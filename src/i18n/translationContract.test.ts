import { describe, expect, it } from 'vitest';
import type { Question } from '../types';
import { ar } from './ar';
import { de } from './de';
import { tr } from './tr';
import { uk } from './uk';

const translations = { ar, de, tr, uk };

const questionMap = (questions: Question[]) =>
  Object.fromEntries(
    questions.map((question) => [
      question.id,
      (question.options ?? []).map((option) => option.value),
    ]),
  );

describe('translation contract', () => {
  it('keeps category and question identifiers aligned in all languages', () => {
    const expectedCategoryIds = de.categories.map((category) => category.id);
    const expectedCommon = questionMap(de.commonQuestions);

    for (const translation of Object.values(translations)) {
      expect(translation.categories.map((category) => category.id)).toEqual(expectedCategoryIds);
      expect(questionMap(translation.commonQuestions)).toEqual(expectedCommon);

      for (const categoryId of expectedCategoryIds) {
        expect(questionMap(translation.categoryQuestions[categoryId])).toEqual(
          questionMap(de.categoryQuestions[categoryId]),
        );
      }
    }
  });

  it('contains no untranslated German prompts in non-German court/debt questions', () => {
    const germanPrompts = new Set(de.categoryQuestions.debtCourt.map((question) => question.text));
    for (const translation of [tr, ar, uk]) {
      for (const question of translation.categoryQuestions.debtCourt) {
        expect(germanPrompts.has(question.text)).toBe(false);
      }

      const germanCategory = de.categories.find((category) => category.id === 'debtCourt');
      const localizedCategory = translation.categories.find((category) => category.id === 'debtCourt');
      expect(localizedCategory?.description).not.toBe(germanCategory?.description);
      expect(localizedCategory?.primaryContact).not.toBe(germanCategory?.primaryContact);

      const localizedDebtText = [
        localizedCategory?.description,
        localizedCategory?.primaryContact,
        ...translation
          .buildAllTemplates(localizedCategory!, {})
          .flatMap((template) => [template.label, template.text]),
      ].join(' ');
      expect(localizedDebtText).not.toMatch(
        /\b(ich|wegen|einer|beziehungsweise|gerichtlichen|sortieren|Gläubiger|Mahngericht)\b/i,
      );
    }
  });
});
