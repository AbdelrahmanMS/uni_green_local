---
description: "Task list for Admin Accounts Management"
---

# Tasks: Admin Accounts Management

**Input**: Design documents from `/specs/008-admin-accounts/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/admins.md, quickstart.md
**Depends on**: Feature 001 (kit + `RequireSuperAdmin` + decoded current-admin id) + Feature 006
(form-modal pattern).

**Tests**: OPTIONAL (self-protection logic; 409/403 message mapping).

## Phase 1: Setup

- [x] T001 Add admins Arabic copy (columns, role labels مشرف/مشرف رئيسي, form labels, 409/403/self-protection messages, confirm/toast) to `app/i18n/ar.ts`
- [x] T002 [P] Add `app/lib/validation/admin.ts` (zod: email, password create-required/edit-optional, full_name, role enum)

## Phase 2: Foundational

- [x] T003 Implement `app/lib/api/admins.ts`: `listAdmins()`, `getAdmin(id)`, `createAdmin()`, `updateAdmin(id,patch)`, `deleteAdmin(id)`
- [x] T004 Add route `/admins` in `app/routes.tsx` behind `RequireSuperAdmin` (hidden in nav for regular admin)

**Checkpoint**: Data layer + guarded route ready.

---

## Phase 3: User Story 1 - Gate + list + create (Priority: P1) 🎯 MVP

**Goal**: super_admin-only list with create; regular admin can't see/reach the area.

**Independent Test**: regular admin → no nav item + redirect; super_admin → list + create; dup email → 409.

### Tests (OPTIONAL)

- [ ] T005 [P] [US1] Unit test guard redirect + 409 mapping in `tests/component/admins-guard.test.tsx`

### Implementation

- [x] T006 [US1] Build `app/pages/admins/AdminsListPage.tsx` (Table: id/email/name/role badge/status/created; no passwords)
- [x] T007 [US1] Wire list React Query with `QueryState`
- [x] T008 [US1] Build `app/pages/admins/AdminFormModal.tsx` (create mode: email+password+full_name; react-hook-form + zod) and wire create mutation; map 409 → Arabic message; invalidate list + toast

**Checkpoint**: Gate + list + create work.

---

## Phase 4: User Story 2 - Edit role/status/password (Priority: P2)

**Goal**: Edit subset of fields; password write-only/optional.

**Independent Test**: Edit another admin's role/status; reset password via optional field; password never shown.

### Implementation

- [x] T009 [US2] Reuse `AdminFormModal` for edit (prefill name/role/status; empty password field = unchanged; password write-only)
- [x] T010 [US2] Wire update mutation; role select (`admin`/`super_admin`); surface `error.message`; invalidate list + toast

**Checkpoint**: Editing works without exposing passwords.

---

## Phase 5: User Story 3 - Delete + self-protection (Priority: P2)

**Goal**: Hard delete with confirm; self cannot deactivate/demote/delete.

**Independent Test**: Delete another admin → removed; own row controls disabled; 403 surfaced.

### Tests (OPTIONAL)

- [ ] T011 [P] [US3] Unit test self-protection (own-row controls disabled by id match) in `tests/unit/admin-self-protect.test.ts`

### Implementation

- [x] T012 [US3] Compute self from decoded current-admin id; disable deactivate/demote/delete on own row with explanatory tooltip
- [x] T013 [US3] Wire delete mutation with ConfirmModal (states permanent hard delete); invalidate list + toast
- [x] T014 [US3] Map API 403 on a self action → Arabic self-protection message; make no change

**Checkpoint**: Destructive actions safe; self-protection enforced UI + API.

---

## Phase 6: Polish & Cross-Cutting

- [x] T015 [P] Empty state; ensure passwords never rendered anywhere
- [x] T016 [P] Accessibility pass (labelled inputs, modal focus, disabled-control reasons announced)
- [x] T017 Run quickstart.md walkthrough incl. gate (regular admin) + self-protection + 409 checks

---

## Dependencies & Execution Order

- Setup → Foundational → US1 (P1) → US2 (P2) → US3 (P2) → Polish.
- US2/US3 reuse the form-modal and the guarded list from US1.

## Parallel Opportunities

- T002 with T001; tests T005/T011 parallel to their UI.

## Implementation Strategy

- MVP = Setup + Foundational + US1 (gate + list + create). Then edit (US2), then delete +
  self-protection (US3), then polish.

## Notes

- super_admin-only; hard delete (soft-delete exception); password write-only; self-protection.
- STOP after this file — no `/speckit.implement`.
