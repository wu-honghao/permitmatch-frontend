# PermitMatch — Frontend

**PermitMatch** helps software job seekers exploring opportunities in Ireland compare their skills with job requirements, see missing skills, and review analyses across multiple jobs.

This repository contains the **React + TypeScript frontend**. PermitMatch is designed for individual job seekers—not as a recruiter or employer management platform.

> **Status:** MVP V1 implemented and deployed.

**Live app:** https://d3omusoi6mx2kn.cloudfront.net

## Features

- **Authentication:** Register, log in, and access protected application routes.
- **Candidate profile:** Maintain target role, technical skills, experience, education, preferred location, and employment-permit needs.
- **Job management:** Save, view, edit, and delete jobs and their original descriptions.
- **AI-assisted job import:** Paste a job description, generate a structured draft using Gemini through the backend, review/edit the results, then save the job. Manual entry is also supported.
- **Explainable skill matching:** Display a match score, required/preferred group coverage, matched and missing skills, and the scoring rules.
- **Analysis history:** Review saved analyses that preserve the profile and job information used at analysis time.
- **Cross-job skill gaps:** Identify recurring unmet skill requirements across saved jobs.
- **Bilingual interface:** Switch between English and Simplified Chinese.
- **Request handling:** Present loading, error, and empty states; handle authentication errors and request timeouts.

> **Important:** Skill match scores measure rule-based coverage of job requirements. They are not hiring probabilities or proof of proficiency. Permit-related information is guidance only, not an eligibility determination.

## Tech Stack

| Area | Technologies |
| --- | --- |
| UI | React 19, TypeScript 6, Ant Design 6 |
| Build | Vite 8 |
| Routing | React Router 8 |
| State | Redux Toolkit 2, React Redux 9 |
| Internationalisation | i18next, react-i18next |
| Utilities | dayjs, lodash |
| Testing | Vitest 5, Testing Library, Playwright |
| Production hosting | Amazon S3, CloudFront |

## Getting Started

### Prerequisites

- Node.js and npm compatible with this repository's Vite toolchain
- A running PermitMatch backend API

### Install

```bash
npm ci
```

### Configure the API URL

Copy the template:

```bash
cp .env.example .env
```

If `.env.example` is not yet checked in, create `.env` with:

```dotenv
VITE_API_URL=http://localhost:3000
```

The API URL must be reachable from the browser. For local development, make sure the backend allows the Vite origin (typically `http://localhost:5173`) in its CORS configuration.

**Security:** Variables starting with `VITE_` are embedded in the browser bundle. Never put API keys, JWT signing secrets, or database credentials in frontend environment variables.

### Start development server

```bash
npm run dev
```

Open the local address shown in the terminal.

## Available Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and build production assets |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest |

## How to Use

1. Register or log in.
2. Create a candidate profile and enter your skills.
3. Paste a job description for AI-assisted extraction, or enter the requirements manually.
4. Review and confirm the job details and required/preferred skill groups.
5. Run a skill analysis to see requirement coverage and missing skills.
6. Revisit saved analysis snapshots and compare recurring gaps across jobs.

### Scoring explanation

- An **AND** group is covered only when all skills in that group match.
- An **OR** group is covered when at least one alternative matches.
- Coverage counts **requirement groups**, not individual technology mentions.
- With both categories present: `required coverage × 80% + preferred coverage × 20%`.
- With only required groups: required coverage accounts for 100% of the score.
- With no scorable groups: display **Unavailable**, not a numeric score.

## Testing

Run Vitest:

```bash
npm run test
```

Run the Playwright browser tests, if the local test environment and configured test cases are available:

```bash
npx playwright install
npx playwright test
```

Browser tests may need both frontend and backend services running and dedicated test accounts/data. Do not treat the test setup as fully automated CI unless the repository actually includes that configuration.

## Production Deployment

The production frontend is deployed as static assets on **Amazon S3**, delivered through **Amazon CloudFront**.

- **Frontend:** https://d3omusoi6mx2kn.cloudfront.net
- **Backend API:** https://d38890yu916wq0.cloudfront.net
- **Database:** MongoDB Atlas (accessed by the backend only)

The production Vite environment is configured with:

```dotenv
VITE_API_URL=https://d38890yu916wq0.cloudfront.net
```

The API URL is resolved at **build time**. After changing it, create and deploy a new frontend build.

Since this is a single-page application, the CloudFront configuration returns `index.html` for frontend routes such as `/login` when those paths are refreshed directly.

## Project Structure

```text
src/
├── api/            # API request helpers
├── components/     # Reusable components
├── features/auth/  # Authentication state
├── i18n/           # English and Chinese translations
├── layout/         # Application layout
├── pages/          # Profile, jobs and analysis screens
├── store/          # Redux store
├── types/          # Domain types
└── utils/          # Formatting and other utilities
```

## Related Repository

- **Backend repository:** `permitmatch-backend` (add the GitHub link when available)

## Disclaimer

PermitMatch is a portfolio and educational project. Its analyses are informational and should not replace professional recruitment or immigration advice.