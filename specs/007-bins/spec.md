# Feature Specification: Bins Management

**Feature Branch**: `007-bins`
**Created**: 2026-06-24
**Status**: Draft
**Input**: User description: "Build the Bins management area: list by location, create (server generates QR), render the QR client-side with a Print button, edit (qr_code read-only), and soft-delete."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse bins (typically by location) (Priority: P1)

An administrator views bins — usually scoped to one location ("bins at this location"), but also
browsable overall — seeing material (Arabic), color, active status, and the QR value, with
deactivated bins distinguished.

**Why this priority**: Seeing bins is the base of the area and the destination of the location→bins
link.

**Independent Test**: Open bins for a location → a list shows material (Arabic), color, active
status, and the QR value; inactive bins are visually distinct.

**Acceptance Scenarios**:

1. **Given** a location's bins view, **When** it loads, **Then** bins for that `location_id` are
   listed with material (Arabic), color, status, and QR value.
2. **Given** the bins area without a location filter, **When** it loads, **Then** all bins are
   browsable.
3. **Given** a deactivated bin, **When** the list renders, **Then** it is visually distinguished yet
   still present.

---

### User Story 2 - Create a bin with a printable QR (Priority: P1)

An administrator creates a bin (location, material from the five valid values, color); the server
generates the QR, which is then rendered as a scannable image with the raw value and a Print button.

**Why this priority**: Creating bins and printing their QR is the core operational task of the area.

**Independent Test**: Create a bin → a scannable QR renders immediately client-side with the raw
value beneath and a working Print button; the material picker offers only the five valid materials.

**Acceptance Scenarios**:

1. **Given** the create form, **When** the admin submits location + material + color, **Then** the
   bin is created and the server-generated `qr_code` is returned.
2. **Given** a created bin, **When** it renders, **Then** the `qr_code` is shown as a scannable QR
   image (client-side) with the raw value beneath and a Print button.
3. **Given** the material picker, **When** opened, **Then** it offers exactly glass, metal, paper,
   plastic, trash (no cardboard).
4. **Given** a missing/inactive location, **When** creating, **Then** the backend 404 message is
   shown.
5. **Given** the form, **When** it renders, **Then** there is NO field to enter `qr_code` (the
   server generates it).

---

### User Story 3 - Edit & deactivate bins (Priority: P2)

An administrator edits a bin's location/material/color/active status (never the QR), and deactivates
a bin (soft-delete) with reactivation via edit.

**Why this priority**: Maintenance of existing bins; depends on list/create.

**Independent Test**: Edit material/color → persists, QR unchanged and not editable; deactivate →
becomes inactive (still listed); reactivate via edit.

**Acceptance Scenarios**:

1. **Given** a bin, **When** the admin edits any subset of
   `{ location_id, material, color, is_active }`, **Then** the changes persist; `qr_code` is never
   shown as editable.
2. **Given** an active bin, **When** the admin deactivates it, **Then** a confirm step is required
   and on confirm it is soft-deleted (`is_active=false`) — still listed, marked inactive.
3. **Given** an admin, **When** a bin is deactivated, **Then** they understand it can no longer be
   scanned (verify returns 404 for inactive bins).
4. **Given** an inactive bin, **When** the admin edits `is_active=true`, **Then** it is reactivated.

---

### Edge Cases

- No bins for a location → Arabic empty state with a create CTA.
- Reprinting an existing bin's QR from its detail/row → QR re-renders from the stored value.
- Print on a small/odd printer → print view shows QR + raw value + material/color legibly.
- Permanent deletion is NOT offered.
- `qr_code` is read-only everywhere (list shows it; no input ever edits it).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST list bins, filterable by `location_id` (and browsable overall),
  showing material (localized), color, active status, and the QR value.
- **FR-002**: The system MUST visually distinguish deactivated bins while still listing them.
- **FR-003**: The system MUST create a bin via `{ location_id, material, color }`; the material
  picker MUST be limited to glass, metal, paper, plastic, trash (no cardboard).
- **FR-004**: The system MUST NOT send `qr_code` from the form (server-generated).
- **FR-005**: After creation (and on a bin's detail/row), the system MUST render the `qr_code` as a
  scannable QR image client-side, with the raw value shown beneath and a Print button.
- **FR-006**: On a 404 (location missing/inactive) during create, the system MUST show the backend
  message.
- **FR-007**: The system MUST edit a bin via any subset of
  `{ location_id, material, color, is_active }`; `qr_code` MUST never be editable.
- **FR-008**: The system MUST soft-delete a bin (deactivate → `is_active=false`) behind a confirm,
  and allow reactivation via edit; it MUST convey that an inactive bin cannot be scanned.
- **FR-009**: The system MUST surface `error.message` from the error envelope on failures.
- **FR-010**: The system MUST NOT offer permanent deletion or use any server-side QR-image endpoint
  (render client-side).
- **FR-011**: The area MUST be available to both `admin` and `super_admin`.

### Key Entities *(include if feature involves data)*

- **Bin**: `id`, `location_id`, `material` (one of five), `color`, `qr_code` (server-generated
  UUID, read-only), `is_active`, `created_at`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Creating a bin shows a scannable, printable QR within 3 seconds of success.
- **SC-002**: The material picker offers exactly the five valid materials 100% of the time (never
  cardboard).
- **SC-003**: `qr_code` is read-only everywhere — no UI path edits it.
- **SC-004**: "Deleting" a bin only deactivates it — still listed (marked inactive) and
  reactivatable.
- **SC-005**: The QR is always rendered client-side; no server QR-image endpoint is ever called.

## Assumptions

- Endpoints per the constitution: `POST /admin/bins`, `GET /admin/bins?location_id=`,
  `GET/PATCH/DELETE /admin/bins/:id`; `DELETE` is soft-delete.
- QR is rendered client-side (e.g., `qrcode.react`) from the bin's `qr_code` value; there is no
  bin-QR endpoint.
- Reuses the shared table/card, form-modal, confirm-modal, and toast from features 01/06; the bins
  view is typically reached via `/locations/:id/bins`.
- Default color input is a free-text/swatch field (colors are not a fixed enum in the contract).
