# Implementation Plan: Recycle Sessions Audit

**Branch**: `004-recycle-sessions` | **Date**: 2026-06-24 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-recycle-sessions/spec.md`

## Summary

A read-only, paginated, filterable audit of recycle sessions with server-computed state rendered as
color-coded Arabic badges. Filters: state, material, date range, and `user_id` (deep-linkable from a
student). Reuses the foundation table/badge/pagination and introduces a reusable filter-bar pattern.

## Technical Context

**Language/Version**: TypeScript 5.x, React 18 (from feature 01).
**Primary Dependencies**: React Query (keyed by all filters + page), shared kit (`Table`, `Badge`,
`Pagination`, `Select`, `Input`, `QueryState`), a small reusable `FilterBar` (new shared pattern,
also used by feature 05).
**Storage**: None (read-only). Filter/page state in URL query.
**Testing**: Vitest + RTL for state-badge mapping and filter→query-param composition.
**Target Platform**: Evergreen browsers, RTL.
**Project Type**: Web application (frontend feature on the foundation).
**Performance Goals**: Filtered results perceived < 1.5s.
**Constraints**: Read-only; NO failure_reason here; state is server-computed.
**Scale/Scope**: 1 list page + a filter bar; 1 endpoint.

## Constitution Check

| 🔒 Principle | Compliance |
|---|---|
| I. Source of truth | `state` is server-computed and trusted; no client recomputation of lifecycle. |
| II. Envelopes | Shared interceptor + standard pagination shape. |
| III. Auth & RBAC | Both roles; Bearer via shared client. |
| IV. Data conventions | Materials translated at display (no cardboard); standard pagination. |
| V. Scope (v1) | Read-only audit; failure reasons explicitly excluded (belong to feature 05). |
| VI. RTL/Arabic | Arabic state/material labels and filter UI; RTL table. |
| VII. Simplicity | Reuses kit; thin API module + shared FilterBar. |

**Result**: PASS.

## How this plan follows the attached design

Mirrors the prototype `SessionsPage`: a filter row above a table, with color-coded state badges
(blue/green/red) matching the design's badge tokens.

### Enhancements over the prototype

1. **URL-synced filters + pagination** (prototype filters a static array); shareable/deep-linkable
   investigation links; filters preserved across pages.
2. **Reusable `FilterBar`** component (state/material selects + date range + user_id chip) shared
   with feature 05.
3. **`user_id` deep-link** from a student detail page pre-applies and shows a clearable "viewing one
   student" chip.
4. **Accessibility**: labelled filter controls, badge text not color-only (label + color), keyboard
   navigable rows.
5. **Resilient date inputs**: inverted/invalid ranges blocked client-side with Arabic helper.

### Deviations from the design, corrected for the constitution

- **No failure reasons in this view.** The old design/ADMIN.md hinted at surfacing failures from the
  sessions screen; per the constitution failures come from `/admin/recycles?status=failed` (feature
  05). No `failure_reason` field is read or invented here.
- State labels/colors fixed to the constitution's three values.

## Project Structure

```text
specs/004-recycle-sessions/
├── plan.md  research.md  data-model.md  quickstart.md
├── contracts/sessions.md
├── checklists/requirements.md
└── tasks.md

app/
├── lib/api/sessions.ts        # listSessions({page,limit,user_id,material,state,from_date,to_date})
├── components/FilterBar.tsx   # shared filter pattern (also used by feature 05)
└── pages/sessions/
    └── SessionsListPage.tsx   # filter bar + table + pagination (state in URL)
```

**Structure Decision**: Frontend module under `app/pages/sessions/` + `app/lib/api/sessions.ts`;
`FilterBar` added to the shared kit for reuse by feature 05.

## Complexity Tracking

No violations — omitted.
