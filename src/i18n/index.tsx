import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Country } from '../types';
import { ar } from './ar';
import { de } from './de';
import { tr } from './tr';
import { uk } from './uk';
import { adaptTranslationForAustria } from './austria';
import { adaptTranslationForSwitzerland } from './switzerland';

export type BaseLanguage = 'de' | 'tr' | 'ar' | 'uk';
export type Language = BaseLanguage | 'fr' | 'gsw';

const STORAGE_KEY = 'klarkommen-language';
const COUNTRY_STORAGE_KEY = 'klarkommen-country';

const translations: Record<BaseLanguage, typeof de> = {
  ar,
  de,
  tr,
  uk,
};

const baseLanguageOptions: Array<{ code: BaseLanguage; label: string }> = [
  { code: 'de', label: 'Deutsch' },
  { code: 'tr', label: 'Türkçe' },
  { code: 'ar', label: 'العربية' },
  { code: 'uk', label: 'Українська' },
];

const swissLanguageOptions: Array<{ code: Language; label: string }> = [
  ...baseLanguageOptions,
  { code: 'fr', label: 'Français' },
  { code: 'gsw', label: 'Schwiizerdütsch' },
];

export const isBaseLanguage = (language: Language): language is BaseLanguage =>
  language === 'de' || language === 'tr' || language === 'ar' || language === 'uk';

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
  const savedCountry = window.localStorage.getItem(COUNTRY_STORAGE_KEY);
  if (savedCountry === 'ch' && (savedLanguage === 'fr' || savedLanguage === 'gsw')) return savedLanguage;
  if (savedLanguage === 'ar') return 'ar';
  if (savedLanguage === 'uk') return 'uk';
  return savedLanguage === 'tr' ? 'tr' : 'de';
};

const readInitialCountry = (): Country => {
  if (typeof window === 'undefined') return 'de';
  const savedCountry = window.localStorage.getItem(COUNTRY_STORAGE_KEY);
  if (savedCountry === 'at' || savedCountry === 'ch') return savedCountry;
  return 'de';
};

const countryLabels: Record<Language, Record<Country, string>> = {
  de: { de: 'Deutschland', at: 'Österreich', ch: 'Schweiz' },
  tr: { de: 'Almanya', at: 'Avusturya', ch: 'İsviçre' },
  ar: { de: 'ألمانيا', at: 'النمسا', ch: 'سويسرا' },
  uk: { de: 'Німеччина', at: 'Австрія', ch: 'Швейцарія' },
  fr: { de: 'Allemagne', at: 'Autriche', ch: 'Suisse' },
  gsw: { de: 'Dütschland', at: 'Öschtriich', ch: 'Schwiiz' },
};

const countryAriaLabels: Record<Language, string> = {
  de: 'Land',
  tr: 'Ülke',
  ar: 'البلد',
  uk: 'Країна',
  fr: 'Pays',
  gsw: 'Land',
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [country, setCountryState] = useState<Country>(readInitialCountry);
  const [language, setLanguage] = useState<Language>(readInitialLanguage);

  const setCountry = (nextCountry: Country) => {
    setCountryState(nextCountry);
    if (nextCountry !== 'ch' && !isBaseLanguage(language)) setLanguage('de');
  };

  useEffect(() => {
    window.localStorage.setItem(COUNTRY_STORAGE_KEY, country);
    document.documentElement.dataset.country = country;
  }, [country]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language === 'de'
      ? ({ de: 'de-DE', at: 'de-AT', ch: 'de-CH' } as const)[country]
      : language === 'fr'
        ? 'fr-CH'
        : language === 'gsw'
          ? 'gsw-CH'
          : language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [country, language]);

  const value = useMemo(
    () => ({
      country,
      countryAriaLabel: countryAriaLabels[language],
      countryOptions: (['de', 'at', 'ch'] as Country[]).map((code) => ({
        code,
        label: countryLabels[language][code],
      })),
      language,
      languageOptions: country === 'ch' ? swissLanguageOptions : baseLanguageOptions,
      setCountry,
      setLanguage,
      t: country === 'ch'
        ? adaptTranslationForSwitzerland(translations[isBaseLanguage(language) ? language : 'de'], language)
        : country === 'at'
          ? adaptTranslationForAustria(translations[isBaseLanguage(language) ? language : 'de'], isBaseLanguage(language) ? language : 'de')
          : translations[isBaseLanguage(language) ? language : 'de'],
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
