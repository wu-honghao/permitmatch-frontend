import { test, expect, type Page } from '@playwright/test';

const now = '2026-11-24T12:00:00.000Z';
const jobId = '507f1f77bcf86cd799439011';
const analysisId = '507f1f77bcf86cd799439012';
const JD = 'React Developer. Requirements: React, TypeScript, Docker. Location: Dublin.';
const requirements = [
  { rawContent: 'React', category: 'required', operator: 'all', skills: ['React'] },
  { rawContent: 'Docker', category: 'preferred', operator: 'all', skills: ['Docker'] },
];
const job = {
  _id: jobId, ownerId: 'user-1', title: 'React Developer', company: 'Demo Company',
  location: 'Dublin', rawDescription: JD, requirements,
  salary: null, contract: null, educationRequirement: null,
  experienceRequirement: null, permitSupport: { rawContent: null, status: 'unknown' },
  latestAnalysisId: null, createdAt: now, updatedAt: now,
};
const result = {
  _id: analysisId, ownerId: 'user-1', jobId,
  profileSnapshot: {
    needsPermit: true, targetRole: 'React Developer', educationLevel: 'bachelor',
    yearsExperience: 2, skills: ['React', 'TypeScript'], preferredLocation: 'Dublin',
  },
  jobSnapshot: {
    title: job.title, company: job.company, location: job.location,
    rawDescription: JD, requirements, salary: null, contract: null,
    educationRequirement: null, experienceRequirement: null, permitSupport: job.permitSupport,
  },
  skillScoreResult: {
    score: 80, scoreType: 'weighted', hasPendingReview: false,
    required: { matched: 1, total: 1, coveredSkills: ['React'], missingSkills: [] },
    preferred: { matched: 0, total: 1, coveredSkills: [], missingSkills: [['Docker']] },
  },
  createdAt: now, updatedAt: now,
};
const response = (data: unknown) => ({ message: 'OK', data });

async function mockApi(page: Page) {
  let savedJob = false;
  let savedAnalysis = false;
  let authenticated = false;
  const requests: { method: string; path: string; data: unknown }[] = [];

  await page.route('**/__api/**', async route => {
    const req = route.request();
    const path = new URL(req.url()).pathname.replace(/^\/__api/, '');
    const method = req.method();
    const data = req.postDataJSON?.() ?? null;
    requests.push({ method, path, data });
    const json = (body: unknown, status = 200) => route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(body),
    });

    if (path === '/auth/login' && method === 'POST') {
      authenticated = true;
      return json(response({ token: 'e2e-fake-token' }));
    }
    if (path === '/auth/me') {
      const bearer = req.headers().authorization;
      return authenticated && bearer === 'Bearer e2e-fake-token'
        ? json(response({ id: 'user-1', email: 'e2e@example.com' }))
        : json({ message: 'Unauthorized' }, 401);
    }
    if (path === '/jobs' && method === 'GET') {
      return json(response(savedJob ? [{
        _id: jobId, title: job.title, company: job.company, location: job.location,
        skillScore: savedAnalysis ? 80 : null,
        scoreType: savedAnalysis ? 'weighted' : null,
        latestAnalysisId: savedAnalysis ? analysisId : null, updatedAt: now,
      }] : []));
    }
    if (path === '/jobs/extract' && method === 'POST') {
      return json(response({
        title: job.title, company: job.company, location: job.location,
        rawDescription: JD, requirements,
      }));
    }
    if (path === '/jobs' && method === 'POST') {
      savedJob = true;
      return json(response(job));
    }
    if (path === `/jobs/${jobId}` && method === 'GET') {
      return json(response({
        ...job,
        latestAnalysisId: savedAnalysis
          ? { _id: analysisId, createdAt: now, skillScoreResult: { score: 80, scoreType: 'weighted' } }
          : null,
      }));
    }
    if (path === `/jobs/${jobId}/analyses` && method === 'POST') {
      savedAnalysis = true;
      return json(response({ _id: analysisId }));
    }
    if (path === `/analyses/${analysisId}` && method === 'GET') return json(response(result));
    if (path === '/analyses' && method === 'GET') return json(response(savedAnalysis ? [{
      _id: analysisId, jobId, jobExists: true,
      jobSnapshot: { title: job.title, company: job.company },
      skillScoreResult: { score: 80 }, createdAt: now,
    }] : []));
    if (path === '/skillsGap' && method === 'GET') return json(response({
      totalJobs: savedAnalysis ? 1 : 0,
      gaps: savedAnalysis ? [{ skills: ['Docker'], requiredCount: 0, preferredCount: 1, totalCount: 1 }] : [],
    }));
    if (path === '/profile' && method === 'GET') return json(response({
      needsPermit: true, targetRole: 'React Developer', educationLevel: 'bachelor',
      yearsExperience: 2, skills: ['React', 'TypeScript'], preferredLocation: 'Dublin',
    }));
    return json({ message: `No E2E mock for ${method} ${path}` }, 501);
  });
  return requests;
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('language', 'en'));
});

test('Unauthenticated users cannot access the jobs page', async ({ page }) => {
  await mockApi(page);
  await page.goto('/jobs');
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
});

test('Login → AI extraction → Review and save job → Skill analysis → Analysis history → Cross-job skill gaps', async ({ page }) => {
  const requests = await mockApi(page);
  await page.goto('/login');
  await page.getByRole('textbox', { name: 'Email' }).fill('e2e@example.com');
  await page.getByLabel('Password').fill('safe-test-password');
  await page.getByRole('button', { name: /sign in/i }).click();
  await expect(page).toHaveURL(/\/jobs$/);
  await page.getByRole('link', { name: /import job/i }).click();
  await expect(page).toHaveURL(/\/jobs\/new$/);
  await page.getByPlaceholder('Paste the English job description here...').fill(JD);
  await page.getByRole('button', { name: 'Extract with AI' }).click();
  await expect(page.getByRole('textbox', { name: 'Job Title' })).toHaveValue('React Developer');
  await page.getByRole('textbox', { name: 'Job Title' }).fill('Senior React Developer');
  await page.getByRole('button', { name: /save/i }).click();
  await expect(page).toHaveURL(new RegExp(`/jobs/${jobId}$`));
  await page.getByRole('button', { name: 'Analyse Skills' }).click();
  await expect(page).toHaveURL(new RegExp(`/analyses/${analysisId}$`));
  await expect(page.getByText('Docker').first()).toBeVisible();
  await page.getByRole('menuitem', { name: /my analyses/i }).click();
  await expect(page).toHaveURL(/\/analyses$/);
  await expect(page.getByRole('link', { name: 'View Full Results' })).toBeVisible();
  await page.getByRole('menuitem', { name: /skills gap/i }).click();
  await expect(page).toHaveURL(/\/skillGaps$/);
  await expect(page.getByText('Docker')).toBeVisible();

  // Enforce the real user edit, not merely a successful navigation.
  const save = requests.find(x => x.path === '/jobs' && x.method === 'POST');
  expect(save).toBeDefined();
  expect(save?.data).toEqual(expect.objectContaining({ title: 'Senior React Developer' }));
  expect(requests).toEqual(expect.arrayContaining([
    expect.objectContaining({ path: '/jobs/extract', method: 'POST' }),
    expect.objectContaining({ path: `/jobs/${jobId}/analyses`, method: 'POST' }),
  ]));
});
