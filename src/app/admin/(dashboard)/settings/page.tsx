'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, Loader, CheckCircle } from 'lucide-react';

interface StoreSettings {
  storeName: string;
  contactPhone: string;
  whatsAppNumber: string;
  deliveryFee: number;
  currencySymbol: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
  };
  enabledPaymentMethods: {
    cod: boolean;
  };
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Form fields
  const [storeName, setStoreName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [whatsAppNumber, setWhatsAppNumber] = useState('');
  const [deliveryFee, setDeliveryFee] = useState('');
  
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  
  const [cod, setCod] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.success && data.settings) {
          const s = data.settings;
          setSettings(s);
          setStoreName(s.storeName);
          setContactPhone(s.contactPhone);
          setWhatsAppNumber(s.whatsAppNumber);
          setDeliveryFee(s.deliveryFee.toString());
          setFacebook(s.socialLinks?.facebook || '');
          setInstagram(s.socialLinks?.instagram || '');
          setCod(s.enabledPaymentMethods?.cod ?? true);
        }
      } catch (e) {
        console.error('Failed to load settings', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsSaving(true);

    if (!storeName || !contactPhone || !whatsAppNumber || !deliveryFee) {
      setError('Please fill in all store contact and shipping fields.');
      setIsSaving(false);
      return;
    }

    const payload = {
      storeName,
      contactPhone,
      whatsAppNumber,
      deliveryFee: parseFloat(deliveryFee),
      socialLinks: { facebook, instagram },
      enabledPaymentMethods: {
        cod: true,
      },
    };

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        // Clear success banner after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(data.error || 'Failed to update store settings.');
      }
    } catch (err) {
      setError('A connection error occurred. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-border-default pb-5">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">System Settings</h1>
        <p className="text-sm text-brand-text-secondary mt-1">Configure delivery fees, payment triggers, and store contact info</p>
      </div>

      {success && (
        <div className="bg-emerald-955/35 border border-emerald-900/50 text-emerald-350 text-xs p-4 rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>System settings updated successfully. Changes applied to storefront checkout.</span>
        </div>
      )}

      {error && (
        <div className="bg-red-955/30 border border-red-900/60 text-red-200 text-xs p-4 rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-xs sm:text-sm">
        
        {/* Left 2 Cols: Main settings cards */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* General Profile settings */}
          <div className="bg-brand-surface border border-border-default rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-white border-b border-slate-850 pb-3">
              <Settings className="w-4.5 h-4.5 text-accent-bright" />
              <h2 className="text-sm font-bold uppercase tracking-wider">General Store Profile</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-brand-text-secondary uppercase tracking-wider mb-1.5">
                  Store Public Name
                </label>
                <input
                  type="text"
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full bg-brand-deep border border-slate-850 focus:border-indigo-500 text-white rounded-lg p-2.5 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-text-secondary uppercase tracking-wider mb-1.5">
                  Nationwide Delivery Fee ($)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(e.target.value)}
                  className="w-full bg-brand-deep border border-slate-850 focus:border-indigo-500 text-white rounded-lg p-2.5 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-text-secondary uppercase tracking-wider mb-1.5">
                  Support Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full bg-brand-deep border border-slate-850 focus:border-indigo-500 text-white rounded-lg p-2.5 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-text-secondary uppercase tracking-wider mb-1.5">
                  WhatsApp Number (with country code, e.g. 96170123456)
                </label>
                <input
                  type="text"
                  required
                  value={whatsAppNumber}
                  onChange={(e) => setWhatsAppNumber(e.target.value)}
                  className="w-full bg-brand-deep border border-slate-850 focus:border-indigo-500 text-white rounded-lg p-2.5 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Social connections */}
          <div className="bg-brand-surface border border-border-default rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-white border-b border-slate-850 pb-3">
              <span className="text-accent-bright font-bold">🔗</span>
              <h2 className="text-sm font-bold uppercase tracking-wider">Social Links</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-brand-text-secondary uppercase tracking-wider mb-1.5">
                  Facebook Page Link
                </label>
                <input
                  type="url"
                  placeholder="https://facebook.com/yourpage"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  className="w-full bg-brand-deep border border-slate-850 focus:border-indigo-500 text-white rounded-lg p-2.5 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-text-secondary uppercase tracking-wider mb-1.5">
                  Instagram Link
                </label>
                <input
                  type="url"
                  placeholder="https://instagram.com/yourhandle"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="w-full bg-brand-deep border border-slate-850 focus:border-indigo-500 text-white rounded-lg p-2.5 outline-none"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Col: Payment selectors */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-brand-surface border border-border-default rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-white border-b border-slate-850 pb-3">
              <span className="text-accent-bright font-bold">💳</span>
              <h2 className="text-sm font-bold uppercase tracking-wider">Payment Toggles</h2>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between p-3 border border-slate-850 hover:border-border-default rounded-xl cursor-pointer select-none">
                <div>
                  <p className="text-white font-semibold text-xs">Cash on Delivery</p>
                  <p className="text-[10px] text-brand-text-tertiary mt-0.5">Enable pay cash USD</p>
                </div>
                <input
                  type="checkbox"
                  checked={cod}
                  onChange={(e) => setCod(e.target.checked)}
                  className="rounded text-indigo-600 bg-slate-955 border-border-default focus:ring-0 cursor-pointer"
                />
              </label>


            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full flex items-center justify-center gap-1.5 bg-indigo-650 hover:bg-accent-blue disabled:bg-indigo-800 text-white font-bold py-3.5 px-4 rounded-xl text-xs transition-colors mt-6 shadow-lg shadow-indigo-950/40"
            >
              {isSaving ? (
                <>
                  <Loader className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving settings...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Config Settings</span>
                </>
              )}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
