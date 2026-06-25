# Feature Specification: Dashboard & Reports

**Feature Branch**: `002-dashboard-reports`
**Created**: 2026-06-24
**Status**: Draft
**Input**: User description: "Build the Dashboard / Reports area of the UniGreen admin panel: overview stat cards, a trends chart with a date-range picker, and a top-locations list."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - At-a-glance platform health (Priority: P1)

An administrator opens the dashboard and immediately sees headline numbers — total users, total
recycles, total points awarded — plus a per-material breakdown (glass, metal, paper, plastic,
trash) with Arabic labels.

**Why this priority**: This is the landing page after login and the single most-used screen. It
delivers value on its own even without trends or rankings.

**Independent Test**: Open the dashboard → four summary stats render from the overview endpoint and
a material breakdown shows Arabic material names with counts straight from the API.

**Acceptance Scenarios**:

1. **Given** an authenticated admin, **When** the dashboard loads, **Then** stat cards show total
   users, total recycles, and total points awarded.
2. **Given** the overview data, **When** the material breakdown renders, **Then** each of the five
   materials shows its Arabic label and its count from `by_material`.
3. **Given** the overview is loading, **When** the request is in flight, **Then** a loading state is
   shown; on error, an Arabic error with retry is shown.

---

### User Story 2 - Explore recycling trends over time (Priority: P2)

An administrator picks a date range (default: last 30 days) and sees a chart of daily recycle
counts, with every day in the range present (zero-filled).

**Why this priority**: Engagement-over-time is the core analytical value, but it depends on the
page existing and is secondary to the headline stats.

**Independent Test**: Change the date range → the chart re-queries and redraws; a range over 90 days
shows a clear Arabic message instead of a chart.

**Acceptance Scenarios**:

1. **Given** the dashboard, **When** it first loads, **Then** the trends chart defaults to the last
   30 days.
2. **Given** a selected valid range, **When** it changes, **Then** the chart updates to daily counts
   for that range, including zero days.
3. **Given** a range longer than 90 days, **When** it is applied, **Then** the backend rejects it
   and the UI shows a friendly Arabic "max 90 days" message rather than an error dump.
4. **Given** an empty range result, **When** it renders, **Then** an Arabic empty state is shown.

---

### User Story 3 - See which locations perform best (Priority: P3)

An administrator views a ranked list of locations by recycling volume, including deactivated ones.

**Why this priority**: Useful operational insight, but the least critical of the three sections.

**Independent Test**: View the top-locations section → locations appear ranked by `recycle_count`
descending, including inactive locations.

**Acceptance Scenarios**:

1. **Given** the dashboard, **When** the top-locations section loads, **Then** locations are listed
   with name and recycle count, ranked descending.
2. **Given** a deactivated location with activity, **When** the list renders, **Then** it still
   appears in the ranking.
3. **Given** no locations, **When** the section renders, **Then** an Arabic empty state is shown.

---

### Edge Cases

- Overview returns zeros across the board (new platform) → render zeros, not blanks.
- Trends `from`/`to` inverted or invalid → block client-side and/or surface the backend 400 message.
- A material key missing from `by_material` → treat as 0 (never crash).
- Each section loads/fails independently — one failing section must not blank the others.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The dashboard MUST display total users, total recycles, and total points awarded from
  the overview report.
- **FR-002**: The dashboard MUST display a per-material breakdown for glass, metal, paper, plastic,
  and trash, each with an Arabic label and the count from the API.
- **FR-003**: The dashboard MUST provide a date-range picker for trends defaulting to the last 30
  days.
- **FR-004**: The trends chart MUST show daily recycle counts for the selected range, including
  zero-filled days.
- **FR-005**: When a trends range exceeds 90 days, the system MUST surface a friendly Arabic message
  (reflecting the backend's 400) instead of a raw error.
- **FR-006**: The system MUST display a top-locations list ranked by recycle count descending,
  including deactivated locations.
- **FR-007**: Each of the three sections MUST have independent loading, empty, and error states
  using the shared error handling and Arabic copy.
- **FR-008**: All numeric values MUST come straight from the API (no client-side recomputation of
  business values).
- **FR-009**: The area MUST be available to both `admin` and `super_admin`.

### Key Entities *(include if feature involves data)*

- **Overview**: totals (`total_users`, `total_recycles`, `total_points_awarded`) and `by_material`
  map (glass/metal/paper/plastic/trash → count).
- **TrendPoint**: a `{ date, count }` pair; the series is zero-filled across the selected range.
- **TopLocation**: `{ id, name, recycle_count }`, ranked descending.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: From login, an admin sees headline platform stats within 3 seconds on a warm cache.
- **SC-002**: Changing the date range re-renders the trends chart for the new range 100% of the
  time, including correct zero-filled days.
- **SC-003**: A >90-day range never shows a raw/technical error; it always shows the Arabic limit
  message.
- **SC-004**: All material labels render in Arabic and all counts match the API exactly.
- **SC-005**: A failure in any one section leaves the other two fully usable.

## Assumptions

- Endpoints follow the constitution: `GET /admin/reports/overview`, `/trends?from=&to=`,
  `/top-locations`; reports are limited to these three (no other reports in v1).
- The chart and material visualization reuse the shared chart components from feature 01.
- Date inputs use ISO-8601 (`from`/`to`); the picker prevents obviously invalid ranges before
  calling the API.
