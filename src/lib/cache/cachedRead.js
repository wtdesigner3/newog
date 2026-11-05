/**
 * cachedRead.js — Resilient Next.js Data Cache Wrapper
 * 
 * Attaches Next.js Data Cache tags to raw database reads in Next.js Server Components.
 * Gracefully degrades to direct execution when outside Next.js request lifecycle
 * (e.g. standalone scripts, unit tests, CLI runners).
 */

let unstable_cache = null;
try {
  const nextCache = await import("next/cache.js").catch(() => import("next/cache")).catch(() => null);
  unstable_cache = nextCache?.unstable_cache || null;
} catch {
  // Graceful fallback for non-Next environments
}

export function safeCachedRead(fn, keyParts, options) {
  let cachedFn = null;
  if (typeof unstable_cache === "function") {
    try {
      cachedFn = unstable_cache(fn, keyParts, options);
    } catch {
      // In environments where unstable_cache throws at call time
    }
  }

  return async (...args) => {
    if (cachedFn) {
      try {
        return await cachedFn(...args);
      } catch (err) {
        // When running in standalone scripts or tests where incrementalCache is not mounted
        if (
          err?.message?.includes("incrementalCache missing") ||
          err?.message?.includes("Invariant") ||
          err?.name === "InvariantError"
        ) {
          return await fn(...args);
        }
        throw err;
      }
    }
    return await fn(...args);
  };
}
