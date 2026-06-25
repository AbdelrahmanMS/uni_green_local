# Quickstart: Bins Management

> Planning artifact. No code until `/speckit.implement` (not run).

## Prerequisites

- Feature 01 foundation + feature 06 (locations + form-modal pattern). At least one active location.

## Acceptance walkthrough (maps to spec)

1. **US1 Browse**: open `/locations/:id/bins` → bins for that location with material(Arabic)/color/
   status/QR value; inactive distinct; global `/bins` also browsable. (FR-001, FR-002)
2. **US2 Create + QR**: create a bin (material picker shows exactly the five materials) → scannable
   QR renders client-side with raw value + Print; no `qr_code` input on the form; missing/inactive
   location → backend 404 message. (FR-003–FR-006, SC-001, SC-002, SC-005)
3. **US3 Edit/deactivate**: edit material/color → persists, QR unchanged and not editable;
   deactivate → inactive (still listed, unscannable); reactivate via edit. (FR-007, FR-008, SC-003,
   SC-004)

## Test ideas (Vitest + RTL)

- Material picker: exactly 5 options, never cardboard.
- QR renders from a value; print view contains QR + raw value.
- Create payload excludes `qr_code`; edit form has no `qr_code` field.
