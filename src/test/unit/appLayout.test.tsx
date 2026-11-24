import { afterEach, describe, expect, it, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router';
import AppLayout from '../../layout/AppLayout';
import authReducer, { saveUserData } from '../../features/auth/authSlice';
import { USERTOKEN } from '../../constant';
import i18n from '../../i18n';

// 本组只测试布局导航；语言选择行为在 languageSwitcher.test.tsx 单独测试。
vi.mock('../../components/LanguageSwitcher', () => ({ default: () => <span>Language switcher</span> }));

function CurrentPage() {
  const location = useLocation();
  return <div data-testid="current-path">{location.pathname}</div>;
}

function renderLayout(initialPath = '/jobs') {
  const store = configureStore({ reducer: { auth: authReducer } });
  store.dispatch(saveUserData({ email: 'candidate@example.com' }));
  const result = render(
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <MemoryRouter initialEntries={[initialPath]}>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/jobs" element={<CurrentPage />} />
              <Route path="/analyses" element={<CurrentPage />} />
              <Route path="/profile" element={<CurrentPage />} />
              <Route path="/skillGaps" element={<CurrentPage />} />
            </Route>
            <Route path="/login" element={<CurrentPage />} />
          </Routes>
        </MemoryRouter>
      </I18nextProvider>
    </Provider>,
  );
  return { store, ...result };
}

afterEach(async () => {
  await i18n.changeLanguage('en');
  localStorage.removeItem(USERTOKEN);
});

describe('AppLayout — 受保护页面布局', () => {
  it('显示当前子页面，并呈现四个核心导航入口', async () => {
    await i18n.changeLanguage('en');
    renderLayout();
    expect(screen.getByTestId('current-path')).toHaveTextContent('/jobs');
    for (const key of ['nav.myjobs', 'nav.myanalyses', 'nav.myprofile', 'nav.skillsgap']) {
      expect(screen.getByText(i18n.t(key))).toBeInTheDocument();
    }
  });

  it('点击分析历史导航，路由切换到 /analyses', async () => {
    await i18n.changeLanguage('en');
    renderLayout();
    await userEvent.setup().click(screen.getByText(i18n.t('nav.myanalyses')));
    expect(screen.getByTestId('current-path')).toHaveTextContent('/analyses');
  });

  it('点击档案导航，路由切换到 /profile', async () => {
    await i18n.changeLanguage('en');
    renderLayout();
    await userEvent.setup().click(screen.getByText(i18n.t('nav.myprofile')));
    expect(screen.getByTestId('current-path')).toHaveTextContent('/profile');
  });

  it('折叠侧栏后隐藏 PermitMatch 品牌文字，再展开恢复', async () => {
    await i18n.changeLanguage('en');
    const { container } = renderLayout();
    const toggle = container.querySelector('.ant-layout-header button');
    expect(toggle).not.toBeNull();
    expect(screen.getByText('PermitMatch')).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(toggle as HTMLButtonElement);
    expect(screen.queryByText('PermitMatch')).not.toBeInTheDocument();
    await user.click(toggle as HTMLButtonElement);
    expect(screen.getByText('PermitMatch')).toBeInTheDocument();
  });

  it('退出时清空 token、Redux 用户资料并跳转登录页', async () => {
    await i18n.changeLanguage('en');
    localStorage.setItem(USERTOKEN, 'fake-token');
    const { store } = renderLayout();
    await userEvent.setup().click(screen.getByRole('button', { name: i18n.t('nav.logout') }));
    expect(localStorage.getItem(USERTOKEN)).toBeNull();
    expect(store.getState().auth.userData.email).toBe('');
    expect(screen.getByTestId('current-path')).toHaveTextContent('/login');
  });
});
