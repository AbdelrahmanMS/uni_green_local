import { jwtDecode } from "jwt-decode";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api, tokenStore } from "./http";

export type Role = "admin" | "super_admin";

export interface CurrentAdmin {
  id: string;
  email: string;
  full_name: string;
  role: Role;
}

interface TokenPayload {
  sub: string;
  email: string;
  role: Role;
  exp: number;
  iat: number;
}

interface LoginResponse {
  access_token: string;
  expires_in: string;
  admin: { id: string; email: string; full_name: string; role: Role };
}

function decode(token: string): TokenPayload | null {
  try {
    return jwtDecode<TokenPayload>(token);
  } catch {
    return null;
  }
}

function isExpired(payload: TokenPayload): boolean {
  return typeof payload.exp === "number" && payload.exp * 1000 <= Date.now();
}

/** Stored alongside the token so full_name (not always in the JWT) survives a refresh. */
const NAME_KEY = "unigreen_admin_name";

function hydrate(): CurrentAdmin | null {
  const token = tokenStore.get();
  if (!token) return null;
  const payload = decode(token);
  if (!payload || isExpired(payload)) {
    tokenStore.clear();
    return null;
  }
  const role: Role = payload.role === "super_admin" ? "super_admin" : "admin";
  const full_name =
    (typeof window !== "undefined" && window.localStorage.getItem(NAME_KEY)) ||
    payload.email;
  return { id: payload.sub, email: payload.email, full_name, role };
}

interface AuthContextValue {
  admin: CurrentAdmin | null;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<CurrentAdmin | null>(() => hydrate());

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post<LoginResponse>("/admin/auth/login", {
      email,
      password,
    });
    tokenStore.set(res.access_token);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(NAME_KEY, res.admin.full_name);
    }
    const payload = decode(res.access_token);
    const role: Role =
      (payload?.role ?? res.admin.role) === "super_admin"
        ? "super_admin"
        : "admin";
    setAdmin({
      id: payload?.sub ?? res.admin.id,
      email: payload?.email ?? res.admin.email,
      full_name: res.admin.full_name,
      role,
    });
  }, []);

  const logout = useCallback(() => {
    tokenStore.clear();
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(NAME_KEY);
    }
    setAdmin(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      admin,
      isAuthenticated: !!admin,
      isSuperAdmin: admin?.role === "super_admin",
      login,
      logout,
    }),
    [admin, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function roleLabel(role: Role): string {
  return role === "super_admin" ? "مشرف رئيسي" : "مشرف";
}
