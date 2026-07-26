import { describe, expect, it } from 'vitest';
import { buildDirectHelpContacts } from '../data/directHelp';
import { buildHelpSearchLinks } from '../data/localHelp';
import { buildActionPlan, buildDocuments } from '../data/preparation';
import { buildQuickActions } from '../data/quickHelp';
import type { CategoryId } from '../types';
import { ar } from './ar';
import { adaptTranslationForAustria } from './austria';
import { de } from './de';
import { getQuickHelpTexts } from './quickHelp';
import { tr } from './tr';
import { uk } from './uk';
import type { Language } from './index';

const categoryIds: CategoryId[] = [
  'rent',
  'energy',
  'jobcenter',
  'health',
  'garnishment',
  'schufa',
  'debtCourt',
  'family',
];

describe('Austrian country adaptation', () => {
  it('uses Austrian institutions and legal terms in the German categories', () => {
    const at = adaptTranslationForAustria(de, 'de');
    const categories = Object.fromEntries(at.categories.map((category) => [category.id, category]));

    expect(categories.jobcenter.title).toContain('Sozialhilfe');
    expect(categories.jobcenter.title).toContain('AMS');
    expect(categories.garnishment.title).toContain('Existenzminimum');
    expect(categories.schufa.title).toContain('KSV1870');
    expect(categories.schufa.title).toContain('CRIF');
    expect(categories.debtCourt.title).toContain('bedingter Zahlungsbefehl');
  });

  it('uses the Austrian euro placement in generated German results', () => {
    const at = adaptTranslationForAustria(de, 'de');
    const result = at.buildRecommendations('rent', { amount: '1200' });
    expect(result.situation.join(' ')).toContain('€\u00a01.200,00');
    expect(result.situation.join(' ')).not.toContain('1.200,00\u00a0€');
  });

  it('keeps all category and question identifiers stable in every language', () => {
    const translations = { ar, de, tr, uk };
    for (const language of Object.keys(translations) as Language[]) {
      const at = adaptTranslationForAustria(translations[language], language);
      expect(at.categories.map((category) => category.id)).toEqual(de.categories.map((category) => category.id));
      expect(at.commonQuestions.map((question) => question.id)).toEqual(de.commonQuestions.map((question) => question.id));
      for (const categoryId of categoryIds) {
        expect(at.categoryQuestions[categoryId].map((question) => question.id)).toEqual(
          de.categoryQuestions[categoryId].map((question) => question.id),
        );
      }
    }
  });

  it('contains no central Germany-only institutions in German Austrian outputs', () => {
    const at = adaptTranslationForAustria(de, 'de');
    const answers = {
      city: 'Wien',
      amount: '1200',
      writtenDeadline: 'ja',
      deadlineDate: '2026-08-01',
      accountGarnished: 'ja',
      pAccount: 'nein',
      debtLetterType: 'mahnbescheid',
      creditRejected: 'ja',
    };
    const output: string[] = [JSON.stringify(at.categories), JSON.stringify(at.commonQuestions)];

    for (const category of at.categories) {
      output.push(JSON.stringify(at.categoryQuestions[category.id]));
      output.push(JSON.stringify(at.buildRecommendations(category.id, answers)));
      output.push(JSON.stringify(at.buildAllTemplates(category, answers)));
      output.push(JSON.stringify(buildQuickActions(category.id, 'de', 'at')));
      output.push(JSON.stringify(buildDocuments(category.id, answers, 'de', 'at')));
      output.push(JSON.stringify(buildActionPlan(category.id, answers, 'de', 'at')));
    }

    const visibleOutput = output
      .join(' ')
      .replace(/"(?:id|category|value)":"[^"]*"/g, '');
    expect(visibleOutput).not.toMatch(
      /Jobcenter|Schufa|SCHUFA|P-Konto|Mahnbescheid|Vollstreckungsbescheid|Verbraucherzentrale|Bürgergeld|Grundsicherungsgeld|Beratungshilfeschein/,
    );
    const malformed = visibleOutput.match(
      /Mindestsicherung, Sozialhilfe|Bezirksgericht oder Bezirksgericht|gerichtlichem bedingter|Gerichtliche bedingter|eines bedingten Zahlungsbefehl(?!s)|des Gerichtss(?:\.|\s)|Schutz unpfändbarer Beträgeen|Pensionn/,
    );
    expect(malformed?.[0]).toBeUndefined();
  });

  it('removes Germany-only institutions from Austrian output in every language', () => {
    const translations = { ar, de, tr, uk };
    for (const language of Object.keys(translations) as Language[]) {
      const at = adaptTranslationForAustria(translations[language], language);
      const output = [JSON.stringify(at)];
      for (const categoryId of categoryIds) {
        output.push(JSON.stringify(at.buildRecommendations(categoryId, {})));
        output.push(JSON.stringify(at.buildAllTemplates(at.categories.find((item) => item.id === categoryId)!, {})));
        output.push(JSON.stringify(buildQuickActions(categoryId, language, 'at')));
        output.push(JSON.stringify(buildDocuments(categoryId, {}, language, 'at')));
        output.push(JSON.stringify(buildActionPlan(categoryId, {}, language, 'at')));
      }
      const visibleOutput = output.join(' ').replace(/\"(?:id|category|value)\":\"[^\"]*\"/g, '');
      expect(visibleOutput).not.toMatch(
        /Jobcenter|Schufa|SCHUFA|P-Konto|Mahnbescheid|Vollstreckungsbescheid|Verbraucherzentrale|Bürgergeld|Grundsicherungsgeld|Beratungshilfeschein/,
      );
    }
  });

  it('uses Austrian emergency numbers and Austrian official contacts', () => {
    const texts = getQuickHelpTexts('de', 'at');
    expect(texts.emergencyCall).toContain('144');
    expect(texts.emergencyPolice).toContain('133');
    expect(texts.emergencyText).toContain('112');

    for (const categoryId of categoryIds) {
      const contacts = buildDirectHelpContacts(categoryId, 'de', {}, 'at');
      expect(contacts).toHaveLength(3);
      expect(contacts.every((contact) => contact.id.startsWith('at-'))).toBe(true);
      expect(contacts.every((contact) => contact.sourceUrl.startsWith('https://'))).toBe(true);
    }
  });

  it('builds Austria-specific local search queries', () => {
    const links = buildHelpSearchLinks('schufa', { city: 'Graz' }, 'de', 'at');
    expect(links.map((link) => link.query).join(' ')).toContain('KSV1870');
    expect(links.map((link) => link.query).join(' ')).toContain('CRIF');
    expect(links.map((link) => link.query).join(' ')).not.toContain('Schufa');
  });
});
