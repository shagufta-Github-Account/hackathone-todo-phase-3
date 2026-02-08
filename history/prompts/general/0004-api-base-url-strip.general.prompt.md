---
id: 0004
title: Api base url strip
stage: general
date: 2026-01-04
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: 001-fullstack-todo-app
user: user
command: none
labels: [api,config]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - frontend/src/lib/api.ts
 - history/prompts/general/0004-api-base-url-strip.general.prompt.md
tests:
 - not-run
---

## Prompt

You are a senior TypeScript + Next.js engineer.

Context:
This is Phase 2 of Hackathon II (Full-Stack Todo Web Application).

Frontend:
- Next.js App Router
- TypeScript
- Client-side API wrapper using fetch
- JWT stored in localStorage

Backend:
- FastAPI
- JWT-based authentication
- Routes are prefixed with /api

PHASE RULES (NON-NEGOTIABLE):
- Phase 2 ONLY
- Do NOT add new features
- Do NOT refactor unrelated code
- Do NOT introduce Phase 3 concepts (AI, chatbot, agents, MCP)
- Fix must be minimal and targeted
- Backend logic must NOT be changed

PHASE 2 SCOPE:
Allowed:
- Fixing API client bugs
- Fixing JWT token injection issues
- Fixing fetch / response handling
- Fixing runtime or TypeScript errors
- Making frontend API calls work with backend

Not Allowed:
- UI redesign
- Backend changes
- Architectural refactor
- Adding interceptors, libraries, or abstractions

Problem:
The following centralized API client file is causing runtime
and/or integration issues between frontend and backend
(JWT auth, fetch errors, response parsing, or environment config).

Your Tasks:
1. Review the provided API client code carefully.
2. Identify any bugs or risky patterns (JWT handling, headers, fetch usage, error parsing, base URL).
3. Explain the ROOT CAUSE in simple terms.
4. Propose the SMALLEST possible fix that keeps Phase-2 scope.
5. Provide corrected code ONLY if necessary.
6. Do NOT rewrite the entire file.
7. Do NOT add new dependencies.

Here is the file that needs review and fixing:
<<<(api.ts content)>>>

## Response snapshot

- Root cause: when `NEXT_PUBLIC_API_URL` already ends with a slash, adding endpoint strings starting with `/api` generated URLs like `https://backend.example.com//api/...`, which FastAPI treats as a different path and returns 404.
- Minimal fix: normalize `API_BASE_URL` once by stripping any trailing slash before concatenating endpoints.
- Updated single line: `const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000').replace(/\/$/, '');`

## Outcome

- ✅ Impact: Frontend can now call FastAPI endpoints without double slashes; UI and backend communicate correctly.
- 🧪 Tests: not-run (manual verification recommended via login + task CRUD flow)
- 📁 Files: frontend/src/lib/api.ts
- 🔁 Next prompts: none
- 🧠 Reflection: keep endpoint strings prefixed with `/` but ensure base URL normalization once.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): None
- Next experiment: None
