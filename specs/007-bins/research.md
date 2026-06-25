# Phase 0 Research: Bins Management

## Decision: Client-side QR with `qrcode.react`

- **Decision**: Render the bin's `qr_code` value as a QR via `qrcode.react`; provide a print view.
- **Rationale**: Constitution scope (no bin-QR endpoint; render client-side); ADMIN.md suggests this
  library. Lightweight and offline.
- **Alternatives**: Server QR image (forbidden in v1); other QR libs (qrcode.react is the suggested,
  React-native option).

## Decision: `qr_code` is read-only and never in a form payload

- **Decision**: Display `qr_code` in list/detail; exclude it from create and edit payloads/inputs.
- **Rationale**: Server generates it (FR-004/FR-007/SC-003).
- **Alternatives**: Editable QR (wrong — would desync physical labels).

## Decision: Material as a zod enum

- **Decision**: `material ∈ {glass, metal, paper, plastic, trash}` enforced in the picker and schema.
- **Rationale**: Constitution Principle IV (no cardboard); SC-002.
- **Alternatives**: Free text (allows invalid materials).

## Decision: Color as a free-text/swatch field

- **Decision**: Color is a string (swatch + text), not a fixed enum.
- **Rationale**: The contract treats `color` as a free string; matches the prototype's `ColorSwatch`.
- **Alternatives**: Fixed color enum (not in the contract).

## Decision: Location-scoped + global routing

- **Decision**: `/locations/:id/bins` (scoped via `?location_id=`) and a global `/bins`.
- **Rationale**: FR-001; reached from the locations link (feature 06) but also browsable.

## Decision: Print via a dedicated print view/stylesheet

- **Decision**: A print layout shows QR + raw value + material/color; `window.print()`.
- **Rationale**: Operational need (stick label on bin); reliable across printers.

## Resolved unknowns

- All five endpoints live; no NEEDS CLARIFICATION.
