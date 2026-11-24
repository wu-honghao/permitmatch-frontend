import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../utils/renderWithProviders';
import JobEdit from '../../pages/Jobs/JobEdit';
import { getAPI, patchAPI } from '../../api/api';

vi.mock('../../api/api', () => ({ getAPI: vi.fn(), patchAPI: vi.fn() }));
vi.mock('react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router')>()),
  useParams: () => ({ id: 'job-001' }),
}));

const job = {
  _id: 'job-001', title: 'React Developer', company: 'ABC Ltd', location: 'Dublin',
  rawDescription: 'A developer position', requirements: [],
  salary: { min: null }, contract: { durationMonths: null },
  experienceRequirement: { minYears: null, scope: null },
  educationRequirement: { level: null }, permitSupport: { status: 'unknown' },
};

beforeEach(() => vi.resetAllMocks());

describe('JobEdit', () => {
  it('loads and prefills the existing job', async () => {
    vi.mocked(getAPI).mockResolvedValue({ data: job });
    renderWithProviders(<JobEdit />);
    expect(await screen.findByRole('textbox', { name: 'Job Title' })).toHaveValue('React Developer');
    expect(screen.getByRole('textbox', { name: 'Company' })).toHaveValue('ABC Ltd');
    expect(getAPI).toHaveBeenCalledWith(expect.objectContaining({ url: '/jobs/job-001' }));
  });

  it('does not PATCH if the form is unchanged', async () => {
    vi.mocked(getAPI).mockResolvedValue({ data: job });
    renderWithProviders(<JobEdit />);
    await screen.findByRole('textbox', { name: 'Job Title' });
    await userEvent.setup().click(screen.getByRole('button', { name: 'Save Job' }));
    await waitFor(() => expect(patchAPI).not.toHaveBeenCalled());
  });

  it('sends only modified top-level fields to PATCH', async () => {
    vi.mocked(getAPI).mockResolvedValue({ data: job });
    vi.mocked(patchAPI).mockResolvedValue({ data: job });
    renderWithProviders(<JobEdit />);
    const title = await screen.findByRole('textbox', { name: 'Job Title' });
    const user = userEvent.setup();
    await user.clear(title);
    await user.type(title, 'Senior React Developer');
    await user.click(screen.getByRole('button', { name: 'Save Job' }));
    await waitFor(() => expect(patchAPI).toHaveBeenCalledWith(expect.objectContaining({
      url: '/jobs/job-001', data: expect.objectContaining({ title: 'Senior React Developer' }),
    })));
    const request = vi.mocked(patchAPI).mock.calls[0][0];
    expect(request.data).not.toHaveProperty('ownerId');
    expect(request.data).not.toHaveProperty('latestAnalysisId');
  });

  it('displays a load error when a job cannot be fetched', async () => {
    vi.mocked(getAPI).mockRejectedValue(new Error('Not Found'));
    renderWithProviders(<JobEdit />);
    expect(await screen.findByText('Failed to load')).toBeInTheDocument();
    expect(patchAPI).not.toHaveBeenCalled();
  });
});
