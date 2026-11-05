/**
 * Blog listing page — Ultra-bright, light loading shell.
 * Matches OG Heavy Duty's public inner page header & blog card layout.
 */
export default function BlogLoading() {
  return (
    <div className="w-full bg-[#f8fafc] min-h-screen">
      {/* Brand Hero Header Shimmer (Clean White & Soft Ice-Blue Gradient) */}
      <div className="w-full bg-gradient-to-b from-blue-50/70 via-white to-slate-50 border-b border-slate-200/80 py-16 px-4 text-center">
        <div className="max-w-xl mx-auto space-y-4 flex flex-col items-center">
          <div className="h-7 w-44 rounded-full bg-blue-50 border border-blue-200/80 flex items-center justify-center animate-pulse">
            <div className="h-2.5 w-24 bg-blue-400/40 rounded-full" />
          </div>
          <div className="h-10 sm:h-12 w-80 max-w-full rounded-2xl bg-slate-200 animate-pulse" />
          <div className="h-4 w-96 max-w-full rounded-full bg-slate-200/70 animate-pulse" />
        </div>
      </div>

      {/* Blog Cards Grid */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-2xl bg-white border border-slate-200/90 p-5 space-y-4 shadow-xs"
            >
              <div className="h-48 w-full rounded-xl bg-slate-100 border border-slate-200/50 animate-pulse" />
              <div className="flex gap-2">
                <div className="h-5 w-20 rounded bg-blue-50 border border-blue-100 animate-pulse" />
                <div className="h-5 w-24 rounded bg-slate-100 animate-pulse" />
              </div>
              <div className="h-6 w-5/6 rounded-lg bg-slate-200 animate-pulse" />
              <div className="space-y-2">
                <div className="h-3.5 w-full rounded bg-slate-100 animate-pulse" />
                <div className="h-3.5 w-3/4 rounded bg-slate-100 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
