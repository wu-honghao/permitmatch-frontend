import { afterEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import i18n from '../../i18n';

const renderSwitcher = () => render(
  <I18nextProvider i18n={i18n}><LanguageSwitcher /></I18nextProvider>,
);

afterEach(async () => {
  await i18n.changeLanguage('en');
  localStorage.removeItem('language');
});

describe('LanguageSwitcher — 语言偏好', () => {
  it('显示当前语言', async () => {
    await i18n.changeLanguage('en');
    renderSwitcher();
    expect(screen.getByText('English')).toBeInTheDocument();
  });

  it('切换为中文，更新 i18n 并保存 localStorage', async () => {
    await i18n.changeLanguage('en');
    renderSwitcher();
    const user = userEvent.setup();
    await user.click(screen.getByRole('combobox'));
    await user.click(await screen.findByText('中文'));
    expect(i18n.language).toBe('zh-CN');
    expect(localStorage.getItem('language')).toBe('zh-CN');
  });

  it('从中文切回英文，更新 i18n 并保存 localStorage', async () => {
    await i18n.changeLanguage('zh-CN');
    renderSwitcher();
    const user = userEvent.setup();
    await user.click(screen.getByRole('combobox'));
    await user.click(await screen.findByText('English', { selector: '.ant-select-item-option-content' }));
    expect(i18n.language).toBe('en');
    expect(localStorage.getItem('language')).toBe('en');
  });
});
