import type { Answers, CategoryId } from '../types';

export interface SavedCase {
  categoryId: CategoryId;
  answers: Answers;
  checkedItems: Record<string, boolean>;
  savedAt: string;
}

const STORAGE_KEY = 'klarkommen-saved-case';
const SCHEMA_VERSION = 2;

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

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const readStringRecord = (value: unknown): Answers => {
  if (!isRecord(value)) return {};
  return Object.fromEntries(
    Object.entries(value)
      .filter(([key, item]) => key.length <= 80 && typeof item === 'string')
      .slice(0, 100)
      .map(([key, item]) => [key, (item as string).slice(0, 10_000)]),
  );
};

const readBooleanRecord = (value: unknown): Record<string, boolean> => {
  if (!isRecord(value)) return {};
  return Object.fromEntries(
    Object.entries(value)
      .filter(([key, item]) => key.length <= 200 && typeof item === 'boolean')
      .slice(0, 500),
  ) as Record<string, boolean>;
};

export function loadSavedCase(): SavedCase | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || typeof parsed.categoryId !== 'string' || !isCategoryId(parsed.categoryId)) {
      return null;
    }

    const savedAt =
      typeof parsed.savedAt === 'string' && !Number.isNaN(Date.parse(parsed.savedAt))
        ? parsed.savedAt
        : new Date().toISOString();

    return {
      categoryId: parsed.categoryId,
      answers: readStringRecord(parsed.answers),
      checkedItems: readBooleanRecord(parsed.checkedItems),
      savedAt,
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
      schemaVersion: SCHEMA_VERSION,
      savedAt: new Date().toISOString(),
    }),
  );
}

export function deleteSavedCase() {
  window.localStorage.removeItem(STORAGE_KEY);
}
