# Implementation Plan: Bins Management

**Branch**: `007-bins` | **Date**: 2026-06-24 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/007-bins/spec.md`

## Summary

Manage bins per location: list (filter by `location_id`, browsable overall), create with a
server-generated QR rendered client-side (with raw value + Print), edit (QR read-only), and
soft-delete with reactivation. Reuses the foundation kit and the form-modal pattern from feature 06;
adds a client-side QR renderer + print view.

## Technical Context

**Language/Version**: TypeScript 5.x, React 18 (from feature 01).
**Primary Dependencies**: React Query (list by location + mutations), react-hook-form + zod
(material enum + required fields), `qrcode.react` (client-side QR), shared kit + `LocationFormModal`
pattern (feature 06).
**Storage**: None client-side. Query cache invalidated on mutations.
**Testing**: Vitest + RTL for the material-enum picker and QR rendering from a value; print view.
**Target Platform**: Evergreen browsers, RTL; print stylesheet for the QR.
**Project Type**: Web application (frontend feature on the foundation).
**Performance Goals**: QR visible < 3s after create.
**Constraints**: `qr_code` read-only + never sent; five materials only; soft-delete; client-side QR
only (no server QR endpoint).
**Scale/Scope**: 1 bins view (location-scoped + global) + create/edit + QR/print; 5 endpoints.

## Constitution Check

| 🔒 Principle | Compliance |
|---|---|
| I. Source of truth | Bin/QR data from API; QR value never invented; colors/materials from contract. |
| II. Envelopes | Shared interceptor; `error.message` surfaced (e.g., 404 on missing location). |
| III. Auth & RBAC | Both roles; Bearer via shared client. |
| IV. Data conventions | Materials limited to glass/metal/paper/plastic/trash (no cardboard); soft-delete. |
| V. Scope (v1) | No bin-QR endpoint (render client-side); no permanent delete; `qr_code` read-only. |
| VI. RTL/Arabic | Arabic material labels, form/confirm/toast copy; RTL list/forms. |
| VII. Simplicity | Reuses kit + form-modal; one thin API module + a QR component. |

**Result**: PASS.

## How this plan follows the attached design

Mirrors the prototype `BinsPage`: a bins table with material/color/status, a create form, and a QR
display panel (canvas + raw value + Print). Color swatch UI from the prototype's `ColorSwatch`.

### Enhancements over the prototype

1. **Client-side QR via `qrcode.react`** with an accessible alt/label and a dedicated print view
   (print stylesheet shows QR + raw value + material/color) — robust reprint from any row/detail.
2. **Material enum enforced** in the picker + zod (exactly five; no cardboard).
3. **`qr_code` strictly read-only**: shown in list/detail, never an input; never sent on create.
4. **Location-scoped routing** (`/locations/:id/bins`) plus a global bins view; backend 404 message
   surfaced on missing/inactive location.
5. **Accessibility**: labelled color/material controls, focus management, keyboard row actions.

### Deviations from the design, corrected for the constitution

- **No server-side QR-image endpoint** — QR is always rendered client-side from `qr_code`.
- **`qr_code` never editable**; not part of any form payload.
- Soft-delete only; deactivated bins conveyed as unscannable (verify 404).

## Project Structure

```text
specs/007-bins/
├── plan.md  research.md  data-model.md  quickstart.md
├── contracts/bins.md
├── checklists/requirements.md
└── tasks.md

app/
├── lib/api/bins.ts             # listBins(location_id?), getBin(id), createBin(), updateBin(), deactivateBin()
├── lib/validation/bin.ts       # zod schema (location_id, material enum, color)
└── pages/bins/
    ├── BinsListPage.tsx         # list (location-scoped + global) + actions
    ├── BinFormModal.tsx         # create/edit (qr_code excluded)
    └── BinQrCard.tsx            # client-side QR (qrcode.react) + raw value + Print
```

**Structure Decision**: Frontend module under `app/pages/bins/` + `app/lib/api/bins.ts`; reuses the
feature-06 form-modal pattern; reached via `/locations/:id/bins` and a global `/bins`.

## Complexity Tracking

No violations — omitted.
