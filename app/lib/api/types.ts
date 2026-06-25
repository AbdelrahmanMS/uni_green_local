import type { Role } from "../auth";

export interface Paged<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface Overview {
  total_users: number;
  total_recycles: number;
  total_points_awarded: number;
  by_material: Record<string, number>;
}

export interface TrendsResult {
  from: string;
  to: string;
  daily: { date: string; count: number }[];
}

export interface TopLocation {
  id: string;
  name: string;
  recycle_count: number;
}

export interface Student {
  id: string;
  email: string;
  display_name: string;
  total_points: number;
  level: number;
  is_active: boolean;
  created_at: string;
}

export interface StudentDetail extends Student {
  badges: unknown[]; // always empty in v1 — never rendered
}

export interface Session {
  id: string;
  user_id: string;
  student_name: string;
  student_email: string;
  material: string;
  state: "pending" | "completed" | "expired";
  used: boolean;
  expires_at: string;
  created_at: string;
}

export interface Activity {
  id: string;
  user_id: string;
  student_name: string;
  student_email: string;
  material: string;
  points_earned: number;
  location_name: string;
  bin_color: string;
  created_at: string;
  status?: "verified" | "failed";
  failure_reason?: string | null;
}

export interface Location {
  id: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  is_active: boolean;
  created_at: string;
}

export interface Bin {
  id: string;
  location_id: string;
  material: string;
  color: string;
  qr_code: string;
  is_active: boolean;
  created_at: string;
}

export interface AdminAccount {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  is_active: boolean;
  created_at: string;
}
