# Quickstart: Admin Accounts Management

> Planning artifact. No code until `/speckit.implement` (not run).

## Prerequisites

- Feature 01 foundation (incl. `RequireSuperAdmin` + decoded current-admin id). Two admin accounts
  (at least one `super_admin`).

## Acceptance walkthrough (maps to spec)

1. **US1 Gate + list + create**: as regular `admin`, the Admins nav item is absent and `/admins`
   redirects to dashboard. As `super_admin`, list shows id/email/name/role/status/created (no
   passwords); create a new admin (defaults to `admin`); duplicate email → 409 message.
   (FR-001–FR-004, SC-001, SC-002)
2. **US2 Edit**: edit another admin's name/role/status; reset password via optional field (empty =
   unchanged); password never displayed. (FR-005, FR-006, SC-004)
3. **US3 Delete + self-protection**: delete another admin (confirm: permanent) → removed. On own
   row, deactivate/demote/delete disabled; any API 403 → Arabic self-protection message.
   (FR-007–FR-009, FR-011, SC-003, SC-005)

## Test ideas (Vitest + RTL)

- Self-protection: own row disables deactivate/demote/delete (id match from decoded token).
- 409 → duplicate-email message; 403(self) → self-protection message.
- Edit payload omits password when the field is empty.
