---
description: "Task list for Students Management"
---

# Tasks: Students Management

**Input**: Design documents from `/specs/003-students/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/students.md, quickstart.md
**Depends on**: Feature 001 (kit: Table/Badge/Pagination/ConfirmModal/Toast/QueryState, levels.ts).

**Tests**: OPTIONAL (level-badge + toggle unit tests).

## Phase 1: Setup

- [x] T001 Add students Arabic copy (columns, confirm/toast, level labels reuse) to `app/i18n/ar.ts`
- [x] T002 [P] Add `app/components/Avatar.tsx` (initials avatar) to the shared kit

## Phase 2: Foundational

- [x] T003 Implement `app/lib/api/students.ts`: `listStudents({page,limit,search})`, `getStudent(id)`, `setActive(id, is_active)` over the shared HTTP client (typed per data-model.md)
- [x] T004 Add routes `/students` and `/students/:id` in `app/routes.tsx` (both roles, inside shell)

**Checkpoint**: Data layer + routes ready.

---

## Phase 3: User Story 1 - Browse and search students (Priority: P1) 🎯 MVP

**Goal**: Paginated, searchable list with level badges.

**Independent Test**: Table renders all columns; search filters server-side; paging preserves search; 0-point student shows Rookie.

### Tests (OPTIONAL)

- [ ] T005 [P] [US1] Unit test level badge (0→Rookie, 4→Platinum, unknown→gray) in `tests/unit/level-badge.test.ts`

### Implementation

- [x] T006 [US1] Build `app/pages/students/StudentsListPage.tsx` (Table + columns incl. level Badge + Avatar; Arabic headers)
- [x] T007 [US1] Implement debounced search + URL-synced `page`/`search`; reset page→1 on new term
- [x] T008 [US1] Wire list React Query keyed by `[students,page,search]` with shared `QueryState` + `Pagination`

**Checkpoint**: List + search + pagination functional.

---

## Phase 4: User Story 2 - Inspect a single student (Priority: P2)

**Goal**: Detail view with profile header; no badges section.

**Independent Test**: Detail shows avatar/level/points/join/status; badges array present but not rendered.

### Implementation

- [x] T009 [US2] Build `app/pages/students/StudentDetailPage.tsx` (initials avatar header, level Badge, points, join date, status)
- [x] T010 [US2] Wire detail React Query by id with `QueryState`; explicitly DO NOT render `badges`
- [x] T011 [US2] Add affordances linking to this student's sessions/recycles (deep-link with `user_id`) — targets features 04/05

**Checkpoint**: Detail view functional.

---

## Phase 5: User Story 3 - Activate / deactivate (Priority: P2)

**Goal**: Safe status toggle with confirmation and immediate reflection.

**Independent Test**: Deactivate (confirm) → status updates in place; failure rolls back with Arabic error.

### Tests (OPTIONAL)

- [ ] T012 [P] [US3] Unit test toggle mutation (only `is_active` sent; rollback on error) in `tests/unit/student-toggle.test.ts`

### Implementation

- [x] T013 [US3] Build `app/pages/students/StatusToggle.tsx` (ConfirmModal before deactivate; in-flight guard)
- [x] T014 [US3] Wire toggle mutation (`setActive`) with immediate reflection + rollback + Toast; note "takes effect next request"
- [x] T015 [US3] Surface the toggle in both the list row and the detail header

**Checkpoint**: Moderation works from list and detail.

---

## Phase 6: Polish & Cross-Cutting

- [x] T016 [P] Empty/not-found states (empty search; non-existent `:id`) in Arabic
- [x] T017 [P] Truncation for long names/emails in the table; full value in detail
- [x] T018 Run quickstart.md walkthrough incl. scope check (no points-edit/delete/badges)

---

## Dependencies & Execution Order

- Setup → Foundational → US1 (P1) → US2 (P2) → US3 (P2) → Polish.
- US2 and US3 both depend on US1's list/route but are otherwise independent.

## Parallel Opportunities

- T002 with T001; test tasks T005/T012 parallel to their UI.

## Implementation Strategy

- MVP = Setup + Foundational + US1 (browse/search). Then detail, then toggle, then polish.

## Notes

- Only `is_active` is writable. STOP after this file — no `/speckit.implement`.
