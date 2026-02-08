# Tasks: Full-Stack Todo Web Application

**Input**: Design documents from `/specs/001-fullstack-todo-app/`
**Prerequisites**: plan.md (required), spec.md (required), data-model.md, contracts/, research.md, quickstart.md

**Tests**: Tests will be written FIRST before implementation (TDD - NON-NEGOTIABLE per constitution)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Web app monorepo**: `backend/src/`, `frontend/src/`
- Paths shown below follow monorepo structure from plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create monorepo root structure with backend/ and frontend/ directories
- [x] T002 [P] Initialize backend Python project with pyproject.toml in backend/
- [x] T003 [P] Initialize frontend Next.js project with package.json in frontend/
- [x] T004 [P] Create .env.example with DATABASE_URL, JWT_SECRET, CORS_ORIGINS in repo root
- [x] T005 [P] Create .gitignore for Python and Node.js in repo root
- [x] T006 [P] Create README.md with project overview and setup instructions in repo root

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 [P] Create backend/src/core/config.py with environment configuration (DATABASE_URL, JWT_SECRET, JWT_ALGORITHM, JWT_EXPIRATION_HOURS, CORS_ORIGINS)
- [x] T008 [P] Create backend/src/core/database.py with async PostgreSQL connection and session management
- [x] T009 [P] Create backend/src/core/security.py with password hashing (bcrypt) and JWT utilities (encode/decode)
- [x] T010 [P] Initialize Alembic for database migrations in backend/alembic/
- [x] T011 [P] Create backend/src/main.py with FastAPI app initialization, CORS middleware, and health endpoint
- [x] T012 [P] Create frontend/src/lib/api.ts with centralized API client (fetch wrapper with JWT injection)
- [x] T013 [P] Create frontend/src/lib/types.ts with TypeScript interfaces (User, Task, API response types)
- [x] T014 [P] Configure frontend/tsconfig.json with strict mode enabled
- [x] T015 [P] Configure frontend/tailwind.config.ts with custom theme (if needed)
- [x] T016 [P] Create frontend/src/app/layout.tsx with root layout and global styles

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - User Registration and Authentication (Priority: P1) 🎯 MVP

**Goal**: Enable users to register accounts, log in with JWT, and log out

**Independent Test**: Register new account → Log in → Verify dashboard access → Log out → Verify redirect to login

### Tests for User Story 1 (TDD - Write These FIRST) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T017 [P] [US1] Write unit test for password hashing in backend/tests/unit/test_security.py
- [ ] T018 [P] [US1] Write unit test for JWT encode/decode in backend/tests/unit/test_security.py
- [ ] T019 [P] [US1] Write unit test for AuthService.register in backend/tests/unit/test_auth_service.py (email validation, password hashing, duplicate email)
- [ ] T020 [P] [US1] Write unit test for AuthService.login in backend/tests/unit/test_auth_service.py (valid credentials, invalid credentials)
- [ ] T021 [P] [US1] Write integration test for POST /api/auth/register in backend/tests/integration/test_auth_api.py (201 success, 400 validation, 409 duplicate)
- [ ] T022 [P] [US1] Write integration test for POST /api/auth/login in backend/tests/integration/test_auth_api.py (200 success with token, 401 invalid credentials)
- [ ] T023 [P] [US1] Write E2E test for registration flow in frontend/tests/e2e/auth.spec.ts (fill form, submit, verify redirect)
- [ ] T024 [P] [US1] Write E2E test for login flow in frontend/tests/e2e/auth.spec.ts (fill form, submit, verify token, verify dashboard access)

### Backend Implementation for User Story 1

- [ ] T025 [P] [US1] Create User SQLModel in backend/src/models/user.py (id, email, password_hash, created_at)
- [ ] T026 [US1] Create Alembic migration for users table in backend/alembic/versions/ (run alembic revision --autogenerate)
- [ ] T027 [US1] Apply migration to create users table (run alembic upgrade head)
- [ ] T028 [US1] Create AuthService in backend/src/services/auth_service.py (register, login, verify_password functions)
- [ ] T029 [US1] Create JWT dependency in backend/src/api/dependencies.py (get_current_user_id from token)
- [ ] T030 [US1] Create auth API routes in backend/src/api/auth.py (POST /api/auth/register, POST /api/auth/login)
- [ ] T031 [US1] Register auth router in backend/src/main.py

### Frontend Implementation for User Story 1

