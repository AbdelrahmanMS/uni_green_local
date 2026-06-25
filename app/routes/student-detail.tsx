import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
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
} from "../components/ui";
import { QueryState } from "../components/QueryState";
import { ConfirmModal } from "../components/Modal";
import { useToast } from "../components/Toast";
import { studentsApi } from "../lib/api/students";
import { errorMessage } from "../lib/http";
import { ar } from "../lib/i18n";
import { formatDate } from "../lib/datetime";
import type { StudentDetail } from "../lib/api/types";

export default function StudentDetailPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const toast = useToast();
  const [confirm, setConfirm] = useState(false);

  const query = useQuery({
    queryKey: ["student", id],
    queryFn: () => studentsApi.get(id),
  });

  const toggle = useMutation({
    mutationFn: (s: StudentDetail) => studentsApi.setActive(s.id, !s.is_active),
    onSuccess: (_d, s) => {
      toast.success(s.is_active ? "تم إيقاف الطالب" : "تم تفعيل الطالب");
      qc.invalidateQueries({ queryKey: ["student", id] });
      qc.invalidateQueries({ queryKey: ["students"] });
    },
    onError: (e) => toast.error(errorMessage(e)),
    onSettled: () => setConfirm(false),
  });

  return (
    <div>
      <div className="mb-5">
        <Button variant="ghost" icon="back" onClick={() => navigate("/students")}>
          العودة للطلاب
        </Button>
      </div>

      <QueryState<StudentDetail>
        isLoading={query.isLoading}
        isError={query.isError}
        error={query.error}
        data={query.data}
        onRetry={() => query.refetch()}
      >
        {(s) => (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[320px_1fr]">
            <Card className="p-6 text-center">
              <div className="mb-3.5 flex justify-center">
                <Avatar name={s.display_name} size={70} />
              </div>
              <h2 className="mb-1 text-lg font-bold text-ink">
                {s.display_name}
              </h2>
              <p className="mb-3.5 text-[13px] text-muted">{s.email}</p>
              <div className="mb-4 flex justify-center gap-2">
                <LevelBadge level={s.level} />
                <Badge color={s.is_active ? "green" : "red"}>
                  {s.is_active ? ar.active : ar.suspended}
                </Badge>
              </div>
              <div className="rounded-xl bg-page p-4">
                <div className="text-2xl font-bold text-primary">
                  {s.total_points.toLocaleString("en-US")}
                </div>
                <div className="text-[13px] text-muted">نقطة مكتسبة</div>
              </div>
              <p className="mt-3 text-xs text-muted">
                تسجيل منذ {formatDate(s.created_at)}
              </p>
              <Button
                variant={s.is_active ? "danger" : "secondary"}
                className="mt-4 w-full"
                onClick={() => setConfirm(true)}
              >
                {s.is_active ? "إيقاف الحساب" : "تفعيل الحساب"}
              </Button>
            </Card>

            <Card className="p-6">
              <h3 className="mb-2 text-[15px] font-bold text-ink">
                نشاط الطالب
              </h3>
              <p className="mb-4 text-[13px] text-muted">
                استعرض جلسات هذا الطالب وأنشطته المكتملة.
              </p>
              <div className="flex flex-wrap gap-2.5">
                <Link
                  to={`/sessions?user_id=${s.id}`}
                  className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-ink hover:bg-page"
                >
                  جلسات التدوير
                </Link>
                <Link
                  to={`/recycles?user_id=${s.id}`}
                  className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-ink hover:bg-page"
                >
                  الأنشطة المكتملة
                </Link>
              </div>
            </Card>
          </div>
        )}
      </QueryState>

      {query.data && (
        <ConfirmModal
          open={confirm}
          onClose={() => setConfirm(false)}
          onConfirm={() => toggle.mutate(query.data!)}
          busy={toggle.isPending}
          title={query.data.is_active ? "إيقاف الطالب" : "تفعيل الطالب"}
          message={
            query.data.is_active
              ? `هل أنت متأكد من إيقاف حساب "${query.data.display_name}"؟ سيتوقف عمل رمزه عند الطلب التالي.`
              : `هل تريد تفعيل حساب "${query.data.display_name}" مجدداً؟`
          }
          confirmLabel={query.data.is_active ? "نعم، إيقاف" : "نعم، تفعيل"}
          danger={query.data.is_active}
        />
      )}
    </div>
  );
}
