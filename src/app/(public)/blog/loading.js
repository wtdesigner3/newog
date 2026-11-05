/**
 * Blog listing page — instant loading shell.
 * Matches OG Heavy Duty's public inner page header & blog card layout.
 */
export default function BlogLoading() {
  return (
    <div className="w-full bg-slate-50 min-h-screen">
      {/* Brand Hero Shimmer */}
      <div className="w-full bg-gradient-to-b from-[#061842] via-[#030e26] to-[#010818] py-16 px-4 text-center">
        <div className="max-w-xl mx-auto space-y-4 flex flex-col items-center">
          <div className="h-7 w-44 rounded-full bg-blue-500/20 border border-blue-400/30 animate-pulse" />
          <div className="h-10 sm:h-12 w-80 max-w-full rounded-2xl bg-white/20 animate-pulse" />
          <div className="h-4 w-96 max-w-full rounded-full bg-white/10 animate-pulse" />
        </div>
      </div>

      {/* Blog Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-3xl bg-white border border-slate-200/80 p-5 shadow-sm space-y-4"
            >
              <div className="h-48 w-full rounded-2xl bg-slate-100 animate-pulse" />
              <div className="flex gap-2">
                <div className="h-5 w-20 rounded bg-blue-50 animate-pulse" />
                <div className="h-5 w-24 rounded bg-slate-100 animate-pulse" />
              </div>
              <div className="h-6 w-5/6 rounded-lg bg-slate-200 animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-slate-100 animate-pulse" />
                <div className="h-4 w-2/3 rounded bg-slate-100 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
