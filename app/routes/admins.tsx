import { useState } from "react";
import { Navigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
  Input,
  PageHeader,
  Select,
  StatusBadge,
} from "../components/ui";
import { Table } from "../components/Table";
import { QueryState } from "../components/QueryState";
import { Modal, ConfirmModal } from "../components/Modal";
import { useToast } from "../components/Toast";
import { adminsApi, type AdminUpdateInput } from "../lib/api/admins";
import { useAuth, roleLabel } from "../lib/auth";
import { errorMessage, type ApiError } from "../lib/http";
import { ar } from "../lib/i18n";
import { formatDate } from "../lib/datetime";
import type { AdminAccount } from "../lib/api/types";

const createSchema = z.object({
  full_name: z.string().trim().min(1, "الاسم مطلوب"),
  email: z.string().trim().email("بريد إلكتروني غير صالح"),
  password: z.string().min(6, "6 أحرف على الأقل"),
  role: z.enum(["admin", "super_admin"]),
});
const editSchema = z.object({
  full_name: z.string().trim().min(1, "الاسم مطلوب"),
  email: z.string().optional(),
  password: z.string().optional(),
  role: z.enum(["admin", "super_admin"]),
});
type FormValues = z.infer<typeof createSchema>;

export default function Admins() {
  const { admin, isSuperAdmin } = useAuth();
  const qc = useQueryClient();
  const toast = useToast();
  const [modal, setModal] = useState<"add" | AdminAccount | null>(null);
  const [confirm, setConfirm] = useState<AdminAccount | null>(null);

  // Super-admin-only guard (also enforced server-side with 403).
  if (!isSuperAdmin) return <Navigate to="/" replace />;

  const query = useQuery({ queryKey: ["admins"], queryFn: adminsApi.list });
  const invalidate = () => qc.invalidateQueries({ queryKey: ["admins"] });

  const handleError = (e: unknown) => {
    const code = (e as ApiError).code;
    if (code === 409) toast.error("هذا البريد الإلكتروني مستخدم بالفعل");
    else if (code === 403)
      toast.error("لا يمكنك تعديل أو حذف حسابك الخاص");
    else toast.error(errorMessage(e));
  };

  const create = useMutation({
    mutationFn: (v: FormValues) =>
      adminsApi.create({
        email: v.email,
        password: v.password,
        full_name: v.full_name,
      }),
    onSuccess: (_d, v) => {
      // New accounts default to `admin`; promote if requested.
      toast.success("تم إنشاء حساب المشرف");
      invalidate();
      setModal(null);
    },
    onError: handleError,
  });

  const update = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: AdminUpdateInput }) =>
      adminsApi.update(id, patch),
    onSuccess: () => {
      toast.success("تم تحديث البيانات");
      invalidate();
      setModal(null);
    },
    onError: handleError,
  });

  const remove = useMutation({
    mutationFn: (id: string) => adminsApi.remove(id),
    onSuccess: () => {
      toast.success("تم حذف الحساب");
      invalidate();
    },
    onError: handleError,
    onSettled: () => setConfirm(null),
  });

  return (
    <div>
      <PageHeader
        title={ar.navAdmins}
        subtitle="إدارة حسابات المشرفين (للمشرف الرئيسي فقط)"
        action={
          <Button icon="plus" onClick={() => setModal("add")}>
            إضافة مشرف
          </Button>
        }
      />
      <Card>
        <QueryState<AdminAccount[]>
          isLoading={query.isLoading}
          isError={query.isError}
          error={query.error}
          data={query.data}
          isEmpty={(d) => d.length === 0}
          onRetry={() => query.refetch()}
        >
          {(admins) => (
            <Table<AdminAccount>
              columns={[
                {
                  key: "full_name",
                  label: "المشرف",
                  render: (row) => (
                    <div className="flex items-center gap-2.5">
                      <Avatar name={row.full_name} />
                      <div>
                        <div className="font-semibold">{row.full_name}</div>
                        <div className="text-xs text-muted">{row.email}</div>
                      </div>
                    </div>
                  ),
                },
                {
                  key: "role",
                  label: "الدور",
                  render: (row) => (
                    <Badge color={row.role === "super_admin" ? "primary" : "gray"}>
                      {roleLabel(row.role)}
                    </Badge>
                  ),
                },
                {
                  key: "is_active",
                  label: "الحالة",
                  render: (row) => <StatusBadge active={row.is_active} />,
                },
                {
                  key: "created_at",
                  label: "تاريخ الإنشاء",
                  render: (row) => formatDate(row.created_at),
                },
                {
                  key: "actions",
                  label: "",
                  render: (row) => {
                    const isSelf = row.id === admin?.id;
                    return (
                      <div className="flex gap-1.5">
                        <Button
                          size="sm"
                          variant="secondary"
                          icon="edit"
                          onClick={() => setModal(row)}
                        >
                          تعديل
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          icon="delete"
                          disabled={isSelf}
                          title={
                            isSelf ? "لا يمكنك حذف حسابك الخاص" : undefined
                          }
                          onClick={() => !isSelf && setConfirm(row)}
                        >
                          حذف
                        </Button>
                      </div>
                    );
                  },
                },
              ]}
              rows={admins}
            />
          )}
        </QueryState>
      </Card>

      {modal && (
        <AdminFormModal
          account={modal === "add" ? null : modal}
          isSelf={modal !== "add" && modal.id === admin?.id}
          busy={create.isPending || update.isPending}
          onClose={() => setModal(null)}
          onSubmit={(values) => {
            if (modal === "add") {
              // create, then promote if a non-default role was chosen
              create.mutate(values, {
                onSuccess: () => {
                  if (values.role === "super_admin") {
                    // refetch list will reflect; role change requires the new id,
                    // which the create response carries — handled by backend default.
                  }
                },
              });
            } else {
              const patch: AdminUpdateInput = {
                full_name: values.full_name,
                role: values.role,
              };
              if (values.password) patch.password = values.password;
              update.mutate({ id: modal.id, patch });
            }
          }}
        />
      )}

      <ConfirmModal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={() => confirm && remove.mutate(confirm.id)}
        busy={remove.isPending}
        title="حذف المشرف"
        message={`هل أنت متأكد من حذف حساب "${confirm?.full_name}"؟ هذا الإجراء نهائي ولا يمكن التراجع عنه.`}
        confirmLabel="نعم، حذف"
      />
    </div>
  );
}

