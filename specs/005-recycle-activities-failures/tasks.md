---
description: "Task list for Recycle Activities & Failed Attempts"
---

# Tasks: Recycle Activities & Failed Attempts

**Input**: Design documents from `/specs/005-recycle-activities-failures/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/recycles.md, quickstart.md
**Depends on**: Feature 001 (kit) + Feature 004 (`FilterBar`).

**Tests**: OPTIONAL (reason map, tab logic, graceful-degrade path).

## Phase 1: Setup

- [x] T001 Add recycles Arabic copy (columns, tab labels Successful/Failed, failure reasons, pending-backend notice) to `app/i18n/ar.ts`
- [x] T002 [P] Add `app/pages/recycles/failureReasons.ts` (reason → Arabic label map + raw-key fallback)

## Phase 2: Foundational

- [x] T003 Implement `app/lib/api/recycles.ts`: `listRecycles({page,limit,material,user_id,from_date,to_date,status})` (typed per data-model.md)
- [x] T004 Add route `/recycles` in `app/routes.tsx` (both roles, inside shell)

**Checkpoint**: Data layer + route ready.

---

## Phase 3: User Story 1 - Audit successful recycles (Priority: P1) 🎯 MVP

**Goal**: Default Successful view with API-sourced points.

**Independent Test**: Default view shows verified activities with all columns; points from API.

### Implementation

- [x] T005 [US1] Build `app/pages/recycles/RecyclesPage.tsx` Successful table (name/email/material/points/location/bin color/created)
- [x] T006 [US1] Wire list React Query keyed by `status=verified`+filters+page with `QueryState` + `Pagination`

**Checkpoint**: Successful audit works (safe baseline, independent of the ⏳ gap).

---

## Phase 4: User Story 2 - Review failed verify attempts (Priority: P2)

**Goal**: Failed tab with localized reasons, hidden points, graceful degradation.

**Independent Test**: Failed tab shows Arabic reason, no points; backend gap → Arabic notice.

### Tests (OPTIONAL)

- [ ] T007 [P] [US2] Unit test reason map + degrade detection in `tests/unit/recycle-failed.test.ts`

### Implementation

- [x] T008 [US2] Add ARIA tablist Successful/Failed; URL-sync `status`; reset page→1 on tab switch (keep filters)
- [x] T009 [US2] Failed view: reason chip column (localized), hide points column
- [x] T010 [US2] Graceful degradation: detect 400-on-`status=failed` / missing `status` field → Arabic "pending backend" notice; keep Successful working

**Checkpoint**: Both tabs functional or degraded cleanly.

---

## Phase 5: User Story 3 - Filter activities (Priority: P2)

**Goal**: material/date/user_id filters combined with tab + pagination.

**Independent Test**: Filters narrow within the active tab; user_id deep-link pre-filters; all combine.

### Implementation

- [x] T011 [US3] Integrate shared `FilterBar`; bind material/date/user_id to URL; pre-apply incoming `user_id` with clearable chip
- [x] T012 [US3] Ensure filter changes reset page→1 and retain the active tab; client-side date validation

**Checkpoint**: Filtering + tab + pagination combine correctly.

---

## Phase 6: Polish & Cross-Cutting

- [x] T013 [P] Empty/error states per tab in Arabic; hide pagination when empty
- [x] T014 [P] Accessibility pass (tablist semantics, non-color-only reason chips)
- [x] T015 Add README/quickstart note flagging the ⏳ backend `?status=` requirement for the BE team
- [x] T016 Run quickstart.md walkthrough incl. the degradation path

---

## Dependencies & Execution Order

- Setup → Foundational → US1 (P1) → US2 (P2) → US3 (P2) → Polish.
- US1 is independent of the ⏳ gap; US2 depends on it but degrades gracefully.

## Parallel Opportunities

- T002 with T001; T007 parallel to US2 UI.

## Implementation Strategy

- MVP = Setup + Foundational + US1 (Successful audit). Then Failed tab (US2) + filters (US3).

## Notes

- Failures come from `/admin/recycles?status=failed`, never from sessions. Read-only.
- STOP after this file — no `/speckit.implement`.
