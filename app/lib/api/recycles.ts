import { api } from "../http";
import type { Activity, Paged } from "./types";

export interface RecycleQuery {
  page: number;
  limit: number;
  status: "verified" | "failed";
  user_id?: string;
  material?: string;
}

function clean(q: RecycleQuery): Record<string, unknown> {
  const out: Record<string, unknown> = {
    page: q.page,
    limit: q.limit,
    status: q.status,
  };
  for (const k of ["user_id", "material"] as const) {
    if (q[k]) out[k] = q[k];
  }
  return out;
}

export const recyclesApi = {
  list: (q: RecycleQuery) => api.get<Paged<Activity>>("/admin/recycles", clean(q)),
};
