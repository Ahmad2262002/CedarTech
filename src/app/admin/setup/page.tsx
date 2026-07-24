'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Mail, Lock, User, KeyRound, Loader, ArrowRight, Eye, EyeOff, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminSetupPage() {
  const router = useRouter();

  const [setupKey, setSetupKey] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setupKey, name, email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        // Redirect to login after 2 seconds
        setTimeout(() => router.push('/admin/login'), 2000);
      } else {
        setError(data.error || 'Setup failed. Please try again.');
      }
    } catch {
      setError('A connection error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-brand-deep flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center space-y-6 bg-brand-surface border border-border-default rounded-2xl p-10 shadow-2xl">
          <div className="w-16 h-16 bg-emerald-950/50 border border-emerald-800 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Account Ready!</h1>
            <p className="text-brand-text-secondary text-sm mt-2">
              Admin account created successfully. Redirecting you to the login page…
            </p>
          </div>
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-deep flex flex-col items-center justify-center p-4">
      {/* Back link */}
      <Link
        href="/admin/login"
        className="absolute top-6 left-6 flex items-center gap-1.5 text-brand-text-tertiary hover:text-white text-xs font-semibold transition-colors"
      >
        Already have an account? Sign in →
      </Link>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-accent-blue/15 border border-indigo-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-7 h-7 text-accent-bright" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Admin Setup</h1>
          <p className="text-brand-text-secondary text-sm mt-1.5 max-w-xs mx-auto">
            Create your administrator account to manage the Cedar Tech store.
          </p>
        </div>

        {/* Card */}
        <div className="bg-brand-surface border border-border-default rounded-2xl p-6 md:p-8 shadow-2xl space-y-5">

          {error && (
            <div className="bg-red-950/40 border border-red-800/60 text-red-300 text-xs p-3.5 rounded-lg text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Secret Setup Key */}
            <div>
              <label className="block text-[10px] font-bold text-brand-text-secondary uppercase tracking-widest mb-1.5">
                Secret Setup Key
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                <input
                  type="password"
                  required
                  placeholder="Enter the secret setup key"
                  value={setupKey}
                  onChange={(e) => setSetupKey(e.target.value)}
                  className="w-full bg-brand-deep border border-amber-900/40 focus:border-amber-500 text-white rounded-lg py-2.5 pl-10 pr-4 outline-none text-sm transition-all placeholder:text-slate-600"
                />
              </div>
              <p className="text-[10px] text-brand-text-tertiary mt-1">
                This key is defined in your <code className="text-amber-400">.env.local</code> file as <code className="text-amber-400">ADMIN_SETUP_KEY</code>.
              </p>
            </div>

            <hr className="border-border-default" />

            {/* Full Name */}
            <div>
              <label className="block text-[10px] font-bold text-brand-text-secondary uppercase tracking-widest mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-tertiary" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Ahmad Al-Kadri"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-brand-deep border border-border-default focus:border-indigo-500 text-white rounded-lg py-2.5 pl-10 pr-4 outline-none text-sm transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[10px] font-bold text-brand-text-secondary uppercase tracking-widest mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-tertiary" />
                <input
                  type="email"
                  required
                  placeholder="admin@cedartech.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-brand-deep border border-border-default focus:border-indigo-500 text-white rounded-lg py-2.5 pl-10 pr-4 outline-none text-sm transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-bold text-brand-text-secondary uppercase tracking-widest mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-tertiary" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-brand-deep border border-border-default focus:border-indigo-500 text-white rounded-lg py-2.5 pl-10 pr-10 outline-none text-sm transition-all placeholder:text-slate-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-tertiary hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[10px] font-bold text-brand-text-secondary uppercase tracking-widest mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-tertiary" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full bg-brand-deep border focus:border-indigo-500 text-white rounded-lg py-2.5 pl-10 pr-10 outline-none text-sm transition-all placeholder:text-slate-600 ${
                    confirmPassword && confirmPassword !== password
                      ? 'border-red-700'
                      : 'border-border-default'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-tertiary hover:text-slate-300"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword && confirmPassword !== password && (
                <p className="text-red-400 text-[10px] mt-1">Passwords do not match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-accent-blue hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl text-sm transition-all shadow-lg shadow-indigo-900/30 active:scale-[0.98] mt-2"
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Creating Account…</span>
                </>
              ) : (
                <>
                  <span>Create Admin Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-600 text-[10px] mt-4">
          This page is for initial setup only. Do not share the URL or setup key.
        </p>
      </div>
    </div>
  );
}
