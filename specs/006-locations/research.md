# Phase 0 Research: Locations Management

## Decision: react-hook-form + zod for the create/edit form

- **Decision**: Use react-hook-form with a zod schema (name required; latitude −90..90; longitude
  −180..180) in a shared modal form.
- **Rationale**: Constitution-suggested stack; declarative validation with inline Arabic errors;
  reused by bins/admins.
- **Alternatives**: Manual state + ad-hoc checks (error-prone, duplicated).

## Decision: Soft-delete with explicit confirm copy

- **Decision**: `DELETE /admin/locations/:id` is presented as "deactivate"; the confirm dialog states
  it remains in history and can be reactivated.
- **Rationale**: Constitution Principle IV (soft-delete) + clear UX (SC-003); historical activity
  references locations.
- **Alternatives**: Hard delete (forbidden); hiding inactive (they must remain visible).

## Decision: Reactivate via edit, not a separate endpoint

- **Decision**: Reactivation is `PATCH { is_active: true }` through the edit form.
- **Rationale**: Matches the contract (no dedicated reactivate endpoint).
- **Alternatives**: A reactivate button calling DELETE-inverse (no such endpoint).

## Decision: Manual coordinate entry (no map picker in v1)

- **Decision**: Decimal-degree numeric inputs; no embedded map.
- **Rationale**: Simplicity (Principle VII); a map picker is a future enhancement.
- **Alternatives**: Leaflet/Google Maps picker (scope creep for v1).

## Decision: Invalidate list query after mutations

- **Decision**: After create/update/deactivate, invalidate the locations query so the list reflects
  changes.
- **Rationale**: Correctness over hand-rolled cache edits; list stays authoritative.

## Resolved unknowns

- All five endpoints live; no NEEDS CLARIFICATION.
