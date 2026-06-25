# Phase 0 Research: Recycle Sessions Audit

## Decision: Trust the server-computed `state`

- **Decision**: Render the `state` field as-is; do not recompute from `used`/`expires_at` on the
  client (the client helper exists only as a fallback documented in ADMIN.md).
- **Rationale**: Constitution Principle I — backend is source of truth; avoids clock-skew bugs.
- **Alternatives**: Recompute client-side (risk of disagreeing with the server; rejected).

## Decision: All filters + page in the URL query

- **Decision**: `state`, `material`, `from_date`, `to_date`, `user_id`, `page` live in the URL;
  React Query key includes them all.
- **Rationale**: Deep-linkable investigations (FR-004), preserved filters across pages (FR-005).
- **Alternatives**: Local state (loses shareability and refresh-survival).

## Decision: Shared `FilterBar` component

- **Decision**: Extract a reusable filter bar (selects + date range + clearable user chip) used here
  and in feature 05.
- **Rationale**: Both audit views need the same pattern; DRY + consistency (Principle VII).
- **Alternatives**: Bespoke filters per page (duplication).

## Decision: Badge is label + color (not color-only)

- **Decision**: State badge always shows the Arabic label alongside its color.
- **Rationale**: Accessibility (color-blind users); SC-002/SC-004.
- **Alternatives**: Color-only chips (inaccessible).

## Resolved unknowns

- Endpoint live; no NEEDS CLARIFICATION. Boundary with feature 05 is explicit (no failure_reason).
