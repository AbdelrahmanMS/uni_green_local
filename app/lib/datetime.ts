import { format } from "date-fns";

// Backend timestamps are UTC (ISO with `Z`). `new Date(iso)` parses them and
// date-fns `format` renders in the device's local timezone.

export function formatDateTime(iso?: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "—" : format(d, "yyyy-MM-dd HH:mm");
}

export function formatDate(iso?: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "—" : format(d, "yyyy-MM-dd");
}
