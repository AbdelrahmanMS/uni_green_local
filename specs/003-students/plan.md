# Implementation Plan: Students Management

**Branch**: `003-students` | **Date**: 2026-06-24 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-students/spec.md`

## Summary

A paginated, searchable students list; a student detail view (initials avatar, level badge, points,
join date, status); and an activate/deactivate moderation action. Reuses the foundation's table,
badge, pagination, confirm-modal, toast, and the shared int→level mapping.

## Technical Context

**Language/Version**: TypeScript 5.x, React 18 (from feature 01).
**Primary Dependencies**: React Query (list keyed by page+search; detail by id; mutation for
toggle), shared kit (`Table`, `Badge`, `Pagination`, `ConfirmModal`, `Toast`, `QueryState`),
`levels.ts` mapping.
**Storage**: None (server-owned). Query cache + optimistic-ish update on toggle.
**Testing**: Vitest + RTL for the level-badge mapping (incl. 0) and the toggle flow.
**Target Platform**: Evergreen browsers, RTL.
**Project Type**: Web application (frontend feature on the foundation).
**Performance Goals**: Search results perceived < 1s; toggle reflects immediately.
**Constraints**: Only `is_active` is writable; no points edit, no delete, no badges.
**Scale/Scope**: 1 list page + 1 detail page + 1 mutation; 3 endpoints.

## Constitution Check

| 🔒 Principle | Compliance |
|---|---|
| I. Source of truth | Points/level/status from API; no business values hardcoded. |
| II. Envelopes | Shared interceptor unwraps `data`; pagination read as `data.data[]/total/page/limit`. |
| III. Auth & RBAC | Both roles; Bearer via shared client; 401/403 handled centrally. |
| IV. Data conventions | Level is an int 0–4 → label+color (0=Rookie handled); standard pagination shape. |
| V. Scope (v1) | No points editing, no student delete, no badges UI (FR-006/FR-011). |
| VI. RTL/Arabic | Arabic columns, level labels, confirm/toast copy; RTL table. |
| VII. Simplicity | Reuses foundation kit; thin API module. |

**Result**: PASS.

## How this plan follows the attached design

Mirrors the prototype `StudentsPage` (search box + table + pagination) and `StudentDetailPage`
(profile header + stat tiles). Level badges use the design's badge color tokens
(bronze/silver/gold/platinum + gray for Rookie/unknown).

### Enhancements over the prototype

1. **Server-side search + pagination** wired to the real contract (prototype filters a static
   array); debounced input; page resets to 1 on new search; search preserved across pages.
2. **Initials avatar** generated from `display_name` (prototype assumed `photo_url`).
3. **Safe toggle**: confirm-before-deactivate, request-in-flight guard against double submit,
   immediate status reflection with rollback + Arabic error on failure.
4. **Accessibility**: sortable/keyboard-navigable rows, labelled search, focus return after modal.
5. **Deep-link friendly**: list state (page/search) in the URL query; detail by `/students/:id`.

### Deviations from the design, corrected for the constitution

- **Level is an integer**, rendered via the shared map with **Rookie (0)** — the prototype showed
  string levels with no Rookie.
- **No badges section** in detail even though the response carries an (empty) `badges` array.
- **No points-edit and no delete** affordances anywhere.
- Field is `display_name`; `photo_url` is ignored (initials avatar).

## Project Structure

```text
specs/003-students/
├── plan.md  research.md  data-model.md  quickstart.md
├── contracts/students.md
├── checklists/requirements.md
└── tasks.md

app/
├── lib/api/students.ts        # listStudents({page,limit,search}), getStudent(id), setActive(id,is_active)
├── pages/students/
│   ├── StudentsListPage.tsx   # search + table + pagination (state in URL)
│   ├── StudentDetailPage.tsx  # profile header + stats + status toggle
│   └── StatusToggle.tsx       # confirm + mutation + toast
└── components/Avatar.tsx       # initials avatar (shared addition)
```

**Structure Decision**: Frontend module under `app/pages/students/` + `app/lib/api/students.ts`.
`Avatar` is added to the shared kit for reuse (admins area also uses initials).

## Complexity Tracking

No violations — omitted.
