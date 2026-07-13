import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { I18nProvider } from '../i18n';
import { de } from '../i18n/de';
import Results from './Results';

const family = de.categories.find((category) => category.id === 'family')!;

describe('Results safety contacts', () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  it('keeps 112 and 110 directly callable in a resumed acute case', () => {
    render(
      <I18nProvider>
        <Results
          category={family}
          answers={{ safetyAtRisk: 'ja', triageCompleted: 'ja' }}
          checkedItems={{}}
          savedCaseExists
          onCheckedItemsChange={vi.fn()}
          onDeleteSavedCase={vi.fn()}
          onReset={vi.fn()}
          onSaveCase={vi.fn()}
        />
      </I18nProvider>,
    );

    expect(screen.getByRole('link', { name: /112/ }).getAttribute('href')).toBe('tel:112');
    expect(screen.getByRole('link', { name: /110/ }).getAttribute('href')).toBe('tel:110');
  });
});
