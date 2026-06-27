# `app/components/` — Design-System Kit (Reusable UI)

## Purpose
The shared, presentational building blocks every screen is assembled from: buttons, badges, cards,
tables, modals, toasts, filter bars, charts, the QR card, and the icon set. Screens compose these
instead of writing raw markup, so the whole panel looks and behaves consistently.

## Where it sits
The visual layer. `routes/*` screens import these; the components themselves are "dumb" (props in,
UI out) and lean on `lib/i18n` for Arabic labels and `lib/levels` for level styling. They hold no
server logic.

## Key files
| File | What it provides |
|---|---|
| `ui.tsx` | Core primitives: `Button`, `Input`, `Select`, `Card`, `PageHeader`, `Badge`, `StatusBadge`, `Spinner`, level badge (uses `levelInfo`). |
| `Table.tsx` | Generic `Table<T>` — column defs with custom `render`, row click, empty text. |
| `Modal.tsx` | `Modal` (dialog with Escape-to-close) and `ConfirmModal` (destructive-action confirmation). |
| `FilterBar.tsx` | The shared audit filter row (material / state / student) for sessions & recycles. |
| `charts.tsx` | Dependency-free inline-SVG `LineChart` / bar charts (RTL-friendly) for the dashboard. |
| `BinQrCard.tsx` | Renders a bin's QR **client-side** (`qrcode.react`) and prints it. |
| `QueryState.tsx` | One wrapper that renders loading / error / empty / data for any React Query result. |
| `Toast.tsx` | `ToastProvider` + `useToast()` for success/error notifications. |
| `Icon.tsx` | The inline-SVG icon set (`ICONS` map + `<Icon name=… />`). |

## How it works
- Components are styled with **Tailwind v4** utility classes and design tokens (e.g. `bg-primary`,
  `text-ink`) defined in `app.css`.
- **`QueryState`** is the glue between React Query and the UI: a screen passes its query's
  `isLoading/isError/data`, and `QueryState` shows the spinner, an error with retry, an empty state,
  or the children — so no screen re-implements that async UX.
- **`BinQrCard`** generates the QR from the bin's `qr_code` value entirely in the browser and opens a
  print window with a high-resolution canvas.
- **`charts.tsx`** draws SVG by hand (no chart library) and includes accessible text summaries.

## Why we built it this way (and the business reasoning)
- **A small in-house design system, not a UI library.** A consistent, branded admin panel with full
  control over RTL and Arabic typography is easier to achieve with a focused set of own components
  than by bending a heavy third-party kit. It also keeps the bundle small and the code readable for a
  student to study.
- **`QueryState` standardizes async UX.** Loading, error, retry, and empty are the same on every
  screen because they all funnel through one component — users get predictable behavior and
  developers stop copy-pasting boilerplate.
- **Client-side QR generation.** The backend stores only the QR *value* (a UUID); rendering and
  printing the actual QR in the browser (`qrcode.react`) means no image endpoint is needed and staff
  can print a bin label on demand. This is a deliberate constitution decision (no server QR endpoint).
- **Hand-rolled SVG charts.** The dashboard needs only a couple of simple, RTL-correct charts;
  avoiding a charting dependency keeps the app light and the rendering fully controllable.
- **Toast + Modal as context/shared components** give consistent feedback and confirmation for every
  create/edit/delete across the panel.

## Gotchas
- These components are presentational — data fetching and mutations live in the `routes/*` screens,
  not here.
- Arabic labels come from `lib/i18n`; don't hard-code strings inside components.
- `BinQrCard` encodes the raw `qr_code` value — it must match exactly what the backend stored, since
  that's what the mobile app scans on verify.

## Related
- `routes/` — the screens that compose these components.
- `lib/i18n.ts`, `lib/levels.ts` — labels and level styling the components use.
