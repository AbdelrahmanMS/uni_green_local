# Contract: Auth & Envelope Handling

All routes are under base URL `http://localhost:3000` (dev). Consumed verbatim from the locked
constitution Backend Contract.

## POST /admin/auth/login

**Auth**: none (public).

**Request**:
```json
{ "email": "admin@uni.edu", "password": "secret" }
```

**Success 200** (envelope):
```json
{
  "success": true,
  "message": "...",
  "data": {
    "access_token": "eyJ...",
    "expires_in": "7d",
    "admin": { "id": "uuid", "email": "admin@uni.edu", "full_name": "Admin", "role": "admin" }
  },
  "timestamp": "2026-06-24T10:00:00.000Z"
}
```

**Errors**:
| Status | Meaning | UI behavior |
|---|---|---|
| 401 | Wrong email or wrong password (same message by design) | Show ONE generic Arabic error. |
| 403 | Account deactivated | Show a DISTINCT Arabic "account deactivated" message. |
| network/5xx | Connectivity / server | Friendly Arabic error; no session created. |

Client action on success: store `access_token`, decode it for `{ id, email, role, exp }`, keep
`full_name` from the response, route to `/dashboard`.

## Global request behavior (all authenticated calls)

- Attach header `Authorization: Bearer <access_token>`.

## Global response behavior (interceptor)

- **Success**: resolve with `response.data.data` (unwrap the envelope's `data`).
- **Failure**: reject with normalized `{ code, message }` where
  `code = body.error.code`, `message = body.error.message` (object-shaped error per constitution).
- **401 on any request**: clear the stored token and redirect to `/login`.
- **403 on any request**: do NOT log out; surface a friendly Arabic "insufficient permissions"
  message and let the calling screen hide/disable the restricted affordance.

## JWT payload (decoded client-side)

```json
{ "sub": "admin-uuid", "email": "admin@uni.edu", "role": "admin", "iat": 1713434400, "exp": 1714039200 }
```

- `role` is the ONLY source of role on the client (no `/admin/auth/me`).
- On app load, if `exp <= now` or the token is malformed → treat as logged-out.

## Deviation note (design → constitution)

The attached design/ADMIN.md describe the error body as `{ message, error: "CODE", statusCode }`.
This contract intentionally follows the **constitution** instead:
`{ success:false, error:{ code, message }, timestamp }`. The interceptor reads `error.message` and
`error.code` from the **object**, not a top-level string. This is a deliberate correction, not an
oversight.
