---
description: "Task list for Foundation — Auth & App Shell"
---

# Tasks: Foundation — Auth & App Shell

**Input**: Design documents from `/specs/001-foundation-auth-shell/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/auth.md, quickstart.md

**Tests**: Light unit/component tests are included (marked OPTIONAL) because quickstart.md defines
test ideas. They may be skipped for the graduation-project MVP without blocking delivery.

**Organization**: Tasks are grouped by user story. This is the foundation feature, so Setup and
Foundational phases are large and establish the shared design system + HTTP/auth layer reused by
features 02–08.

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 Verify/初始 React + TS + React Router project builds; add deps (axios, @tanstack/react-query, jwt-decode, react-hook-form, zod) to `package.json`
- [x] T002 [P] Add design tokens in `app/styles/tokens.css` (palette from plan: primary #2d6a4f … border #e5e7eb + semantic colors; spacing/radius scale)
- [x] T003 [P] Add `app/styles/global.css`: `dir="rtl"`, `lang="ar"`, Tajawal @font-face/import, base resets, focus-visible ring
- [x] T004 [P] Create Arabic string map `app/i18n/ar.ts` (nav labels, role labels, login + envelope errors, common words)
- [x] T005 Configure `VITE_API_BASE_URL` env handling and `vite.config.ts` alias for `app/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**⚠️ CRITICAL**: No user story work can begin until this phase is complete. This phase delivers the
shared HTTP/auth layer and the design-system component kit that every later feature imports.

- [x] T006 Implement axios instance + interceptors in `app/lib/http.ts` (Bearer on request; unwrap `data` on success; normalize error to `{code,message}`; 401→clear+redirect; 403→friendly message) per contracts/auth.md
- [x] T007 [P] Implement token utilities in `app/lib/auth.ts` (store/read/clear token, `decode()`→{id,email,role,exp}, `isExpired()`, `login()`, `logout()`, role fallback to `admin`)
- [x] T008 [P] Implement `app/lib/levels.ts` int→{label,color} map (0=Rookie…4=Platinum + unknown fallback) per data-model.md
- [x] T009 Implement `app/auth/AuthContext.tsx` (hydrate session from token on load; expose current admin + login/logout)
- [x] T010 [P] Build component kit primitives: `app/components/Button.tsx`, `Input.tsx`, `Select.tsx`, `Icon.tsx`
- [x] T011 [P] Build component kit display: `app/components/Badge.tsx` (incl. level colors), `Card.tsx`, `StatCard.tsx`, `PageHeader.tsx`
- [x] T012 [P] Build component kit data: `app/components/Table.tsx` (RTL headers, empty state "لا توجد بيانات", keyboard-navigable rows), `Pagination.tsx`
- [x] T013 [P] Build component kit overlays: `app/components/Modal.tsx` (role="dialog", focus trap, Esc), `ConfirmModal.tsx`, `Toast.tsx`
- [x] T014 [P] Build `app/components/QueryState.tsx` (shared loading spinner / Arabic empty / Arabic error+retry wrapper for React Query)
- [x] T015 [P] Build `app/components/charts/LineChart.tsx` and `PieChart.tsx` (used from feature 02)
- [x] T016 Wire providers in `app/main.tsx` (Router, QueryClientProvider, AuthProvider; set root `dir="rtl"` `lang="ar"`)
- [x] T017 Define route table + guard components in `app/routes.tsx`, `app/auth/RequireAuth.tsx`, `app/auth/RequireSuperAdmin.tsx`

**Checkpoint**: HTTP/auth layer + design-system kit ready — user stories can proceed.

---

## Phase 3: User Story 1 - Administrator logs in (Priority: P1) 🎯 MVP

**Goal**: An admin can log in (RTL/Arabic) and reach the authenticated shell; bad creds and
deactivated accounts show the correct distinct messages.

**Independent Test**: Valid creds → shell; wrong creds → one generic Arabic error; deactivated →
distinct Arabic message.

### Tests for User Story 1 (OPTIONAL)

- [ ] T018 [P] [US1] Unit test `app/lib/auth.ts` login/decode/expired/role-fallback in `tests/unit/auth.test.ts`
- [ ] T019 [P] [US1] Component test login flow (success/401/403) in `tests/component/login.test.tsx`

### Implementation for User Story 1

- [x] T020 [US1] Build `app/pages/LoginPage.tsx` (centered card per design; email/password via react-hook-form + zod; Tajawal/RTL)
- [x] T021 [US1] Wire login submit to `login()` + AuthContext; route to `/dashboard` on success
- [x] T022 [US1] Map login errors: 401→generic Arabic message, 403→"account deactivated" Arabic message, network→friendly error (from `app/i18n/ar.ts`)

**Checkpoint**: Login works end-to-end into an (empty) shell.

