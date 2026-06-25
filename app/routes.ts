import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  route("login", "routes/login.tsx"),
  layout("routes/shell.tsx", [
    index("routes/dashboard.tsx"),
    route("students", "routes/students.tsx"),
    route("students/:id", "routes/student-detail.tsx"),
    route("sessions", "routes/sessions.tsx"),
    route("recycles", "routes/recycles.tsx"),
    route("locations", "routes/locations.tsx"),
    route("bins", "routes/bins.tsx"),
    route("admins", "routes/admins.tsx"),
    route("profile", "routes/profile.tsx"),
  ]),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
