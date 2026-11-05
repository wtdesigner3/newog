'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FloatingInput } from '../../../components/ui/floating-input';
import { Button } from '../../../components/ui/button';
import { Eye, EyeOff, AlertCircle, ShieldCheck, Lock, User, ArrowRight } from 'lucide-react';
import '../../../components/dashboard/dashboard.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          identifier: form.identifier,
          email: form.identifier,
          username: form.identifier,
          password: form.password,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }

      // Store non-sensitive UI state for dashboard
      localStorage.setItem('admin_logged_in', 'true');
      localStorage.setItem('admin_login_history', 'true');
      if (data.user) {
        localStorage.setItem('admin_user', JSON.stringify(data.user));
      }

      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid username/email or password.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-slate-100 font-sans text-slate-900 p-4 sm:p-8">
      {/* Login Card */}
      <div className="w-full max-w-[1050px] min-h-[520px] flex flex-col lg:flex-row bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden">
        
        {/* Left Brand Panel */}
        <div className="hidden lg:flex flex-col justify-between relative w-[46%] bg-gradient-to-br from-[#0f7ae0] via-[#0b63b8] to-[#084887] text-white p-10 overflow-hidden">
          {/* Subtle geometric circles */}
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-[#f94d1c]/20 blur-2xl pointer-events-none" />

          {/* Top Brand Header */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/20 backdrop-blur-sm text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#f94d1c] animate-pulse"></span>
              OG HEAVY DUTY CMS &bull; SECURE PORTAL
            </div>

            <div className="mt-8">
              <h1 className="text-3xl font-extrabold tracking-tight leading-tight">
                Industrial Strength. <br />
                <span className="text-orange-400">Total Management.</span>
              </h1>
              <p className="mt-3 text-sm text-blue-100 leading-relaxed max-w-sm">
                Control commercial vehicle components, leaf springs, trailer axles, enquiries, and digital assets with enterprise security.
              </p>
            </div>
          </div>

          {/* Middle Badges */}
          <div className="relative z-10 my-8 space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 border border-white/10 backdrop-blur-sm">
              <ShieldCheck className="w-5 h-5 text-orange-400 shrink-0" />
              <div className="text-xs">
                <p className="font-semibold text-white">Hardened Authentication</p>
                <p className="text-blue-100">Bcrypt + HttpOnly JWT session control</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 border border-white/10 backdrop-blur-sm">
              <Lock className="w-5 h-5 text-blue-200 shrink-0" />
              <div className="text-xs">
                <p className="font-semibold text-white">Role-Based Access Control</p>
                <p className="text-blue-100">Granular permissions across 12 CMS modules</p>
              </div>
            </div>
          </div>

          {/* Footer Copyright */}
          <div className="relative z-10 pt-4 border-t border-white/15 text-xs text-blue-200/80">
            &copy; {new Date().getFullYear()} OG Heavy Duty. All rights reserved.
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="flex-1 flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-14">
          <div className="w-full max-w-md mx-auto">
            {/* Form Header */}
            <div className="mb-8">
              <div className="inline-block lg:hidden mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200">
                  OG Heavy Duty CMS
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Administrator Sign In
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Enter your administrative credentials to access the control panel.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-sm animate-in fade-in">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium leading-relaxed">{error}</div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Username or Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={form.identifier}
                    onChange={(e) => setForm({ ...form, identifier: e.target.value })}
                    placeholder="admin or admin@ogheavyduty.in"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f7ae0] focus:border-transparent transition-all"
                  />
                  <User className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f7ae0] focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#0f7ae0] hover:bg-[#0c68c2] active:bg-[#0a56a1] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Security Notice */}
            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                Protected by rate limiting &amp; automated lockout policies.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

