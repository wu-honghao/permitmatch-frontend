import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, screen, within } from '@testing-library/react';
import { renderWithProviders } from '../utils/renderWithProviders';
import { getAPI } from '../../api/api';
import Analyses from '../../pages/Analyses';
import SkillGaps from '../../pages/SkillGaps';

vi.mock('../../api/api', () => ({ getAPI: vi.fn() }));
beforeEach(() => vi.resetAllMocks());
afterEach(() => cleanup());

describe('Analyses list', () => {
  it('renders saved analysis and links to snapshot and original job', async () => {
    vi.mocked(getAPI).mockResolvedValue({ data: [{
      _id: 'a1', jobId: 'j1', jobExists: true,
      jobSnapshot: { title: 'React Developer', company: 'ABC Ltd' },
      skillScoreResult: { score: 85 }, createdAt: '2026-11-18T10:00:00Z',
    }] });
    renderWithProviders(<Analyses />);
    const title = await screen.findByText('React Developer');
    const row = title.closest('tr')!;
    expect(within(row).getByText('85 / 100')).toBeInTheDocument();
    expect(within(row).getByRole('link', { name: /view/i })).toHaveAttribute('href', '/analyses/a1');
    expect(within(row).getByRole('link', { name: /current job/i })).toHaveAttribute('href', '/jobs/j1');
    expect(getAPI).toHaveBeenCalledWith(expect.objectContaining({ url: '/analyses' }));
  });

  it('does not link to a deleted original job', async () => {
    vi.mocked(getAPI).mockResolvedValue({ data: [{
      _id: 'a2', jobId: 'deleted', jobExists: false,
      jobSnapshot: { title: 'Old Job', company: 'ABC Ltd' },
      skillScoreResult: { score: null }, createdAt: '2026-11-18T10:00:00Z',
    }] });
    renderWithProviders(<Analyses />);
    expect(await screen.findByText('Old Job')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /current job/i })).not.toBeInTheDocument();
  });

  it('shows an error state when loading fails', async () => {
    vi.mocked(getAPI).mockRejectedValue(new Error('Offline'));
    renderWithProviders(<Analyses />);
    expect(await screen.findByRole('alert')).toBeInTheDocument();
  });
});

describe('Cross-job skill gaps', () => {
  it('renders single skills and OR-alternative groups', async () => {
    vi.mocked(getAPI).mockResolvedValue({ data: { totalJobs: 2, gaps: [
      { skills: ['React'], requiredCount: 2, preferredCount: 0, totalCount: 2 },
      { skills: ['Vue.js', 'Angular'], requiredCount: 1, preferredCount: 1, totalCount: 2 },
    ] } });
    renderWithProviders(<SkillGaps />);
    expect(await screen.findByText('React')).toBeInTheDocument();
    expect(screen.getByText(/Vue\.js \/ Angular/)).toBeInTheDocument();
    expect(getAPI).toHaveBeenCalledWith(expect.objectContaining({ url: '/skillsGap' }));
  });

  it('shows an error state after API failure', async () => {
    vi.mocked(getAPI).mockRejectedValue(new Error('Offline'));
    renderWithProviders(<SkillGaps />);
    expect(await screen.findByRole('alert')).toBeInTheDocument();
  });
});
