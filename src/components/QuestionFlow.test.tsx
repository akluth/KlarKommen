import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { I18nProvider } from '../i18n';
import { de } from '../i18n/de';
import QuestionFlow from './QuestionFlow';

const rent = de.categories.find((category) => category.id === 'rent')!;

describe('QuestionFlow accessibility', () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  it('exposes mutually exclusive answers as a named native radio group', async () => {
    const user = userEvent.setup();
    render(
      <I18nProvider>
        <QuestionFlow
          category={rent}
          initialAnswers={{ city: '10115' }}
          onBack={vi.fn()}
          onComplete={vi.fn()}
        />
      </I18nProvider>,
    );

    const group = screen.getByRole('group', { name: 'Gibt es eine schriftliche Frist?' });
    const noDeadline = screen.getByRole('radio', { name: 'Nein' });
    expect(group.contains(noDeadline)).toBe(true);

    await user.click(noDeadline);
    expect((noDeadline as HTMLInputElement).checked).toBe(true);
  });
});
