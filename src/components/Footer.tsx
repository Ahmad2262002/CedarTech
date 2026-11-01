'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'src/context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  const footerColumns = [
    {
      title: t('footer.catalog', 'Catalog'),
      links: [
        [t('nav.products', 'All Products'), '/products'],
        [t('categories.smartphones', 'Smartphones'), '/products?category=cell-phones'],
        [t('categories.laptops', 'Laptops'), '/products?category=laptops'],
        [t('categories.tablets', 'Tablets'), '/products?category=tablets'],
        [t('categories.accessories', 'Accessories'), '/products?category=accessories'],
      ],
    },
    {
      title: t('footer.support', 'Support'),
      links: [
        [t('footer.whatsapp', 'WhatsApp Support'), 'https://wa.me/96176743718'],
        [t('footer.warranty', 'Warranty Policy'), '/about'],
        [t('footer.shipping', 'Shipping Info'), '/about'],
      ],
    },
    {
      title: t('footer.account', 'Account'),
      links: [
        [t('cart.title', 'Shopping Cart'), '/cart'],
        [t('footer.admin_portal', 'Admin Portal'), '/admin/login'],
      ],
    },
    {
      title: t('footer.about_cedar', 'Agha Tech plus'),
      links: [
        [t('footer.about_us', 'About Us'), '/about'],
        [t('footer.privacy', 'Privacy Policy'), '/about'],
        [t('footer.terms', 'Terms of Use'), '/about'],
      ],
    },
  ];

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
              <span className="block text-xl font-black tracking-tight text-brand-text-primary uppercase">
                Agha Tech<span className="text-accent-bright"> plus</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              {t('footer.tagline', "Lebanon's premier destination for high-performance electronics, custom builds, and flagship devices.")}
            </p>
            <div className="pt-2">
              <LanguageSwitcher variant="footer" />
            </div>
          </div>
          {footerColumns.map(({ title, links }) => (
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
          <p>{t('footer.copyright', `Copyright © ${currentYear} Agha Tech plus. All rights reserved.`)}</p>
          <p>{t('footer.motto', 'Engineered for Performance · Delivered in Lebanon')}</p>
        </div>
      </div>
    </footer>
  );
}
