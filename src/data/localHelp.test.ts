import { describe, expect, it } from 'vitest';
import type { Language } from '../i18n';
import type { CategoryId } from '../types';
import { buildHelpSearchLinks } from './localHelp';

const categories: CategoryId[] = ['rent', 'energy', 'jobcenter', 'health', 'garnishment', 'schufa', 'debtCourt', 'family'];
const languages: Language[] = ['de', 'tr', 'ar', 'uk'];

describe('Google local-help fallback', () => {
  it.each(categories)('uses only Google search URLs for %s', (categoryId) => {
    for (const language of languages) {
      const links = buildHelpSearchLinks(categoryId, { city: 'Frankfurt (Oder)' }, language);
      expect(links).toHaveLength(4);
      for (const link of links) {
        const url = new URL(link.url);
        expect(url.hostname).toBe('www.google.com');
        expect(url.pathname).toBe('/search');
        expect(url.searchParams.get('q')).toContain('Frankfurt (Oder)');
      }
    }
  });

  it('normalizes location before adding it to a query', () => {
    const [link] = buildHelpSearchLinks('rent', { city: '  01067\n Dresden  ' }, 'de');
    expect(new URL(link.url).searchParams.get('q')).toContain('01067 Dresden');
  });
});
