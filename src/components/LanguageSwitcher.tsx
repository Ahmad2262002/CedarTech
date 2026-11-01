'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslation, SupportedLocale } from '../context/LanguageContext';
import { Globe, ChevronDown, Check } from 'lucide-react';

interface LanguageSwitcherProps {
  variant?: 'navbar' | 'footer' | 'default';
  className?: string;
}

export default function LanguageSwitcher({ variant = 'default', className = '' }: LanguageSwitcherProps) {
  const { locale, setLocale, languages } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find((l) => l.code === locale) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSelect = (code: SupportedLocale) => {
    setLocale(code);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-brand-text-primary hover:bg-white/10 border border-white/10 transition-all active:scale-95 shadow-sm"
        aria-label="Select Language"
        aria-expanded={isOpen}
      >
        <span className="text-sm leading-none">{currentLang.flag}</span>
        <span className="hidden sm:inline tracking-wide uppercase font-bold text-[11px]">
          {currentLang.code}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-brand-text-tertiary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-2xl overflow-hidden bg-[#121217]/95 backdrop-blur-xl border border-white/15 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3.5 py-2.5 border-b border-white/10 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-text-tertiary flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-accent-bright" />
              Language
            </span>
          </div>
          <div className="py-1.5 max-h-64 overflow-y-auto custom-scrollbar">
            {languages.map((lang) => {
              const isSelected = lang.code === locale;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full flex items-center justify-between px-3.5 py-2 text-xs transition-colors ${
                    isSelected
                      ? 'bg-accent-bright/15 text-accent-bright font-bold'
                      : 'text-brand-text-primary hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base leading-none">{lang.flag}</span>
                    <div className="flex flex-col text-left rtl:text-right">
                      <span className="font-medium text-xs leading-tight">{lang.nativeName}</span>
                      <span className="text-[10px] text-brand-text-tertiary">{lang.name}</span>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-accent-bright shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
