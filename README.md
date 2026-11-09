# PermitMatch — Frontend

PermitMatch is a web application for software job seekers exploring opportunities in Ireland. It helps users compare their skills against job requirements, review missing skills, and track analyses across multiple jobs.

This repository contains the **frontend** of PermitMatch. It is designed for individual job seekers, not recruitment agencies or employers.

## Features

- **Authentication:** Registration, login, and protected application routes.
- **Candidate profile:** Manage target role, experience, education, skills, preferred location, and employment-permit needs.
- **Job management:** Create, view, edit, and delete saved job descriptions and structured requirements.
- **Skill matching:** Display match scores, required and preferred skill coverage, and missing skills.
- **Analysis history:** Review previous job analyses and their saved results.
- **Cross-role skill gaps:** Identify skills repeatedly missing across analysed jobs.
- **Internationalisation:** Switch between English and Simplified Chinese.

> **Important:** Skill scores are not hiring probabilities or proof of proficiency. Employment-permit information is for guidance only; PermitMatch does not determine visa or permit eligibility.

## Tech Stack

| Area | Technologies |
| --- | --- |
| UI | React 19, TypeScript, Ant Design 6 |
| Build | Vite 8 |
| Routing | React Router 8 |
| State | Redux Toolkit, React Redux |
| Internationalisation | i18next, react-i18next |
| Testing | Vitest, Playwright |
| Deployment | Docker, Nginx |

## Getting Started

### Prerequisites

- Node.js version compatible with the project's Vite toolchain
- npm
- A running PermitMatch backend API

### Install and run

```bash
npm ci
```

Create a `.env.local` file at the repository root:

```dotenv
VITE_API_URL=http://localhost:3000
```

Set `VITE_API_URL` to the base URL of your backend, with no trailing slash. Ensure the backend permits requests from the frontend origin via its CORS configuration.

```bash
npm run dev
```

Open the local URL printed by Vite.

## Available Commands

```bash
npm run dev       # Start the development server
npm run build     # TypeScript check and production build
npm run preview   # Preview the production build locally
npm run lint      # Run ESLint
npm run test      # Run Vitest
```

### End-to-end testing

The repository includes Playwright configuration and an initial browser login test:

```bash
npx playwright install
npx playwright test
```

The browser tests require the frontend and backend to be running and suitable test accounts/data to be available. The existing Playwright tests are not yet a self-contained CI test suite.

## Docker

The Dockerfile builds the frontend and serves the resulting static files with Nginx.

```bash
docker build --build-arg VITE_API_URL=http://localhost:3000 -t permitmatch-frontend .
docker run --rm -p 8080:80 permitmatch-frontend
```

Visit `http://localhost:8080`. When deploying, provide a backend URL reachable **from the user's browser**; Vite embeds `VITE_API_URL` at build time. If the frontend is served over HTTPS, use an HTTPS API URL.

## Project Structure

```text
src/
├── api/            # HTTP request helpers
├── components/     # Reusable UI components
├── features/auth/  # Authentication state
├── i18n/           # English and Chinese translations
├── layout/         # Application layout
├── pages/          # Login, Profile, Jobs, Analysis, Skill Gaps
├── store/          # Redux store
├── types/          # TypeScript domain types
└── utils/          # Formatting and other utilities
e2e/                # Playwright browser tests
```

## Project Status

The core frontend workflows are implemented. Automated test coverage and production deployment are being improved. Job information is currently entered and confirmed manually; AI-assisted job-description extraction is not part of this version.

## Related Repository

The backend is maintained separately as **permitmatch-backend**. Add its GitHub URL here once the repository is published.

## Disclaimer

PermitMatch is a portfolio and educational project. Its analysis is informational and should not replace professional recruitment or immigration advice.
