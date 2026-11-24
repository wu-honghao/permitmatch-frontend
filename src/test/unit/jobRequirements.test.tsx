import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../utils/renderWithProviders';
import JobRequirements from '../../components/JobRequirements';

describe('JobRequirements', () => {
  it('shows empty state when no requirements exist', () => {
    renderWithProviders(<JobRequirements requirements={[]} />);
    expect(screen.getByText('No skill requirements')).toBeInTheDocument();
  });

  it('groups requirements by priority and renders ANY operator', () => {
    renderWithProviders(<JobRequirements requirements={[
      {category: 'required', operator: 'any', skills: ['React', 'Vue'], rawContent: null},
      {category: 'preferred', operator: 'all', skills: ['Docker'], rawContent: null},
    ]} />);
    expect(screen.getByText('Required Skills')).toBeInTheDocument();
    expect(screen.getByText('Preferred Skills')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Vue')).toBeInTheDocument();
    expect(screen.getByText('Docker')).toBeInTheDocument();
    expect(screen.getByText('Any One')).toBeInTheDocument();
    expect(screen.queryByText('All Required')).not.toBeInTheDocument();
  });

  it('shows raw text when a review group has no extracted skills', () => {
    renderWithProviders(<JobRequirements requirements={[
      {category: 'review', operator: null, skills: [], rawContent: 'Experience with a modern framework'},
      {category: 'review', operator: null, skills: [], rawContent: null},
    ]} />);
    expect(screen.getByText('Needs Review')).toBeInTheDocument();
    expect(screen.getByText('Experience with a modern framework')).toBeInTheDocument();
    expect(screen.getByText('Requires manual review')).toBeInTheDocument();
  });
});
