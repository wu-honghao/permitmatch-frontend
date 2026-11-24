import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CoveredSkills, MissingSkills } from '../../components/SkillsShow';
import SkillProgress from '../../components/SkillProgress';

describe('skill presentation components', () => {
  it('renders all covered skills', () => {
    render(<CoveredSkills skills={['React', 'TypeScript']} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('renders alternative missing skills as OR groups', () => {
    render(<MissingSkills skills={ [['React', 'Vue'], ['Docker']] } />);
    expect(screen.getByText('React OR Vue')).toBeInTheDocument();
    expect(screen.getByText('Docker')).toBeInTheDocument();
  });

  it('shows matched and total skills with percentage', () => {
    const {container} = render(<SkillProgress title='Required coverage' skillCoverage={{matched: 3, total: 4, coveredSkills: ["React", "TypeScript", "Node.js"], missingSkills: [["Docker"]]}} />);
    expect(screen.getByText('Required coverage')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(container.querySelector('.ant-progress')).toBeInTheDocument();
    expect(container.querySelector('[aria-valuenow="75"]')).toBeInTheDocument();
  });
});
