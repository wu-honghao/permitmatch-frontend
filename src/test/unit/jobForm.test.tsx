import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import JobForm from '../../pages/Jobs/Form/JobForm';
import type { JobFormValues } from '../../types/job';
import { renderWithProviders } from '../utils/renderWithProviders';

const onSubmit = vi.fn(async (_values: JobFormValues): Promise<void> => {});

beforeEach(() => onSubmit.mockClear());

describe('JobForm — validated form behaviour', () => {
  it('F07: accepts text input', async () => {
    const user = userEvent.setup();
    renderWithProviders(<JobForm onSubmit={onSubmit} />);

    const title = screen.getByRole('textbox', { name: 'Job Title' });
    await user.type(title, 'React Developer');

    expect(title).toHaveValue('React Developer');
  });

  it('F08/F10: rejects an empty required title without submitting', async () => {
    const user = userEvent.setup();
    renderWithProviders(<JobForm onSubmit={onSubmit} />);

    await user.click(screen.getByRole('button', { name: 'Save Job' }));

    expect(await screen.findByText('Please input yourJob Title')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('F09: submits entered fields after successful validation', async () => {
    const user = userEvent.setup();
    renderWithProviders(<JobForm onSubmit={onSubmit} />);

    await user.type(screen.getByRole('textbox', { name: 'Job Title' }), 'React Developer');
    await user.type(screen.getByRole('textbox', { name: 'Company' }), 'ABC Ltd');
    await user.click(screen.getByRole('button', { name: 'Save Job' }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'React Developer', company: 'ABC Ltd' }),
      );
    });
  });

  it('prefills editable fields from existing job values', () => {
    renderWithProviders(
      <JobForm onSubmit={onSubmit} initialValues={{ title: 'Frontend Engineer', company: 'Example Ltd' }} />,
    );

    expect(screen.getByRole('textbox', { name: 'Job Title' })).toHaveValue('Frontend Engineer');
    expect(screen.getByRole('textbox', { name: 'Company' })).toHaveValue('Example Ltd');
  });

  it('does not submit when a new required skill group is incomplete', async () => {
    const user = userEvent.setup();
    renderWithProviders(<JobForm onSubmit={onSubmit} />);

    await user.type(screen.getByRole('textbox', { name: 'Job Title' }), 'React Developer');
    await user.click(screen.getByRole('button', { name: /Add Requirement Group/i }));
    await user.click(screen.getByRole('button', { name: 'Save Job' }));

    await screen.findAllByText(/Please input your/);
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