---

## Phase 4: User Story 2 - Role-aware navigation shell (Priority: P1)

**Goal**: Persistent shell (sidebar + top bar) with role-filtered nav.

**Independent Test**: `admin` sees 6 nav items (no Admins); `super_admin` also sees Admins.

### Tests for User Story 2 (OPTIONAL)

- [ ] T023 [P] [US2] Component test: Sidebar renders Admins only for `super_admin` in `tests/component/sidebar.test.tsx`

### Implementation for User Story 2

- [x] T024 [US2] Build `app/shell/AppShell.tsx` (layout: fixed RTL sidebar + sticky top bar + `<Outlet/>`, 24px content padding)
- [x] T025 [P] [US2] Build `app/shell/Sidebar.tsx` (nav model from data-model.md, role filter, collapsible 240/64, active state, responsive drawer on small screens)
- [x] T026 [P] [US2] Build `app/shell/TopBar.tsx` (current page label, admin name + Arabic role label, logout affordance)
- [x] T027 [US2] Add empty placeholder pages in `app/pages/placeholders/` behind each nav route (replaced by features 02–08)

**Checkpoint**: Authenticated shell renders with correct role-based nav.

---

## Phase 5: User Story 3 - Session persistence & route guards (Priority: P2)

**Goal**: Refresh keeps a valid session; guards protect routes by auth and role; logout clears
session.

**Independent Test**: Refresh→stay; logged-out→/login; `admin` hitting `/admins`→/dashboard;
logout→/login.

### Tests for User Story 3 (OPTIONAL)

- [ ] T028 [P] [US3] Component test: RequireAuth + RequireSuperAdmin redirects in `tests/component/guards.test.tsx`

### Implementation for User Story 3

- [x] T029 [US3] Implement `RequireAuth` (redirect unauthenticated → `/login`) and apply to shell routes in `app/routes.tsx`
- [x] T030 [US3] Implement `RequireSuperAdmin` (redirect regular `admin` → `/dashboard`) and apply to `/admins`
- [x] T031 [US3] On app load, check token `exp`/validity in AuthContext → proactively redirect expired/malformed sessions to `/login`
- [x] T032 [US3] Implement logout in TopBar → clear token + session, redirect to `/login`

**Checkpoint**: Auth persistence and route protection verified.

---

## Phase 6: User Story 4 - View my profile (Priority: P3)

**Goal**: Read-only profile of the current admin.

**Independent Test**: Open "My profile" → name/email/Arabic role label, no editable fields.

### Implementation for User Story 4

- [x] T033 [US4] Build `app/pages/ProfilePage.tsx` (read-only name/email/role from AuthContext) and route `/profile`

**Checkpoint**: Profile view available from the top bar.

---

## Phase 7: Polish & Cross-Cutting Concerns

- [x] T034 [P] Add `app/pages/NotFoundPage.tsx` (Arabic not-found inside shell) + catch-all route
- [x] T035 [P] Accessibility pass: landmarks (`<nav>/<main>/<header>`), focus order, ARIA on modal, color-contrast check on badges
- [x] T036 [P] Responsive pass: sidebar drawer + table overflow containers across breakpoints
- [x] T037 Run quickstart.md acceptance walkthrough (US1–US4) and fix gaps
- [x] T038 [P] README section: env setup, run, and a note on the ⏳ backend gap (affects feature 05 only)

---

## Dependencies & Execution Order

- **Setup (Phase 1)**: no dependencies.
- **Foundational (Phase 2)**: depends on Setup; BLOCKS all user stories. (HTTP/auth + kit)
- **US1 (P1)**: depends on Phase 2 (needs auth + LoginPage primitives).
- **US2 (P1)**: depends on Phase 2; independent of US1 but naturally shown after login.
- **US3 (P2)**: depends on Phase 2 + the shell/routes from US2.
- **US4 (P3)**: depends on Phase 2 (AuthContext) + shell.
- **Polish (Phase 7)**: after desired stories complete.

## Parallel Opportunities

- Phase 1: T002, T003, T004 in parallel.
- Phase 2: T007/T008 in parallel; the kit tasks T010–T015 are all `[P]` (different files).
- Tests T018/T019/T023/T028 can run in parallel with their story's UI once primitives exist.

## Implementation Strategy

- **MVP** = Phase 1 + Phase 2 + US1 + US2 (login into a working role-aware shell). Validate, demo.
- Then add US3 (guards/persistence), then US4 (profile), then Polish.
- This foundation's component kit + `lib/` are imported by every later feature; do not duplicate
  them downstream.

## Notes

- [P] = different files, no dependency. [Story] label maps tasks to user stories.
- Tests are OPTIONAL for the MVP; include if time allows.
- STOP after this file — `/speckit.implement` is intentionally NOT run.
