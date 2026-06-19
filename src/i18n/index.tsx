import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { de } from './de';
import { tr } from './tr';

export type Language = 'de' | 'tr';

const STORAGE_KEY = 'klarkommen-language';

const translations = {
  de,
  tr,
};

const languageOptions: Array<{ code: Language; label: string }> = [
  { code: 'de', label: 'Deutsch' },
  { code: 'tr', label: 'Türkçe' },
];

interface I18nContextValue {
  language: Language;
  languageOptions: Array<{ code: Language; label: string }>;
  setLanguage: (language: Language) => void;
  t: typeof de;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const readInitialLanguage = (): Language => {
  if (typeof window === 'undefined') return 'de';
  const savedLanguage = window.localStorage.getItem(STORAGE_KEY);
  return savedLanguage === 'tr' ? 'tr' : 'de';
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(readInitialLanguage);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      languageOptions,
      setLanguage,
      t: translations[language] ?? translations.de,
    }),
    [language],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used inside I18nProvider');
  }
  return context;
}
