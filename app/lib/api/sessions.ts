import { api } from "../http";
import type { Paged, Session } from "./types";

export interface SessionQuery {
  page: number;
  limit: number;
  user_id?: string;
  material?: string;
  state?: string;
}

function clean(q: SessionQuery): Record<string, unknown> {
  const out: Record<string, unknown> = { page: q.page, limit: q.limit };
  for (const k of ["user_id", "material", "state"] as const) {
    if (q[k]) out[k] = q[k];
  }
  return out;
}

export const sessionsApi = {
  list: (q: SessionQuery) => api.get<Paged<Session>>("/admin/sessions", clean(q)),
};
