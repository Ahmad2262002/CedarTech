'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import en from '../locales/en.json';
import ar from '../locales/ar.json';
import fr from '../locales/fr.json';
import it from '../locales/it.json';
import es from '../locales/es.json';
import tr from '../locales/tr.json';

export type SupportedLocale = 'en' | 'ar' | 'fr' | 'it' | 'es' | 'tr';

export interface LanguageInfo {
  code: SupportedLocale;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

export const LANGUAGES: Record<SupportedLocale, LanguageInfo> = {
  en: { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', dir: 'ltr' },
  ar: { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  fr: { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr' },
  it: { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', dir: 'ltr' },
  es: { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr' },
  tr: { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', dir: 'ltr' },
};

const dictionaries: Record<SupportedLocale, any> = {
  en,
  ar,
  fr,
  it,
  es,
  tr,
};

interface LanguageContextType {
  locale: SupportedLocale;
  setLocale: (lang: SupportedLocale) => void;
  dir: 'ltr' | 'rtl';
  t: (keyPath: string, fallback?: string) => string;
  languages: LanguageInfo[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>('en');
  const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr');

  useEffect(() => {
    // Read stored language or default to English
    const saved = localStorage.getItem('cedar_lang') as SupportedLocale;
    if (saved && LANGUAGES[saved]) {
      setLocaleState(saved);
      applyLanguageSettings(saved);
    } else {
      applyLanguageSettings('en');
    }
  }, []);

  const applyLanguageSettings = (lang: SupportedLocale) => {
    const config = LANGUAGES[lang] || LANGUAGES.en;
    setDir(config.dir);
    if (typeof document !== 'undefined') {
      document.documentElement.dir = config.dir;
      document.documentElement.lang = config.code;
    }
  };

  const setLocale = (newLocale: SupportedLocale) => {
    if (!LANGUAGES[newLocale]) return;
    setLocaleState(newLocale);
    localStorage.setItem('cedar_lang', newLocale);
    document.cookie = `cedar_lang=${newLocale}; path=/; max-age=31536000`;
    applyLanguageSettings(newLocale);
  };

  const t = (keyPath: string, fallback?: string): string => {
    const dict = dictionaries[locale] || dictionaries.en;
    const parts = keyPath.split('.');
    let current: any = dict;

    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        // Fallback to English dictionary
        let fallbackCurrent: any = dictionaries.en;
        for (const fPart of parts) {
          if (fallbackCurrent && typeof fallbackCurrent === 'object' && fPart in fallbackCurrent) {
            fallbackCurrent = fallbackCurrent[fPart];
          } else {
            return fallback || keyPath;
          }
        }
        return typeof fallbackCurrent === 'string' ? fallbackCurrent : fallback || keyPath;
      }
    }

    return typeof current === 'string' ? current : fallback || keyPath;
  };

  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale,
        dir,
        t,
        languages: Object.values(LANGUAGES),
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      locale: 'en' as SupportedLocale,
      setLocale: () => {},
      dir: 'ltr' as const,
      t: (keyPath: string, fallback?: string) => fallback || keyPath,
      languages: Object.values(LANGUAGES),
    };
  }
  return context;
}
