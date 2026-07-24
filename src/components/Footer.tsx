'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border-default mt-auto bg-brand-surface text-brand-text-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 space-y-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 2L4 14H10L4 24H28L22 14H28L16 2Z" fill="url(#cedar-grad-foot)" />
                <rect x="14" y="24" width="4" height="6" fill="#52525b" />
                <defs>
                  <linearGradient id="cedar-grad-foot" x1="16" y1="2" x2="16" y2="24" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#ffffff" />
                    <stop offset="1" stopColor="#a1a1aa" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="block text-xl font-black tracking-tight text-brand-text-primary">
                CEDAR<span className="text-accent-bright">TECH</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Lebanon&apos;s premier destination for high-performance electronics, custom builds, and flagship devices.
            </p>
          </div>
          {[
            { title: 'Catalog', links: [['All Products','/products'],['Smartphones','/products?category=phones'],['Laptops','/products?category=laptops'],['Gaming','/products?category=gaming'],['Accessories','/products?category=accessories']] },
            { title: 'Support', links: [['WhatsApp Chat','https://wa.me/96179115521'],['Warranty Policy','#'],['Shipping Info','#'],['Returns','#']] },
            { title: 'Account', links: [['Shopping Cart','/cart'],['My Orders','#'],['Admin Portal','/admin/login']] },
            { title: 'Cedar Tech', links: [['About Us','/about'],['Privacy Policy','#'],['Terms of Use','#']] },
          ].map(({ title, links }) => (
            <div key={title} className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-brand-text-tertiary">{title}</p>
              <ul className="space-y-3">
                {links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="text-sm transition-colors duration-200 hover:text-brand-text-primary">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-border-default text-xs text-brand-text-tertiary">
          <p>Copyright © {currentYear} Cedar Tech. All rights reserved.</p>
          <p>Engineered for Performance · Delivered in Lebanon</p>
        </div>
      </div>
    </footer>
  );
}
