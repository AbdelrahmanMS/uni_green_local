# Feature Specification: Admin Accounts Management

**Feature Branch**: `008-admin-accounts`
**Created**: 2026-06-24
**Status**: Draft
**Input**: User description: "Build the Admin Accounts management area (super_admin only): list, create, edit role/status/password, hard delete with confirm, and the self-protection rule (cannot deactivate/demote/delete self)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Super admin manages the admin list (Priority: P1)

A `super_admin` views all admin accounts (id, email, full name, role, active status, created date)
and creates new ones; a regular `admin` cannot see or reach this area at all.

**Why this priority**: The whole area is gated and the list+create is its core; without the guard
and the list, nothing else applies.

**Independent Test**: As `super_admin`, open admins → a list renders and a new admin can be created.
As a regular `admin`, the Admins item is absent from nav and the URL redirects to the dashboard.

**Acceptance Scenarios**:

1. **Given** a regular `admin`, **When** they look at the nav or navigate to the admins URL,
   **Then** the item is hidden and the URL redirects them to the dashboard (and the API returns 403
   if reached).
2. **Given** a `super_admin`, **When** they open the area, **Then** a list shows id/email/full name/
   role/active status/created date (passwords never shown).
3. **Given** the create form, **When** a `super_admin` submits email + password + full name, **Then**
   a new admin (role defaults to `admin`) is created and appears immediately in the list.
4. **Given** a duplicate email, **When** creating, **Then** the 409 message is shown clearly.

---

### User Story 2 - Edit role, status, and reset password (Priority: P2)

A `super_admin` edits an admin's full name, role (`admin`/`super_admin`), active status, or resets
their password.

**Why this priority**: Team administration; depends on the list/area existing.

**Independent Test**: Edit another admin's role to `super_admin` → persists; set a new password
(optional field) → succeeds without exposing the password.

**Acceptance Scenarios**:

1. **Given** an admin (not self), **When** the `super_admin` edits any subset of
   `{ full_name, role, is_active, password }`, **Then** the changes persist; password is write-only.
2. **Given** an empty password field on edit, **When** saving, **Then** the password is left
   unchanged (optional = reset only when provided).
3. **Given** a role change to `super_admin`/`admin`, **When** saved, **Then** the new role reflects
   in the list.

---

### User Story 3 - Delete admins with self-protection (Priority: P2)

A `super_admin` hard-deletes another admin (with confirmation) but can never deactivate, demote, or
delete their own account; those actions are UI-disabled on their own row and the API enforces 403.

**Why this priority**: Destructive action + the safety rule; depends on the list.

**Independent Test**: Delete another admin (confirm) → removed from the list. On the current admin's
own row, deactivate/demote/delete are disabled; if a 403 still occurs it is surfaced.

**Acceptance Scenarios**:

1. **Given** another admin, **When** the `super_admin` deletes them, **Then** a confirm step is
   required and on confirm the admin is hard-deleted (removed from the list).
2. **Given** the current `super_admin`'s own row, **When** it renders, **Then** deactivate, demote
   (role change away from super_admin), and delete are disabled for self.
3. **Given** a self-modifying action that still reaches the API, **When** it returns 403, **Then**
   the Arabic self-protection message is surfaced and no change is made.

---

### Edge Cases

- Creating an admin with a weak/empty password → client-side validation blocks it.
- Editing self via a crafted request → backend 403; UI shows the self-protection message.
- Deleting the last super_admin (if it's another account) → backend governs; surface any error.
- Email format invalid → client-side validation.
- Hard delete is permanent (unlike locations/bins) — the confirm copy makes this explicit.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The entire area MUST be restricted to `super_admin`: hidden in nav for regular
  `admin`, redirected away on direct URL access, and the API returns 403.
- **FR-002**: The system MUST list admins with id, email, full name, role, active status, and
  created date; passwords MUST never be displayed.
- **FR-003**: The system MUST create an admin via `{ email, password, full_name }`; new accounts
  default to role `admin`.
- **FR-004**: On a 409 (email already exists) during create, the system MUST show a clear message.
- **FR-005**: The system MUST edit an admin via any subset of
  `{ full_name, role, is_active, password }`; `password` is optional (reset only when provided) and
  write-only.
- **FR-006**: The system MUST allow setting role to `admin` or `super_admin`.
- **FR-007**: The system MUST hard-delete an admin (with a confirmation that states it is
  permanent).
- **FR-008**: The system MUST enforce self-protection in the UI: deactivate, demote, and delete are
  disabled on the current admin's own row.
- **FR-009**: If a self-modifying action still reaches the API and returns 403, the system MUST
  surface the Arabic self-protection message and make no change.
- **FR-010**: The system MUST surface `error.message` from the error envelope on failures.
- **FR-011**: Admins are hard-deleted (NOT soft-deleted) — this is the documented exception to the
  soft-delete rule.

### Key Entities *(include if feature involves data)*

- **AdminAccount**: `id`, `email`, `full_name`, `role` (`admin`|`super_admin`), `is_active`,
  `created_at`. Password is write-only (create/reset), never returned.
- **Current admin**: the logged-in `super_admin` (from the decoded token) — compared by `id` to
  enforce self-protection.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A regular `admin` can never see or reach this area (hidden in nav AND redirected on
  direct URL) 100% of the time.
- **SC-002**: A `super_admin` can create a new admin and see it in the list within 10 seconds; a
  duplicate email always shows the 409 message.
- **SC-003**: The current admin can never deactivate, demote, or delete themselves — controls are
  disabled and any 403 is surfaced as the self-protection message 100% of the time.
- **SC-004**: Passwords are never displayed anywhere; password reset works without revealing the
  value.
- **SC-005**: Deleting another admin removes them from the list (hard delete) and the confirm copy
  makes permanence explicit.

## Assumptions

- Endpoints per the constitution: `POST/GET /admin/admins`, `GET/PATCH/DELETE /admin/admins/:id`;
  `PATCH`/`DELETE` return 403 on self.
- The current admin's `id` comes from the decoded JWT (feature 01) for self comparison.
- Reuses the shared table, form-modal, confirm-modal, and toast; create/edit use react-hook-form +
  zod; this area sits behind the `RequireSuperAdmin` guard from feature 01.
- Admins are hard-deleted (the documented exception to soft-delete).
