import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { de } from '../i18n/de';
import { I18nProvider } from '../i18n';
import QuickHelpFlow from './QuickHelpFlow';

const rent = de.categories.find((category) => category.id === 'rent')!;

describe('QuickHelpFlow', () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  it('collects exactly the short triage and supports continuing without location', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    render(
      <I18nProvider>
        <QuickHelpFlow category={rent} initialAnswers={{}} onBack={vi.fn()} onComplete={onComplete} />
      </I18nProvider>,
    );

    expect(screen.getAllByRole('group')).toHaveLength(3);
    expect(document.activeElement).toBe(
      screen.getByRole('heading', { name: 'Was ist jetzt sofort wichtig?' }),
    );

    await user.click(screen.getByRole('checkbox', { name: 'Ohne Ort fortfahren' }));
    await user.click(screen.getByRole('radio', { name: /Räumungsklage oder Räumungstermin/ }));
    await user.click(screen.getByRole('radio', { name: /Frist abgelaufen oder heute\/morgen/ }));
    await user.click(screen.getByRole('button', { name: 'Soforthilfe anzeigen' }));

    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        evictionClaim: 'ja',
        quickDeadlineWindow: 'today',
        quickRisk: 'eviction',
        triageCompleted: 'ja',
      }),
    );
    expect(onComplete.mock.calls[0][0]).not.toHaveProperty('city');
  });

  it('keeps unknown as an explicit selectable answer', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    render(
      <I18nProvider>
        <QuickHelpFlow category={rent} initialAnswers={{}} onBack={vi.fn()} onComplete={onComplete} />
      </I18nProvider>,
    );

    await user.type(screen.getByRole('textbox', { name: /Welche PLZ oder Stadt/ }), '04109');
    const unknownOptions = screen.getAllByRole('radio', { name: /Unklar/ });
    expect(unknownOptions).toHaveLength(2);
    await user.click(unknownOptions[0]);
    await user.click(unknownOptions[1]);
    await user.click(screen.getByRole('button', { name: 'Soforthilfe anzeigen' }));

    expect(onComplete).toHaveBeenCalledWith(
      expect.objectContaining({ city: '04109', quickDeadlineWindow: 'unclear', quickRisk: 'unclear' }),
    );
  });

  it('associates the validation alert with every missing triage field', async () => {
    const user = userEvent.setup();
    render(
      <I18nProvider>
        <QuickHelpFlow category={rent} initialAnswers={{}} onBack={vi.fn()} onComplete={vi.fn()} />
      </I18nProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Soforthilfe anzeigen' }));

    const alert = screen.getByRole('alert');
    expect(alert.textContent).toContain('Ort');
    expect(screen.getByRole('textbox', { name: /Welche PLZ oder Stadt/ }).getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByRole('group', { name: /Was ist beim Wohnen bereits passiert/ }).getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByRole('group', { name: /Was macht die Lage zeitlich dringend/ }).getAttribute('aria-invalid')).toBe('true');
  });
});
