# Implementation Plan: Locations Management

**Branch**: `006-locations` | **Date**: 2026-06-24 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/006-locations/spec.md`

## Summary

CRUD-with-soft-delete for recycling locations: list active+inactive (newest first), create/edit via
a validated form, deactivate behind a confirm, reactivate via edit, and a link to each location's
bins. Reuses the foundation kit; forms use react-hook-form + zod. Introduces a reusable
create/edit modal-form pattern shared with bins and admins.

## Technical Context

**Language/Version**: TypeScript 5.x, React 18 (from feature 01).
**Primary Dependencies**: React Query (list query + create/update/delete mutations), react-hook-form
+ zod (coordinate validation), shared kit (`Table`/`Card`, `Input`, `Modal`, `ConfirmModal`,
`Toast`, `QueryState`).
**Storage**: None client-side (server-owned). Query cache invalidated on mutations.
**Testing**: Vitest + RTL for coordinate validation and the soft-delete→reactivate flow.
**Target Platform**: Evergreen browsers, RTL.
**Project Type**: Web application (frontend feature on the foundation).
**Performance Goals**: Create/edit reflect in the list < 1s after success.
**Constraints**: Soft-delete only (no hard delete); coordinate ranges enforced.
**Scale/Scope**: 1 list page + create/edit form + delete confirm; 5 endpoints.

## Constitution Check

| 🔒 Principle | Compliance |
|---|---|
| I. Source of truth | Location data from API; no hardcoded business values. |
| II. Envelopes | Shared interceptor; `error.message` surfaced on failure. |
| III. Auth & RBAC | Both roles; Bearer via shared client. |
| IV. Data conventions | Soft-delete via `DELETE` → `is_active=false`; never hard-deleted. |
| V. Scope (v1) | No permanent deletion; reactivation via edit. |
| VI. RTL/Arabic | Arabic labels/validation/confirm/toast; RTL forms and list. |
| VII. Simplicity | Reuses kit; one thin API module + a shared form-modal pattern. |

**Result**: PASS.

## How this plan follows the attached design

Mirrors the prototype `LocationsPage`: a table/cards of locations with status badges and row
actions (edit/delete), plus a modal create/edit form. Inactive rows use muted styling + an inactive
badge per the design tokens.

### Enhancements over the prototype

1. **Real validation** via zod (name required; lat −90..90; lng −180..180) with inline Arabic errors
   (prototype had none); still surfaces backend `error.message`.
2. **Soft-delete clarity**: confirm dialog explains "deactivate, not delete"; inactive locations
   stay listed and are reactivatable via edit.
3. **Shared form-modal pattern** reused by bins (07) and admins (08).
4. **Optimistic list refresh**: query invalidation after each mutation; toasts for success/failure.
5. **Accessibility**: labelled inputs, focus management in the modal, keyboard-operable row actions.

### Deviations from the design, corrected for the constitution

- "Delete" is a **soft-delete** everywhere; no permanent-delete affordance.
- `error.message` read from the constitution's object-shaped error envelope.

## Project Structure

```text
specs/006-locations/
├── plan.md  research.md  data-model.md  quickstart.md
├── contracts/locations.md
├── checklists/requirements.md
└── tasks.md

app/
├── lib/api/locations.ts        # listLocations(), getLocation(id), createLocation(), updateLocation(), deactivateLocation()
├── lib/validation/location.ts  # zod schema (name, lat, lng)
└── pages/locations/
    ├── LocationsListPage.tsx    # list (active+inactive) + actions + bins link
    └── LocationFormModal.tsx    # shared create/edit modal-form
```

**Structure Decision**: Frontend module under `app/pages/locations/` + `app/lib/api/locations.ts`;
the form-modal + zod-validation pattern is reused by features 07–08.

## Complexity Tracking

No violations — omitted.
