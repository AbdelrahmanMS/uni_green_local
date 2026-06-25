import { api } from "../http";
import type { Paged, Student, StudentDetail } from "./types";

export const studentsApi = {
  list: (params: { page: number; limit: number; search?: string }) =>
    api.get<Paged<Student>>("/admin/users", {
      page: params.page,
      limit: params.limit,
      ...(params.search ? { search: params.search } : {}),
    }),
  get: (id: string) => api.get<StudentDetail>(`/admin/users/${id}`),
  setActive: (id: string, is_active: boolean) =>
    api.patch<Student>(`/admin/users/${id}`, { is_active }),
};
