import { api } from "../http";
import type { Overview, TopLocation, TrendsResult } from "./types";

export const reportsApi = {
  overview: () => api.get<Overview>("/admin/reports/overview"),
  trends: (from: string, to: string) =>
    api.get<TrendsResult>("/admin/reports/trends", { from, to }),
  topLocations: () => api.get<TopLocation[]>("/admin/reports/top-locations"),
};
