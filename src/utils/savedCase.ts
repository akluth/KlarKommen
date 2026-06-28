import type { Answers, CategoryId } from '../types';

export interface SavedCase {
  categoryId: CategoryId;
  answers: Answers;
  checkedItems: Record<string, boolean>;
  savedAt: string;
}

const STORAGE_KEY = 'klarkommen-saved-case';

const isCategoryId = (value: string): value is CategoryId =>
  [
    'rent',
    'energy',
    'jobcenter',
    'health',
    'garnishment',
    'schufa',
    'debtCourt',
    'family',
  ].includes(value);

export function loadSavedCase(): SavedCase | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SavedCase>;
    if (!parsed.categoryId || !isCategoryId(parsed.categoryId)) return null;

    return {
      categoryId: parsed.categoryId,
      answers: parsed.answers ?? {},
      checkedItems: parsed.checkedItems ?? {},
      savedAt: parsed.savedAt ?? new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function saveCase(savedCase: Omit<SavedCase, 'savedAt'>) {
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      ...savedCase,
      savedAt: new Date().toISOString(),
    }),
  );
}

export function deleteSavedCase() {
  window.localStorage.removeItem(STORAGE_KEY);
}