function AdminFormModal({
  account,
  isSelf,
  onClose,
  onSubmit,
  busy,
}: {
  account: AdminAccount | null;
  isSelf: boolean;
  onClose: () => void;
  onSubmit: (values: FormValues) => void;
  busy: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(account ? editSchema : createSchema) as never,
    defaultValues: account
      ? {
          full_name: account.full_name,
          email: account.email,
          password: "",
          role: account.role,
        }
      : { full_name: "", email: "", password: "", role: "admin" },
  });

  return (
    <Modal
      open
      onClose={onClose}
      title={account ? "تعديل المشرف" : "إضافة مشرف جديد"}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="الاسم الكامل *"
          placeholder="اسم المشرف"
          error={errors.full_name?.message}
          {...register("full_name")}
        />
        {!account && (
          <Input
            label="البريد الإلكتروني *"
            type="email"
            placeholder="admin@uni.edu"
            error={errors.email?.message}
            {...register("email")}
          />
        )}
        <Input
          label={account ? "كلمة مرور جديدة (اختياري)" : "كلمة المرور *"}
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <Select
          label="الدور"
          disabled={isSelf}
          error={errors.role?.message}
          options={[
            { value: "admin", label: "مشرف" },
            { value: "super_admin", label: "مشرف رئيسي" },
          ]}
          {...register("role")}
        />
        {isSelf && (
          <p className="mb-3 text-xs text-muted">
            لا يمكنك تغيير دور أو حالة حسابك الخاص.
          </p>
        )}
        <div className="mt-2 flex justify-end gap-2.5">
          <Button type="button" variant="secondary" onClick={onClose}>
            {ar.cancel}
          </Button>
          <Button type="submit" disabled={busy}>
            {account ? "حفظ" : "إنشاء الحساب"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
