import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, PageHeader, StatCard, Spinner, Button } from "../components/ui";
import { LineChart, PieChart } from "../components/charts";
import { Table } from "../components/Table";
import { reportsApi } from "../lib/api/reports";
import { errorMessage } from "../lib/http";
import { MATERIAL_AR, ar } from "../lib/i18n";
import type { TopLocation } from "../lib/api/types";

const MATERIAL_COLORS: Record<string, string> = {
  plastic: "#3b82f6",
  metal: "#9ca3af",
  paper: "#d97706",
  glass: "#22c55e",
  trash: "#374151",
};

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

function num(n: number): string {
  return n.toLocaleString("en-US");
}

/* ─── Overview ──────────────────────────────────────────────────────── */
function OverviewSection() {
  const q = useQuery({ queryKey: ["overview"], queryFn: reportsApi.overview });

  if (q.isLoading)
    return (
      <SectionLoading />
    );
  if (q.isError)
    return <SectionError msg={errorMessage(q.error)} onRetry={() => q.refetch()} />;

  const o = q.data!;
  const pie = Object.entries(o.by_material).map(([k, v]) => ({
    label: MATERIAL_AR[k] ?? k,
    value: v,
    color: MATERIAL_COLORS[k] ?? "#94a3b8",
  }));

  return (
    <>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="إجمالي الطلاب" value={num(o.total_users)} icon="students" />
        <StatCard
          label="عمليات التدوير"
          value={num(o.total_recycles)}
          icon="recycles"
        />
        <StatCard
          label="النقاط الممنوحة"
          value={num(o.total_points_awarded)}
          icon="points"
        />
      </div>
      <Card className="mb-6 p-6">
        <h3 className="mb-4 text-[15px] font-bold text-ink">توزيع المواد</h3>
        <PieChart data={pie} />
      </Card>
    </>
  );
}

/* ─── Trends ────────────────────────────────────────────────────────── */
function TrendsSection() {
  const [from, setFrom] = useState(isoDaysAgo(30));
  const [to, setTo] = useState(isoDaysAgo(0));

  const rangeError = useMemo(() => {
    if (from > to) return "تاريخ البداية بعد تاريخ النهاية";
    const days = (new Date(to).getTime() - new Date(from).getTime()) / 86_400_000;
    if (days > 90) return "النطاق الأقصى هو 90 يوماً";
    return "";
  }, [from, to]);

  const q = useQuery({
    queryKey: ["trends", from, to],
    queryFn: () => reportsApi.trends(from, to),
    enabled: !rangeError,
  });

  return (
    <Card className="mb-6 p-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-bold text-ink">اتجاه التدوير اليومي</h3>
          <p className="mt-1 text-xs text-muted">عدد العمليات لكل يوم</p>
        </div>
        <div className="flex items-end gap-2">
          <label className="text-xs text-muted">
            من
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="mr-1 rounded-md border border-line px-2 py-1 text-sm"
            />
          </label>
          <label className="text-xs text-muted">
            إلى
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="mr-1 rounded-md border border-line px-2 py-1 text-sm"
            />
          </label>
        </div>
      </div>

      {rangeError ? (
        <p className="py-10 text-center text-sm text-danger">{rangeError}</p>
      ) : q.isLoading ? (
        <SectionLoading />
      ) : q.isError ? (
        <SectionError
          msg={errorMessage(q.error)}
          onRetry={() => q.refetch()}
        />
      ) : q.data!.daily.length === 0 ? (
        <p className="py-10 text-center text-muted">{ar.empty}</p>
      ) : (
        <LineChart data={q.data!.daily} />
      )}
    </Card>
  );
}

/* ─── Top locations ─────────────────────────────────────────────────── */
function TopLocationsSection() {
  const q = useQuery({
    queryKey: ["top-locations"],
    queryFn: reportsApi.topLocations,
  });

  const max = q.data?.reduce((m, l) => Math.max(m, l.recycle_count), 0) || 1;

  return (
    <Card className="p-6">
      <h3 className="mb-4 text-[15px] font-bold text-ink">أكثر المواقع نشاطاً</h3>
      {q.isLoading ? (
        <SectionLoading />
      ) : q.isError ? (
        <SectionError msg={errorMessage(q.error)} onRetry={() => q.refetch()} />
      ) : (
        <Table<TopLocation>
          columns={[
            { key: "name", label: "الموقع" },
            {
              key: "recycle_count",
              label: "عمليات التدوير",
              render: (row) => (
                <div className="flex items-center gap-2.5">
                  <div className="h-1.5 w-32 overflow-hidden rounded-full bg-line">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(row.recycle_count / max) * 100}%` }}
                    />
                  </div>
                  <span className="text-[13px] font-semibold">
                    {row.recycle_count}
                  </span>
                </div>
              ),
            },
          ]}
          rows={[...(q.data ?? [])].sort(
            (a, b) => b.recycle_count - a.recycle_count,
          )}
        />
      )}
    </Card>
  );
}

function SectionLoading() {
  return (
    <div className="flex items-center justify-center gap-2 py-10 text-muted">
      <Spinner /> {ar.loading}
    </div>
  );
}

function SectionError({ msg, onRetry }: { msg: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 py-10">
      <p className="text-sm text-danger">{msg}</p>
      <Button variant="secondary" size="sm" onClick={onRetry}>
        {ar.retry}
      </Button>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div>
      <PageHeader title={ar.navDashboard} subtitle="نظرة عامة على منصة UniGreen" />
      <OverviewSection />
      <TrendsSection />
      <TopLocationsSection />
    </div>
  );
}
