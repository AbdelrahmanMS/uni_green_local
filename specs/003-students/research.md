# Phase 0 Research: Students Management

## Decision: List state (page + search) lives in the URL query

- **Decision**: Keep `page` and `search` in the URL query string; React Query key = `[students,
  page, search]`.
- **Rationale**: Deep-linkable, back-button friendly, preserves search across pages (FR-003);
  trivial with React Router.
- **Alternatives**: Local component state only (loses state on refresh/navigation).

## Decision: Debounced server-side search, reset to page 1

- **Decision**: Debounce input (~300ms); on new term reset page to 1.
- **Rationale**: Search is server-side (FR-002); debounce avoids a request per keystroke.
- **Alternatives**: Client-side filter (wrong — dataset is paginated server-side).

## Decision: Toggle as a mutation with immediate reflection + rollback

- **Decision**: `PATCH /admin/users/:id { is_active }` via a React Query mutation; reflect the new
  status immediately and roll back + show Arabic error on failure; guard against double submit.
- **Rationale**: FR-009/FR-010/SC-004; only `is_active` is sent (FR-007).
- **Alternatives**: Full list refetch on toggle (slower, loses scroll/page).

## Decision: Initials avatar, integer level

- **Decision**: Generate an initials avatar from `display_name`; render level via the shared
  `levels.ts` map (0=Rookie…4=Platinum, unknown→gray).
- **Rationale**: Locked contract has no photo and uses an integer level; corrects the prototype.
- **Alternatives**: `photo_url` (not in contract); string level (not in contract).

## Resolved unknowns

- All three endpoints are live; no NEEDS CLARIFICATION remain.
