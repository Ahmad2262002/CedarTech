'use client';

import React, { useState } from 'react';
import { useAuth } from 'src/lib/context/AuthContext';
import { X, Mail, Lock, User, AlertCircle, Loader } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

export default function LoginModal() {
  const { showLoginModal, setShowLoginModal, login, register } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!showLoginModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!isLoginMode && !name) {
      setError('Please enter your name.');
      return;
    }

    if (!isLoginMode && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    try {
      if (isLoginMode) {
        const result = await login(email, password);
        if (!result.success) {
          setError(result.error || 'Invalid email or password');
        }
      } else {
        const result = await register(name, email, password);
        if (!result.success) {
          setError(result.error || 'Registration failed');
        }
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setShowLoginModal(false);
    setError('');
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6">
      <div className="relative w-full max-w-md rounded-3xl p-8 space-y-8 bg-[#0a0a0d] border border-white/10 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-full text-brand-text-secondary hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            {isLoginMode ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-sm text-brand-text-secondary">
            {isLoginMode ? 'Sign in to access checkout and track your orders' : 'Register to purchase electronics with local warranty'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLoginMode && (
            <Input
              label="Full Name"
              type="text"
              required
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<User className="w-4 h-4" />}
            />
          )}

          <Input
            label="Email Address"
            type="email"
            required
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="w-4 h-4" />}
          />

          <Input
            label="Password"
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="w-4 h-4" />}
          />

          {!isLoginMode && (
            <Input
              label="Confirm Password"
              type="password"
              required
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
            />
          )}

          <Button
            type="submit"
            disabled={isLoading}
            fullWidth
            size="lg"
            className="mt-4"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{isLoginMode ? 'Sign In' : 'Create Account'}</span>
            )}
          </Button>
        </form>

        {/* Modal Footer Toggler */}
        <div className="pt-6 border-t border-white/10 text-center">
          <button
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setError('');
            }}
            className="text-sm font-medium text-accent-blue hover:text-blue-400 transition-colors"
          >
            {isLoginMode ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </button>
        </div>

      </div>
    </div>
  );
}
