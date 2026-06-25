---
description: "Task list for Dashboard & Reports"
---

# Tasks: Dashboard & Reports

**Input**: Design documents from `/specs/002-dashboard-reports/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/reports.md, quickstart.md
**Depends on**: Feature 001 (HTTP client, design-system kit, charts, shell, auth).

**Tests**: OPTIONAL (range-guard + material-map unit tests). Skippable for MVP.

## Phase 1: Setup

- [x] T001 Add report material labels + dashboard Arabic copy to `app/i18n/ar.ts`
- [x] T002 [P] Add `app/lib/api/reports.ts` skeleton (typed return shapes from data-model.md)

## Phase 2: Foundational

- [x] T003 Implement `app/lib/api/reports.ts`: `getOverview()`, `getTrends(from,to)`, `getTopLocations()` over the shared HTTP client
- [x] T004 Create `app/pages/dashboard/DashboardPage.tsx` shell + route `/dashboard` (mounted in the foundation shell, available to both roles)

**Checkpoint**: Data layer + page scaffold ready.

---

## Phase 3: User Story 1 - At-a-glance platform health (Priority: P1) 🎯 MVP

**Goal**: Headline stats + Arabic material breakdown from the overview endpoint.

**Independent Test**: Dashboard shows users/recycles/points and a 5-material breakdown with API counts.

### Tests (OPTIONAL)

- [ ] T005 [P] [US1] Unit test material map (missing key ⇒ 0) in `tests/unit/material-map.test.ts`

### Implementation

- [x] T006 [US1] Build `app/pages/dashboard/OverviewStats.tsx`: StatCards (users/recycles/points) + material PieChart with Arabic labels
- [x] T007 [US1] Wire overview React Query with shared `QueryState` (loading/empty/error+retry)
- [x] T008 [US1] Localized number formatting for large counts/points

**Checkpoint**: Overview section fully functional.

---

## Phase 4: User Story 2 - Explore recycling trends (Priority: P2)

**Goal**: Date-range trends chart with zero-filled days and a 90-day guard.

**Independent Test**: Range change redraws chart; > 90 days → Arabic limit message.

### Tests (OPTIONAL)

- [ ] T009 [P] [US2] Unit test range guard (>90 days + inverted) in `tests/unit/trends-range.test.ts`

### Implementation

- [x] T010 [US2] Build `app/pages/dashboard/TrendsPanel.tsx`: date-range picker (default last 30 days) + LineChart
- [x] T011 [US2] Implement client-side range validation (>90 days, inverted) with Arabic helper; map backend 400 to the Arabic limit message
- [x] T012 [US2] Wire trends React Query keyed by `from`/`to`; accessible chart summary/table fallback

**Checkpoint**: Trends section functional and resilient.

---

## Phase 5: User Story 3 - Top locations (Priority: P3)

**Goal**: Ranked top-locations list including deactivated locations.

**Independent Test**: List ranked descending by recycle_count; inactive locations included.

### Implementation

- [x] T013 [US3] Build `app/pages/dashboard/TopLocations.tsx` (ranked list/table, Arabic empty state)
- [x] T014 [US3] Wire top-locations React Query with shared `QueryState`

**Checkpoint**: All three sections render independently.

---

## Phase 6: Polish & Cross-Cutting

- [x] T015 [P] Per-section manual refresh affordance
- [x] T016 [P] Accessibility pass on charts (aria-labels, focusable legend, table fallback)
- [x] T017 Run quickstart.md walkthrough incl. the section-isolation resilience check

---

## Dependencies & Execution Order

- Setup → Foundational → US1 (P1) → US2 (P2) → US3 (P3) → Polish.
- US1/US2/US3 are independent sections; after Foundational they can be built in parallel.

## Parallel Opportunities

- T002 with T001; the three section components (T006/T010/T013) are independent files.

## Implementation Strategy

- MVP = Setup + Foundational + US1 (a useful dashboard with headline stats). Then add trends, then
  top-locations, then polish.

## Notes

- Reports limited to the three allowed endpoints. STOP after this file — no `/speckit.implement`.
