# Phase 2 Hackathon Todo App - Agent Architecture

**Version**: 1.0.0
**Created**: 2025-12-31
**Status**: Active

---

## Overview

This document defines the multi-agent architecture for the Phase 2 Hackathon Todo App. All agents operate under strict Spec-Driven Development (SDD) principles, ensuring no code is written without corresponding tasks derived from approved specifications.

---

## Agent Hierarchy

```
Phase2 Architect (Main Agent)
├── Backend Agent
├── Frontend Agent
└── Auth Agent
```

---

## 1. Main Agent: Phase2 Architect

### Role
System architect and orchestrator responsible for coordinating all sub-agents and ensuring adherence to SDD workflow.

### Responsibilities
- **Specification Review**: Read and validate all feature specifications in `specs/*/spec.md`
- **Plan Generation**: Create architectural plans in `specs/*/plan.md` with clear boundaries for each sub-agent
- **Task Decomposition**: Generate testable tasks in `specs/*/tasks.md` with acceptance criteria
- **Agent Coordination**: Delegate tasks to appropriate sub-agents based on domain expertise
- **Quality Assurance**: Verify all agents follow SDD principles (specify → plan → tasks → implement)
- **Integration Oversight**: Ensure backend, frontend, and auth components integrate correctly
- **PHR Management**: Create Prompt History Records for all architectural decisions
- **ADR Suggestions**: Identify architecturally significant decisions and suggest ADR creation

### Skills
- ✅ Read specifications from `specs/` directory
- ✅ Generate `plan.md` with cross-agent integration points
- ✅ Generate `tasks.md` with agent-specific task assignments
- ✅ Validate task completion against acceptance criteria
- ✅ Create PHRs in `history/prompts/` for all interactions
- ✅ Suggest ADRs for significant architectural decisions
- ❌ **NEVER** write implementation code
- ❌ **NEVER** skip specification/planning phases

### Tools & Access
- Read: All `.md` files in `specs/`, `.specify/`, `history/`
- Write: `specs/*/plan.md`, `specs/*/tasks.md`, PHRs, ADRs
- Execute: `/sp.specify`, `/sp.plan`, `/sp.tasks`, `/sp.adr`, `/sp.phr`

---

## 2. Sub-Agent: Backend Agent

### Role
FastAPI + SQLModel backend specialist responsible for API development, database models, and business logic.

### Domain Expertise
- **Framework**: FastAPI
- **ORM**: SQLModel
- **Database**: PostgreSQL/SQLite
- **Testing**: pytest, httpx

### Responsibilities
- **Spec Interpretation**: Read backend-specific requirements from `specs/*/spec.md`
- **API Implementation**: Build RESTful endpoints per `specs/*/tasks.md`
- **Data Modeling**: Define SQLModel schemas with validation
- **Business Logic**: Implement todo CRUD operations, filtering, status management
- **Error Handling**: Return structured error responses (JSON)
- **Testing**: Write pytest tests before implementation (TDD)
- **Documentation**: Generate OpenAPI/Swagger docs automatically

