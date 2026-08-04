export type SupportedLanguage = 'de' | 'tr' | 'ar' | 'uk' | 'fr' | 'gsw';

export const localeByLanguage: Record<SupportedLanguage, string> = {
  ar: 'ar-DE',
  de: 'de-DE',
  tr: 'tr-TR',
  uk: 'uk-UA',
  fr: 'fr-CH',
  gsw: 'de-CH',
};

export function formatDateForLanguage(value: string, language: SupportedLanguage): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(localeByLanguage[language], {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function formatEuroForLanguage(value: string, language: SupportedLanguage): string {
  return formatCurrencyForLanguage(value, language, 'EUR');
}

export function formatCurrencyForLanguage(
  value: string,
  language: SupportedLanguage,
  currency: 'CHF' | 'EUR',
): string {
  const normalized = value.trim().replace(',', '.');
  const amount = Number(normalized);
  if (!normalized || !Number.isFinite(amount)) return `${value.trim()} ${currency}`.trim();

  return new Intl.NumberFormat(localeByLanguage[language], {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}
