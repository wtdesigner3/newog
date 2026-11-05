/**
 * Google reCAPTCHA v3 Server-Side Verification Engine
 * 
 * Enforces strict fail-closed security in production environments while
 * permitting explicit, warned fallback during local development when credentials
 * are unconfigured.
 */

const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
const REQUEST_TIMEOUT_MS = 5000;

/**
 * Verify a reCAPTCHA v3 token against Google's verification API.
 * 
 * @param {string} token - The client-generated reCAPTCHA token
 * @param {Object} options - Verification options
 * @param {string} [options.expectedAction] - Expected action name (e.g. 'enquiry_submission', 'career_application')
 * @param {string} [options.remoteIp] - Client IP address
 * @returns {Promise<{ success: boolean, score?: number, action?: string, bypassed?: boolean, error?: string }>}
 */
export async function verifyRecaptcha(token, options = {}) {
  const { expectedAction, remoteIp } = options;
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  const isProduction = process.env.NODE_ENV === 'production';

  // 1. Production Fail-Closed Enforcement
  if (isProduction) {
    if (!secret) {
      console.error("[reCAPTCHA Security Exception] RECAPTCHA_SECRET_KEY is not configured in production environment. Failing closed.");
      return {
        success: false,
        error: "Security verification service is unavailable. Please contact the administrator.",
      };
    }

    if (!token || typeof token !== 'string' || token.trim() === '') {
      return {
        success: false,
        error: "Security verification token is missing. Please refresh and try again.",
      };
    }
  }

  // 2. Development Mode Explicit Bypass (only when secret is unconfigured and not in production)
  if (!secret) {
    console.warn(
      "[reCAPTCHA Dev Warning] Operating in local development mode without RECAPTCHA_SECRET_KEY. Verification bypassed."
    );
    return {
      success: true,
      bypassed: true,
      score: 1.0,
      action: expectedAction,
    };
  }

  // 3. When secret is configured, require a valid token regardless of environment
  if (!token || typeof token !== 'string' || token.trim() === '') {
    return {
      success: false,
      error: "Security verification token is required.",
    };
  }

  // 4. Verification with Google API (Bounded Timeout)
  try {
    const postData = new URLSearchParams();
    postData.append('secret', secret);
    postData.append('response', token);
    if (remoteIp && remoteIp !== 'anonymous') {
      postData.append('remoteip', remoteIp);
    }

    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: postData.toString(),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!res.ok) {
      console.error(`[reCAPTCHA] Provider returned HTTP ${res.status}`);
      return {
        success: false,
        error: "Verification service communication failure.",
      };
    }

    const result = await res.json();

    // 5. Check Verification Result
    if (!result.success) {
      const errorCodes = result['error-codes'] || [];
      console.warn("[reCAPTCHA] Verification rejected by Google. Codes:", errorCodes);
      return {
        success: false,
        error: "CAPTCHA verification failed. Please try again.",
      };
    }

    // 6. Action Validation
    if (expectedAction && result.action && result.action !== expectedAction) {
      console.warn(`[reCAPTCHA Security Warning] Action mismatch. Expected '${expectedAction}', got '${result.action}'`);
      return {
        success: false,
        error: "Security validation error: Action mismatch.",
      };
    }

    // 7. Hostname Validation (if configured)
    const expectedHostname = process.env.RECAPTCHA_EXPECTED_HOSTNAME;
    if (expectedHostname && result.hostname && result.hostname !== expectedHostname) {
      console.warn(`[reCAPTCHA Security Warning] Hostname mismatch. Expected '${expectedHostname}', got '${result.hostname}'`);
      return {
        success: false,
        error: "Security validation error: Hostname mismatch.",
      };
    }

    // 8. Score Threshold Validation (reCAPTCHA v3: 0.0 - 1.0)
    const minScore = parseFloat(process.env.RECAPTCHA_MIN_SCORE) || 0.5;
    if (typeof result.score === 'number' && result.score < minScore) {
      console.warn(`[reCAPTCHA] Bot score detected (${result.score} < ${minScore})`);
      return {
        success: false,
        score: result.score,
        error: "Security verification indicated suspicious activity.",
      };
    }

    return {
      success: true,
      score: result.score,
      action: result.action,
    };
  } catch (err) {
    if (err.name === 'TimeoutError' || err.name === 'AbortError') {
      console.error("[reCAPTCHA] Verification request timed out after 5000ms.");
      return {
        success: false,
        error: "Verification request timed out. Please try again.",
      };
    }

    console.error("[reCAPTCHA Verification Error]:", err.message);
    return {
      success: false,
      error: "Internal error during security verification.",
    };
  }
}

