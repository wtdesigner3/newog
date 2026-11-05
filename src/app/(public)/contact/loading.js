/**
 * Contact page — Ultra-bright, light loading shell.
 * Matches OG Heavy Duty's public inner page header & 2-column contact layout.
 */
export default function ContactLoading() {
  return (
    <div className="w-full bg-[#f8fafc] min-h-screen">
      {/* Brand Hero Header Shimmer (Clean White & Soft Ice-Blue Gradient) */}
      <div className="w-full bg-gradient-to-b from-blue-50/70 via-white to-slate-50 border-b border-slate-200/80 py-16 px-4 text-center">
        <div className="max-w-xl mx-auto space-y-4 flex flex-col items-center">
          <div className="h-7 w-48 rounded-full bg-blue-50 border border-blue-200/80 flex items-center justify-center animate-pulse">
            <div className="h-2.5 w-24 bg-blue-400/40 rounded-full" />
          </div>
          <div className="h-10 sm:h-12 w-80 max-w-full rounded-2xl bg-slate-200 animate-pulse" />
          <div className="h-4 w-96 max-w-full rounded-full bg-slate-200/70 animate-pulse" />
        </div>
      </div>

      {/* Contact Content Skeleton */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Info Side */}
          <div className="lg:col-span-5 space-y-6">
            <div className="h-8 w-60 rounded-xl bg-slate-200 animate-pulse" />
            <div className="h-4 w-full rounded bg-slate-100 animate-pulse" />
            <div className="space-y-4 pt-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4 items-center p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex-shrink-0 flex items-center justify-center animate-pulse">
                    <div className="w-5 h-5 rounded bg-[#0f7ae0]/30" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-28 rounded bg-slate-200 animate-pulse" />
                    <div className="h-3 w-48 rounded bg-slate-100 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7">
            <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-6">
              <div className="h-8 w-48 rounded-xl bg-slate-200 animate-pulse" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="h-12 rounded-xl bg-slate-50 border border-slate-200/70 animate-pulse" />
                <div className="h-12 rounded-xl bg-slate-50 border border-slate-200/70 animate-pulse" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="h-12 rounded-xl bg-slate-50 border border-slate-200/70 animate-pulse" />
                <div className="h-12 rounded-xl bg-slate-50 border border-slate-200/70 animate-pulse" />
              </div>
              <div className="h-32 rounded-xl bg-slate-50 border border-slate-200/70 animate-pulse" />
              <div className="h-12 w-48 rounded-xl bg-[#0f7ae0] shadow-sm animate-pulse flex items-center justify-center">
                <div className="h-3.5 w-24 bg-white/70 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
