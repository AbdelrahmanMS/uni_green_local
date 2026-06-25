import { api } from "../http";
import type { Bin } from "./types";

export interface BinInput {
  location_id: string;
  material: string;
  // color is NOT sent — the backend derives it from the material.
}

export const binsApi = {
  list: (locationId?: string) =>
    api.get<Bin[]>("/admin/bins", locationId ? { location_id: locationId } : undefined),
  get: (id: string) => api.get<Bin>(`/admin/bins/${id}`),
  // qr_code is never sent — the server generates it.
  create: (input: BinInput) => api.post<Bin>("/admin/bins", input),
  update: (id: string, patch: Partial<BinInput & { is_active: boolean }>) =>
    api.patch<Bin>(`/admin/bins/${id}`, patch),
  deactivate: (id: string) => api.delete<void>(`/admin/bins/${id}`),
};
