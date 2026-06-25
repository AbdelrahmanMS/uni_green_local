# Phase 0 Research: Recycle Activities & Failed Attempts

## Decision: Single endpoint, status as a tab parameter

- **Decision**: Both tabs hit `GET /admin/recycles` with `status=verified|failed`; the tab is part
  of the React Query key and the URL.
- **Rationale**: Matches the ⏳ contract (default `verified`); one API module, two views.
- **Alternatives**: Two endpoints (don't exist); client-side split (the backend filters by status).

## Decision: Graceful degradation of the Failed view

- **Decision**: Detect the unshipped backend gap (a 400 on `?status=failed`, or rows lacking a
  `status` field) and render an Arabic "pending backend" notice; keep the Successful view fully
  working.
- **Rationale**: FR-009/SC-004 — the single known gap must not break the default audit.
- **Alternatives**: Hide the Failed tab entirely (less transparent); show a raw error (poor UX).

## Decision: Failure-reason localization with raw-key fallback

- **Decision**: Map `material_mismatch | expired | already_used | bin_not_found` to Arabic phrases;
  unknown reasons fall back to the raw key chip.
- **Rationale**: Readable audits (FR-004) without crashing on new/unknown reasons.
- **Alternatives**: Show raw enum always (not user-friendly).

## Decision: Hide points in the Failed view

- **Decision**: Omit the points column when `status=failed` (always 0).
- **Rationale**: Avoids misleading "0 points" noise (FR-004).
- **Alternatives**: Show 0 (clutter).

## Decision: Reuse `FilterBar` and `user_id` deep-link

- **Decision**: Reuse the feature-04 filter bar; accept incoming `user_id`.
- **Rationale**: Consistency + DRY; investigation from a student detail page.

## Resolved unknowns

- Only unknown is the ⏳ backend addition; handled by graceful degradation rather than blocking.