- [ ] T032 [P] [US1] Create AuthContext in frontend/src/lib/auth.ts (useAuth hook, login/logout functions, token storage)
- [ ] T033 [P] [US1] Create RegisterForm component in frontend/src/components/auth/RegisterForm.tsx (email/password inputs, validation, submit)
- [ ] T034 [P] [US1] Create LoginForm component in frontend/src/components/auth/LoginForm.tsx (email/password inputs, validation, submit)
- [ ] T035 [P] [US1] Create Button component in frontend/src/components/common/Button.tsx (reusable styled button)
- [ ] T036 [P] [US1] Create Input component in frontend/src/components/common/Input.tsx (reusable styled input with label)
- [ ] T037 [US1] Create register page in frontend/src/app/register/page.tsx (render RegisterForm, handle success redirect)
- [ ] T038 [US1] Create login page in frontend/src/app/page.tsx (render LoginForm, handle success redirect)
- [ ] T039 [US1] Create dashboard page skeleton in frontend/src/app/dashboard/page.tsx (protected route, verify auth)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Create and View Tasks (Priority: P2)

**Goal**: Authenticated users can create new tasks and view their task list

**Independent Test**: Log in → Create multiple tasks → Verify all tasks appear → Verify data isolation (other users can't see your tasks)

### Tests for User Story 2 (TDD - Write These FIRST) ⚠️

- [ ] T040 [P] [US2] Write unit test for TaskService.create in backend/tests/unit/test_task_service.py (valid task, empty description validation)
- [ ] T041 [P] [US2] Write unit test for TaskService.get_user_tasks in backend/tests/unit/test_task_service.py (filter by user_id, return only user's tasks)
- [ ] T042 [P] [US2] Write integration test for POST /api/tasks in backend/tests/integration/test_tasks_api.py (201 success, 400 validation, 401 unauthorized)
- [ ] T043 [P] [US2] Write integration test for GET /api/tasks in backend/tests/integration/test_tasks_api.py (200 success with array, verify user_id filtering)
- [ ] T044 [P] [US2] Write data isolation test in backend/tests/integration/test_data_isolation.py (two users, verify each sees only their own tasks)
- [ ] T045 [P] [US2] Write E2E test for create task flow in frontend/tests/e2e/tasks.spec.ts (login, create task, verify appears in list)
- [ ] T046 [P] [US2] Write E2E test for view tasks flow in frontend/tests/e2e/tasks.spec.ts (login, create tasks, verify all displayed, verify empty state)

### Backend Implementation for User Story 2

- [ ] T047 [P] [US2] Create Task SQLModel in backend/src/models/task.py (id, user_id FK, description, is_completed, created_at, updated_at)
- [ ] T048 [US2] Create Alembic migration for tasks table in backend/alembic/versions/ (run alembic revision --autogenerate)
- [ ] T049 [US2] Apply migration to create tasks table (run alembic upgrade head)
- [ ] T050 [US2] Create TaskService in backend/src/services/task_service.py (create, get_user_tasks functions with user_id filtering)
- [ ] T051 [US2] Create tasks API routes in backend/src/api/tasks.py (POST /api/tasks, GET /api/tasks with JWT dependency)
- [ ] T052 [US2] Register tasks router in backend/src/main.py

### Frontend Implementation for User Story 2

- [ ] T053 [P] [US2] Create useTasks hook in frontend/src/hooks/useTasks.ts (fetch tasks, create task, state management)
- [ ] T054 [P] [US2] Create TaskItem component in frontend/src/components/tasks/TaskItem.tsx (display task description, completion status)
- [ ] T055 [P] [US2] Create TaskList component in frontend/src/components/tasks/TaskList.tsx (map tasks array, empty state, loading state)
- [ ] T056 [P] [US2] Create CreateTaskForm component in frontend/src/components/tasks/CreateTaskForm.tsx (input, submit button, validation)
- [ ] T057 [US2] Update dashboard page in frontend/src/app/dashboard/page.tsx (integrate TaskList and CreateTaskForm, fetch tasks on mount)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Update Task Status (Priority: P3)

**Goal**: Authenticated users can mark tasks as completed or incomplete

**Independent Test**: Log in → Create task → Mark as completed → Verify visual change → Refresh page → Verify persisted → Toggle back to incomplete

### Tests for User Story 3 (TDD - Write These FIRST) ⚠️

- [ ] T058 [P] [US3] Write unit test for TaskService.update_status in backend/tests/unit/test_task_service.py (toggle completion, verify user ownership)
- [ ] T059 [P] [US3] Write integration test for PATCH /api/tasks/{id} (status only) in backend/tests/integration/test_tasks_api.py (200 success, 403 forbidden for wrong user, 404 not found)
- [ ] T060 [P] [US3] Write E2E test for mark completed flow in frontend/tests/e2e/tasks.spec.ts (create task, click checkbox, verify strikethrough, refresh, verify persisted)

### Backend Implementation for User Story 3

- [ ] T061 [US3] Add update_status function to TaskService in backend/src/services/task_service.py (update is_completed, verify ownership)
- [ ] T062 [US3] Add PATCH /api/tasks/{id} endpoint in backend/src/api/tasks.py (handle is_completed updates, authorization check)

### Frontend Implementation for User Story 3

- [ ] T063 [US3] Add toggleComplete function to useTasks hook in frontend/src/hooks/useTasks.ts (API call, optimistic update)
- [ ] T064 [US3] Update TaskItem component in frontend/src/components/tasks/TaskItem.tsx (add checkbox, handle click, conditional styling for completed)

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently

---

## Phase 6: User Story 4 - Edit and Delete Tasks (Priority: P4)

**Goal**: Authenticated users can edit task descriptions and delete tasks

**Independent Test**: Log in → Create task → Edit description → Verify saved → Delete task with confirmation → Verify removed from list

### Tests for User Story 4 (TDD - Write These FIRST) ⚠️

- [ ] T065 [P] [US4] Write unit test for TaskService.update_description in backend/tests/unit/test_task_service.py (update text, empty validation, verify ownership)
- [ ] T066 [P] [US4] Write unit test for TaskService.delete in backend/tests/unit/test_task_service.py (delete task, verify ownership, verify CASCADE delete on user deletion)
- [ ] T067 [P] [US4] Write integration test for PATCH /api/tasks/{id} (description) in backend/tests/integration/test_tasks_api.py (200 success, 400 empty, 403 forbidden)
- [ ] T068 [P] [US4] Write integration test for DELETE /api/tasks/{id} in backend/tests/integration/test_tasks_api.py (204 success, 403 forbidden, 404 not found)
- [ ] T069 [P] [US4] Write E2E test for edit task flow in frontend/tests/e2e/tasks.spec.ts (create, click edit, change text, save, verify updated)
- [ ] T070 [P] [US4] Write E2E test for delete task flow in frontend/tests/e2e/tasks.spec.ts (create, click delete, confirm, verify removed)

### Backend Implementation for User Story 4

- [ ] T071 [US4] Add update_description and delete functions to TaskService in backend/src/services/task_service.py (update text, delete task, verify ownership)
- [ ] T072 [US4] Update PATCH /api/tasks/{id} endpoint in backend/src/api/tasks.py (handle description updates)
- [ ] T073 [US4] Add DELETE /api/tasks/{id} endpoint in backend/src/api/tasks.py (delete task, authorization check)

### Frontend Implementation for User Story 4

- [ ] T074 [P] [US4] Create EditTaskModal component in frontend/src/components/tasks/EditTaskModal.tsx (modal overlay, input, save/cancel buttons)
- [ ] T075 [US4] Add updateTask and deleteTask functions to useTasks hook in frontend/src/hooks/useTasks.ts (API calls, state updates)
- [ ] T076 [US4] Update TaskItem component in frontend/src/components/tasks/TaskItem.tsx (add edit/delete buttons, handle clicks, confirmation dialog)

**Checkpoint**: All user stories should now be independently functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T077 [P] Add loading spinners to all forms in frontend/src/components/
- [ ] T078 [P] Add error toast notifications in frontend/src/components/common/Toast.tsx
- [ ] T079 [P] Add form validation error messages to Input component in frontend/src/components/common/Input.tsx
- [ ] T080 [P] Add logout button to dashboard layout in frontend/src/app/dashboard/page.tsx
- [ ] T081 [P] Add responsive meta tags and viewport in frontend/src/app/layout.tsx
- [ ] T082 [P] Add API error handling with user-friendly messages in frontend/src/lib/api.ts
- [ ] T083 [P] Run backend type checking with mypy on backend/src/
- [ ] T084 [P] Run frontend type checking with tsc --noEmit on frontend/src/
- [ ] T085 [P] Run backend linting with ruff on backend/src/
- [ ] T086 [P] Run frontend linting with eslint on frontend/src/
- [ ] T087 [P] Create docker-compose.yml for local PostgreSQL in repo root
- [ ] T088 [P] Verify all tests pass (run pytest backend/tests/ and npm test in frontend/)
- [ ] T089 [P] Verify quickstart.md instructions work end-to-end

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed) OR sequentially in priority order (P1 → P2 → P3 → P4)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Requires US1 for authentication, but independently testable with login
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Requires US1 for auth + US2 for tasks, but independently testable
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Requires US1 for auth + US2 for tasks, but independently testable

### Within Each User Story

- **Tests MUST be written FIRST** and MUST FAIL before implementation (TDD - NON-NEGOTIABLE)
- Models before services (services depend on models)
- Services before API endpoints (endpoints depend on services)
- Backend API before frontend integration (frontend depends on working API)
- Core implementation before polish features

### Parallel Opportunities

- **All Setup tasks (T001-T006)** can run in parallel
- **All Foundational tasks (T007-T016)** can run in parallel (within Phase 2)
- **All test tasks within a user story** marked [P] can run in parallel
- **All backend model tasks** within a user story marked [P] can run in parallel
- **All frontend component tasks** within a user story marked [P] can run in parallel
- **Once Foundational phase completes**, all user stories can start in parallel (if team capacity allows)
- **All Polish tasks (T077-T089)** can run in parallel

---

## Parallel Example: User Story 1

```bash
# After Foundational phase complete:

# Launch all US1 tests together (TDD - write these FIRST):
T017: Write unit test for password hashing
T018: Write unit test for JWT encode/decode
T019: Write unit test for AuthService.register
T020: Write unit test for AuthService.login
T021: Write integration test for POST /api/auth/register
T022: Write integration test for POST /api/auth/login
T023: Write E2E test for registration flow
T024: Write E2E test for login flow

# Verify all tests FAIL (expected in TDD red phase)

# Launch backend models together:
T025: Create User SQLModel

# Then backend implementation (some can be parallel):
T026: Create Alembic migration
T027: Apply migration
T028: Create AuthService (depends on T025)
T029: Create JWT dependency
T030: Create auth API routes (depends on T028, T029)
T031: Register auth router

# Launch frontend components together:
T032: Create AuthContext
T033: Create RegisterForm component
T034: Create LoginForm component
T035: Create Button component
T036: Create Input component

# Then frontend pages (depend on components):
T037: Create register page (depends on T033, T035, T036)
T038: Create login page (depends on T034, T035, T036)
T039: Create dashboard page skeleton (depends on T032)

# Verify all tests now PASS (TDD green phase)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Authentication)
   - Write all tests FIRST (T017-T024) - verify they FAIL
   - Implement backend (T025-T031)
   - Implement frontend (T032-T039)
   - Verify all tests PASS
4. **STOP and VALIDATE**: Test User Story 1 independently (register, login, logout)
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (Auth) → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 (Create/View Tasks) → Test independently → Deploy/Demo
4. Add User Story 3 (Complete Tasks) → Test independently → Deploy/Demo
5. Add User Story 4 (Edit/Delete Tasks) → Test independently → Deploy/Demo
6. Add Polish → Final deployment
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Authentication)
   - Developer B: User Story 2 (Create/View Tasks) - can work in parallel after US1 auth is done
   - Developer C: User Story 3 (Task Status) - can work in parallel after US1+US2 done
   - Developer D: User Story 4 (Edit/Delete) - can work in parallel after US1+US2 done
3. Stories complete and integrate independently

---

## TDD Workflow (CRITICAL - NON-NEGOTIABLE)

**Constitutional Requirement**: Test-First Development is mandatory

For each user story:

1. **RED Phase**: Write ALL test tasks for the story
   - Unit tests for services
   - Integration tests for API endpoints
   - E2E tests for user flows
   - Run tests → **VERIFY THEY FAIL** (no implementation yet)

2. **GREEN Phase**: Implement tasks to make tests pass
   - Implement models
   - Implement services
   - Implement API endpoints
   - Implement frontend components
   - Run tests → **VERIFY THEY PASS**

3. **REFACTOR Phase**: Improve code quality
   - Remove duplication
   - Improve naming
   - Optimize performance
   - Run tests → **VERIFY THEY STILL PASS**

**NEVER skip the RED phase** - if tests pass before implementation, they're testing the wrong thing!

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- **TDD is NON-NEGOTIABLE**: Write tests FIRST, verify they FAIL, then implement
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Total tasks: 89 (8 tests per story × 4 stories = 32 test tasks, 57 implementation tasks)
