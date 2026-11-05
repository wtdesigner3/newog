'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/dashboard/Sidebar';
import Topbar from '../../components/dashboard/Topbar';
import "../../components/dashboard/dashboard.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { ThemeProvider } from '../../components/dashboard/ThemeProvider';
import { ShieldCheck } from 'lucide-react';

function DashboardGuard({ children }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/admin/login';
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#0f172a] flex flex-col items-center justify-center z-50">
        {/* Outer spinning ring */}
        <div className="relative flex items-center justify-center">
          <div className="w-24 h-24 rounded-full border-4 border-slate-700/50 border-t-[#0f7ae0] animate-spin" />
          <div
            className="absolute w-16 h-16 rounded-full border-4 border-slate-700/30 border-b-[#f94d1c]/80 animate-spin"
            style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}
          />
          {/* Logo badge in center */}
          <div className="absolute w-12 h-12 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center shadow-xl">
            <ShieldCheck className="w-6 h-6 text-[#0f7ae0]" />
          </div>
        </div>
        {/* Brand text */}
        <div className="mt-8 text-center">
          <h2 className="text-white font-bold text-lg tracking-wide">OG Heavy Duty</h2>
          <p className="text-slate-400 text-xs mt-1 tracking-widest uppercase">Admin CMS Panel</p>
        </div>
        {/* Loading dots */}
        <div className="flex gap-1.5 mt-6">
          {[0, 0.2, 0.4].map((delay, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-[#0f7ae0] animate-bounce"
              style={{ animationDelay: `${delay}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!user) return null;

  return children;
}

function DashboardShell({ children }) {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground font-inter antialiased transition-colors duration-200">
      <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
        <Topbar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <DashboardGuard>
          <DashboardShell>
            {children}
          </DashboardShell>
        </DashboardGuard>
      </AuthProvider>
    </ThemeProvider>
  );
}
