---
description: "Task list for Bins Management"
---

# Tasks: Bins Management

**Input**: Design documents from `/specs/007-bins/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/bins.md, quickstart.md
**Depends on**: Feature 001 (kit) + Feature 006 (form-modal pattern; locations link).

**Tests**: OPTIONAL (material picker, QR render, payload-excludes-qr).

## Phase 1: Setup

- [x] T001 Add bins Arabic copy (material labels, color/form labels, confirm/toast, "unscannable when inactive") to `app/i18n/ar.ts`
- [x] T002 [P] Add `app/lib/validation/bin.ts` (zod: location_id required, material enum of five, color)
- [x] T003 [P] Add `qrcode.react` dependency to `package.json`

## Phase 2: Foundational

- [x] T004 Implement `app/lib/api/bins.ts`: `listBins(location_id?)`, `getBin(id)`, `createBin()`, `updateBin(id,patch)`, `deactivateBin(id)` (payloads exclude `qr_code`)
- [x] T005 Add routes `/locations/:id/bins` (scoped) and `/bins` (global) in `app/routes.tsx` (both roles)

**Checkpoint**: Data layer + validation + routes ready.

---

## Phase 3: User Story 1 - Browse bins (Priority: P1) 🎯 MVP

**Goal**: List bins by location (and globally) with QR value shown.

**Independent Test**: Location-scoped list shows material/color/status/QR; inactive distinct.

### Implementation

- [x] T006 [US1] Build `app/pages/bins/BinsListPage.tsx` (Table/Card; localized material; color swatch; inactive styling; QR value column)
- [x] T007 [US1] Wire list React Query (by `location_id` when scoped, else all) with `QueryState`

**Checkpoint**: Browsing works.

---

## Phase 4: User Story 2 - Create a bin with printable QR (Priority: P1)

**Goal**: Create with material enum; render server QR client-side + Print.

**Independent Test**: Create → scannable QR + raw value + Print; no qr_code input; 404 message on bad location.

### Tests (OPTIONAL)

- [ ] T008 [P] [US2] Unit test material picker (exactly 5) + create payload excludes qr_code in `tests/unit/bin-create.test.ts`

### Implementation

- [x] T009 [US2] Build `app/pages/bins/BinFormModal.tsx` (location + material enum picker + color; NO qr_code field; react-hook-form + zod)
- [x] T010 [US2] Build `app/pages/bins/BinQrCard.tsx` (qrcode.react render + raw value + Print view/stylesheet)
- [x] T011 [US2] Wire create mutation; show QR card on success; surface backend 404 `error.message`; invalidate list + toast

**Checkpoint**: Create + QR + print work.

---

## Phase 5: User Story 3 - Edit & deactivate bins (Priority: P2)

**Goal**: Edit subset (QR read-only); soft-delete with confirm; reactivate via edit.

**Independent Test**: Edit material/color persists, QR unchanged/uneditable; deactivate → inactive; reactivate via edit.

### Implementation

- [x] T012 [US3] Reuse `BinFormModal` for edit (prefill; `is_active` toggle; `qr_code` shown read-only, never an input)
- [x] T013 [US3] Wire update + deactivate mutations; ConfirmModal notes "inactive bins can't be scanned"; invalidate list + toast
- [x] T014 [US3] Provide reprint affordance from any row/detail (re-render QR from stored value)

**Checkpoint**: Full lifecycle works; QR always read-only.

---

## Phase 6: Polish & Cross-Cutting

- [x] T015 [P] Empty state + create CTA; print stylesheet polish (QR + raw value + material/color legible)
- [x] T016 [P] Accessibility pass (labelled material/color, QR alt/label, modal focus)
- [x] T017 Run quickstart.md walkthrough incl. client-side-QR-only + qr_code-read-only checks

---

## Dependencies & Execution Order

- Setup → Foundational → US1 (P1) → US2 (P1) → US3 (P2) → Polish.
- `BinQrCard` (T010) used by create (T011) and reprint (T014).

## Parallel Opportunities

- T002/T003 with T001; test T008 parallel to US2 UI.

## Implementation Strategy

- MVP = Setup + Foundational + US1 + US2 (browse + create with printable QR). Then edit/deactivate.

## Notes

- `qr_code` read-only + client-side render only; five materials only; soft-delete only.
- STOP after this file — no `/speckit.implement`.
