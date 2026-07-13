import { describe, expect, it } from 'vitest';
import { formatDateForLanguage, formatEuroForLanguage } from './formatters';

describe('locale-aware formatters', () => {
  it('does not expose an ISO deadline in localized output', () => {
    expect(formatDateForLanguage('2026-07-13', 'de')).toBe('13.07.2026');
    expect(formatDateForLanguage('2026-07-13', 'tr')).not.toBe('2026-07-13');
    expect(formatDateForLanguage('2026-07-13', 'ar')).not.toBe('2026-07-13');
    expect(formatDateForLanguage('2026-07-13', 'uk')).not.toBe('2026-07-13');
  });

  it('formats the euro amount with the selected locale', () => {
    expect(formatEuroForLanguage('1234.5', 'de')).toContain('1.234,5');
    expect(formatEuroForLanguage('1234.5', 'tr')).toContain('1.234,5');
  });
});
