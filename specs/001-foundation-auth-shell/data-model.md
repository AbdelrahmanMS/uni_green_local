# Phase 1 Data Model: Foundation — Auth & App Shell

These are **client-side** shapes (the backend owns persistence). They mirror the locked contract.

## Entity: AdminSession (current admin)

Derived from the login response `admin` object and/or the decoded JWT.

| Field | Type | Source | Notes |
|---|---|---|---|
| `id` | string (uuid) | JWT `sub` / login `admin.id` | |
| `email` | string | JWT `email` / login `admin.email` | |
| `full_name` | string | login `admin.full_name` | Not always in the token; kept from login response. |
| `role` | `'admin' \| 'super_admin'` | JWT `role` | Unknown/missing → treated as `'admin'` (least privilege). |

Validation / rules:
- A session exists only if a token is present AND decodable AND not expired (`exp > now`).
- `role` drives nav visibility and route guards.

## Entity: TokenPayload (decoded JWT)

| Field | Type | Notes |
|---|---|---|
| `sub` | string | admin id |
| `email` | string | |
| `role` | `'admin' \| 'super_admin'` | |
| `iat` | number (epoch s) | issued-at |
| `exp` | number (epoch s) | expiry; checked on load |

## Value object: LevelMap (shared, used from feature 03 on)

Defined here as part of the shared kit so all features map levels identically.

| level (int) | label (ar) | badge color key |
|---|---|---|
| 0 | Rookie → "مبتدئ" | gray |
| 1 | Bronze → "برونزي" | bronze |
| 2 | Silver → "فضي" | silver |
| 3 | Gold → "ذهبي" | gold |
| 4 | Platinum → "بلاتيني" | platinum |

Rule: **0 (Rookie) MUST be handled** — new students start there. Unknown integers fall back to a
neutral "غير معروف" gray badge.

## Value object: ErrorEnvelope (normalized)

The interceptor normalizes backend errors to:

| Field | Type | Notes |
|---|---|---|
| `code` | number | from `error.error.code` |
| `message` | string | from `error.error.message` (shown in Arabic toasts/inline) |

## Navigation model

| key | label (ar) | route | visibility |
|---|---|---|---|
| dashboard | لوحة التحكم | `/dashboard` | all |
| students | الطلاب | `/students` | all |
| sessions | جلسات التدوير | `/sessions` | all |
| recycles | الأنشطة المكتملة | `/recycles` | all |
| locations | المواقع | `/locations` | all |
| bins | الحاويات | `/bins` | all |
| admins | المشرفون | `/admins` | `super_admin` only |
| profile | ملفي الشخصي | `/profile` | all (reached from top bar) |

State transitions (session lifecycle):
`logged-out → (login success) → logged-in → (logout | 401 | token expired) → logged-out`.
