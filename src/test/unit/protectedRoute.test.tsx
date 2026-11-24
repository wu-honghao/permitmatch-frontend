import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import ProtectedRoute from '../../pages/ProtectedRoute';
import authReducer from '../../features/auth/authSlice';
import i18n from '../../i18n';
import { ApiError, getAPI } from '../../api/api';

vi.mock('../../api/api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../api/api')>()),
  getAPI: vi.fn(),
}));

function LoginMarker() {
  const location = useLocation();
  return <div>Current route: {location.pathname}</div>;
}
function renderGuard() {
  const store = configureStore({ reducer: { auth: authReducer } });
  const view = render(
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <MemoryRouter initialEntries={['/jobs']}>
          <Routes>
            <Route path="/login" element={<LoginMarker />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/jobs" element={<div>Protected Jobs Page</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </I18nextProvider>
    </Provider>,
  );
  return { store, ...view };
}

beforeEach(() => vi.resetAllMocks());
afterEach(() => cleanup());

describe('ProtectedRoute /auth/me', () => {
  it('blocks protected content while authentication is pending', async () => {
    vi.mocked(getAPI).mockImplementation(() => new Promise(() => {}));
    renderGuard();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Protected Jobs Page')).not.toBeInTheDocument();
    await waitFor(() => expect(getAPI).toHaveBeenCalledWith(expect.objectContaining({ url: '/auth/me' })));
  });

  it('renders protected content and saves email after successful authentication', async () => {
    vi.mocked(getAPI).mockResolvedValue({ message: 'ok', data: { id: 'u1', email: 'user@example.com' } });
    const { store } = renderGuard();
    expect(await screen.findByText('Protected Jobs Page')).toBeInTheDocument();
    expect(store.getState().auth.userData.email).toBe('user@example.com');
    expect(screen.queryByText('Current route: /login')).not.toBeInTheDocument();
  });

  it('redirects to /login after a 401', async () => {
    vi.mocked(getAPI).mockRejectedValue(new ApiError('Unauthorized', 401));
    renderGuard();
    expect(await screen.findByText('Current route: /login')).toBeInTheDocument();
    expect(screen.queryByText('Protected Jobs Page')).not.toBeInTheDocument();
  });

  it('keeps protected content hidden on 500 and recovers after Retry', async () => {
    vi.mocked(getAPI)
      .mockRejectedValueOnce(new ApiError('Server error', 500))
      .mockResolvedValueOnce({ message: 'ok', data: { id: 'u1', email: 'user@example.com' } });
    renderGuard();
    const retry = await screen.findByRole('button', { name: /retry/i });
    expect(screen.queryByText('Protected Jobs Page')).not.toBeInTheDocument();
    await userEvent.setup().click(retry);
    expect(await screen.findByText('Protected Jobs Page')).toBeInTheDocument();
    expect(getAPI).toHaveBeenCalledTimes(2);
  });
});
