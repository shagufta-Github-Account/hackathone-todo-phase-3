<!--
Sync Impact Report:
Version change: initial → 1.0.0
Modified principles: All principles newly defined
Added sections: Core Principles (6 principles), Technology Stack, Development Workflow, Governance
Removed sections: None (initial creation)
Templates requiring updates:
  ✅ .specify/templates/plan-template.md - validated, consistent with constitution
  ✅ .specify/templates/spec-template.md - validated, consistent with constitution
  ✅ .specify/templates/tasks-template.md - validated, consistent with constitution
Follow-up TODOs: None - all templates aligned
-->

# Hackathon II Todo Application Constitution

## Core Principles

### I. Spec-Driven Development (NON-NEGOTIABLE)

Spec-Driven Development (SDD) MUST be followed for all features and changes:
- All features begin with a complete specification in `specs/<feature>/spec.md`
- Architecture decisions are documented in `specs/<feature>/plan.md`
- Implementation tasks are broken down in `specs/<feature>/tasks.md` with test cases
- NO code generation until specs, plans, and tasks are completed and approved
- Manual coding is strictly prohibited; all code MUST be generated from validated specifications

**Rationale**: SDD ensures clarity, reduces rework, maintains design integrity, and creates a traceable development history. Manual coding bypasses validation and introduces undocumented changes.

### II. Test-First Development (NON-NEGOTIABLE)

Test-Driven Development (TDD) is mandatory for all code generation:
- Tests MUST be written before implementation code
- Red-Green-Refactor cycle: Write failing tests → Implement to pass → Refactor
- All test cases MUST be defined in tasks.md before code generation
- Test coverage is required for all business logic and API endpoints
- User approval required before implementing code

**Rationale**: Test-first development catches issues early, documents expected behavior, and ensures generated code meets requirements before it's written.

### III. Clean Architecture

Code architecture MUST follow clean architecture principles:
- Clear separation of concerns: presentation, business logic, data access
- Dependencies point inward (outer layers depend on inner, never reverse)
- Business logic is framework-agnostic and independently testable
- Interfaces define contracts between layers
- Readability and maintainability prioritized over cleverness

**Rationale**: Clean architecture enables independent testing, technology flexibility, and long-term maintainability essential for multi-phase development.

### IV. Multi-User Data Isolation (NON-NEGOTIABLE)

Strict data isolation MUST be enforced between users:
- Every data query MUST filter by authenticated user ID
- Database models include user_id foreign key relationships where applicable
- API endpoints validate user ownership before mutations
- Authentication required for all protected routes
- Zero-trust model: verify user context in every operation

**Rationale**: Data isolation is critical for security, privacy compliance, and user trust in multi-tenant todo applications.

### V. Full-Stack Type Safety

Strong typing MUST be maintained across the full stack:
- Frontend TypeScript with strict mode enabled
- Backend Python with type hints and validation (SQLModel, Pydantic)
- Shared schema definitions prevent frontend-backend contract drift
- API contracts validated at runtime and compile time
- No `any` types or unvalidated external data

**Rationale**: Type safety catches errors at development time, documents interfaces, enables confident refactoring, and reduces runtime bugs.

### VI. JWT-Based Authentication

Authentication MUST use JWT tokens with Better Auth compatibility:
- Stateless authentication via JWT access tokens
- Secure token storage (httpOnly cookies or secure storage)
- Token expiration and refresh mechanisms implemented
- User sessions tracked and validated on protected endpoints
- Compatible with Better Auth library patterns

**Rationale**: JWT enables scalable stateless authentication, reduces server load, and provides flexibility for future auth enhancements.

## Technology Stack

The following technology choices are binding and MUST NOT be substituted without constitutional amendment:

**Frontend:**
- Next.js with App Router (React framework)
- Tailwind CSS (styling)
- TypeScript (language)

**Backend:**
- FastAPI (Python web framework)
- SQLModel (ORM with Pydantic integration)
- Python 3.11+ with type hints

**Database:**
- Neon Serverless PostgreSQL

**Authentication:**
- JWT-based tokens
- Better Auth library compatibility

**Rationale**: This stack provides modern, type-safe, full-stack development with serverless database scalability and industry-standard authentication.

## Development Workflow

### Specification Phase

1. Create feature specification (`specs/<feature>/spec.md`)
2. Document architecture and decisions (`specs/<feature>/plan.md`)
3. Break down into testable tasks (`specs/<feature>/tasks.md`)
4. User review and approval required before proceeding

### Implementation Phase

1. Generate tests first (red phase) per tasks.md
2. Generate implementation code to pass tests (green phase)
3. Refactor for code quality (refactor phase)
4. All code generated via AI tools following approved specs
5. Manual coding prohibited

### Quality Gates

Before merging, code MUST pass:
- All tests passing (unit + integration)
- Type checking without errors (TypeScript strict mode, Python type hints)
- No security vulnerabilities in dependencies
- Authentication and authorization checks validated
- Data isolation verified for multi-user scenarios

### Prompt History Records (PHR)

Every user interaction MUST be recorded as a PHR under `history/prompts/`:
- Constitution changes → `history/prompts/constitution/`
- Feature-specific → `history/prompts/<feature-name>/`
- General → `history/prompts/general/`
- Full verbatim user input preserved (no truncation)
- Representative assistant output captured

### Architecture Decision Records (ADR)

Architecturally significant decisions SHOULD be documented as ADRs in `history/adr/`:
- Decisions affecting long-term structure, security, scalability, or platform choices
- ADR creation requires user consent after intelligent suggestion
- Related decisions grouped into single ADR when appropriate

## Governance

This constitution supersedes all other development practices. Compliance is mandatory.

**Amendment Process:**
- Amendments require explicit documentation of changes
- Version bump follows semantic versioning (MAJOR.MINOR.PATCH)
- All dependent templates and docs MUST be updated for consistency
- Migration plan required for breaking changes

**Compliance:**
- All pull requests MUST verify constitutional compliance
- Violations MUST be flagged and corrected before merge
- Complexity or deviations MUST be explicitly justified and documented
- Runtime development guidance in `CLAUDE.md` supplements but does not override this constitution

**Version**: 1.0.0 | **Ratified**: 2025-12-31 | **Last Amended**: 2025-12-31
