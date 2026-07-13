import { describe, expect, it } from 'vitest';
import type { Language } from '../i18n';
import type { CategoryId } from '../types';
import { buildUrgency } from './preparation';
import { buildQuickActions, buildQuickAnswers, getQuickRiskOptions } from './quickHelp';

const categories: CategoryId[] = [
  'rent',
  'energy',
  'jobcenter',
  'health',
  'garnishment',
  'schufa',
  'debtCourt',
  'family',
];
const languages: Language[] = ['de', 'tr', 'ar', 'uk'];

describe('quick-help triage', () => {
  it.each(categories)('offers an explicit unknown option for %s in every language', (categoryId) => {
    for (const language of languages) {
      const options = getQuickRiskOptions(categoryId, language);
      expect(options).toHaveLength(5);
      expect(options.some((option) => option.value === 'unclear')).toBe(true);
      expect(new Set(options.map((option) => option.value)).size).toBe(options.length);
      expect(options.every((option) => option.label.length > 0 && option.help.length > 0)).toBe(true);
    }
  });

  it.each(categories)('never rates unclear + unclear as green for %s', (categoryId) => {
    const answers = buildQuickAnswers(categoryId, '01067', 'unclear', 'unclear');
    for (const language of languages) {
      const urgency = buildUrgency(categoryId, answers, language);
      expect(urgency.level).toBe('yellow');
      expect(urgency.reasons).toHaveLength(1);
    }
  });

  it.each(categories)('does not rate an incomplete legacy case as green for %s', (categoryId) => {
    expect(buildUrgency(categoryId, {}, 'de').level).toBe('yellow');
  });

  it('maps all immediate deadline and basic-needs paths to red', () => {
    for (const categoryId of categories) {
      const today = buildQuickAnswers(categoryId, 'Köln', 'today', 'unclear');
      const needs = buildQuickAnswers(categoryId, 'Köln', 'immediateNeeds', 'unclear');
      expect(buildUrgency(categoryId, today, 'de').level).toBe('red');
      expect(buildUrgency(categoryId, needs, 'de').level).toBe('red');
    }
  });

  it('sanitizes location without turning a postcode into a number', () => {
    const answers = buildQuickAnswers('rent', '  01067\n  Dresden  ', 'later', 'arrears');
    expect(answers.city).toBe('01067 Dresden');
  });

  it.each(categories)('provides exactly three immediate actions for %s in every language', (categoryId) => {
    for (const language of languages) {
      const actions = buildQuickActions(categoryId, language);
      expect(actions).toHaveLength(3);
      expect(actions.every((action) => action.length > 20)).toBe(true);
    }
  });
});
