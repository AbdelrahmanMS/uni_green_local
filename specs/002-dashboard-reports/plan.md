# Implementation Plan: Dashboard & Reports

**Branch**: `002-dashboard-reports` | **Date**: 2026-06-24 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-dashboard-reports/spec.md`

## Summary

Build the dashboard landing area: overview stat cards, a material breakdown, a date-range trends
chart, and a ranked top-locations list. Consumes the three locked report endpoints and reuses the
foundation's HTTP client, design-system kit, and charts.

## Technical Context

**Language/Version**: TypeScript 5.x, React 18 (from feature 01).
**Primary Dependencies**: React Query (per-section queries), the foundation chart components
(`LineChart`/`PieChart`), shared `StatCard`/`Card`/`QueryState`. A lightweight date-range control
(native date inputs or a small picker) — no new heavy dependency required.
**Storage**: None (read-only reports). React Query cache only.
**Testing**: Vitest + RTL for the trends range logic and the 90-day guard.
**Target Platform**: Evergreen browsers, RTL.
**Project Type**: Web application (frontend feature on the foundation).
**Performance Goals**: Headline stats visible < 3s warm; chart re-query feels responsive.
**Constraints**: Reports limited to overview/trends/top-locations; counts come from the API.
**Scale/Scope**: 1 dashboard page, 3 sections, 3 endpoints.

## Constitution Check

| 🔒 Principle | Compliance |
|---|---|
| I. Source of truth | All numbers from `/admin/reports/*`; no client recomputation. |
| II. Envelopes | Uses the foundation interceptor (unwraps `data`, object error). |
| III. Auth & RBAC | Available to both roles; Bearer token via shared client; 401/403 handled centrally. |
| IV. Data conventions | Material keys (glass/metal/paper/plastic/trash) translated at display; no cardboard. |
| V. Scope (v1) | Exactly the 3 allowed reports — no extra analytics. |
| VI. RTL/Arabic | Arabic material labels, Arabic empty/error/limit messages, RTL chart axis order. |
| VII. Simplicity | Reuses foundation kit + charts; no new abstractions. |

**Result**: PASS.

## How this plan follows the attached design

Mirrors the prototype `DashboardPage`: a row of `StatCard`s (icon tile + label + big number), a
trends panel with the area/line chart, a material `PieChart` with legend, and a top-locations
list/table. Colors and chart styling come from the design tokens.

### Enhancements over the prototype

1. **Independent section states**: each section is its own React Query with its own loading/empty/
   error (via shared `QueryState`), so one failure never blanks the page (prototype renders all from
   one static blob).
2. **Accessible chart**: chart has an accessible summary/table fallback and aria-labels; legend is
   keyboard-focusable.
3. **Robust range picker**: prevents inverted ranges and ranges > 90 days client-side, with a clear
   Arabic helper, before the request — still surfaces the backend 400 if it slips through.
4. **Number formatting**: localized thousands separators for large counts/points.
5. **Refetch affordance**: a manual refresh on each section.

### Deviations from the design, corrected for the constitution

- Reports are limited to overview/trends/top-locations (prototype hints at a fuller analytics page;
  trimmed to v1 scope).
- Any "badges/levels as strings" hints in the prototype dashboard are not used here.

## Project Structure

### Documentation (this feature)

```text
specs/002-dashboard-reports/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/reports.md
├── checklists/requirements.md
└── tasks.md
```

### Source Code (additions on the foundation)

```text
app/
├── lib/api/reports.ts        # getOverview(), getTrends(from,to), getTopLocations()
├── pages/dashboard/
│   ├── DashboardPage.tsx     # composes the three sections
│   ├── OverviewStats.tsx     # stat cards + material breakdown (PieChart)
│   ├── TrendsPanel.tsx       # date-range picker + LineChart + 90-day guard
│   └── TopLocations.tsx      # ranked list/table
└── i18n/ar.ts                # (extend) material labels + report copy
```

**Structure Decision**: Frontend feature module under `app/pages/dashboard/` plus a thin
`app/lib/api/reports.ts` over the shared HTTP client. No backend work (all endpoints live).

## Complexity Tracking

No violations — omitted.
