import type { ReactNode } from "react";
import { Icon } from "./Icon";
import { ar } from "../lib/i18n";

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
}

export function Table<T extends { id?: string }>({
  columns,
  rows,
  onRowClick,
  rowClassName,
  emptyText = ar.empty,
}: {
  columns: Column<T>[];
  rows: T[];
  onRowClick?: (row: T) => void;
  rowClassName?: (row: T) => string;
  emptyText?: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-line">
            {columns.map((col) => (
              <th
                key={col.key}
                className="whitespace-nowrap px-3.5 py-3 text-right text-xs font-bold tracking-wide text-muted"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.id ?? i}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              tabIndex={onRowClick ? 0 : undefined}
              onKeyDown={
                onRowClick
                  ? (e) => {
                      if (e.key === "Enter") onRowClick(row);
                    }
                  : undefined
              }
              className={`border-b border-line transition-colors ${
                onRowClick ? "cursor-pointer hover:bg-page" : ""
              } ${rowClassName ? rowClassName(row) : ""}`}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-3.5 py-3 align-middle text-sm text-ink"
                >
                  {col.render
                    ? col.render(row)
                    : ((row as Record<string, unknown>)[col.key] as ReactNode)}
                </td>
              ))}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="p-10 text-center text-muted"
              >
                {emptyText}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export function Pagination({
  page,
  total,
  limit,
  onChange,
}: {
  page: number;
  total: number;
  limit: number;
  onChange: (page: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / limit));
  if (pages <= 1) return null;

  const nums = Array.from({ length: pages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === pages || Math.abs(p - page) <= 2,
  );

  return (
    <nav
      className="flex items-center justify-center gap-1.5 py-3.5"
      aria-label="ترقيم الصفحات"
    >
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="rounded-md border border-line bg-white p-1.5 disabled:opacity-40"
        aria-label="السابق"
      >
        <Icon name="chevronRight" size={16} />
      </button>
      {nums.map((p, idx) => {
        const prev = nums[idx - 1];
        const gap = prev && p - prev > 1;
        return (
          <span key={p} className="flex items-center gap-1.5">
            {gap && <span className="px-1 text-muted">…</span>}
            <button
              onClick={() => onChange(p)}
              aria-current={p === page ? "page" : undefined}
              className={`rounded-md border px-3 py-1.5 text-sm ${
                p === page
                  ? "border-primary bg-primary font-bold text-white"
                  : "border-line bg-white text-ink"
              }`}
            >
              {p}
            </button>
          </span>
        );
      })}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === pages}
        className="rounded-md border border-line bg-white p-1.5 disabled:opacity-40"
        aria-label="التالي"
      >
        <Icon name="chevronLeft" size={16} />
      </button>
    </nav>
  );
}
