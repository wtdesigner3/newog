/**
 * Client-Side Google reCAPTCHA v3 Helper
 * 
 * Dynamically loads the reCAPTCHA v3 script upon first request and executes
 * token generation for specific user actions (e.g., 'enquiry_submission', 'career_application').
 */

let scriptLoadingPromise = null;

function loadRecaptchaScript(siteKey) {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.grecaptcha && window.grecaptcha.execute) {
    return Promise.resolve(true);
  }

  if (scriptLoadingPromise) return scriptLoadingPromise;

  scriptLoadingPromise = new Promise((resolve) => {
    // Check if script tag is already in DOM
    const existing = document.getElementById("google-recaptcha-v3");
    if (existing) {
      if (window.grecaptcha && window.grecaptcha.ready) {
        window.grecaptcha.ready(() => resolve(true));
      } else {
        existing.addEventListener("load", () => {
          if (window.grecaptcha && window.grecaptcha.ready) {
            window.grecaptcha.ready(() => resolve(true));
          } else {
            resolve(true);
          }
        });
        existing.addEventListener("error", () => {
          console.warn("[reCAPTCHA Client] Failed to load Google reCAPTCHA script.");
          resolve(false);
        });
      }
      return;
    }

    const script = document.createElement("script");
    script.id = "google-recaptcha-v3";
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.grecaptcha && window.grecaptcha.ready) {
        window.grecaptcha.ready(() => resolve(true));
      } else {
        resolve(true);
      }
    };

    script.onerror = () => {
      console.warn("[reCAPTCHA Client] Failed to load Google reCAPTCHA script from CDN.");
      resolve(false);
    };

    document.head.appendChild(script);
  });

  return scriptLoadingPromise;
}

/**
 * Execute client-side reCAPTCHA token generation for an action.
 * 
 * @param {string} action - Explicit action identifier (e.g., 'enquiry_submission', 'career_application')
 * @returns {Promise<string|null>} - Returns the token string or null if unavailable/unconfigured
 */
export async function getRecaptchaToken(action = "generic_action") {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  // In local dev without configured site key, return null gracefully
  if (!siteKey || siteKey.trim() === "") {
    return null;
  }

  if (typeof window === "undefined") {
    return null;
  }

  try {
    const loaded = await loadRecaptchaScript(siteKey);
    if (!loaded || !window.grecaptcha || !window.grecaptcha.execute) {
      console.warn("[reCAPTCHA Client] grecaptcha unavailable.");
      return null;
    }

    return await new Promise((resolve) => {
      // 5-second client-side execution timeout
      const timer = setTimeout(() => {
        console.warn("[reCAPTCHA Client] Token execution timed out.");
        resolve(null);
      }, 5000);

      window.grecaptcha.ready(async () => {
        try {
          const token = await window.grecaptcha.execute(siteKey, { action });
          clearTimeout(timer);
          resolve(token);
        } catch (execErr) {
          clearTimeout(timer);
          console.warn("[reCAPTCHA Client] Execution error:", execErr.message);
          resolve(null);
        }
      });
    });
  } catch (err) {
    console.warn("[reCAPTCHA Client] Unexpected error during token generation:", err.message);
    return null;
  }
}

