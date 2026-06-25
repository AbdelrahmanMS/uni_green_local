# Phase 0 Research: Foundation — Auth & App Shell

## Decision: Stack — React + React Router + axios + React Query

- **Decision**: React 18 + TypeScript, React Router for routing/guards, axios for HTTP, TanStack
  Query for server cache, react-hook-form + zod for forms (from feature 02 on), `jwt-decode` for
  reading the token.
- **Rationale**: This is the constitution's suggested stack (Principle VII) and matches ADMIN.md's
  recommended libraries. The repo is already scaffolded with React Router (`react-router.config.ts`,
  `app/`, `vite.config.ts`). Well-known, low-learning-curve, student-friendly.
- **Alternatives considered**: Next.js (overkill — no SSR/SEO need for an internal admin tool);
  Redux (unnecessary; Query + a tiny auth context suffice); fetch wrapper instead of axios
  (axios interceptors give the cleanest single place to enforce the envelope and Bearer header).

## Decision: Component kit — bespoke in-repo kit over a heavy UI library

- **Decision**: Reproduce the prototype's component set as a small, typed, CSS-variable-themed
  in-repo kit rather than adopting Ant Design / shadcn wholesale.
- **Rationale**: The design is already fully specified by the prototype (exact colors, radii,
  spacing, RTL behavior). A bespoke kit matches it 1:1, keeps the bundle small, and avoids fighting
  a library's theming for RTL+Arabic. The constitution lists shadcn/AntD as *suggestions, not
  mandates*.
- **Alternatives considered**: Ant Design (has RTL + tables/forms but heavy and visually divergent
  from the design); shadcn/ui (great, but its Radix+Tailwind setup is more machinery than a
  graduation project needs to match this specific look). Either remains a valid future swap because
  screens consume the kit's API, not the library directly.

## Decision: Token storage in localStorage

- **Decision**: Persist the `access_token` in `localStorage`; hydrate session on app load by
  decoding it.
- **Rationale**: Spec assumption + ADMIN.md guidance; simplest way to survive refresh for a
  graduation project. The constitution explicitly accepts this simplicity trade-off.
- **Alternatives considered**: httpOnly cookie (more secure but requires backend CORS/cookie
  support not in the locked contract); in-memory only (loses session on refresh — fails FR-011).

## Decision: Role from JWT, not an API call

- **Decision**: Decode the JWT payload (`sub`, `email`, `role`, `exp`) on the client to obtain
  identity and role; check `exp` on load to pre-empt expired sessions.
- **Rationale**: Constitution Principle III — there is no `/admin/auth/me`. Decoding is the only
  source of role. Checking `exp` proactively improves UX (redirect before a doomed request).
- **Alternatives considered**: Trust only the login response `admin` object (lost on refresh);
  call a profile endpoint (does not exist).

## Decision: Envelope handling in one interceptor

- **Decision**: axios response interceptor returns `response.data.data` on success and rejects with
  a normalized `{ code, message }` derived from `error.error.code` / `error.error.message` on
  failure; a `401` triggers token clear + redirect to `/login`.
- **Rationale**: Constitution Principle II (object-shaped error). Centralizing this means screens
  never touch the envelope and downstream features get consistent error text for free.
- **Alternatives considered**: Per-call unwrapping (repetitive, error-prone); reading the
  prototype's string-shaped `error` field (wrong — corrected to the constitution's object shape).

## Decision: RTL + Arabic strategy

- **Decision**: Set `dir="rtl"` and `lang="ar"` on the root; load Tajawal; keep all user-facing
  strings in a single `i18n/ar.ts` map; keep English keys (materials, roles) internal and translate
  at the display layer.
- **Rationale**: Constitution Principle VI; a single string map keeps Arabic copy consistent and
  reviewable, and leaves the door open to future localization without rework.
- **Alternatives considered**: Inline Arabic literals in components (scattered, inconsistent); a
  full i18n framework like i18next (more than v1 needs, but the `ar.ts` map mirrors its shape for an
  easy later upgrade).

## Resolved unknowns

- All Technical Context items are resolved; no NEEDS CLARIFICATION remain.
- Backend availability: the auth endpoint is live per the constitution (no ⏳ gap touches this
  feature).
