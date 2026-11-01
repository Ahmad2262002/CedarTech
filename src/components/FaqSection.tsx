'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useTranslation } from 'src/context/LanguageContext';

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const { t } = useTranslation();

  const FAQS = [
    {
      q: t('faq.q1', 'How does delivery work across Lebanon?'),
      a: t('faq.a1', 'We operate as a 100% online store with daily nationwide dispatch! Our courier delivers straight to your doorstep across all Lebanese regions (Beirut, Mount Lebanon, Tripoli, Sidon, Tyre, Bekaa, Jounieh, etc.) within 24 to 48 hours.'),
    },
    {
      q: t('faq.q2', 'How does Cash on Delivery (COD) work?'),
      a: t('faq.a2', 'You can pay in USD cash directly to our delivery courier upon receiving and inspecting your sealed package. No pre-payment or credit card is required.'),
    },
    {
      q: t('faq.q3', 'Are all products brand new, authentic, and sealed?'),
      a: t('faq.a3', '100% guaranteed. Every device sold at Agha Tech plus is original, brand new, factory sealed, inspected, and delivered in our custom branded packaging with local warranty.'),
    },
    {
      q: t('faq.q4', 'What does the 1-Year Local Warranty cover?'),
      a: t('faq.a4', 'Our local warranty covers manufacturing defects, hardware failures, and component replacements. Repairs are handled locally in Lebanon by certified brand technicians.'),
    },
    {
      q: t('faq.q5', 'Can I request a custom PC build or ask for specific product stock?'),
      a: t('faq.a5', 'Absolutely! Our live WhatsApp tech concierge is available 6 days a week to provide custom PC part configurations, pricing quotes, and stock verification in real time.'),
    },
  ];

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="w-full py-24 border-t border-white/10 bg-brand-deep">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-blue-500/10 text-accent-bright border border-blue-500/20 mb-4">
            <HelpCircle className="w-4 h-4" />
            <span>{t('faq.badge', 'Got Questions?')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            {t('faq.title', 'Frequently Asked Questions')}
          </h2>
          <p className="text-lg text-brand-text-secondary">
            {t('faq.subtitle', 'Everything you need to know about ordering, warranty, and delivery in Lebanon.')}
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <div
                key={i}
                className={`rounded-2xl overflow-hidden transition-all duration-300 bg-brand-surface border ${
                  isOpen ? 'border-accent-bright shadow-[0_0_20px_rgba(41,151,255,0.1)]' : 'border-white/10'
                }`}
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full p-6 flex items-center justify-between text-left rtl:text-right gap-4 hover:bg-brand-elevated transition-colors"
                >
                  <span className="text-base font-bold text-white leading-snug">
                    {faq.q}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? 'bg-accent-blue text-white rotate-180' : 'bg-white/5 text-white/50 rotate-0'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-sm leading-relaxed text-brand-text-secondary">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
