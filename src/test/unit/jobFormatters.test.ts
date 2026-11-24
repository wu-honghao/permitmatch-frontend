import { describe, expect, it } from 'vitest';
import { formatSalary, mapFormToJobPayload } from '../../utils/jobFormatters';

describe('formatSalary', () => {
  it('handles missing salary and raw-only salary', () => {
    expect(formatSalary(null)).toBe('-');
    expect(formatSalary({min: null, max: null, currency: null, period: null, rawContent: '  Negotiable  '})).toBe('Negotiable');
    expect(formatSalary({min: null, max: null, currency: null, period: null, rawContent: '  '})).toBe('-');
  });

  it('formats ranges and lower/upper bounds', () => {
    expect(formatSalary({min: 45000, max: 65000, currency: 'EUR', period: 'year', rawContent: null})).toBe('€45,000–65,000 / year');
    expect(formatSalary({min: 50000, max: null, currency: 'USD', period: null, rawContent: null})).toBe('$50,000+');
    expect(formatSalary({min: null, max: 60000, currency: 'GBP', period: 'year', rawContent: null})).toBe('GBP Up to 60,000 / year');
    expect(formatSalary({min: 42, max: null, currency: null, period: 'hour', rawContent: null})).toBe('42+ / hour');
  });
});

describe('mapFormToJobPayload', () => {
  it('normalises an empty form and trims the title', () => {
    expect(mapFormToJobPayload({title: '  React Developer  '})).toEqual({
      rawDescription: null, title: 'React Developer', company: null, location: null,
      salary: null, contract: null, educationRequirement: null,
      experienceRequirement: null, requirements: [], permitSupport: null,
    });
  });

  it('maps nested fields and requirement groups', () => {
    const payload = mapFormToJobPayload({
      title: 'Frontend Engineer', company: 'Example', rawDescription: 'Job description',
      salary: {min: 55000}, contract: {durationMonths: 24},
      educationRequirement: {level: 'bachelor'},
      experienceRequirement: {minYears: 3, scope: 'Frontend'},
      permitSupport: {status: 'supported'},
      requirements: [{category: 'required', operator: 'any', skills: ['React', 'Vue'] }],
    });
    expect(payload).toEqual(expect.objectContaining({
      title: 'Frontend Engineer', company: 'Example',
      salary: {rawContent: null, min: 55000, max: null, currency: null, period: null},
      contract: {rawContent: null, type: null, durationMonths: 24},
      educationRequirement: {rawContent: null, level: 'bachelor', importance: null, fieldOfStudy: null},
      experienceRequirement: {rawContent: null, minYears: 3, maxYears: null, importance: null, scope: 'Frontend'},
      permitSupport: {rawContent: null, status: 'supported'},
      requirements: [{rawContent: null, category: 'required', operator: 'any', skills: ['React', 'Vue']}],
    }));
  });
});
