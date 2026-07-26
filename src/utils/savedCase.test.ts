import { beforeEach, describe, expect, it } from 'vitest';
import { loadSavedCase, saveCase } from './savedCase';

describe('saved case validation', () => {
  beforeEach(() => window.localStorage.clear());

  it('round-trips a current case', () => {
    saveCase({
      country: 'de',
      categoryId: 'rent',
      answers: { city: '01067', quickRisk: 'eviction' },
      checkedItems: { first: true },
    });

    expect(loadSavedCase()).toEqual(
      expect.objectContaining({
        categoryId: 'rent',
        country: 'de',
        answers: { city: '01067', quickRisk: 'eviction' },
        checkedItems: { first: true },
      }),
    );
  });

  it('rejects invalid categories and removes malformed answer values', () => {
    window.localStorage.setItem(
      'klarkommen-saved-case',
      JSON.stringify({
        categoryId: 'not-a-category',
        answers: { city: 12345 },
      }),
    );
    expect(loadSavedCase()).toBeNull();

    window.localStorage.setItem(
      'klarkommen-saved-case',
      JSON.stringify({
        categoryId: 'rent',
        answers: { city: 12345, amount: '20' },
        checkedItems: { valid: true, invalid: 'yes' },
      }),
    );
    expect(loadSavedCase()).toEqual(
      expect.objectContaining({ answers: { amount: '20' }, checkedItems: { valid: true } }),
    );
  });
});
