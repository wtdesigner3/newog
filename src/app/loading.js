export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans p-6">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-slate-200" />
          <div className="absolute inset-0 rounded-full border-4 border-[#0f7ae0] border-t-transparent animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-slate-800 tracking-wide">OG HEAVY DUTY</p>
          <p className="text-xs text-slate-400 mt-0.5">Loading resources...</p>
        </div>
      </div>
    </div>
  );
}

