/**
 * LoadingState — Accessible loading indicator and skeleton states for OG Heavy Duty.
 *
 * @param {"spinner" | "skeleton" | "inline"} type
 * @param {string} message - Text for screen readers and visual status
 * @param {string} className
 */
export default function LoadingState({
  type = "spinner",
  message = "Loading content...",
  className = "",
}) {
  if (type === "skeleton") {
    return (
      <div
        className={`w-full py-12 space-y-6 ${className}`}
        role="status"
        aria-live="polite"
        aria-label={message}
      >
        <span className="sr-only">{message}</span>
        {/* Header skeleton */}
        <div className="max-w-md mx-auto space-y-3 text-center">
          <div className="h-4 w-28 bg-slate-200 rounded-full mx-auto animate-pulse" />
          <div className="h-8 w-3/4 bg-slate-200 rounded-lg mx-auto animate-pulse" />
          <div className="h-4 w-full bg-slate-200 rounded mx-auto animate-pulse" />
        </div>

        {/* 3-card skeleton grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="p-5 bg-white border border-slate-200 rounded-xl space-y-4 shadow-sm"
            >
              <div className="h-48 bg-slate-100 rounded-lg animate-pulse" />
              <div className="h-6 w-3/4 bg-slate-200 rounded animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-slate-100 rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-slate-100 rounded animate-pulse" />
              </div>
              <div className="h-10 w-full bg-slate-100 rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "inline") {
    return (
      <div
        className={`inline-flex items-center gap-2 text-sm text-slate-500 ${className}`}
        role="status"
        aria-live="polite"
      >
        <div className="w-4 h-4 border-2 border-[#0f7ae0] border-t-transparent rounded-full animate-spin" />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <div
      className={`min-h-[280px] w-full flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="relative mb-4">
        <div className="w-12 h-12 rounded-full border-3 border-slate-200 border-t-[#0f7ae0] animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0f7ae0]" />
        </div>
      </div>
      <p className="text-sm font-medium text-slate-600 tracking-wide">{message}</p>
    </div>
  );
}

