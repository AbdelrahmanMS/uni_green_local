import {
  forwardRef,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";
import { Icon, type IconName } from "./Icon";
import { levelInfo } from "../lib/levels";

/* ─── Button ─────────────────────────────────────────────────────────── */

type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size = "sm" | "md" | "lg";

const VARIANT: Record<Variant, string> = {
  primary: "bg-primary text-white hover:bg-primary-hover",
  secondary: "bg-white text-ink border border-line hover:bg-gray-50",
  danger: "bg-danger text-white hover:bg-red-700",
  ghost: "bg-transparent text-muted hover:text-ink",
};

const SIZE: Record<Size, string> = {
  sm: "px-3 py-1.5 text-[13px]",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-[15px]",
};

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: IconName;
}

export function Button({
  variant = "primary",
  size = "md",
  icon,
  className = "",
  children,
  ...rest
}: BtnProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${VARIANT[variant]} ${SIZE[size]} ${className}`}
      {...rest}
    >
      {icon && <Icon name={icon} size={15} />}
      {children}
    </button>
  );
}

/* ─── Input ──────────────────────────────────────────────────────────── */

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, id, className = "", ...rest },
  ref,
) {
  const inputId = id ?? rest.name;
  return (
    <div className="mb-3.5">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-[13px] font-semibold text-ink"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        ref={ref}
        className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-ink outline-none ${
          error ? "border-danger" : "border-line"
        } ${className}`}
        aria-invalid={!!error}
        {...rest}
      />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
});

/* ─── Select ─────────────────────────────────────────────────────────── */

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, options, id, className = "", ...rest },
  ref,
) {
  const selectId = id ?? rest.name;
  return (
    <div className="mb-3.5">
      {label && (
        <label
          htmlFor={selectId}
          className="mb-1.5 block text-[13px] font-semibold text-ink"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        ref={ref}
        className={`w-full cursor-pointer rounded-lg border bg-white px-3 py-2.5 text-sm text-ink outline-none ${
          error ? "border-danger" : "border-line"
        } ${className}`}
        {...rest}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
});

/* ─── Badge ──────────────────────────────────────────────────────────── */

export type BadgeColor =
  | "gray"
  | "green"
  | "red"
  | "blue"
  | "yellow"
  | "primary"
  | "bronze"
  | "silver"
  | "gold"
  | "platinum";

const BADGE: Record<BadgeColor, string> = {
  gray: "bg-gray-100 text-gray-500",
  green: "bg-green-100 text-green-700",
  red: "bg-red-100 text-red-600",
  blue: "bg-blue-100 text-blue-700",
  yellow: "bg-amber-100 text-amber-700",
  primary: "bg-light-bg text-primary",
  bronze: "bg-bronze-bg text-bronze-fg",
  silver: "bg-silver-bg text-silver-fg",
  gold: "bg-gold-bg text-gold-fg",
  platinum: "bg-platinum-bg text-platinum-fg",
};

export function Badge({
  children,
  color = "gray",
}: {
  children: ReactNode;
  color?: BadgeColor;
}) {
  return (
    <span
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${BADGE[color]}`}
    >
      {children}
    </span>
  );
}

export function LevelBadge({ level }: { level: number }) {
  const { label, color } = levelInfo(level);
  return <Badge color={color}>{label}</Badge>;
}

/* ─── Card ───────────────────────────────────────────────────────────── */

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-line bg-white ${className}`}>
      {children}
    </div>
  );
}

/* ─── StatCard ───────────────────────────────────────────────────────── */

export function StatCard({
  label,
  value,
  sub,
  icon,
  color = "text-primary",
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: IconName;
  color?: string;
}) {
  return (
    <Card className="flex items-start gap-3.5 p-5">
      <div className={`shrink-0 rounded-lg bg-light-bg p-2.5 ${color}`}>
        <Icon name={icon} size={22} />
      </div>
      <div>
        <div className="text-[13px] text-muted">{label}</div>
        <div className="text-2xl font-bold leading-tight text-ink">{value}</div>
        {sub && <div className="mt-1 text-xs text-muted">{sub}</div>}
      </div>
    </Card>
  );
}

/* ─── PageHeader ─────────────────────────────────────────────────────── */

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <div>
        <h1 className="text-[22px] font-bold text-ink">{title}</h1>
        {subtitle && <p className="mt-1 text-[13px] text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/* ─── Avatar (initials) ──────────────────────────────────────────────── */

export function Avatar({ name, size = 34 }: { name?: string; size?: number }) {
  const initial = (name?.trim()?.[0] ?? "?").toUpperCase();
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-light-bg font-bold text-primary"
      style={{ width: size, height: size, fontSize: size * 0.42 }}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}

/* ─── Spinner ────────────────────────────────────────────────────────── */

export function Spinner({ size = 24 }: { size?: number }) {
  return (
    <span
      className="inline-block animate-spin rounded-full border-2 border-line border-t-primary"
      style={{ width: size, height: size }}
      role="status"
      aria-label="جارٍ التحميل"
    />
  );
}

export function StatusBadge({ active }: { active: boolean }) {
  return (
    <Badge color={active ? "green" : "red"}>{active ? "نشط" : "معطل"}</Badge>
  );
}
