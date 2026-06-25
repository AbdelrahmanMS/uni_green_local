import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Badge, Card, PageHeader } from "../components/ui";
import { Pagination, Table } from "../components/Table";
import { QueryState } from "../components/QueryState";
import { FilterBar, type AuditFilters } from "../components/FilterBar";
import { recyclesApi } from "../lib/api/recycles";
import { errorMessage, type ApiError } from "../lib/http";
import { failureReasonLabel, materialLabel, ar } from "../lib/i18n";
import { formatDateTime } from "../lib/datetime";
import type { Activity, Paged } from "../lib/api/types";

const LIMIT = 20;
type Status = "verified" | "failed";

function filtersFromParams(p: URLSearchParams): AuditFilters {
  return {
    material: p.get("material") ?? "",
    state: "",
    user_id: p.get("user_id") ?? "",
  };
}

export default function Recycles() {
  const [params, setParams] = useSearchParams();
  const status = (params.get("status") as Status) ?? "verified";
  const page = Number(params.get("page") ?? "1");
  const filters = filtersFromParams(params);

  const query = useQuery({
    queryKey: ["recycles", status, page, filters],
    queryFn: () =>
      recyclesApi.list({
        page,
        limit: LIMIT,
        status,
        material: filters.material,
        user_id: filters.user_id,
      }),
  });

  // Graceful degradation: the ⏳ backend addition (?status=failed) may not be live yet.
  const errCode = (query.error as unknown as ApiError | null)?.code;
  const backendGap =
    status === "failed" &&
    query.isError &&
    (errCode === 400 || errCode === 404);

  const setStatus = (s: Status) => {
    const sp = new URLSearchParams(params);
    sp.set("status", s);
    sp.set("page", "1");
    setParams(sp);
  };

  const applyFilters = (next: AuditFilters) => {
    const sp = new URLSearchParams();
    sp.set("status", status);
    if (next.material) sp.set("material", next.material);
    if (next.user_id) sp.set("user_id", next.user_id);
    sp.set("page", "1");
    setParams(sp);
  };

  const setPage = (p: number) => {
    const sp = new URLSearchParams(params);
    sp.set("page", String(p));
    setParams(sp);
  };

  const isFailed = status === "failed";

  return (
    <div>
      <PageHeader
        title={ar.navRecycles}
        subtitle="الأنشطة الناجحة (نقاط) والمحاولات الفاشلة"
      />
      <Card>
        {/* Status tabs */}
        <div
          role="tablist"
          aria-label="حالة النشاط"
          className="flex gap-0 border-b border-line px-5"
        >
          {(
            [
              { id: "verified", label: "ناجحة" },
              { id: "failed", label: "فاشلة" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={status === t.id}
              onClick={() => setStatus(t.id)}
              className={`px-5 py-3 text-sm transition-colors ${
                status === t.id
                  ? "border-b-2 border-primary font-bold text-primary"
                  : "border-b-2 border-transparent text-muted hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <FilterBar value={filters} onChange={applyFilters} />

        {backendGap ? (
          <div className="py-16 text-center text-sm text-muted">
            عرض المحاولات الفاشلة غير متاح بعد — بانتظار تحديث الخادم
            (<span dir="ltr">?status=failed</span>).
          </div>
        ) : (
          <QueryState<Paged<Activity>>
            isLoading={query.isLoading}
            isError={query.isError}
            error={query.error}
            data={query.data}
            isEmpty={(d) => d.data.length === 0}
            onRetry={() => query.refetch()}
            emptyText={isFailed ? "لا توجد محاولات فاشلة" : "لا توجد أنشطة مطابقة"}
          >
            {(data) => (
              <>
                <Table<Activity>
                  columns={[
                    {
                      key: "student",
                      label: "الطالب",
                      render: (row) => (
                        <div>
                          <div className="font-semibold">
                            {row.student_name}
                          </div>
                          <div className="text-xs text-muted">
                            {row.student_email}
                          </div>
                        </div>
                      ),
                    },
                    {
                      key: "material",
                      label: "المادة",
                      render: (row) => materialLabel(row.material),
                    },
                    ...(isFailed
                      ? [
                          {
                            key: "failure_reason",
                            label: "سبب الفشل",
                            render: (row: Activity) => (
                              <Badge color="red">
                                {failureReasonLabel(row.failure_reason)}
                              </Badge>
                            ),
                          },
                        ]
                      : [
                          {
                            key: "points_earned",
                            label: "النقاط",
                            render: (row: Activity) => (
                              <span className="font-bold text-success">
                                +{row.points_earned} نقطة
                              </span>
                            ),
                          },
                        ]),
                    { key: "location_name", label: "الموقع" },
                    { key: "bin_color", label: "الحاوية" },
                    {
                      key: "created_at",
                      label: "التاريخ",
                      render: (row) => formatDateTime(row.created_at),
                    },
                  ]}
                  rows={data.data}
                />
                <div className="px-4">
                  <Pagination
                    page={data.page}
                    total={data.total}
                    limit={data.limit}
                    onChange={setPage}
                  />
                </div>
              </>
            )}
          </QueryState>
        )}
      </Card>
    </div>
  );
}
