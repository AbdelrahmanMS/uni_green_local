import axios, { AxiosError } from "axios";

const TOKEN_KEY = "unigreen_admin_token";

export const tokenStore = {
  get(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(TOKEN_KEY);
  },
  set(token: string) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(TOKEN_KEY, token);
  },
  clear() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(TOKEN_KEY);
  },
};

/** Normalized error shape used everywhere in the UI. */
export interface ApiError {
  code: number;
  message: string;
}

const BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "http://localhost:3000";

export const http = axios.create({ baseURL: BASE_URL });

// Attach the bearer token on every request (constitution principle III).
http.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Unwrap the success envelope's `data`; normalize the object-shaped error envelope
// `{ success:false, error:{ code, message }, timestamp }` (constitution principle II).
http.interceptors.response.use(
  (response) => {
    const body = response.data;
    if (body && typeof body === "object" && "data" in body) {
      return body.data;
    }
    return body;
  },
  (error: AxiosError<any>) => {
    const status = error.response?.status ?? 0;

    // 401 anywhere → clear session and bounce to login.
    if (status === 401) {
      tokenStore.clear();
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }

    const body = error.response?.data;
    const normalized: ApiError = {
      code: body?.error?.code ?? status,
      message:
        body?.error?.message ??
        (status === 0
          ? "تعذّر الاتصال بالخادم. تحقق من الشبكة."
          : "حدث خطأ ما. حاول مرة أخرى."),
    };
    return Promise.reject(normalized);
  },
);

/** Typed helpers (the interceptor already unwrapped `data`). */
export const api = {
  get: <T>(url: string, params?: Record<string, unknown>) =>
    http.get(url, { params }) as unknown as Promise<T>,
  post: <T>(url: string, data?: unknown) =>
    http.post(url, data) as unknown as Promise<T>,
  patch: <T>(url: string, data?: unknown) =>
    http.patch(url, data) as unknown as Promise<T>,
  delete: <T>(url: string) => http.delete(url) as unknown as Promise<T>,
};

export function errorMessage(err: unknown): string {
  if (err && typeof err === "object" && "message" in err) {
    return String((err as ApiError).message);
  }
  return "حدث خطأ ما. حاول مرة أخرى.";
}
