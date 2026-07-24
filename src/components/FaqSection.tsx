'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    q: 'How fast is delivery?',
    a: 'Yes! We offer 24-hour express delivery within the Bekaa valley and 48–72 hour nationwide delivery to all areas including Beirut, Tripoli, Sidon, Tyre, Zahle, Byblos, Jounieh, and Mount Lebanon.',
  },
  {
    q: 'How does Cash on Delivery (COD) work?',
    a: 'You can pay in USD cash directly to our delivery courier upon receiving and inspecting your sealed package. No pre-payment or credit card is required.',
  },
  {
    q: 'Are all products brand new, authentic, and sealed?',
    a: '100% guaranteed. Every device sold at Cedar Tech is original, brand new, factory sealed, and backed by authorized manufacturer/local service center warranties.',
  },
  {
    q: 'What does the 1-Year Local Warranty cover?',
    a: 'Our local warranty covers manufacturing defects, hardware failures, and component replacements. Repairs are handled locally in Lebanon by certified brand technicians.',
  },
  {
    q: 'Can I request a custom PC build or ask for specific product stock?',
    a: 'Absolutely! Our live WhatsApp tech concierge is available 6 days a week to provide custom PC part configurations, pricing quotes, and stock verification in real time.',
  },
];

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="w-full py-24 border-t border-white/10 bg-brand-deep">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-blue-500/10 text-accent-bright border border-blue-500/20 mb-4">
            <HelpCircle className="w-4 h-4" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-brand-text-secondary">
            Everything you need to know about ordering, warranty, and delivery in Lebanon.
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
                  className="w-full p-6 flex items-center justify-between text-left gap-4 hover:bg-brand-elevated transition-colors"
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
