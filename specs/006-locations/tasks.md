---
description: "Task list for Locations Management"
---

# Tasks: Locations Management

**Input**: Design documents from `/specs/006-locations/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/locations.md, quickstart.md
**Depends on**: Feature 001 (kit: Table/Card/Input/Modal/ConfirmModal/Toast/QueryState).

**Tests**: OPTIONAL (zod schema + soft-delete flow).

## Phase 1: Setup

- [x] T001 Add locations Arabic copy (columns, form labels, validation messages, confirm/toast) to `app/i18n/ar.ts`
- [x] T002 [P] Add `app/lib/validation/location.ts` (zod schema: name, latitude −90..90, longitude −180..180)

## Phase 2: Foundational

- [x] T003 Implement `app/lib/api/locations.ts`: `listLocations()`, `getLocation(id)`, `createLocation()`, `updateLocation(id,patch)`, `deactivateLocation(id)`
- [x] T004 Add route `/locations` in `app/routes.tsx` (both roles, inside shell)

**Checkpoint**: Data layer + validation + route ready.

---

## Phase 3: User Story 1 - Browse locations (Priority: P1) 🎯 MVP

**Goal**: List active+inactive, newest first, with bins link.

**Independent Test**: List shows name/description/coords/status; inactive distinct; bins link present.

### Implementation

- [x] T005 [US1] Build `app/pages/locations/LocationsListPage.tsx` (Table/Card; muted style + inactive badge; "view bins" link → `/locations/:id/bins`)
- [x] T006 [US1] Wire list React Query with `QueryState`; order newest first

**Checkpoint**: Browsing works.

---

## Phase 4: User Story 2 - Create a location (Priority: P1)

**Goal**: Validated create form.

**Independent Test**: Valid submit appears in list; invalid coords/name blocked.

### Tests (OPTIONAL)

- [ ] T007 [P] [US2] Unit test zod schema (name required; lat/lng boundaries) in `tests/unit/location-schema.test.ts`

### Implementation

- [x] T008 [US2] Build `app/pages/locations/LocationFormModal.tsx` (shared create/edit modal-form; react-hook-form + zod; inline Arabic errors)
- [x] T009 [US2] Wire create mutation; surface backend `error.message`; invalidate list on success + toast

**Checkpoint**: Create works with validation.

---

## Phase 5: User Story 3 - Edit, deactivate & reactivate (Priority: P2)

**Goal**: Edit subset of fields; soft-delete with confirm; reactivate via edit.

**Independent Test**: Edit persists; delete → inactive (still listed); reactivate via `is_active=true`.

### Tests (OPTIONAL)

- [ ] T010 [P] [US3] Unit test soft-delete then list-contains-inactive in `tests/unit/location-softdelete.test.ts`

### Implementation

- [x] T011 [US3] Reuse `LocationFormModal` for edit (prefill; allow `is_active` toggle for reactivation)
- [x] T012 [US3] Wire update + deactivate mutations; ConfirmModal explains "deactivate, not delete"; invalidate list + toast

**Checkpoint**: Full lifecycle works.

---

## Phase 6: Polish & Cross-Cutting

- [x] T013 [P] Empty state with prominent create CTA; long-description truncation in list
- [x] T014 [P] Accessibility pass (labelled inputs, modal focus management, keyboard row actions)
- [x] T015 Run quickstart.md walkthrough incl. no-permanent-delete scope check

---

## Dependencies & Execution Order

- Setup → Foundational → US1 (P1) → US2 (P1) → US3 (P2) → Polish.
- `LocationFormModal` (T008) is reused for edit (T011) and as a pattern by features 07–08.

## Parallel Opportunities

- T002 with T001; tests T007/T010 parallel to their UI.

## Implementation Strategy

- MVP = Setup + Foundational + US1 + US2 (browse + create). Then edit/deactivate (US3), then polish.

## Notes

- Soft-delete only. STOP after this file — no `/speckit.implement`.
