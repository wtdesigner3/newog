/**
 * Contact page — instant loading shell.
 * Matches OG Heavy Duty's public inner page header & 2-column contact layout.
 */
export default function ContactLoading() {
  return (
    <div className="w-full bg-slate-50 min-h-screen">
      {/* Brand Hero Shimmer */}
      <div className="w-full bg-gradient-to-b from-[#061842] via-[#030e26] to-[#010818] py-16 px-4 text-center">
        <div className="max-w-xl mx-auto space-y-4 flex flex-col items-center">
          <div className="h-7 w-48 rounded-full bg-blue-500/20 border border-blue-400/30 animate-pulse" />
          <div className="h-10 sm:h-12 w-80 max-w-full rounded-2xl bg-white/20 animate-pulse" />
          <div className="h-4 w-96 max-w-full rounded-full bg-white/10 animate-pulse" />
        </div>
      </div>

      {/* Contact Form + Info Shimmer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left info column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="h-8 w-60 rounded-xl bg-slate-200 animate-pulse" />
            <div className="h-4 w-full rounded bg-slate-100 animate-pulse" />
            <div className="space-y-4 pt-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4 items-center p-4 rounded-2xl bg-white border border-slate-200/80">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex-shrink-0 animate-pulse" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-28 rounded bg-slate-200 animate-pulse" />
                    <div className="h-3.5 w-48 rounded bg-slate-100 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right form column */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm space-y-6">
            <div className="h-8 w-48 rounded-xl bg-slate-200 animate-pulse" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-12 rounded-xl bg-slate-100 animate-pulse" />
              <div className="h-12 rounded-xl bg-slate-100 animate-pulse" />
            </div>
            <div className="h-12 rounded-xl bg-slate-100 animate-pulse" />
            <div className="h-28 rounded-xl bg-slate-100 animate-pulse" />
            <div className="h-12 w-44 rounded-xl bg-[#0f7ae0]/80 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
