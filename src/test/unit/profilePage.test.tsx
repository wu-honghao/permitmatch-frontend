import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from 'antd';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import ProfilePage from '../../pages/ProfilePage';
import { getAPI, putAPI } from '../../api/api';

vi.mock('../../api/api', () => ({ getAPI: vi.fn(), putAPI: vi.fn() }));
const profile = {
  needsPermit: true, targetRole: 'Frontend Developer', educationLevel: 'bachelor',
  yearsExperience: 2, skills: ['React', 'TypeScript'], preferredLocation: 'Dublin',
};
const renderProfile = () => render(<I18nextProvider i18n={i18n}><App><ProfilePage /></App></I18nextProvider>);
beforeEach(() => vi.resetAllMocks());
afterEach(() => cleanup());

describe('Profile', () => {
  it('loads and fills existing profile values', async () => {
    vi.mocked(getAPI).mockResolvedValue({ data: profile });
    renderProfile();
    expect(await screen.findByRole('textbox', { name: 'Target Role' })).toHaveValue('Frontend Developer');
    expect(screen.getByRole('textbox', { name: 'Preferred Location' })).toHaveValue('Dublin');
    expect(getAPI).toHaveBeenCalledWith(expect.objectContaining({ url: '/profile' }));
  });

  it('shows an empty profile prompt for new users', async () => {
    vi.mocked(getAPI).mockResolvedValue({ data: {} });
    renderProfile();
    expect(await screen.findByText('Complete your profile')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Target Role' })).toHaveValue('');
  });

  it('shows load error and retries successfully', async () => {
    vi.mocked(getAPI).mockRejectedValueOnce(new Error('Offline')).mockResolvedValueOnce({ data: profile });
    renderProfile();
    expect(await screen.findByText('Failed to load your profile. Please try again.')).toBeInTheDocument();
    await userEvent.setup().click(screen.getByRole('button', { name: 'Retry' }));
    expect(await screen.findByRole('textbox', { name: 'Target Role' })).toHaveValue('Frontend Developer');
    expect(getAPI).toHaveBeenCalledTimes(2);
  });

  it('submits updated profile fields with an authorized PUT', async () => {
    vi.mocked(getAPI).mockResolvedValue({ data: profile });
    vi.mocked(putAPI).mockResolvedValue({ data: profile });
    renderProfile();
    const role = await screen.findByRole('textbox', { name: 'Target Role' });
    const user = userEvent.setup();
    await user.clear(role);
    await user.type(role, 'Full Stack Developer');
    await user.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(putAPI).toHaveBeenCalledWith(expect.objectContaining({
      url: '/profile', headersOption: { isAuthorization: true },
      data: expect.objectContaining({ targetRole: 'Full Stack Developer', needsPermit: true }),
    })));
  });
});
