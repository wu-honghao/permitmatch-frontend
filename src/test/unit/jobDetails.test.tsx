import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../utils/renderWithProviders';
import JobDetail from '../../pages/JobDetail/JobDetail';
import JobDetailAnalyses from '../../pages/JobDetailAnalyses/JobDetailAnalyses';
import { getAPI, postAPI } from '../../api/api';

vi.mock('../../api/api', () => ({ getAPI: vi.fn(), postAPI: vi.fn() }));
vi.mock('react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router')>()),
  useParams: () => ({ id: 'job-001' }),
}));

const job = {
  _id: 'job-001', title: 'React Developer', company: 'ABC Ltd', location: 'Dublin',
  rawDescription: 'We require React and TypeScript', requirements: [], latestAnalysisId: null,
  salary: null, contract: null, educationRequirement: null, experienceRequirement: null,
  permitSupport: null,
};
const analysis = {
  _id: 'analysis-001', jobId: 'job-001',
  jobSnapshot: { requirements: [{ category: 'review', operator: null, skills: [], rawContent: 'Check cloud experience' }] },
  skillScoreResult: {
    score: 80, scoreType: 'weighted',
    required: { matched: 1, total: 2, coveredSkills: ['React'], missingSkills: [['TypeScript']] },
    preferred: { matched: 1, total: 1, coveredSkills: ['Docker'], missingSkills: [] },
  },
};
beforeEach(() => vi.resetAllMocks());
afterEach(() => cleanup());

describe('JobDetail', () => {
  it('shows the job and allows starting a new analysis', async () => {
    vi.mocked(getAPI).mockResolvedValue({ data: job });
    vi.mocked(postAPI).mockResolvedValue({ data: { _id: 'analysis-001' } });
    renderWithProviders(<JobDetail />);
    expect(await screen.findByRole('heading', { name: 'React Developer' })).toBeInTheDocument();
    expect(screen.getByText(/ABC Ltd/)).toBeInTheDocument();
    await userEvent.setup().click(screen.getByRole('button', { name: 'Analyse Skills' }));
    await waitFor(() => expect(postAPI).toHaveBeenCalledWith(expect.objectContaining({
      url: '/jobs/job-001/analyses', headersOption: { isAuthorization: true },
    })));
  });
  it('shows an error when the job is unavailable', async () => {
    vi.mocked(getAPI).mockRejectedValue(new Error('Not Found'));
    renderWithProviders(<JobDetail />);
    expect(await screen.findByRole('alert')).toBeInTheDocument();
  });
});

describe('JobDetailAnalyses', () => {
  it('renders score and immutable snapshot skills', async () => {
    vi.mocked(getAPI).mockResolvedValue({ data: analysis });
    renderWithProviders(<JobDetailAnalyses />);
    expect(await screen.findByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Check cloud experience')).toBeInTheDocument();
    expect(getAPI).toHaveBeenCalledWith(expect.objectContaining({ url: '/analyses/job-001' }));
  });
  it('handles unavailable scores without showing a numeric match', async () => {
    vi.mocked(getAPI).mockResolvedValue({ data: {
      ...analysis, skillScoreResult: { ...analysis.skillScoreResult, score: null, scoreType: 'unavailable' },
    } });
    renderWithProviders(<JobDetailAnalyses />);
    expect(await screen.findByText('React')).toBeInTheDocument();
    expect(screen.getByText('Score unavailable')).toBeInTheDocument();
  });
  it('shows an error on analysis load failure', async () => {
    vi.mocked(getAPI).mockRejectedValue(new Error('Offline'));
    renderWithProviders(<JobDetailAnalyses />);
    expect(await screen.findByRole('alert')).toBeInTheDocument();
  });
});
