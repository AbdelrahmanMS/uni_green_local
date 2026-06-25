# Phase 0 Research: Dashboard & Reports

## Decision: One React Query per section

- **Decision**: Separate queries for overview, trends, and top-locations.
- **Rationale**: Satisfies FR-007/SC-005 (independent loading/empty/error; one failure must not
  blank others). Each section can refetch on its own.
- **Alternatives**: Single combined fetch (a failure blanks everything; rejected).

## Decision: Date-range control without a heavy dependency

- **Decision**: Use native `<input type="date">` pair (or a tiny presets control: last 7/30/90
  days) bound to `from`/`to` ISO strings; default to last 30 days.
- **Rationale**: Simplicity (Principle VII); avoids a date-picker dependency; native inputs are
  accessible and localizable.
- **Alternatives**: react-day-picker / antd RangePicker (more weight than needed for v1).

## Decision: 90-day guard client-side AND server-aware

- **Decision**: Block ranges > 90 days (and inverted ranges) before calling; still translate a
  backend 400 into the Arabic limit message if it occurs.
- **Rationale**: FR-005/SC-003 — never show a raw error; the backend is the final authority.
- **Alternatives**: Rely only on the backend 400 (worse UX, a wasted round-trip).

## Decision: Reuse foundation charts

- **Decision**: Use `LineChart` for trends and `PieChart` for the material breakdown from the
  feature-01 kit; add an accessible table fallback.
- **Rationale**: Visual consistency + accessibility enhancement; no new chart lib.
- **Alternatives**: Recharts (allowed by the constitution; deferred — the kit charts match the
  design and are lighter. Recharts remains an easy swap if richer interactivity is needed later).

## Resolved unknowns

- All endpoints are live; no NEEDS CLARIFICATION remain.
