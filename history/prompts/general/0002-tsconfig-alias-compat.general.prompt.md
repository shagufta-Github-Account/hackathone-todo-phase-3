---
id: 0002
title: Tsconfig alias compat
stage: general
date: 2026-01-04
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: 001-fullstack-todo-app
user: user
command: none
labels: [tsconfig,nextjs]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - frontend/tsconfig.json
 - history/prompts/general/0002-tsconfig-alias-compat.general.prompt.md
tests:
 - not-run
---

## Prompt

You are a senior TypeScript + Next.js engineer.

Context:
This is Phase 2 of Hackathon II (Full-Stack Todo Web Application).
Frontend is built with Next.js App Router and TypeScript.
Backend is FastAPI (already implemented).

PHASE RULES (NON-NEGOTIABLE):
- This is Phase 2 only
- Do NOT add new features
- Do NOT refactor unrelated code
- Do NOT introduce Phase 3 concepts (AI, chatbot, MCP, agents)
- Fix must be minimal and targeted
- Keep changes limited to configuration and compatibility issues

PHASE 2 SCOPE:
Allowed:
- Fixing TypeScript configuration issues
- Fixing path alias / import resolution issues
- Fixing strict-mode related TypeScript errors
- Making frontend compatible with Next.js App Router

Not Allowed:
- New UI features
- Business logic changes
- Backend changes
- Architectural refactor

Problem:
The following tsconfig.json is causing TypeScript / runtime errors
with Next.js App Router and the existing frontend code
(e.g. alias @/* imports, strict mode conflicts, module resolution issues).

Your Tasks:
1. Review the provided tsconfig.json
2. Identify configuration problems or risky settings
3. Explain the root cause in simple terms
4. Propose the smallest possible fix that is Phase-2 compliant
5. Provide a corrected tsconfig.json ONLY if necessary
6. Do NOT change unrelated compiler options

Here is the tsconfig.json:
<<<{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "i>>>

## Response snapshot

- Diagnosed missing `baseUrl` as cause of `@/*` alias failures under Next.js App Router.
- Added `"baseUrl": "."` to align module resolution with configured paths.
- Confirmed no other compiler options changed per Phase 2 constraints.

## Outcome

- ✅ Impact: Restored TypeScript + runtime resolution for path aliases
- 🧪 Tests: not-run
- 📁 Files: Updated frontend/tsconfig.json to include baseUrl
- 🔁 Next prompts: none
- 🧠 Reflection: Future alias additions should always pair paths with baseUrl.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): None
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): None
