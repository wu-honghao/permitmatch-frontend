import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../utils/renderWithProviders';
import JobLogin from '../../pages/Login';
import JobRegister from '../../pages/Register';
import { postAPI } from '../../api/api';
import { USERTOKEN } from '../../constant';

vi.mock('../../api/api', () => ({ postAPI: vi.fn() }));
beforeEach(() => { vi.resetAllMocks(); localStorage.clear(); });
afterEach(() => cleanup());

const fillLogin = async () => {
  const user = userEvent.setup();
  await user.type(screen.getByRole('textbox', { name: 'Email' }), 'dev@example.com');
  await user.type(screen.getByPlaceholderText('Enter your password'), 'secret123');
  return user;
};

describe('Login', () => {
  it('prevents submission of empty fields', async () => {
    renderWithProviders(<JobLogin />);
    await userEvent.setup().click(screen.getByRole('button', { name: /Sign in/i }));
    expect(await screen.findByText('Please enter your email')).toBeInTheDocument();
    expect(postAPI).not.toHaveBeenCalled();
  });

  it('sends credentials and stores token on success', async () => {
    vi.mocked(postAPI).mockResolvedValue({ data: { token: 'token-123' } });
    renderWithProviders(<JobLogin />);
    const user = await fillLogin();
    await user.click(screen.getByRole('button', { name: /Sign in/i }));
    await waitFor(() => expect(localStorage.getItem(USERTOKEN)).toBe('token-123'));
    expect(postAPI).toHaveBeenCalledWith(expect.objectContaining({
      url: '/auth/login', data: { email: 'dev@example.com', password: 'secret123' },
    }));
  });

  it('shows an error and preserves credentials on failed login', async () => {
    vi.mocked(postAPI).mockRejectedValue(new Error('Unauthorized'));
    renderWithProviders(<JobLogin />);
    const user = await fillLogin();
    await user.click(screen.getByRole('button', { name: /Sign in/i }));
    expect(await screen.findByText('Sign-in failed. Please check your email and password.')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveValue('dev@example.com');
    expect(localStorage.getItem(USERTOKEN)).toBeNull();
  });
});

describe('Register', () => {
  const fillRegister = async (confirmPassword = 'secure123') => {
    const user = userEvent.setup();
    await user.type(screen.getByRole('textbox', { name: 'Email' }), 'new@example.com');
    await user.type(screen.getByPlaceholderText('At least 8 characters'), 'secure123');
    await user.type(screen.getByPlaceholderText('Enter your password again'), confirmPassword);
    return user;
  };

  it('rejects mismatched passwords without calling API', async () => {
    renderWithProviders(<JobRegister />);
    const user = await fillRegister('different123');
    await user.click(screen.getByRole('button', { name: /Create account/i }));
    expect(await screen.findByText('Passwords do not match')).toBeInTheDocument();
    expect(postAPI).not.toHaveBeenCalled();
  });

  it('sends email and password but never sends confirmPassword', async () => {
    vi.mocked(postAPI).mockResolvedValue({ data: null });
    renderWithProviders(<JobRegister />);
    const user = await fillRegister();
    await user.click(screen.getByRole('button', { name: /Create account/i }));
    await waitFor(() => expect(postAPI).toHaveBeenCalledWith(expect.objectContaining({
      url: '/auth/register', data: { email: 'new@example.com', password: 'secure123' },
    })));
  });

  it('shows registration error and preserves email after API failure', async () => {
    vi.mocked(postAPI).mockRejectedValue(new Error('Server error'));
    renderWithProviders(<JobRegister />);
    const user = await fillRegister();
    await user.click(screen.getByRole('button', { name: /Create account/i }));
    expect(await screen.findByText('Registration failed. Please check your details and try again.')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveValue('new@example.com');
  });
});
