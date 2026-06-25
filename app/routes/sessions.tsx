import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Badge, Card, PageHeader } from "../components/ui";
import { Pagination, Table } from "../components/Table";
import { QueryState } from "../components/QueryState";
import {
  FilterBar,
  EMPTY_FILTERS,
  type AuditFilters,
} from "../components/FilterBar";
import { sessionsApi } from "../lib/api/sessions";
import { STATE_AR, STATE_COLOR, materialLabel, ar } from "../lib/i18n";
import { formatDateTime } from "../lib/datetime";
import type { Paged, Session } from "../lib/api/types";

const LIMIT = 20;

function filtersFromParams(p: URLSearchParams): AuditFilters {
  return {
    material: p.get("material") ?? "",
    state: p.get("state") ?? "",
    user_id: p.get("user_id") ?? "",
  };
}

export default function Sessions() {
  const [params, setParams] = useSearchParams();
  const page = Number(params.get("page") ?? "1");
  const filters = filtersFromParams(params);

  const query = useQuery({
    queryKey: ["sessions", page, filters],
    queryFn: () => sessionsApi.list({ page, limit: LIMIT, ...filters }),
  });

  const applyFilters = (next: AuditFilters) => {
    const sp = new URLSearchParams();
    Object.entries(next).forEach(([k, v]) => v && sp.set(k, v));
    sp.set("page", "1");
    setParams(sp);
  };

  const setPage = (p: number) => {
    const sp = new URLSearchParams(params);
    sp.set("page", String(p));
    setParams(sp);
  };

  return (
    <div>
      <PageHeader
        title={ar.navSessions}
        subtitle="سجل دورة حياة الجلسات (معلقة / مكتملة / منتهية)"
      />
      <Card>
        <FilterBar value={filters} onChange={applyFilters} showState />
        <QueryState<Paged<Session>>
            isLoading={query.isLoading}
            isError={query.isError}
            error={query.error}
            data={query.data}
            isEmpty={(d) => d.data.length === 0}
            onRetry={() => query.refetch()}
            emptyText="لا توجد جلسات مطابقة"
          >
            {(data) => (
              <>
                <Table<Session>
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
                    {
                      key: "state",
                      label: "الحالة",
                      render: (row) => (
                        <Badge color={STATE_COLOR[row.state] ?? "gray"}>
                          {STATE_AR[row.state] ?? row.state}
                        </Badge>
                      ),
                    },
                    {
                      key: "created_at",
                      label: "وقت الإرسال",
                      render: (row) => formatDateTime(row.created_at),
                    },
                    {
                      key: "expires_at",
                      label: "وقت الانتهاء",
                      render: (row) => formatDateTime(row.expires_at),
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
      </Card>
    </div>
  );
}
