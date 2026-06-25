import { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { Icon, type IconName } from "../components/Icon";
import { Button, Input } from "../components/ui";
import { useAuth } from "../lib/auth";
import { ar } from "../lib/i18n";
import type { ApiError } from "../lib/http";

const FEATURES: { icon: IconName; text: string }[] = [
  { icon: "students", text: "متابعة طلاب الجامعة" },
  { icon: "locations", text: "إدارة مواقع الحاويات" },
  { icon: "stats", text: "تقارير وإحصائيات فورية" },
];

export default function Login() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/", { replace: true });
    } catch (err) {
      const code = (err as ApiError).code;
      setError(code === 403 ? ar.accountDeactivated : ar.badCredentials);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-page">
      {/* Brand panel */}
      <div className="hidden flex-1 flex-col items-center justify-center bg-primary p-12 md:flex">
        <img
          src="/logo.png"
          alt={ar.brand}
          className="mb-6 h-20 w-20 rounded-3xl object-contain p-2"
        />
        <h2 className="mb-3 text-3xl font-bold text-white">{ar.brand}</h2>
        <p className="max-w-xs text-center text-[15px] leading-relaxed text-white/70">
          {ar.tagline}
        </p>
        <div className="mt-12 flex w-full max-w-[280px] flex-col gap-4">
          {FEATURES.map((f) => (
            <div key={f.text} className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/12">
                <Icon name={f.icon} size={18} className="text-white/85" />
              </div>
              <span className="text-sm text-white/80">{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="flex w-full items-center justify-center p-8 md:w-[480px]">
        <form onSubmit={onSubmit} className="w-full max-w-sm">
          <h1 className="mb-1.5 text-2xl font-bold text-ink">{ar.login}</h1>
          <p className="mb-8 text-sm text-muted">{ar.loginSubtitle}</p>
          <Input
            label={ar.email}
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@uni.edu"
            autoComplete="username"
            required
          />
          <Input
            label={ar.password}
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
          {error && (
            <div
              role="alert"
              className="mb-3 rounded-lg bg-red-100 px-3 py-2 text-[13px] text-danger"
            >
              {error}
            </div>
          )}
          <Button
            type="submit"
            size="lg"
            className="mt-2 w-full"
            disabled={loading}
          >
            {loading ? ar.loggingIn : ar.login}
          </Button>
        </form>
      </div>
    </div>
  );
}
