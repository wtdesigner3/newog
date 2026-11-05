/**
 * OG Heavy Duty — Ultra-Bright, Modern Public Route Group Loading Skeleton.
 *
 * Clean, light-mode design matching OG brand identity:
 * - Pristine slate-50/white backgrounds (#f8fafc)
 * - Soft ice-blue gradient hero card with zero dark/midnight elements
 * - Clean slate-200/100 pulse shimmer wireframes
 * - Vibrant OG Blue (#0f7ae0) CTA button and badge accents
 *
 * Server Component — zero client JS, zero layout shift (CLS).
 */

export default function PublicLoading() {
  return (
    <div className="w-full bg-[#f8fafc] min-h-screen">
      {/* ─── Hero Banner Wireframe (Clean, Bright White & Soft Ice-Blue Card) ─── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="relative rounded-[24px] sm:rounded-[32px] bg-gradient-to-br from-blue-50/70 via-white to-slate-50/80 border border-slate-200/90 shadow-sm overflow-hidden p-6 sm:p-10 lg:p-14">
          {/* Subtle Ambient Ice-Blue Glow in Top Corner */}
          <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-blue-400/10 blur-[90px] pointer-events-none rounded-full" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6">
              {/* Top Kicker Pill Badge */}
              <div className="inline-flex items-center gap-2 h-8 px-4 rounded-full bg-blue-50 border border-blue-200/80 shadow-xs animate-pulse">
                <div className="w-2 h-2 rounded-full bg-[#0f7ae0]" />
                <div className="h-3 w-44 bg-blue-400/40 rounded-full" />
              </div>

              {/* Main Headline Placeholder (Bold Clean Lines) */}
              <div className="space-y-3 sm:space-y-4">
                <div className="h-10 sm:h-12 lg:h-14 w-full max-w-xl rounded-2xl bg-slate-200 animate-pulse" />
                <div className="h-10 sm:h-12 lg:h-14 w-4/5 max-w-lg rounded-2xl bg-slate-200/80 animate-pulse" />
              </div>

              {/* Subtitle Lines */}
              <div className="space-y-2.5 max-w-xl">
                <div className="h-4 w-full rounded-full bg-slate-200/70 animate-pulse" />
                <div className="h-4 w-4/5 rounded-full bg-slate-200/50 animate-pulse" />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                {/* Primary CTA (Vibrant OG Blue) */}
                <div className="h-12 sm:h-13 w-44 sm:w-48 rounded-xl bg-[#0f7ae0] shadow-sm animate-pulse flex items-center justify-center">
                  <div className="h-3.5 w-24 bg-white/80 rounded-full" />
                </div>
                {/* Secondary CTA (Clean Light Outline) */}
                <div className="h-12 sm:h-13 w-40 sm:w-44 rounded-xl bg-white border border-slate-200 shadow-2xs animate-pulse flex items-center justify-center">
                  <div className="h-3.5 w-24 bg-slate-300 rounded-full" />
                </div>
              </div>

              {/* Feature Chips Row */}
              <div className="pt-2 flex flex-wrap gap-2.5">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="h-7 w-28 rounded-lg bg-slate-100/90 border border-slate-200/70 animate-pulse"
                  />
                ))}
              </div>
            </div>

            {/* Right Machine / Equipment Visual Wireframe (Desktop) */}
            <div className="hidden lg:flex lg:col-span-5 flex-col items-center justify-center">
              <div className="w-full h-[340px] rounded-2xl bg-gradient-to-tr from-slate-100 via-blue-50/50 to-white border border-slate-200/80 p-6 flex flex-col items-center justify-center gap-4 shadow-xs animate-pulse">
                {/* Simulated HVAC Unit Silhouette */}
                <div className="w-4/5 h-36 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-200/70 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-[#0f7ae0]/30" />
                  </div>
                </div>
                {/* Spec Indicators Row */}
                <div className="flex gap-2.5 w-4/5 justify-center">
                  <div className="h-6 w-20 rounded-full bg-white border border-slate-200/80" />
                  <div className="h-6 w-24 rounded-full bg-blue-50 border border-blue-200/60" />
                  <div className="h-6 w-20 rounded-full bg-white border border-slate-200/80" />
                </div>
                <div className="h-3.5 w-3/5 bg-slate-200/70 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Milestones Strip Skeleton (Clean, Light White Panel) ─── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8">
        <div className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-3 p-4 rounded-xl bg-slate-50/70 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center">
                    <div className="w-4 h-4 rounded bg-[#0f7ae0]/40 animate-pulse" />
                  </div>
                  <div className="h-3.5 w-24 bg-blue-100/90 rounded-full animate-pulse" />
                </div>
                <div className="h-8 sm:h-9 w-28 bg-slate-200 rounded-lg animate-pulse" />
                <div className="h-3.5 w-36 bg-slate-200/70 rounded-full animate-pulse" />
                <div className="h-2.5 w-44 bg-slate-100 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Content Section Skeleton (Clean White Product Grid) ─── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 space-y-8">
        {/* Section Header */}
        <div className="space-y-3">
          <div className="h-6 w-40 rounded-full bg-blue-50 border border-blue-200/80 animate-pulse" />
          <div className="h-9 sm:h-10 w-80 max-w-full bg-slate-200 rounded-xl animate-pulse" />
          <div className="h-4 w-96 max-w-full bg-slate-200/70 rounded-full animate-pulse" />
        </div>

        {/* Category Tabs Pill Skeleton */}
        <div className="flex flex-wrap gap-2.5 sm:gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className={`h-9 sm:h-10 rounded-full animate-pulse ${
                i === 1 ? 'w-28 bg-[#0f7ae0] shadow-xs' : 'w-24 bg-white border border-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Product Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl bg-white border border-slate-200/90 p-5 space-y-4 shadow-xs"
            >
              {/* Product Image Placeholder */}
              <div className="h-52 w-full rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center animate-pulse">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100/70" />
              </div>
              {/* Badges */}
              <div className="flex gap-2">
                <div className="h-5 w-20 rounded-full bg-blue-50 border border-blue-100 animate-pulse" />
                <div className="h-5 w-24 rounded-full bg-slate-100 animate-pulse" />
              </div>
              {/* Title & Specs */}
              <div className="space-y-2">
                <div className="h-6 w-3/4 rounded-lg bg-slate-200 animate-pulse" />
                <div className="h-3.5 w-full rounded-full bg-slate-100 animate-pulse" />
                <div className="h-3.5 w-2/3 rounded-full bg-slate-100 animate-pulse" />
              </div>
              {/* Action Buttons */}
              <div className="pt-2 flex gap-3">
                <div className="h-10 flex-1 rounded-xl bg-[#0f7ae0] shadow-xs animate-pulse flex items-center justify-center">
                  <div className="h-3 w-20 bg-white/70 rounded-full" />
                </div>
                <div className="h-10 w-28 rounded-xl bg-slate-100 border border-slate-200 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
