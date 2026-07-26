import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Country } from '../types';
import { ar } from './ar';
import { de } from './de';
import { tr } from './tr';
import { uk } from './uk';
import { adaptTranslationForAustria } from './austria';

export type Language = 'de' | 'tr' | 'ar' | 'uk';

const STORAGE_KEY = 'klarkommen-language';
const COUNTRY_STORAGE_KEY = 'klarkommen-country';

const translations = {
  ar,
  de,
  tr,
  uk,
};

const languageOptions: Array<{ code: Language; label: string }> = [
  { code: 'de', label: 'Deutsch' },
  { code: 'tr', label: 'Türkçe' },
  { code: 'ar', label: 'العربية' },
  { code: 'uk', label: 'Українська' },
];

interface I18nContextValue {
  country: Country;
  countryAriaLabel: string;
  countryOptions: Array<{ code: Country; label: string }>;
  language: Language;
  languageOptions: Array<{ code: Language; label: string }>;
  setCountry: (country: Country) => void;
  setLanguage: (language: Language) => void;
  t: typeof de;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const readInitialLanguage = (): Language => {
  if (typeof window === 'undefined') return 'de';
  const savedLanguage = window.localStorage.getItem(STORAGE_KEY);
  if (savedLanguage === 'ar') return 'ar';
  if (savedLanguage === 'uk') return 'uk';
  return savedLanguage === 'tr' ? 'tr' : 'de';
};

const readInitialCountry = (): Country => {
  if (typeof window === 'undefined') return 'de';
  return window.localStorage.getItem(COUNTRY_STORAGE_KEY) === 'at' ? 'at' : 'de';
};

const countryLabels: Record<Language, Record<Country, string>> = {
  de: { de: 'Deutschland', at: 'Österreich' },
  tr: { de: 'Almanya', at: 'Avusturya' },
  ar: { de: 'ألمانيا', at: 'النمسا' },
  uk: { de: 'Німеччина', at: 'Австрія' },
};

const countryAriaLabels: Record<Language, string> = {
  de: 'Land',
  tr: 'Ülke',
  ar: 'البلد',
  uk: 'Країна',
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [country, setCountry] = useState<Country>(readInitialCountry);
  const [language, setLanguage] = useState<Language>(readInitialLanguage);

  useEffect(() => {
    window.localStorage.setItem(COUNTRY_STORAGE_KEY, country);
    document.documentElement.dataset.country = country;
  }, [country]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language === 'de' ? (country === 'at' ? 'de-AT' : 'de-DE') : language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [country, language]);

  const value = useMemo(
    () => ({
      country,
      countryAriaLabel: countryAriaLabels[language],
      countryOptions: (['de', 'at'] as Country[]).map((code) => ({
        code,
        label: countryLabels[language][code],
      })),
      language,
      languageOptions,
      setCountry,
      setLanguage,
      t:
        country === 'at'
          ? adaptTranslationForAustria(translations[language] ?? translations.de, language)
          : translations[language] ?? translations.de,
    }),
    [country, language],
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
