import { api } from "../http";
import type { Role } from "../auth";
import type { AdminAccount } from "./types";

export interface AdminCreateInput {
  email: string;
  password: string;
  full_name: string;
}

export interface AdminUpdateInput {
  full_name?: string;
  role?: Role;
  is_active?: boolean;
  password?: string;
}

export const adminsApi = {
  list: () => api.get<AdminAccount[]>("/admin/admins"),
  get: (id: string) => api.get<AdminAccount>(`/admin/admins/${id}`),
  create: (input: AdminCreateInput) =>
    api.post<AdminAccount>("/admin/admins", input),
  update: (id: string, patch: AdminUpdateInput) =>
    api.patch<AdminAccount>(`/admin/admins/${id}`, patch),
  remove: (id: string) => api.delete<void>(`/admin/admins/${id}`),
};
