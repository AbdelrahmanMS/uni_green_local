# Contract: Admin Accounts (super_admin only)

Requires admin Bearer token AND `super_admin` role; a regular `admin` gets 403 on all of these.
Success envelope unwrapped by the interceptor.

## POST /admin/admins
Body: `{ "email": "new@uni.edu", "password": "secret", "full_name": "New Admin" }`
→ 201 admin object (password never returned). Role defaults to `admin`. **409** if email exists.

## GET /admin/admins
→ `data`: array of `{ id, email, full_name, role, is_active, created_at }` (no passwords).

## GET /admin/admins/:id
→ single admin; 404 if not found.

## PATCH /admin/admins/:id
Body (all optional): `{ full_name, role, is_active, password }`. `role ∈ admin | super_admin`.
`password` provided = reset. **403 if `:id` is the caller's own id** (self-protection, backend
enforced).

## DELETE /admin/admins/:id
→ **hard delete** (permanent, NOT soft-delete). **403 if `:id` is the caller's own id**.

## Errors
- 403 (insufficient role) → handled centrally (friendly message); 403 (self) → self-protection
  message; 409 → duplicate email message; otherwise `error.message`.

## Constitution notes
- This is the only **hard-delete** resource (the soft-delete exception).
- Self-protection is unconditional on the backend; the UI also disables self deactivate/demote/delete.
