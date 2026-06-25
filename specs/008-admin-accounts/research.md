# Phase 0 Research: Admin Accounts Management

## Decision: Gate the whole area behind `RequireSuperAdmin`

- **Decision**: Mount the area behind the feature-01 `RequireSuperAdmin` guard; hide the nav item
  for regular `admin`.
- **Rationale**: Constitution Principle III; FR-001/SC-001 (hidden + redirected + API 403).
- **Alternatives**: Client-only hiding (insufficient — direct URL must redirect; API still enforces).

## Decision: Self-protection by comparing decoded JWT id

- **Decision**: Compare each row's `id` to the current admin's `id` (from the decoded token);
  disable deactivate/demote/delete on the own row; surface a 403 message if one still occurs.
- **Rationale**: FR-008/FR-009/SC-003; the backend enforces it unconditionally, the UI mirrors it.
- **Alternatives**: Rely only on the API 403 (worse UX — destructive controls look available).

## Decision: Password is write-only; optional on edit

- **Decision**: Password field is never populated; on edit, leaving it empty means "no change",
  providing a value resets it.
- **Rationale**: FR-005/SC-004; passwords are never returned by the API.
- **Alternatives**: Always require password on edit (forces unnecessary resets).

## Decision: Hard delete with explicit confirm copy

- **Decision**: `DELETE /admin/admins/:id` is a permanent hard delete; the confirm states this.
- **Rationale**: Constitution Principle IV (admins are the soft-delete exception); FR-011/SC-005.
- **Alternatives**: Soft-delete (wrong for admins).

## Decision: Map 409 and 403 to specific Arabic messages

- **Decision**: 409 → "email already exists"; 403 (self) → self-protection message; other failures →
  generic `error.message`.
- **Rationale**: FR-004/FR-009/FR-010 — clear, localized feedback.

## Resolved unknowns

- All five endpoints live; no NEEDS CLARIFICATION.
