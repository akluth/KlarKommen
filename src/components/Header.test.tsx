import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { I18nProvider } from '../i18n';
import Header from './Header';

describe('Header country switcher', () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  it('switches between Germany and Austria and persists the selected country', () => {
    render(
      <I18nProvider>
        <Header />
      </I18nProvider>,
    );

    const germany = screen.getByRole('button', { name: /Deutschland/ });
    const austria = screen.getByRole('button', { name: /Österreich/ });
    expect(germany.getAttribute('aria-pressed')).toBe('true');
    expect(germany.querySelector('.flag-icon-country-de')).not.toBeNull();
    expect(austria.querySelector('.flag-icon-country-at')).not.toBeNull();

    fireEvent.click(austria);

    expect(austria.getAttribute('aria-pressed')).toBe('true');
    expect(window.localStorage.getItem('klarkommen-country')).toBe('at');
    expect(document.documentElement.lang).toBe('de-AT');
  });
});
