# Implementation Plan: Admin Accounts Management

**Branch**: `008-admin-accounts` | **Date**: 2026-06-24 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/008-admin-accounts/spec.md`

## Summary

A `super_admin`-only area to list, create, edit (role/status/password), and hard-delete admin
accounts, with the self-protection rule enforced in the UI and surfaced from the API. Reuses the
foundation kit, the `RequireSuperAdmin` guard, and the form-modal pattern from feature 06.

## Technical Context

**Language/Version**: TypeScript 5.x, React 18 (from feature 01).
**Primary Dependencies**: React Query (list + create/update/delete mutations), react-hook-form + zod
(email/password validation), shared kit (`Table`, `Modal`, `ConfirmModal`, `Toast`, `Badge`,
`QueryState`), `RequireSuperAdmin` guard + decoded current-admin id (feature 01).
**Storage**: None client-side. Query cache invalidated on mutations.
**Testing**: Vitest + RTL for the self-protection logic (own row disabling) and the 409/403 message
mapping.
**Target Platform**: Evergreen browsers, RTL.
**Project Type**: Web application (frontend feature on the foundation).
**Performance Goals**: Create/edit/delete reflect in the list < 1s after success.
**Constraints**: super_admin-only; hard delete (not soft); self cannot deactivate/demote/delete;
password write-only.
**Scale/Scope**: 1 list page + create/edit form + delete confirm; 5 endpoints.

## Constitution Check

| 🔒 Principle | Compliance |
|---|---|
| I. Source of truth | Admin data from API; no hardcoded business values. |
| II. Envelopes | Shared interceptor; `error.message` surfaced (409/403). |
| III. Auth & RBAC | super_admin-only via `RequireSuperAdmin`; self-protection (no self deactivate/demote/delete) enforced in UI + 403 surfaced; current id from decoded JWT. |
| IV. Data conventions | Admins are **hard-deleted** (the documented exception to soft-delete). |
| V. Scope (v1) | No soft-delete for admins; scope unchanged otherwise. |
| VI. RTL/Arabic | Arabic labels/role names/validation/confirm/toast; RTL forms + list. |
| VII. Simplicity | Reuses kit + guard + form-modal; one thin API module. |

**Result**: PASS.

## How this plan follows the attached design

Mirrors the prototype `AdminsPage`: a table of admins with role/status badges and row actions
(edit/delete), a create/edit modal, and a confirm dialog. Role labels use Arabic ("مشرف" /
"مشرف رئيسي").

### Enhancements over the prototype

1. **Self-protection in the UI**: deactivate/demote/delete disabled on the current admin's own row
   (compared by decoded JWT id), with a tooltip explaining why; backend 403 surfaced as a fallback.
2. **Validation** via zod (email format; password strength on create; optional password on edit =
   reset only when provided) with inline Arabic errors.
3. **Password is write-only**: never displayed; edit shows an empty "set new password" field.
4. **Clear conflict/permission messaging**: 409 (duplicate email) and 403 (self-protection) mapped
   to specific Arabic messages.
5. **Permanent-delete clarity**: confirm copy states hard delete (contrast with soft-delete areas).
6. **Accessibility**: labelled inputs, modal focus management, disabled-control reasons announced.

### Deviations from the design, corrected for the constitution

- **Hard delete** (not soft) — admins are the exception.
- Error envelope read as the constitution's object shape (`error.message`/`error.code`).

## Project Structure

```text
specs/008-admin-accounts/
├── plan.md  research.md  data-model.md  quickstart.md
├── contracts/admins.md
├── checklists/requirements.md
└── tasks.md

app/
├── lib/api/admins.ts           # listAdmins(), getAdmin(id), createAdmin(), updateAdmin(), deleteAdmin()
├── lib/validation/admin.ts     # zod (email, password create/reset, full_name, role)
└── pages/admins/
    ├── AdminsListPage.tsx       # list + role/status badges + self-aware row actions
    └── AdminFormModal.tsx       # create/edit (password write-only)
```

**Structure Decision**: Frontend module under `app/pages/admins/` + `app/lib/api/admins.ts`, behind
`RequireSuperAdmin`; reuses the feature-06 form-modal pattern and the decoded current-admin id.

## Complexity Tracking

No violations — omitted.