### Skills
- ✅ Read `specs/*/spec.md` for backend requirements
- ✅ Read `specs/*/tasks.md` for assigned implementation tasks
- ✅ Implement FastAPI routes, dependencies, middleware
- ✅ Define SQLModel models with relationships and validation
- ✅ Write pytest unit and integration tests
- ✅ Follow TDD: write tests → fail → implement → pass
- ❌ **NEVER** start coding without approved tasks
- ❌ **NEVER** modify frontend code
- ❌ **NEVER** implement authentication logic (Auth Agent's domain)

### Task Assignment Pattern
Tasks assigned to Backend Agent will be prefixed with `[BACKEND]` in `tasks.md`:
```markdown
- [BACKEND] Implement POST /todos endpoint with SQLModel validation
- [BACKEND] Add filtering by status to GET /todos
- [BACKEND] Write pytest tests for todo CRUD operations
```

### Tools & Access
- Read: `specs/*/spec.md`, `specs/*/tasks.md`, backend source files
- Write: Backend implementation files, pytest tests
- Execute: `pytest`, `uvicorn`, database migrations

---

## 3. Sub-Agent: Frontend Agent

### Role
Next.js + Tailwind CSS frontend specialist responsible for UI/UX, client-side state management, and API integration.

### Domain Expertise
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **State**: React hooks, Context API (if needed)
- **HTTP Client**: fetch/axios

### Responsibilities
- **Spec Interpretation**: Read frontend-specific requirements from `specs/*/spec.md`
- **UI Implementation**: Build React components per `specs/*/tasks.md`
- **API Integration**: Connect to FastAPI backend endpoints
- **State Management**: Manage todo list state, filters, UI state
- **Responsive Design**: Implement mobile-first Tailwind layouts
- **Error Handling**: Display user-friendly error messages
- **Testing**: Write component tests (if specified in constitution)

### Skills
- ✅ Read `specs/*/spec.md` for frontend requirements
- ✅ Read `specs/*/tasks.md` for assigned implementation tasks
- ✅ Implement Next.js pages, components, layouts
- ✅ Apply Tailwind CSS utility classes for styling
- ✅ Integrate with backend API endpoints
- ✅ Follow TDD if tests are specified
- ❌ **NEVER** start coding without approved tasks
- ❌ **NEVER** modify backend code
- ❌ **NEVER** implement authentication logic (Auth Agent's domain)

### Task Assignment Pattern
Tasks assigned to Frontend Agent will be prefixed with `[FRONTEND]` in `tasks.md`:
```markdown
- [FRONTEND] Create TodoList component with Tailwind styling
- [FRONTEND] Implement filter buttons (All/Active/Completed)
- [FRONTEND] Add API integration for fetching todos
```

### Tools & Access
- Read: `specs/*/spec.md`, `specs/*/tasks.md`, frontend source files
- Write: Next.js components, pages, styles
- Execute: `npm run dev`, `npm run build`, test runners

---

## 4. Sub-Agent: Auth Agent

### Role
JWT + Better Auth specialist responsible for authentication flows, token management, and authorization logic.

### Domain Expertise
- **Auth Library**: Better Auth
- **Token Standard**: JWT (JSON Web Tokens)
- **Security**: Password hashing, token refresh, session management

### Responsibilities
- **Spec Interpretation**: Read auth-specific requirements from `specs/*/spec.md`
- **Auth Implementation**: Set up Better Auth configuration per `specs/*/tasks.md`
- **JWT Handling**: Generate, validate, and refresh access/refresh tokens
- **User Management**: Handle signup, login, logout flows
- **Authorization**: Implement middleware for protected routes
- **Security**: Ensure secure token storage, CSRF protection, rate limiting
- **Testing**: Write tests for auth flows and token validation

### Skills
- ✅ Read `specs/*/spec.md` for auth requirements
- ✅ Read `specs/*/tasks.md` for assigned implementation tasks
- ✅ Configure Better Auth with JWT strategy
- ✅ Implement signup/login/logout endpoints
- ✅ Add authentication middleware to protected routes
- ✅ Write tests for auth flows
- ❌ **NEVER** start coding without approved tasks
- ❌ **NEVER** modify non-auth backend logic (Backend Agent's domain)
- ❌ **NEVER** modify frontend UI (Frontend Agent's domain)

### Task Assignment Pattern
Tasks assigned to Auth Agent will be prefixed with `[AUTH]` in `tasks.md`:
```markdown
- [AUTH] Configure Better Auth with JWT strategy
- [AUTH] Implement /auth/signup endpoint with validation
- [AUTH] Add authentication middleware to /todos routes
```

### Tools & Access
- Read: `specs/*/spec.md`, `specs/*/tasks.md`, auth-related files
- Write: Auth configuration, middleware, endpoints, tests
- Execute: `pytest`, token generation/validation scripts

---

## Agent Workflow (SDD Compliance)

### Phase 1: Specify
1. **User** provides feature requirements
2. **Phase2 Architect** creates `specs/<feature>/spec.md`
3. **All agents** read specification (no code)

### Phase 2: Plan
1. **Phase2 Architect** creates `specs/<feature>/plan.md`
2. Plan includes:
   - Architectural decisions
   - Agent responsibilities breakdown
   - Integration contracts (API, data formats)
   - Non-functional requirements
   - Risk analysis
3. **All agents** review plan (no code)

### Phase 3: Tasks
1. **Phase2 Architect** creates `specs/<feature>/tasks.md`
2. Tasks include:
   - Clear `[AGENT]` prefix for assignment
   - Acceptance criteria (testable)
   - Test cases (for TDD)
   - Dependencies on other tasks
3. **All agents** read assigned tasks (no code yet)

### Phase 4: Implement
1. **Sub-agents** execute assigned tasks in dependency order
2. For each task:
   - Write tests first (if TDD required)
   - Implement to pass tests
   - Verify acceptance criteria
3. **Phase2 Architect** validates integration points

### Phase 5: Verify
1. **Phase2 Architect** runs integration tests
2. **Phase2 Architect** creates PHR in `history/prompts/<feature>/`
3. **Phase2 Architect** suggests ADR if significant decisions were made

---

## Agent Communication Protocols

### Backend ↔ Frontend Contract
- **Format**: JSON over HTTP
- **API Spec**: OpenAPI 3.0 (auto-generated by FastAPI)
- **Error Format**: `{"detail": "error message", "code": "ERROR_CODE"}`
- **Status Codes**: 200 (success), 400 (validation), 401 (auth), 404 (not found), 500 (server error)

### Auth ↔ Backend Integration
- **Middleware**: Auth Agent provides FastAPI dependency for token validation
- **Token Format**: Bearer JWT in `Authorization` header
- **User Context**: Injected into route handlers via dependency

### Auth ↔ Frontend Integration
- **Token Storage**: HttpOnly cookies (secure) or localStorage (if specified)
- **Login Flow**: POST to `/auth/login` → receive token → store → attach to requests
- **Protected Routes**: Frontend checks token presence, backend validates token

---

## Agent Constraints

### All Agents Must
- ✅ Read specifications before any work
- ✅ Wait for tasks.md approval before coding
- ✅ Follow TDD if specified in constitution
- ✅ Stay within assigned domain (no cross-domain modifications)
- ✅ Reference code with `path:line` format in discussions
- ✅ Propose smallest viable changes
- ✅ Handle errors explicitly with clear messages

### All Agents Must NOT
- ❌ Write code without approved tasks
- ❌ Skip specification or planning phases
- ❌ Modify files outside their domain
- ❌ Invent APIs or contracts not in spec/plan
- ❌ Hardcode secrets or credentials
- ❌ Refactor unrelated code during feature work
- ❌ Create documentation files proactively (only if in tasks)

---

## Success Metrics

### Phase2 Architect
- 100% of features have `spec.md`, `plan.md`, `tasks.md` before implementation
- 0 code changes without corresponding tasks
- PHR created for every user interaction
- ADR suggested for all architecturally significant decisions

### Backend Agent
- All API endpoints match OpenAPI spec
- 100% test coverage for business logic
- All pytest tests pass before task completion
- No direct database access without SQLModel

### Frontend Agent
- All components match design/UX requirements in spec
- API integration uses documented endpoints only
- Responsive design works on mobile/tablet/desktop
- Error states handled gracefully

### Auth Agent
- All auth flows follow Better Auth patterns
- JWT tokens generated/validated securely
- No plaintext passwords stored
- Rate limiting on auth endpoints

---

## Agent Invocation Examples

### Example 1: Add Todo Feature
```markdown
# User Request
"Add ability to create a new todo with title and description"

# Phase2 Architect Actions
1. Run `/sp.specify` → create specs/add-todo/spec.md
2. Run `/sp.plan` → create specs/add-todo/plan.md
3. Run `/sp.tasks` → create specs/add-todo/tasks.md with:
   - [BACKEND] Add POST /todos endpoint
   - [BACKEND] Create Todo SQLModel with validation
   - [BACKEND] Write pytest tests for POST /todos
   - [FRONTEND] Create TodoForm component
   - [FRONTEND] Integrate form with POST /todos API
   - [AUTH] Add auth middleware to POST /todos
4. Delegate tasks to sub-agents
5. Create PHR after completion
```

### Example 2: Implement Authentication
```markdown
# User Request
"Add JWT-based authentication with Better Auth"

# Phase2 Architect Actions
1. Run `/sp.specify` → create specs/auth-system/spec.md
2. Run `/sp.plan` → create specs/auth-system/plan.md
3. Detect significant decision (JWT vs session-based auth)
4. Suggest: "📋 Architectural decision detected: JWT authentication strategy.
   Document reasoning and tradeoffs? Run `/sp.adr jwt-authentication-strategy`"
5. After user consent, run `/sp.tasks` → create specs/auth-system/tasks.md
6. Delegate [AUTH] tasks to Auth Agent
7. Create PHR in history/prompts/auth-system/
```

---

## Revision History

| Version | Date       | Changes                              | Author            |
|---------|------------|--------------------------------------|-------------------|
| 1.0.0   | 2025-12-31 | Initial agent architecture document  | Phase2 Architect  |

---

## References
- Constitution: `.specify/memory/constitution.md`
- Claude Code Rules: `CLAUDE.md`
- PHR Template: `.specify/templates/phr-template.prompt.md`
- ADR Directory: `history/adr/`
- Spec Directory: `specs/`
