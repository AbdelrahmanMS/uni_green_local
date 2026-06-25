# Feature Specification: Foundation — Auth & App Shell

**Feature Branch**: `001-foundation-auth-shell`
**Created**: 2026-06-24
**Status**: Draft
**Input**: User description: "Build the foundation of the UniGreen admin web panel: the application shell, authentication, and role-aware navigation. This is the base every other feature plugs into."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Administrator logs in (Priority: P1)

An administrator opens the panel, is presented with an Arabic, right-to-left login screen, enters
their email and password, and on success lands on the dashboard with a persistent navigation shell.

**Why this priority**: Without login there is no access to anything. This is the entry point and
the minimum viable slice — a working login that lands on an (empty) authenticated shell.

**Independent Test**: Enter valid credentials → reach the authenticated shell; enter invalid
credentials → see a single generic Arabic error; use deactivated-account credentials → see a
distinct "account deactivated" message.

**Acceptance Scenarios**:

1. **Given** a valid admin email/password, **When** the admin submits the login form, **Then** the
   session is established and the admin is routed to the dashboard.
2. **Given** wrong email or wrong password, **When** the admin submits, **Then** one generic Arabic
   error message is shown (the same message for both cases, by design).
3. **Given** a deactivated admin account, **When** the admin submits valid credentials, **Then** a
   distinct Arabic "account deactivated" message is shown and no session is established.
4. **Given** the login screen, **When** it renders, **Then** the layout is right-to-left, all labels
   are Arabic, and the Tajawal font is used.

---

### User Story 2 - Role-aware navigation shell (Priority: P1)

Once authenticated, the administrator sees a persistent shell: a top bar (app name / current page,
current admin identity, logout) and a side navigation. The navigation items shown depend on the
admin's role.

**Why this priority**: Every later feature mounts inside this shell and relies on role-aware nav.
It must exist before any data page.

**Independent Test**: Log in as a regular `admin` → the navigation shows Dashboard, Students,
Sessions, Recycles, Locations, Bins (no Admins). Log in as a `super_admin` → the same plus Admins.

**Acceptance Scenarios**:

1. **Given** a logged-in regular `admin`, **When** the shell renders, **Then** the side nav shows
   Dashboard, Students, Sessions, Recycles, Locations, Bins — and never shows Admins.
2. **Given** a logged-in `super_admin`, **When** the shell renders, **Then** the side nav also shows
   Admins.
3. **Given** any authenticated admin, **When** they view the top bar, **Then** it shows the app name,
   the current admin's name and role label (Arabic), and a logout affordance.
4. **Given** the shell on a narrow viewport, **When** it renders, **Then** navigation remains usable
   (collapsible / responsive) without horizontal overflow.

---

### User Story 3 - Session persistence & route guards (Priority: P2)

The administrator's session survives a page refresh while the token is valid, unauthenticated
visitors are sent to login, and role-restricted routes are protected both in the nav and by URL.

**Why this priority**: Security correctness and a non-frustrating refresh experience. Builds on the
shell but is testable as its own slice.

**Independent Test**: Refresh while logged in → stay logged in. Visit a protected URL while logged
out → redirected to login. As a regular `admin`, visit the Admins URL directly → redirected to the
dashboard.

**Acceptance Scenarios**:

1. **Given** a valid stored session, **When** the page is refreshed, **Then** the admin remains
   logged in and on the same area.
2. **Given** an expired or invalid session, **When** the next request is made, **Then** the session
   is cleared and the admin is bounced to login.
3. **Given** a logged-out visitor, **When** they open any authenticated URL, **Then** they are
   redirected to login.
4. **Given** a regular `admin`, **When** they navigate directly to a `super_admin`-only URL, **Then**
   they are redirected to the dashboard (and the item is absent from nav).
5. **Given** any authenticated admin, **When** they choose logout, **Then** the session is cleared
   and they are returned to login.

---

### User Story 4 - View my profile (Priority: P3)

The administrator can open a read-only view of their own account (name, email, role).

**Why this priority**: Small convenience; depends on the decoded session identity already available
from earlier stories.

**Independent Test**: Open "My profile" → see the current admin's name, email, and role label,
read-only.

**Acceptance Scenarios**:

