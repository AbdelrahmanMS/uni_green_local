---
description: "Task list for Recycle Sessions Audit"
---

# Tasks: Recycle Sessions Audit

**Input**: Design documents from `/specs/004-recycle-sessions/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/sessions.md, quickstart.md
**Depends on**: Feature 001 (kit: Table/Badge/Pagination/Select/Input/QueryState).

**Tests**: OPTIONAL (state-badge + filter-composition unit tests).

## Phase 1: Setup

- [x] T001 Add sessions Arabic copy (columns, state labels معلقة/مكتملة/منتهية, material labels, filter labels) to `app/i18n/ar.ts`

## Phase 2: Foundational

- [x] T002 Implement `app/lib/api/sessions.ts`: `listSessions({page,limit,user_id,material,state,from_date,to_date})` (typed per data-model.md)
- [x] T003 Build shared `app/components/FilterBar.tsx` (state/material selects + date range + clearable user chip) — reused by feature 05
- [x] T004 Add route `/sessions` in `app/routes.tsx` (both roles, inside shell)

**Checkpoint**: Data layer + shared filter bar + route ready.

---

## Phase 3: User Story 1 - Audit the session lifecycle (Priority: P1) 🎯 MVP

**Goal**: Paginated session table with color-coded Arabic state badges.

**Independent Test**: Table shows all columns; state badges correct color+label.

### Tests (OPTIONAL)

- [ ] T005 [P] [US1] Unit test state-badge map (3 states + unknown→gray) in `tests/unit/session-state-badge.test.ts`

### Implementation

- [x] T006 [US1] Build `app/pages/sessions/SessionsListPage.tsx` (Table + columns; state Badge label+color; localized material; created/expiry formatting)
- [x] T007 [US1] Wire list React Query keyed by filters+page with `QueryState` + `Pagination`

**Checkpoint**: List renders with correct badges + pagination.

---

## Phase 4: User Story 2 - Filter to investigate (Priority: P2)

**Goal**: State/material/date/user_id filters that combine with pagination, URL-synced.

**Independent Test**: state=expired narrows; user_id deep-link pre-filters; filters survive paging.

### Tests (OPTIONAL)

- [ ] T008 [P] [US2] Unit test filter→query-param composition + URL sync in `tests/unit/session-filters.test.ts`

### Implementation

- [x] T009 [US2] Integrate `FilterBar` into the page; bind to URL query (`state/material/from_date/to_date/user_id/page`)
- [x] T010 [US2] Pre-apply incoming `user_id` (deep-link from student detail) with a clearable "viewing one student" chip
- [x] T011 [US2] Client-side date-range validation (inverted/invalid) with Arabic helper; reset page→1 on filter change

**Checkpoint**: Filtering + pagination combine correctly.

---

## Phase 5: Polish & Cross-Cutting

- [x] T012 [P] Empty/error states in Arabic; hide pagination when empty
- [x] T013 [P] Accessibility pass (labelled filters, non-color-only badges, keyboard rows)
- [x] T014 Run quickstart.md walkthrough incl. the no-failure_reason boundary check

---

## Dependencies & Execution Order

- Setup → Foundational → US1 (P1) → US2 (P2) → Polish.
- `FilterBar` (T003) blocks US2 (T009) and is reused by feature 05.

## Parallel Opportunities

- Test tasks T005/T008 parallel to their UI.

## Implementation Strategy

- MVP = Setup + Foundational + US1 (browsable audit). Then add filters (US2), then polish.

## Notes

- Read-only; NO failure_reason. STOP after this file — no `/speckit.implement`.
