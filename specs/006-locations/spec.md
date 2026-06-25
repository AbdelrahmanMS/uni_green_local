# Feature Specification: Locations Management

**Feature Branch**: `006-locations`
**Created**: 2026-06-24
**Status**: Draft
**Input**: User description: "Build the Locations management area: list (active + inactive), create with coordinate validation, edit, soft-delete (deactivate) with confirm, and reactivate. Link to a location's bins."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse locations (Priority: P1)

An administrator views all recycling locations (active and inactive, newest first) with name,
description, coordinates, and status, with deactivated locations visually distinguished.

**Why this priority**: Seeing the infrastructure is the base of the area and the entry point to bins.

**Independent Test**: Open locations → a list shows name, description, coordinates, and an active/
inactive indicator; inactive rows are visually distinct.

**Acceptance Scenarios**:

1. **Given** the locations area, **When** it loads, **Then** all locations (active and inactive) are
   listed newest first with name, description, coordinates, and status.
2. **Given** a deactivated location, **When** the list renders, **Then** it is visually distinguished
   (e.g., muted style + inactive badge) yet still present.
3. **Given** a location row, **When** the admin wants its bins, **Then** an affordance links to that
   location's bins (feature 07).

---

### User Story 2 - Create a location (Priority: P1)

An administrator creates a location via a validated form (name required; latitude −90..90; longitude
−180..180).

**Why this priority**: Without creating locations there are no bins; core to the area.

**Independent Test**: Submit a valid form → the new location appears in the list; invalid
coordinates are blocked client-side and/or the backend error is shown.

**Acceptance Scenarios**:

1. **Given** the create form, **When** the admin submits a valid name + coordinates, **Then** the
   location is created and appears in the list (active).
2. **Given** a missing name, **When** submitting, **Then** a client-side validation message blocks
   the request.
3. **Given** latitude outside −90..90 or longitude outside −180..180, **When** submitting, **Then**
   it is blocked client-side and/or the backend `error.message` is surfaced.

---

### User Story 3 - Edit, deactivate & reactivate (Priority: P2)

An administrator edits a location's fields, deactivates it (soft-delete, with confirmation), and can
reactivate it through edit.

**Why this priority**: Maintenance of existing infrastructure; depends on list/create.

**Independent Test**: Edit a field → it persists; "delete" a location → it becomes inactive (still
listed); reactivate via edit (`is_active=true`).

**Acceptance Scenarios**:

1. **Given** a location, **When** the admin edits any subset of name/description/lat/lng/is_active,
   **Then** the changes persist and reflect in the list.
2. **Given** an active location, **When** the admin chooses delete, **Then** a confirm step is
   required and on confirm it is soft-deleted (`is_active=false`) — still listed, marked inactive.
3. **Given** an inactive location, **When** the admin edits `is_active=true`, **Then** it is
   reactivated.
4. **Given** any failure, **When** it errors, **Then** the Arabic `error.message` is shown.

---

### Edge Cases

- Empty list → Arabic empty state with a prominent "create" affordance.
- Coordinates entered with commas/extra precision → normalized or validated clearly.
- Deleting an already-inactive location → no-op / clear messaging.
- Very long description → truncated in list, full in edit.
- Permanent deletion is NOT offered anywhere.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST list all locations (active and inactive), newest first, showing name,
  description, coordinates, and active status.
- **FR-002**: The system MUST visually distinguish deactivated locations while still listing them.
- **FR-003**: The system MUST create a location via a form with validation: name required, latitude
  in −90..90, longitude in −180..180.
- **FR-004**: The system MUST edit a location via any subset of
  `{ name, description, latitude, longitude, is_active }`.
- **FR-005**: The system MUST soft-delete a location (deactivate → `is_active=false`) behind a
  confirmation step; the location remains listed and reactivatable.
- **FR-006**: The system MUST allow reactivation by editing `is_active=true`.
- **FR-007**: The system MUST surface `error.message` from the error envelope on any failure.
- **FR-008**: The system MUST provide an affordance from a location to its bins (scoped by
  `location_id`, feature 07).
- **FR-009**: The system MUST NOT offer permanent deletion of locations.
- **FR-010**: The area MUST be available to both `admin` and `super_admin`.

### Key Entities *(include if feature involves data)*

- **Location**: `id`, `name`, `description?`, `latitude`, `longitude`, `is_active`, `created_at`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: An admin can create a valid location and see it in the list within 10 seconds.
- **SC-002**: Invalid coordinates never reach a successful create; the user sees a clear Arabic
  validation or backend message 100% of the time.
- **SC-003**: "Deleting" a location only deactivates it — it remains visible (marked inactive) and
  can be reactivated 100% of the time.
- **SC-004**: Deactivated locations are visually distinguishable from active ones in the list.
- **SC-005**: No permanent-delete action exists anywhere in the area.

## Assumptions

- Endpoints per the constitution: `POST/GET /admin/locations`, `GET/PATCH/DELETE
  /admin/locations/:id`; `DELETE` is a soft-delete.
- `GET /admin/locations` returns an array (active + inactive), ordered newest first.
- Reuses the shared table/card, form inputs, confirm-modal, and toast from feature 01; create/edit
  use react-hook-form + zod.
- Coordinates are entered as decimal degrees; a map picker is out of scope for v1 (manual entry).
