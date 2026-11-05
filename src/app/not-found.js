import Link from 'next/link';
import { ArrowLeft, Home, ShieldAlert } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans p-6">
      <div className="max-w-lg w-full text-center bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-12 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0f7ae0] mx-auto mb-6 shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h1 className="text-6xl font-black text-slate-900 tracking-tight">404</h1>
        <h2 className="text-xl font-bold text-slate-800 mt-2">Page Not Found</h2>
        
        <p className="text-sm text-slate-500 mt-3 leading-relaxed">
          The requested page could not be located. It may have been moved, renamed, or is temporarily offline during the platform modernization.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0f7ae0] hover:bg-[#0c68c2] text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
          <Link
            href="/contact"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Contact Support</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
