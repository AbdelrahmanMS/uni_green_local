import { useState } from "react";
import { NavLink, Navigate, Outlet, useNavigate } from "react-router";
import { Icon, type IconName } from "../components/Icon";
import { useAuth, roleLabel } from "../lib/auth";
import { ar } from "../lib/i18n";

interface NavItem {
  to: string;
  label: string;
  icon: IconName;
  superOnly?: boolean;
  end?: boolean;
}

const NAV: NavItem[] = [
  { to: "/", label: ar.navDashboard, icon: "dashboard", end: true },
  { to: "/students", label: ar.navStudents, icon: "students" },
  { to: "/sessions", label: ar.navSessions, icon: "sessions" },
  { to: "/recycles", label: ar.navRecycles, icon: "recycles" },
  { to: "/locations", label: ar.navLocations, icon: "locations" },
  { to: "/bins", label: ar.navBins, icon: "bins" },
  { to: "/admins", label: ar.navAdmins, icon: "admins", superOnly: true },
];

export default function Shell() {
  const { admin, isSuperAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  // Route guard: unauthenticated → login.
  if (!admin) return <Navigate to="/login" replace />;

  const items = NAV.filter((i) => !i.superOnly || isSuperAdmin);
  const width = collapsed ? 64 : 240;

  const onLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-page">
      {/* Sidebar (fixed, RTL right-anchored) */}
      <aside
        className="fixed bottom-0 right-0 top-0 z-40 flex flex-col overflow-hidden bg-primary transition-all"
        style={{ width }}
      >
        <div className="flex min-h-[65px] items-center gap-2.5 border-b border-white/10 px-5">
          <img
            src="/logo.png"
            alt={ar.brand}
            className="h-9 w-9 shrink-0 rounded-lg object-contain"
          />
          {!collapsed && (
            <span className="whitespace-nowrap text-base font-bold text-white">
              {ar.brand}
            </span>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-3">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  collapsed ? "justify-center" : ""
                } ${
                  isActive
                    ? "border-r-[3px] border-white bg-white/15 font-semibold text-white"
                    : "border-r-[3px] border-transparent text-white/75 hover:bg-white/10"
                }`
              }
            >
              <Icon name={item.icon} size={19} />
              {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          {!collapsed && admin && (
            <div className="mb-2.5">
              <div className="text-[13px] font-semibold text-white">
                {admin.full_name}
              </div>
              <div className="text-[11px] text-white/60">
                {roleLabel(admin.role)}
              </div>
            </div>
          )}
          <div
            className={`flex items-center ${
              collapsed ? "justify-center" : "justify-between"
            }`}
          >
            {!collapsed && (
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 text-[13px] text-white/70 hover:text-white"
              >
                <Icon name="logout" size={16} />
                {ar.logout}
              </button>
            )}
            <button
              onClick={() => setCollapsed((c) => !c)}
              className="flex items-center rounded-md bg-white/15 p-1.5 text-white"
              aria-label="طي القائمة"
            >
              <Icon name={collapsed ? "chevronLeft" : "chevronRight"} size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div className="transition-all" style={{ marginRight: width }}>
        <header className="sticky top-0 z-30 flex h-[60px] items-center justify-between border-b border-line bg-white px-6">
          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt={ar.brand}
              className="h-7 w-7 object-contain"
            />
            <span className="text-[15px] font-semibold text-ink">
              {ar.brand}
            </span>
          </div>
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2.5"
            aria-label={ar.navProfile}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-light-bg text-primary">
              <Icon name="profile" size={18} />
            </div>
            <span className="text-right">
              <span className="block text-[13px] font-semibold text-ink">
                {admin.full_name}
              </span>
              <span className="block text-[11px] text-muted">
                {roleLabel(admin.role)}
              </span>
            </span>
          </button>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
