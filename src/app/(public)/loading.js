/**
 * OG Heavy Duty — Public Route Group Instant Loading Skeleton.
 *
 * Designed specifically to match OG Heavy Duty's signature curved dark-navy
 * hero banner, brand pill badges, metrics strip, and product grid.
 * Server Component — zero client JS, zero layout shift (CLS).
 */

export default function PublicLoading() {
  return (
    <div className="w-full bg-slate-50 min-h-screen">
      {/* ─── Hero Banner Skeleton (Matching OG Heavy Duty Curved Hero) ─── */}
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 pt-2 sm:pt-4">
        <div className="relative rounded-[24px] sm:rounded-[32px] lg:rounded-[40px] bg-gradient-to-b from-[#061842] via-[#030e26] to-[#010818] border border-blue-900/40 shadow-2xl overflow-hidden py-16 sm:py-24 px-4 sm:px-8 text-center">
          {/* Subtle Background Radial Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#0f7ae0]/15 blur-[120px] pointer-events-none rounded-full" />
          
          {/* Background Grid Accent Lines */}
          <div 
            className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "48px 48px"
            }}
          />

          <div className="relative z-10 max-w-4xl mx-auto space-y-6 sm:space-y-8 flex flex-col items-center">
            {/* Top Pill / Kicker Badge Skeleton */}
            <div className="h-8 sm:h-9 w-64 sm:w-72 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center gap-2 px-4 animate-pulse">
              <div className="w-3.5 h-3.5 rounded-full bg-blue-400/40" />
              <div className="h-3 w-40 bg-blue-200/30 rounded-full" />
            </div>

            {/* Main Headline Skeleton (Two Bold Lines) */}
            <div className="w-full space-y-3 sm:space-y-4 flex flex-col items-center">
              <div className="h-9 sm:h-14 md:h-16 w-11/12 sm:w-4/5 max-w-3xl rounded-2xl bg-white/20 animate-pulse" />
              <div className="h-9 sm:h-14 md:h-16 w-3/4 sm:w-3/5 max-w-2xl rounded-2xl bg-white/15 animate-pulse" />
            </div>

            {/* Subtitle Skeleton */}
            <div className="w-full space-y-2 flex flex-col items-center max-w-2xl">
              <div className="h-4 w-11/12 sm:w-4/5 rounded-full bg-white/10 animate-pulse" />
              <div className="h-4 w-4/5 sm:w-3/5 rounded-full bg-white/10 animate-pulse" />
            </div>

            {/* CTA Buttons Skeleton */}
            <div className="pt-2 sm:pt-4 flex flex-wrap items-center justify-center gap-4">
              <div className="h-12 sm:h-14 w-44 sm:w-48 rounded-full bg-[#0f7ae0]/80 shadow-lg shadow-blue-500/25 animate-pulse" />
              <div className="h-12 sm:h-14 w-44 sm:w-48 rounded-full bg-white/10 border border-white/20 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* ─── Milestones Strip Skeleton ─── */}
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 mt-6 sm:mt-8">
        <div className="rounded-2xl sm:rounded-3xl bg-[#040f28] border border-blue-900/40 p-6 sm:p-8 shadow-xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 animate-pulse" />
                  <div className="h-3.5 w-24 bg-blue-400/20 rounded-full animate-pulse" />
                </div>
                <div className="h-8 sm:h-10 w-28 bg-white/20 rounded-xl animate-pulse" />
                <div className="h-3 w-36 bg-white/10 rounded-full animate-pulse" />
                <div className="h-2.5 w-44 bg-white/5 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Content Section Skeleton (Product Range & Categories) ─── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-12">
        {/* Section Header */}
        <div className="space-y-4">
          <div className="h-7 w-60 rounded-full bg-blue-50 border border-blue-200/80 animate-pulse" />
          <div className="h-10 sm:h-12 w-80 max-w-full bg-slate-200 rounded-2xl animate-pulse" />
          <div className="h-4 w-96 max-w-full bg-slate-200/70 rounded-full animate-pulse" />
        </div>

        {/* Category Tabs Pill Skeleton */}
        <div className="flex flex-wrap gap-2.5 sm:gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className={`h-9 sm:h-10 rounded-full animate-pulse ${
                i === 1 ? 'w-28 bg-[#0f7ae0]/20 border border-[#0f7ae0]/30' : 'w-24 bg-slate-100 border border-slate-200/60'
              }`}
            />
          ))}
        </div>

        {/* Product Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-3xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-5"
            >
              {/* Product Image Placeholder */}
              <div className="h-56 w-full rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-50 border border-slate-100 flex items-center justify-center animate-pulse">
                <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100/60" />
              </div>
              {/* Badges */}
              <div className="flex gap-2">
                <div className="h-5 w-20 rounded bg-blue-50 border border-blue-100 animate-pulse" />
                <div className="h-5 w-24 rounded bg-slate-100 animate-pulse" />
              </div>
              {/* Title & Specs */}
              <div className="space-y-2">
                <div className="h-6 w-3/4 rounded-lg bg-slate-200 animate-pulse" />
                <div className="h-4 w-full rounded bg-slate-100 animate-pulse" />
                <div className="h-4 w-2/3 rounded bg-slate-100 animate-pulse" />
              </div>
              {/* Action Buttons */}
              <div className="pt-2 flex gap-3">
                <div className="h-10 flex-1 rounded-xl bg-[#0f7ae0]/70 animate-pulse" />
                <div className="h-10 w-28 rounded-xl bg-slate-100 border border-slate-200 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
