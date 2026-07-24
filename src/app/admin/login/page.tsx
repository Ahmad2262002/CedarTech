'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldAlert, Mail, Lock, Loader, Eye, EyeOff,
  User, KeyRound, CheckCircle, ArrowRight, ArrowLeft, X
} from 'lucide-react';
import Link from 'next/link';

// ─── Types ───────────────────────────────────────────────────────────────────
type Stage = 'gate' | 'auth';   // gate = secret-key popup, auth = sign-in/up panel
type AuthTab = 'signin' | 'signup';

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminAuthPage() {
  const router = useRouter();

  // Stage control
  const [stage, setStage] = useState<Stage>('gate');
  const [activeTab, setActiveTab] = useState<AuthTab>('signin');

  // Gate state
  const [gateKey, setGateKey] = useState('');
  const [gateError, setGateError] = useState('');
  const [gateLoading, setGateLoading] = useState(false);
  const [showGateKey, setShowGateKey] = useState(false);
  const gateInputRef = useRef<HTMLInputElement>(null);

  // Sign-in state
  const [siEmail, setSiEmail] = useState('');
  const [siPassword, setSiPassword] = useState('');
  const [siError, setSiError] = useState('');
  const [siLoading, setSiLoading] = useState(false);
  const [showSiPass, setShowSiPass] = useState(false);

  // Sign-up state
  const [suName, setSuName] = useState('');
  const [suEmail, setSuEmail] = useState('');
  const [suPassword, setSuPassword] = useState('');
  const [suConfirm, setSuConfirm] = useState('');
  const [suError, setSuError] = useState('');
  const [suLoading, setSuLoading] = useState(false);
  const [suSuccess, setSuSuccess] = useState(false);
  const [showSuPass, setShowSuPass] = useState(false);
  const [showSuConfirm, setShowSuConfirm] = useState(false);

  // Saved key to reuse for signup
  const [verifiedKey, setVerifiedKey] = useState('');

  // Focus gate input on mount
  useEffect(() => {
    gateInputRef.current?.focus();
  }, []);

  // ── Gate: verify secret key ──────────────────────────────────────────────
  const handleGateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGateError('');
    setGateLoading(true);

    try {
      const res = await fetch('/api/admin/verify-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: gateKey }),
      });

      if (res.ok) {
        setVerifiedKey(gateKey);
        setStage('auth');
      } else {
        setGateError('Incorrect key. Access denied.');
        setGateKey('');
        gateInputRef.current?.focus();
      }
    } catch {
      setGateError('Connection error. Please try again.');
    } finally {
      setGateLoading(false);
    }
  };

  // ── Sign In ──────────────────────────────────────────────────────────────
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSiError('');

    if (!siEmail || !siPassword) {
      setSiError('Please fill in all fields.');
      return;
    }

    setSiLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: siEmail, password: siPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.user?.role !== 'admin') {
          setSiError('Access denied. This account is not an administrator.');
          await fetch('/api/auth/logout', { method: 'POST' });
        } else {
          router.push('/admin/dashboard');
          router.refresh();
        }
      } else {
        setSiError(data.error || 'Invalid credentials. Please try again.');
      }
    } catch {
      setSiError('Connection error. Please try again.');
    } finally {
      setSiLoading(false);
    }
  };

  // ── Sign Up ──────────────────────────────────────────────────────────────
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuError('');

    if (suPassword !== suConfirm) {
      setSuError('Passwords do not match.');
      return;
    }
    if (suPassword.length < 6) {
      setSuError('Password must be at least 6 characters.');
      return;
    }

    setSuLoading(true);
    try {
      const res = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          setupKey: verifiedKey,
          name: suName,
          email: suEmail,
          password: suPassword,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuSuccess(true);
        // Pre-fill sign-in and switch tab after a moment
        setSiEmail(suEmail);
        setTimeout(() => {
          setSuSuccess(false);
          setActiveTab('signin');
        }, 1800);
      } else {
        setSuError(data.error || 'Registration failed. Please try again.');
      }
    } catch {
      setSuError('Connection error. Please try again.');
    } finally {
      setSuLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER: Gate Popup (Stage 1)
  // ─────────────────────────────────────────────────────────────────────────
  if (stage === 'gate') {
    return (
      <div className="min-h-screen bg-brand-deep flex items-center justify-center p-4 relative overflow-hidden text-brand-text-primary">

        {/* Back to store */}
        <Link
          href="/"
          className="absolute top-6 left-6 flex items-center gap-2 text-brand-text-tertiary hover:text-white text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Store</span>
        </Link>

        {/* Gate Card */}
        <div className="w-full max-w-sm bg-brand-surface border border-border-default rounded-3xl p-8 shadow-2xl relative z-10">
          {/* Icon */}
          <div className="flex flex-col items-center gap-3 mb-7">
            <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center">
              <ShieldAlert className="w-7 h-7 text-amber-400" />
            </div>
            <div className="text-center">
              <h1 className="text-xl font-bold text-brand-text-primary tracking-tight">Restricted Area</h1>
              <p className="text-brand-text-secondary text-xs mt-1">Enter secret key to access admin console</p>
            </div>
          </div>

          {gateError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl mb-4 text-center flex items-center justify-center gap-2">
              <X className="w-4 h-4 shrink-0" />
              {gateError}
            </div>
          )}

          <form onSubmit={handleGateSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-brand-text-tertiary uppercase tracking-widest mb-1.5">
                Secret Access Key
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                <input
                  ref={gateInputRef}
                  type={showGateKey ? 'text' : 'password'}
                  required
                  placeholder="Enter secret key…"
                  value={gateKey}
                  onChange={(e) => setGateKey(e.target.value)}
                  className="w-full bg-black/40 border border-border-default focus:border-amber-400 text-brand-text-primary rounded-xl py-3 pl-10 pr-10 outline-none text-sm transition-all placeholder:text-brand-text-tertiary"
                />
                <button
                  type="button"
                  onClick={() => setShowGateKey(!showGateKey)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-text-tertiary hover:text-white"
                >
                  {showGateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-brand-text-tertiary mt-1.5">
                Key set in <code className="text-brand-text-secondary">.env.local</code> → <code className="text-amber-400/80">ADMIN_SETUP_KEY</code>
              </p>
            </div>

            <button
              type="submit"
              disabled={gateLoading || !gateKey}
              className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg active:scale-[0.98]"
            >
              {gateLoading ? (
                <><Loader className="w-4 h-4 animate-spin" /><span>Verifying…</span></>
              ) : (
                <><span>Unlock Console</span><ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER: Auth Panel (Stage 2 — Sign In / Sign Up tabs)
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-brand-deep flex items-center justify-center p-4 relative overflow-hidden text-brand-text-primary">

      {/* Go back to gate */}
      <button
        onClick={() => { setStage('gate'); setGateKey(''); setGateError(''); }}
        className="absolute top-6 left-6 flex items-center gap-2 text-brand-text-tertiary hover:text-white text-xs font-semibold transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Key Lock</span>
      </button>

      {/* Auth Card */}
      <div className="w-full max-w-md bg-brand-surface border border-border-default rounded-3xl shadow-2xl relative z-10 overflow-hidden">

        {/* Header */}
        <div className="p-8 pb-0 text-center">
          <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-accent-bright">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-extrabold text-brand-text-primary tracking-tight">Admin Console</h1>
          <p className="text-brand-text-secondary text-xs mt-1">Cedar Tech Management Portal</p>
        </div>

        {/* Tabs */}
        <div className="flex mx-8 mt-6 bg-black/40 rounded-2xl p-1 border border-border-default">
          <button
            onClick={() => { setActiveTab('signin'); setSiError(''); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'signin'
                ? 'bg-accent-blue text-white shadow-md'
                : 'text-brand-text-secondary hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setActiveTab('signup'); setSuError(''); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'signup'
                ? 'bg-accent-blue text-white shadow-md'
                : 'text-brand-text-secondary hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        <div className="p-8 pt-6">

          {/* ── SIGN IN TAB ── */}
          {activeTab === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              {siError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl text-center">
                  {siError}
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-[10px] font-bold text-brand-text-tertiary uppercase tracking-widest mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-tertiary" />
                  <input
                    type="email"
                    required
                    placeholder="admin@cedartech.com"
                    value={siEmail}
                    onChange={(e) => setSiEmail(e.target.value)}
                    className="w-full bg-black/40 border border-border-default focus:border-accent-bright text-brand-text-primary rounded-xl py-3 pl-10 pr-4 outline-none text-sm transition-all placeholder:text-brand-text-tertiary"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[10px] font-bold text-brand-text-tertiary uppercase tracking-widest mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-tertiary" />
                  <input
                    type={showSiPass ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={siPassword}
                    onChange={(e) => setSiPassword(e.target.value)}
                    className="w-full bg-black/40 border border-border-default focus:border-accent-bright text-brand-text-primary rounded-xl py-3 pl-10 pr-10 outline-none text-sm transition-all placeholder:text-brand-text-tertiary"
                  />
                  <button type="button" onClick={() => setShowSiPass(!showSiPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-text-tertiary hover:text-white">
                    {showSiPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={siLoading}
                className="w-full flex items-center justify-center gap-2 bg-accent-blue hover:bg-blue-600 disabled:opacity-40 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg active:scale-[0.98] mt-2"
              >
                {siLoading ? (
                  <><Loader className="w-4 h-4 animate-spin" /><span>Signing in…</span></>
                ) : (
                  <><span>Sign In to Console</span><ArrowRight className="w-4 h-4" /></>
                )}
              </button>

              <p className="text-center text-brand-text-tertiary text-[11px] pt-1">
                No account yet?{' '}
                <button type="button" onClick={() => setActiveTab('signup')} className="text-accent-bright hover:underline font-semibold">
                  Create one
                </button>
              </p>
            </form>
          )}

          {/* ── SIGN UP TAB ── */}
          {activeTab === 'signup' && (
            <>
              {suSuccess ? (
                <div className="flex flex-col items-center gap-4 py-6 text-center">
                  <div className="w-14 h-14 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-7 h-7 text-green-400" />
                  </div>
                  <div>
                    <p className="text-brand-text-primary font-bold">Admin Account Created!</p>
                    <p className="text-brand-text-secondary text-xs mt-1">Switching you to Sign In…</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSignUp} className="space-y-4">
                  {suError && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl text-center">
                      {suError}
                    </div>
                  )}

                  {/* Name */}
                  <div>
                    <label className="block text-[10px] font-bold text-brand-text-tertiary uppercase tracking-widest mb-1.5">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-tertiary" />
                      <input
                        type="text"
                        required
                        placeholder="Your name"
                        value={suName}
                        onChange={(e) => setSuName(e.target.value)}
                        className="w-full bg-black/40 border border-border-default focus:border-accent-bright text-brand-text-primary rounded-xl py-3 pl-10 pr-4 outline-none text-sm transition-all placeholder:text-brand-text-tertiary"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[10px] font-bold text-brand-text-tertiary uppercase tracking-widest mb-1.5">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-tertiary" />
                      <input
                        type="email"
                        required
                        placeholder="admin@cedartech.com"
                        value={suEmail}
                        onChange={(e) => setSuEmail(e.target.value)}
                        className="w-full bg-black/40 border border-border-default focus:border-accent-bright text-brand-text-primary rounded-xl py-3 pl-10 pr-4 outline-none text-sm transition-all placeholder:text-brand-text-tertiary"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-[10px] font-bold text-brand-text-tertiary uppercase tracking-widest mb-1.5">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-tertiary" />
                      <input
                        type={showSuPass ? 'text' : 'password'}
                        required
                        placeholder="Min. 6 characters"
                        value={suPassword}
                        onChange={(e) => setSuPassword(e.target.value)}
                        className="w-full bg-black/40 border border-border-default focus:border-accent-bright text-brand-text-primary rounded-xl py-3 pl-10 pr-10 outline-none text-sm transition-all placeholder:text-brand-text-tertiary"
                      />
                      <button type="button" onClick={() => setShowSuPass(!showSuPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-text-tertiary hover:text-white">
                        {showSuPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-[10px] font-bold text-brand-text-tertiary uppercase tracking-widest mb-1.5">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-tertiary" />
                      <input
                        type={showSuConfirm ? 'text' : 'password'}
                        required
                        placeholder="Repeat password"
                        value={suConfirm}
                        onChange={(e) => setSuConfirm(e.target.value)}
                        className={`w-full bg-black/40 border focus:border-accent-bright text-brand-text-primary rounded-xl py-3 pl-10 pr-10 outline-none text-sm transition-all placeholder:text-brand-text-tertiary ${
                          suConfirm && suConfirm !== suPassword ? 'border-red-500' : 'border-border-default'
                        }`}
                      />
                      <button type="button" onClick={() => setShowSuConfirm(!showSuConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-text-tertiary hover:text-white">
                        {showSuConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {suConfirm && suConfirm !== suPassword && (
                      <p className="text-red-400 text-[10px] mt-1">Passwords do not match</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={suLoading}
                    className="w-full flex items-center justify-center gap-2 bg-accent-blue hover:bg-blue-600 disabled:opacity-40 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg active:scale-[0.98] mt-2"
                  >
                    {suLoading ? (
                      <><Loader className="w-4 h-4 animate-spin" /><span>Creating Account…</span></>
                    ) : (
                      <><span>Create Admin Account</span><ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>

                  <p className="text-center text-brand-text-tertiary text-[11px] pt-1">
                    Already have an account?{' '}
                    <button type="button" onClick={() => setActiveTab('signin')} className="text-accent-bright hover:underline font-semibold">
                      Sign in
                    </button>
                  </p>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
