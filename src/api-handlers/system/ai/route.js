import { revalidatePath } from "next/cache";
import { NextResponse } from 'next/server';
import { requireAuth } from '@/app/lib/auth';
import { connectDB } from '@/app/lib/config';
import GlobalSetting from '@/app/models/GlobalSetting';

// ─── System Instructions ──────────────────────────────────────────────────────

function getSystemInstruction(taskType, extraContext) {
  switch (taskType) {
    case 'generate_content':
      return "You are an expert copywriter for an industrial machinery and heavy duty equipment company. Generate high-quality, engaging content based on the user's prompt. Format it clearly using markdown with headings, bullet points, and paragraphs where appropriate.";
    case 'seo_optimize':
      return "You are an expert SEO specialist. Analyze the provided content or topic and generate an optimized 'SEO Title' (max 60 chars), a 'Meta Description' (max 160 chars), and a comma-separated list of 'Target Keywords'. Format the output clearly with each on a new line.";
    case 'summarize':
      return "You are an expert editor. Summarize the provided text into a concise, easy-to-read format with key bullet points. Do not include unnecessary details.";
    case 'translate':
      return `You are a professional translator. Translate the provided text into ${extraContext || 'English'}. Preserve the original tone and formatting as much as possible.`;
    case 'grammar_tone':
      return `You are a professional editor. Fix any grammatical errors in the provided text and rewrite it in a ${extraContext || 'professional'} tone. Return only the rewritten text.`;
    default:
      return "You are a helpful AI assistant for an industrial heavy duty machinery company website. Provide concise, accurate, professional responses.";
  }
}

// ─── Provider: OpenRouter ─────────────────────────────────────────────────────

async function callOpenRouter(apiKey, systemInstruction, prompt) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
      'X-Title': 'OG Heavy Duty Admin'
    },
    body: JSON.stringify({
      model: 'openrouter/free',
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2048
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`OpenRouter error: ${data.error?.message || response.statusText}`);
  }

  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('OpenRouter returned empty response');
  return text;
}

// ─── Provider: Groq ───────────────────────────────────────────────────────────

async function callGroq(apiKey, systemInstruction, prompt) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2048
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Groq error: ${data.error?.message || response.statusText}`);
  }

  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('Groq returned empty response');
  return text;
}

// ─── Provider: Cerebras ───────────────────────────────────────────────────────

async function callCerebras(apiKey, systemInstruction, prompt) {
  const response = await fetch('https://api.cerebras.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b',
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2048
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Cerebras error: ${data.error?.message || response.statusText}`);
  }

  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('Cerebras returned empty response');
  return text;
}

// ─── Provider: Gemini ─────────────────────────────────────────────────────────

async function callGemini(apiKey, systemInstruction, prompt) {
  const modelsRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
  const modelsData = await modelsRes.json();

  if (!modelsRes.ok || !modelsData.models) {
    throw new Error('Failed to list Gemini models');
  }

  const validModel = modelsData.models.find(m => m.supportedGenerationMethods?.includes('generateContent'));
  if (!validModel) throw new Error('No valid Gemini model found for this API key');

  const modelName = validModel.name.replace('models/', '');
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `INSTRUCTIONS:\n${systemInstruction}\n\nUSER PROMPT:\n${prompt}` }] }],
        generationConfig: { temperature: 0.7 }
      })
    }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(`Gemini error: ${data.error?.message || response.statusText}`);

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini returned empty response');
  return text;
}

// ─── Main Route Handler ───────────────────────────────────────────────────────

export async function POST(req) {
  const { user, error } = await requireAuth(req);
  if (error) return error;

  try {
    const { prompt, taskType, extraContext } = await req.json();
    if (!prompt) return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });

    await connectDB();
    const settings = await GlobalSetting.findOne();

    const keys = {
      openRouter: settings?.openRouterApiKey || process.env.OPENROUTER_API_KEY || '',
      groq:       settings?.groqApiKey       || process.env.GROQ_API_KEY       || '',
      cerebras:   settings?.cerebrasApiKey   || process.env.CEREBRAS_API_KEY   || '',
      gemini:     settings?.geminiApiKey     || process.env.GEMINI_API_KEY     || '',
    };

    const systemInstruction = getSystemInstruction(taskType, extraContext);
    const defaultSequence = ['groq', 'cerebras', 'openrouter', 'gemini'];
    let providerOrder = defaultSequence;
    
    if (settings?.aiProviderSequence) {
      providerOrder = settings.aiProviderSequence.split(',').map(s => s.trim()).filter(Boolean);
    }
    
    if (providerOrder.length === 0) providerOrder = defaultSequence;

    const availableProviders = providerOrder.filter(p => {
      const keyName = p === 'openrouter' ? 'openRouter' : p;
      return !!keys[keyName];
    });

    if (availableProviders.length === 0) {
      return NextResponse.json({
        error: '⚠️ No AI provider keys are configured. Set up API keys in Global Settings.'
      }, { status: 403 });
    }

    let lastError = null;
    let usedProvider = null;

    for (const provider of availableProviders) {
      try {
        let text = '';

        if (provider === 'openRouter' || provider === 'openrouter') {
          text = await callOpenRouter(keys.openRouter, systemInstruction, prompt);
          usedProvider = 'OpenRouter (Auto Free)';
        } else if (provider === 'groq') {
          text = await callGroq(keys.groq, systemInstruction, prompt);
          usedProvider = 'Groq (Llama 3.3 70B)';
        } else if (provider === 'cerebras') {
          text = await callCerebras(keys.cerebras, systemInstruction, prompt);
          usedProvider = 'Cerebras (Llama 3.3 70B)';
        } else if (provider === 'gemini') {
          text = await callGemini(keys.gemini, systemInstruction, prompt);
          usedProvider = 'Google Gemini';
        }

        revalidatePath('/', 'layout');
        return NextResponse.json({ success: true, text, provider: usedProvider });

      } catch (err) {
        console.warn(`[ai] Provider ${provider} failed:`, err.message);
        lastError = err;
      }
    }

    console.error('[ai] All providers failed. Last error:', lastError?.message);
    return NextResponse.json({
      error: `All AI providers failed. Last error: ${lastError?.message || 'Unknown error'}. Please check your API keys or try again later.`
    }, { status: 500 });

  } catch (err) {
    console.error('[ai] Unexpected error:', err);
    return NextResponse.json({ error: 'Server error occurred' }, { status: 500 });
  }
}
