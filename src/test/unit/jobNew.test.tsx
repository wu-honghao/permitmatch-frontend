import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import JobNew from '../../pages/Jobs/JobNew';
import { postAPI } from '../../api/api';
import { renderWithProviders } from '../utils/renderWithProviders';

vi.mock('../../api/api', async (importOriginal) => {
  const original = await importOriginal<typeof import('../../api/api')>();
  return { ...original, postAPI: vi.fn() };
});

beforeEach(() => vi.mocked(postAPI).mockReset());
afterEach(() => cleanup());

const description = 'React Developer position requiring React and TypeScript.';
const extractedDraft = { title: 'React Developer', company: 'ABC Ltd', requirements: [] };

async function extractDraft(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByPlaceholderText('Paste the English job description here...'), description);
  await user.click(screen.getByRole('button', { name: 'Extract with AI' }));
  expect(await screen.findByRole('textbox', { name: 'Job Title' })).toHaveValue('React Developer');
}

describe('JobNew — extract, review and save', () => {
  it('does not call the extraction API for an empty description', async () => {
    const user = userEvent.setup();
    renderWithProviders(<JobNew />);

    await user.click(screen.getByRole('button', { name: 'Extract with AI' }));

    expect(postAPI).not.toHaveBeenCalled();
    expect(screen.queryByRole('textbox', { name: 'Job Title' })).not.toBeInTheDocument();
  });

  it('shows an editable draft only after successful AI extraction', async () => {
    const user = userEvent.setup();
    vi.mocked(postAPI).mockResolvedValueOnce({ data: extractedDraft, message: 'ok' });
    renderWithProviders(<JobNew />);

    expect(screen.queryByRole('textbox', { name: 'Job Title' })).not.toBeInTheDocument();
    await extractDraft(user);

    expect(postAPI).toHaveBeenCalledWith(expect.objectContaining({
      url: '/jobs/extract',
      data: { rawDescription: description },
    }));
    expect(screen.getByRole('textbox', { name: 'Company' })).toHaveValue('ABC Ltd');
  });

  it('sends the confirmed, edited draft to the save API', async () => {
    const user = userEvent.setup();
    vi.mocked(postAPI)
      .mockResolvedValueOnce({ data: extractedDraft, message: 'ok' })
      .mockResolvedValueOnce({ data: { _id: 'job-001' }, message: 'created' });
    renderWithProviders(<JobNew />);
    await extractDraft(user);

    const title = screen.getByRole('textbox', { name: 'Job Title' });
    await user.clear(title);
    await user.type(title, 'Senior React Developer');
    await user.click(screen.getByRole('button', { name: 'Save Job' }));

    await waitFor(() => {
      expect(postAPI).toHaveBeenCalledTimes(2);
      expect(postAPI).toHaveBeenNthCalledWith(2, expect.objectContaining({
        url: '/jobs',
        data: expect.objectContaining({ title: 'Senior React Developer', company: 'ABC Ltd' }),
      }));
    });
  });

  it('keeps the confirmed draft after a failed save', async () => {
    const user = userEvent.setup();
    vi.mocked(postAPI)
      .mockResolvedValueOnce({ data: extractedDraft, message: 'ok' })
      .mockRejectedValueOnce(new Error('Server error'));
    renderWithProviders(<JobNew />);
    await extractDraft(user);
    await user.click(screen.getByRole('button', { name: 'Save Job' }));

    expect(await screen.findByText('Failed to save')).toBeInTheDocument();
    expect(postAPI).toHaveBeenCalledTimes(2);
    expect(screen.getByRole('textbox', { name: 'Job Title' })).toHaveValue('React Developer');
  });
});
