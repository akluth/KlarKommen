import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { I18nProvider } from '../i18n';
import Header from './Header';

describe('Header country switcher', () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  it('switches between Germany, Austria and Switzerland and scopes extra languages to Switzerland', () => {
    render(
      <I18nProvider>
        <Header />
      </I18nProvider>,
    );

    const germany = screen.getByRole('button', { name: /Deutschland/ });
    const austria = screen.getByRole('button', { name: /Österreich/ });
    const switzerland = screen.getByRole('button', { name: /Schweiz/ });
    expect(germany.getAttribute('aria-pressed')).toBe('true');
    expect(germany.querySelector('.flag-icon-country-de')).not.toBeNull();
    expect(austria.querySelector('.flag-icon-country-at')).not.toBeNull();
    expect(switzerland.querySelector('.flag-icon-country-ch')).not.toBeNull();
    expect(screen.queryByRole('button', { name: /Français/ })).toBeNull();

    fireEvent.click(austria);

    expect(austria.getAttribute('aria-pressed')).toBe('true');
    expect(window.localStorage.getItem('klarkommen-country')).toBe('at');
    expect(document.documentElement.lang).toBe('de-AT');

    fireEvent.click(switzerland);
    expect(window.localStorage.getItem('klarkommen-country')).toBe('ch');
    expect(document.documentElement.lang).toBe('de-CH');
    expect(screen.getByRole('button', { name: /Français/ })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Schwiizerdütsch/ })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /Français/ }));
    expect(document.documentElement.lang).toBe('fr-CH');
    fireEvent.click(germany);
    expect(document.documentElement.lang).toBe('de-DE');
    expect(screen.queryByRole('button', { name: /Français/ })).toBeNull();
  });
});
