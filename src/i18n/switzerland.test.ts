import { describe, expect, it } from 'vitest';
import { buildDirectHelpContacts } from '../data/directHelp';
import { buildHelpSearchLinks, buildPhoneScript } from '../data/localHelp';
import { buildActionPlan, buildDocuments } from '../data/preparation';
import { buildQuickActions } from '../data/quickHelp';
import type { CategoryId } from '../types';
import { ar } from './ar';
import { de } from './de';
import type { Language } from './index';
import { getQuickHelpTexts } from './quickHelp';
import { adaptTranslationForSwitzerland } from './switzerland';
import { tr } from './tr';
import { uk } from './uk';

const categoryIds: CategoryId[] = ['rent', 'energy', 'jobcenter', 'health', 'garnishment', 'schufa', 'debtCourt', 'family'];
const languages: Language[] = ['de', 'tr', 'ar', 'uk', 'fr', 'gsw'];
const bases = { ar, de, tr, uk };

const translationFor = (language: Language) =>
  adaptTranslationForSwitzerland(language === 'fr' || language === 'gsw' ? de : bases[language], language);

describe('Swiss country adaptation', () => {
  it('keeps all functionality identifiers stable in all six Swiss languages', () => {
    for (const language of languages) {
      const ch = translationFor(language);
      expect(ch.categories.map((category) => category.id)).toEqual(categoryIds);
      expect(ch.commonQuestions.map((question) => question.id)).toEqual(de.commonQuestions.map((question) => question.id));
      for (const categoryId of categoryIds) {
        expect(ch.categoryQuestions[categoryId].map((question) => question.id)).toEqual(de.categoryQuestions[categoryId].map((question) => question.id));
        const expectedCount = de.buildAllTemplates(de.categories.find((item) => item.id === categoryId)!, {}).length;
        expect(ch.buildAllTemplates(ch.categories.find((item) => item.id === categoryId)!, {})).toHaveLength(expectedCount);
      }
    }
  });

  it('uses Swiss institutions, law and CHF', () => {
    const ch = translationFor('de');
    const categories = Object.fromEntries(ch.categories.map((category) => [category.id, category]));
    expect(categories.jobcenter.title).toContain('RAV');
    expect(categories.schufa.title).toContain('ZEK');
    expect(categories.debtCourt.title).toContain('Zahlungsbefehl');
    expect(ch.buildRecommendations('rent', { amount: '1200' }).situation.join(' ')).toContain('CHF');
    expect(JSON.stringify(ch.legal)).toContain('10');
  });

  it('provides Swiss contacts and local searches for every category and language', () => {
    for (const language of languages) {
      for (const categoryId of categoryIds) {
        const contacts = buildDirectHelpContacts(categoryId, language, {}, 'ch');
        expect(contacts).toHaveLength(3);
        expect(contacts.every((contact) => contact.lastVerifiedAt === '2026-08-04')).toBe(true);
        expect(contacts.every((contact) => contact.sourceUrl.startsWith('https://'))).toBe(true);
        const links = buildHelpSearchLinks(categoryId, { city: 'Bern' }, language, 'ch');
        expect(links).toHaveLength(4);
        expect(links.every((link) => link.query.includes('Bern'))).toBe(true);
      }
    }
  });

  it('has French and broadly understandable Swiss German throughout supporting flows', () => {
    const frQuick = getQuickHelpTexts('fr', 'ch');
    const gswQuick = getQuickHelpTexts('gsw', 'ch');
    expect(frQuick.heading).toContain('important');
    expect(frQuick.risks.debtCourt.options.courtOrder.label).toContain('Commandement');
    expect(gswQuick.heading).toContain('grad wichtig');
    expect(buildQuickActions('debtCourt', 'gsw', 'ch').join(' ')).toContain('Rechtsvorschlag');
    expect(buildDocuments('garnishment', {}, 'fr', 'ch').join(' ')).toContain('minimum vital');
    expect(buildActionPlan('health', {}, 'gsw', 'ch').join(' ')).toContain('Prämieverbilligung');
    expect(buildPhoneScript(translationFor('fr').categories[0], { amount: '1200' }, 'fr', 'ch')).toContain('CHF');
  });

  it('uses Swiss emergency numbers including European 112', () => {
    for (const language of languages) {
      const texts = getQuickHelpTexts(language, 'ch');
      expect(texts.emergencyCall).toContain('144');
      expect(texts.emergencyPolice).toContain('117');
      expect(texts.emergencyText).toContain('112');
    }
  });

  it('does not leak central German or Austrian institutions into generated Swiss content', () => {
    for (const language of languages) {
      const ch = translationFor(language);
      const output: string[] = [JSON.stringify(ch.categories), JSON.stringify(ch.commonQuestions), JSON.stringify(ch.legal)];
      for (const categoryId of categoryIds) {
        const category = ch.categories.find((item) => item.id === categoryId)!;
        output.push(JSON.stringify(ch.categoryQuestions[categoryId]));
        output.push(JSON.stringify(ch.buildRecommendations(categoryId, {})));
        output.push(JSON.stringify(ch.buildAllTemplates(category, {})));
        output.push(JSON.stringify(buildQuickActions(categoryId, language, 'ch')));
        output.push(JSON.stringify(buildDocuments(categoryId, {}, language, 'ch')));
        output.push(JSON.stringify(buildActionPlan(categoryId, {}, language, 'ch')));
      }
      const visible = output.join(' ').replace(/"(?:id|category|value)":"[^"]*"/g, '');
      expect(visible).not.toMatch(/Jobcenter|Schufa|SCHUFA|P-Konto|KSV1870|WOHNSCHIRM|E-Control|ÖGK|Arbeiterkammer|bedingter Zahlungsbefehl/);
    }
  });
});
