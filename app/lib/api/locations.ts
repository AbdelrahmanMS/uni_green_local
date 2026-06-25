import { api } from "../http";
import type { Location } from "./types";

export interface LocationInput {
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
}

export const locationsApi = {
  list: () => api.get<Location[]>("/admin/locations"),
  get: (id: string) => api.get<Location>(`/admin/locations/${id}`),
  create: (input: LocationInput) =>
    api.post<Location>("/admin/locations", input),
  update: (id: string, patch: Partial<LocationInput & { is_active: boolean }>) =>
    api.patch<Location>(`/admin/locations/${id}`, patch),
  deactivate: (id: string) => api.delete<void>(`/admin/locations/${id}`),
};
