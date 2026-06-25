# Implementation Plan: Recycle Activities & Failed Attempts

**Branch**: `005-recycle-activities-failures` | **Date**: 2026-06-24 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-recycle-activities-failures/spec.md`

## Summary

A read-only points/activities audit with a Successful/Failed tab. The Successful view
(`status=verified`, default) lists completed recycles with points; the Failed view
(`status=failed`) lists failed verify attempts with a localized reason and no points. Filters
(material, date range, `user_id`) combine with the tab and pagination. Reuses the foundation kit and
the `FilterBar` from feature 04.

## Technical Context

**Language/Version**: TypeScript 5.x, React 18 (from feature 01).
**Primary Dependencies**: React Query (keyed by status tab + filters + page), shared kit + the
`FilterBar` (feature 04).
**Storage**: None (read-only). Tab/filter/page state in URL query.
**Testing**: Vitest + RTL for the failure-reason map, the tab→param logic, and the graceful-degrade
path.
**Target Platform**: Evergreen browsers, RTL.
**Project Type**: Web application (frontend feature on the foundation).
**Performance Goals**: Tab switch + filtered results perceived < 1.5s.
**Constraints**: Read-only; points/materials from API; Failed view depends on the ⏳ backend
addition and MUST degrade gracefully if absent.
**Scale/Scope**: 1 list page with two tabs; 1 endpoint (with the `?status=` extension).

## Constitution Check

| 🔒 Principle | Compliance |
|---|---|
| I. Source of truth | Points/materials/reasons from API; nothing hardcoded. |
| II. Envelopes | Shared interceptor + standard pagination shape. |
| III. Auth & RBAC | Both roles; Bearer via shared client. |
| IV. Data conventions | Materials translated; failure reasons localized at display layer. |
| V. Scope (v1) | Read-only; reports/scope unchanged; respects the single ⏳ gap. |
| VI. RTL/Arabic | Arabic materials, reasons, tab labels, notices; RTL table. |
| VII. Simplicity | Reuses kit + FilterBar; one thin API module. |

**Result**: PASS.

## Backend dependency (⏳)

This is the one feature gated by the constitution's only known backend gap: `/admin/recycles` must
accept `?status=verified|failed` (default `verified`) and return `status` + `failure_reason` per
row. The plan builds the UI to this contract and, per FR-009, **degrades gracefully** if the gap is
unshipped: the Successful view works regardless; the Failed view shows an Arabic "pending backend"
notice (detected by absence of the `status` field / a 400 on `?status=failed`). Flag for the backend
team is in README/quickstart.

## How this plan follows the attached design

Mirrors the prototype `RecyclesPage`: a tab/segment control above a filtered table. The Failed view
adds a reason chip column and hides the points column. Colors/spacing from the design tokens.

### Enhancements over the prototype

1. **Status tab wired to the real `?status=` contract** with URL sync (prototype had only a success
   list).
2. **Graceful degradation** of the Failed view when the backend gap exists (Arabic notice; no crash).
3. **Reused `FilterBar`** (feature 04) — consistent investigation UX; `user_id` deep-link supported.
4. **Reason localization map** with a raw-key fallback for unknown reasons.
5. **Accessibility**: tabs as an ARIA tablist; reason chips carry text not color-only.

### Deviations from the design, corrected for the constitution

- **Failures come from `/admin/recycles?status=failed`**, NOT from the sessions view. No
  `failure_reason` is read from sessions.
- Points hidden (not shown as 0 noise) in the Failed view.

## Project Structure

```text
specs/005-recycle-activities-failures/
├── plan.md  research.md  data-model.md  quickstart.md
├── contracts/recycles.md
├── checklists/requirements.md
└── tasks.md

app/
├── lib/api/recycles.ts        # listRecycles({page,limit,material,user_id,from_date,to_date,status})
└── pages/recycles/
    ├── RecyclesPage.tsx        # status tabs + FilterBar + table + pagination (state in URL)
    └── failureReasons.ts       # reason → Arabic label map (fallback to raw key)
```

**Structure Decision**: Frontend module under `app/pages/recycles/` + `app/lib/api/recycles.ts`;
reuses the shared `FilterBar`.

## Complexity Tracking

No violations — omitted. (The ⏳ dependency is a backend gap, not a constitution violation; handled
via graceful degradation.)