1. **Given** an authenticated admin, **When** they open "My profile", **Then** they see their own
   name, email, and Arabic role label with no editable fields.

---

### Edge Cases

- **Malformed or undecodable token**: treat as unauthenticated → send to login.
- **Token valid but role missing/unknown**: treat as the least-privileged role (`admin`); never
  reveal `super_admin`-only nav.
- **Network failure during login**: show a friendly Arabic error; do not establish a session.
- **A `403` returned on a request the user reached anyway**: show a friendly "insufficient
  permissions" Arabic message rather than a raw error.
- **Direct navigation to an unknown route**: show an Arabic not-found state inside the shell.
- **Logout from a stale/expired session**: still clears local state and returns to login.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST present a login screen that requires no prior authentication, accepting
  an email and password.
- **FR-002**: On successful login the system MUST establish a session and route the admin to the
  dashboard.
- **FR-003**: On bad credentials the system MUST show a single generic Arabic error; on a deactivated
  account it MUST show a distinct Arabic "account deactivated" message.
- **FR-004**: Every authenticated request MUST carry the admin's bearer token; the system MUST read
  the successful response payload and, on failure, surface the human-readable error message from the
  error envelope.
- **FR-005**: The system MUST determine the current admin's identity and role by decoding the session
  token locally (there is no profile endpoint).
- **FR-006**: On any `401` response the system MUST clear the session and return the admin to login.
- **FR-007**: On any `403` response the system MUST keep the admin in place and show a friendly
  Arabic "insufficient permissions" message; restricted UI MUST be hidden or disabled.
- **FR-008**: The system MUST render a persistent shell with a top bar (app name / current page,
  current admin identity, logout) and a side navigation.
- **FR-009**: The side navigation MUST show Dashboard, Students, Sessions, Recycles, Locations, Bins
  to all admins, and Admins ONLY to `super_admin`.
- **FR-010**: The system MUST guard routes: unauthenticated users are redirected to login;
  `super_admin`-only routes redirect a regular `admin` to the dashboard.
- **FR-011**: A valid session MUST survive a page refresh; an expired/invalid token MUST bounce the
  admin to login on the next request.
- **FR-012**: Logout MUST clear the session and return to login.
- **FR-013**: The system MUST provide a read-only "My profile" view of the current admin.
- **FR-014**: All screens MUST render right-to-left with Arabic labels and the Tajawal typeface.
- **FR-015**: The shell MUST expose the role labels in Arabic ("مشرف" for `admin`, "مشرف رئيسي" for
  `super_admin`).

### Key Entities *(include if feature involves data)*

- **Admin (session identity)**: the currently authenticated administrator — `id`, `email`,
  `full_name`, `role` (`admin` | `super_admin`). Derived from the login response and the decoded
  token; held in app state for the session.
- **Session token**: the bearer credential returned at login; its payload carries `sub` (id),
  `email`, `role`, and expiry. The single source of role information on the client.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: An administrator can log in and reach the authenticated shell in under 30 seconds on a
  first visit.
- **SC-002**: 100% of `super_admin`-only navigation and routes are inaccessible to a regular `admin`
  (hidden in nav AND redirected on direct URL access).
- **SC-003**: A page refresh with a valid session keeps the admin logged in 100% of the time; an
  expired session results in a redirect to login on the next request 100% of the time.
- **SC-004**: Every screen in the shell renders correctly right-to-left in Arabic with no
  left-to-right or untranslated UI chrome.
- **SC-005**: Bad-credential and deactivated-account attempts each produce the correct, distinct
  Arabic message 100% of the time.

## Assumptions

- The login and session model follow the locked backend contract in the constitution
  (`POST /admin/auth/login`, bearer token, JWT-decoded role, no `/admin/auth/me`).
- The token is persisted on the client for refresh survival (e.g., browser storage) consistent with
  the graduation-project simplicity principle; security trade-offs are acceptable for v1.
- Only the empty shell and auth are in scope here; the data pages behind each nav item are delivered
  by features 02–08.
- The visual language (color palette, Tajawal typography, sidebar/top-bar layout, table/card/form/
  badge components) is derived from the attached design prototype and becomes the shared design
  system reused by all later features.
