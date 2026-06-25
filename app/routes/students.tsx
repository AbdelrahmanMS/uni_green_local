import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Avatar,
  Badge,
  Button,
  Card,
  LevelBadge,
  PageHeader,
  StatusBadge,
} from "../components/ui";
import { Icon } from "../components/Icon";
import { Table } from "../components/Table";
import { Pagination } from "../components/Table";
import { QueryState } from "../components/QueryState";
import { ConfirmModal } from "../components/Modal";
import { useToast } from "../components/Toast";
import { studentsApi } from "../lib/api/students";
import { errorMessage } from "../lib/http";
import { ar } from "../lib/i18n";
import { formatDate } from "../lib/datetime";
import type { Paged, Student } from "../lib/api/types";

const LIMIT = 20;

export default function Students() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const toast = useToast();

  const page = Number(params.get("page") ?? "1");
  const search = params.get("search") ?? "";
  const [term, setTerm] = useState(search);

  // Debounce the search box → URL (resets to page 1).
  useEffect(() => {
    const t = setTimeout(() => {
      if (term !== search) {
        const next = new URLSearchParams(params);
        if (term) next.set("search", term);
        else next.delete("search");
        next.set("page", "1");
        setParams(next, { replace: true });
      }
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term]);

  const query = useQuery({
    queryKey: ["students", page, search],
    queryFn: () => studentsApi.list({ page, limit: LIMIT, search }),
  });

  const [confirm, setConfirm] = useState<Student | null>(null);

  const toggle = useMutation({
    mutationFn: (s: Student) => studentsApi.setActive(s.id, !s.is_active),
    onSuccess: (_d, s) => {
      toast.success(s.is_active ? "تم إيقاف الطالب" : "تم تفعيل الطالب");
      qc.invalidateQueries({ queryKey: ["students"] });
    },
    onError: (e) => toast.error(errorMessage(e)),
    onSettled: () => setConfirm(null),
  });

  const setPage = (p: number) => {
    const next = new URLSearchParams(params);
    next.set("page", String(p));
    setParams(next);
  };

  return (
    <div>
      <PageHeader title={ar.navStudents} subtitle="إدارة حسابات الطلاب" />
      <Card>
        <div className="flex items-center gap-3 border-b border-line px-5 py-4">
          <div className="relative max-w-xs flex-1">
            <Icon
              name="search"
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="بحث بالاسم أو البريد..."
              className="w-full rounded-lg border border-line py-2 pr-9 pl-3 text-sm outline-none"
              aria-label={ar.search}
            />
          </div>
          {query.data && (
            <Badge color="primary">
              {query.data.total} {ar.results}
            </Badge>
          )}
        </div>

        <QueryState<Paged<Student>>
          isLoading={query.isLoading}
          isError={query.isError}
          error={query.error}
          data={query.data}
          isEmpty={(d) => d.data.length === 0}
          onRetry={() => query.refetch()}
          emptyText="لا يوجد طلاب مطابقون"
        >
          {(data) => (
            <>
              <Table<Student>
                onRowClick={(row) => navigate(`/students/${row.id}`)}
                columns={[
                  {
                    key: "display_name",
                    label: "الطالب",
                    render: (row) => (
                      <div className="flex items-center gap-2.5">
                        <Avatar name={row.display_name} />
                        <div>
                          <div className="max-w-[200px] truncate text-sm font-semibold">
                            {row.display_name}
                          </div>
                          <div className="max-w-[200px] truncate text-xs text-muted">
                            {row.email}
                          </div>
                        </div>
                      </div>
                    ),
                  },
                  {
                    key: "level",
                    label: "المستوى",
                    render: (row) => <LevelBadge level={row.level} />,
                  },
                  {
                    key: "total_points",
                    label: "النقاط",
                    render: (row) => (
                      <span className="font-semibold">
                        {row.total_points.toLocaleString("en-US")}
                      </span>
                    ),
                  },
                  {
                    key: "is_active",
                    label: "الحالة",
                    render: (row) => (
                      <Badge color={row.is_active ? "green" : "red"}>
                        {row.is_active ? ar.active : ar.suspended}
                      </Badge>
                    ),
                  },
                  {
                    key: "created_at",
                    label: "تاريخ التسجيل",
                    render: (row) => formatDate(row.created_at),
                  },
                  {
                    key: "actions",
                    label: "",
                    render: (row) => (
                      <div
                        className="flex gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          size="sm"
                          variant="secondary"
                          icon="eye"
                          onClick={() => navigate(`/students/${row.id}`)}
                        >
                          عرض
                        </Button>
                        <Button
                          size="sm"
                          variant={row.is_active ? "danger" : "secondary"}
                          onClick={() => setConfirm(row)}
                        >
                          {row.is_active ? "إيقاف" : "تفعيل"}
                        </Button>
                      </div>
                    ),
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

      <ConfirmModal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={() => confirm && toggle.mutate(confirm)}
        busy={toggle.isPending}
        title={confirm?.is_active ? "إيقاف الطالب" : "تفعيل الطالب"}
        message={
          confirm?.is_active
            ? `هل أنت متأكد من إيقاف حساب "${confirm?.display_name}"؟ سيتوقف عمل رمزه عند الطلب التالي.`
            : `هل تريد تفعيل حساب "${confirm?.display_name}" مجدداً؟`
        }
        confirmLabel={confirm?.is_active ? "نعم، إيقاف" : "نعم، تفعيل"}
        danger={!!confirm?.is_active}
      />
    </div>
  );
}
