import { describe, expect, it } from 'vitest';
import type { Language } from '../i18n';
import type { CategoryId } from '../types';
import { buildDirectHelpContacts } from './directHelp';

const categories: CategoryId[] = ['rent', 'energy', 'jobcenter', 'health', 'garnishment', 'schufa', 'debtCourt', 'family'];
const languages: Language[] = ['de', 'tr', 'ar', 'uk'];

describe('verified direct contacts', () => {
  it.each(categories)('provides three usable contacts for %s in every language', (categoryId) => {
    for (const language of languages) {
      const contacts = buildDirectHelpContacts(categoryId, language);
      expect(contacts).toHaveLength(3);
      expect(new Set(contacts.map((contact) => contact.id)).size).toBe(3);

      for (const contact of contacts) {
        expect(new URL(contact.websiteUrl).protocol).toBe('https:');
        expect(new URL(contact.sourceUrl).protocol).toBe('https:');
        expect(contact.lastVerifiedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(contact.description.length).toBeGreaterThan(20);
        expect(contact.limitation.length).toBeGreaterThan(20);
        if (contact.phoneDisplay) expect(contact.phoneHref).toMatch(/^tel:\+?\d+$/);
      }
    }
  });

  it('routes an existential Schufa case to public and debt help before Schufa services', () => {
    const contacts = buildDirectHelpContacts('schufa', 'de', { basicNeedsAtRisk: 'ja' });
    expect(contacts.map((contact) => contact.id)).toEqual([
      'publicService115',
      'debtHelpline',
      'consumerAdvice',
    ]);
  });
});
