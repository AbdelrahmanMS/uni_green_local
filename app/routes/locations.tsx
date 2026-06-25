import { useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Button, Card, PageHeader, StatusBadge } from "../components/ui";
import { Input } from "../components/ui";
import { Table } from "../components/Table";
import { QueryState } from "../components/QueryState";
import { Modal, ConfirmModal } from "../components/Modal";
import { useToast } from "../components/Toast";
import { locationsApi, type LocationInput } from "../lib/api/locations";
import { errorMessage } from "../lib/http";
import { ar } from "../lib/i18n";
import type { Location } from "../lib/api/types";

const schema = z.object({
  name: z.string().trim().min(1, "اسم الموقع مطلوب"),
  description: z.string().trim().optional(),
  latitude: z.coerce
    .number({ message: "قيمة غير صالحة" })
    .min(-90, "بين -90 و 90")
    .max(90, "بين -90 و 90"),
  longitude: z.coerce
    .number({ message: "قيمة غير صالحة" })
    .min(-180, "بين -180 و 180")
    .max(180, "بين -180 و 180"),
});
type FormValues = z.input<typeof schema>;

export default function Locations() {
  const qc = useQueryClient();
  const toast = useToast();
  const [modal, setModal] = useState<"add" | Location | null>(null);
  const [confirm, setConfirm] = useState<Location | null>(null);

  const query = useQuery({ queryKey: ["locations"], queryFn: locationsApi.list });

  const invalidate = () =>
    qc.invalidateQueries({ queryKey: ["locations"] });

  const create = useMutation({
    mutationFn: (input: LocationInput) => locationsApi.create(input),
    onSuccess: () => {
      toast.success("تم إضافة الموقع بنجاح");
      invalidate();
      setModal(null);
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const update = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<LocationInput> }) =>
      locationsApi.update(id, patch),
    onSuccess: () => {
      toast.success("تم تحديث الموقع");
      invalidate();
      setModal(null);
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const deactivate = useMutation({
    mutationFn: (id: string) => locationsApi.deactivate(id),
    onSuccess: () => {
      toast.success("تم تعطيل الموقع");
      invalidate();
    },
    onError: (e) => toast.error(errorMessage(e)),
    onSettled: () => setConfirm(null),
  });

  const reactivate = (loc: Location) =>
    update.mutate({ id: loc.id, patch: { is_active: true } as never });

  const rows = [...(query.data ?? [])].sort((a, b) =>
    b.created_at.localeCompare(a.created_at),
  );

  return (
    <div>
      <PageHeader
        title={ar.navLocations}
        subtitle="إدارة مواقع الحاويات"
        action={
          <Button icon="plus" onClick={() => setModal("add")}>
            إضافة موقع
          </Button>
        }
      />
      <Card>
        <QueryState<Location[]>
          isLoading={query.isLoading}
          isError={query.isError}
          error={query.error}
          data={query.data}
          isEmpty={(d) => d.length === 0}
          onRetry={() => query.refetch()}
          emptyText="لا توجد مواقع — أضف موقعاً جديداً"
        >
          {() => (
            <Table<Location>
              rowClassName={(row) => (row.is_active ? "" : "opacity-60")}
              columns={[
                {
                  key: "name",
                  label: "اسم الموقع",
                  render: (row) => (
                    <div>
                      <div className="font-semibold">{row.name}</div>
                      <div className="max-w-xs truncate text-xs text-muted">
                        {row.description}
                      </div>
                    </div>
                  ),
                },
                {
                  key: "coords",
                  label: "الإحداثيات",
                  render: (row) => (
                    <span dir="ltr" className="text-xs text-muted">
                      {row.latitude}, {row.longitude}
                    </span>
                  ),
                },
                {
                  key: "is_active",
                  label: "الحالة",
                  render: (row) => <StatusBadge active={row.is_active} />,
                },
                {
                  key: "actions",
                  label: "",
                  render: (row) => (
                    <div className="flex gap-1.5">
                      <Link
                        to={`/bins?location_id=${row.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-1.5 text-[13px] font-bold text-ink hover:bg-gray-50"
                      >
                        الحاويات
                      </Link>
                      <Button
                        size="sm"
                        variant="secondary"
                        icon="edit"
                        onClick={() => setModal(row)}
                      >
                        تعديل
                      </Button>
                      {row.is_active ? (
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => setConfirm(row)}
                        >
                          تعطيل
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => reactivate(row)}
                        >
                          تفعيل
                        </Button>
                      )}
                    </div>
                  ),
                },
              ]}
              rows={rows}
            />
          )}
        </QueryState>
      </Card>

      {modal && (
        <LocationFormModal
          location={modal === "add" ? null : modal}
          busy={create.isPending || update.isPending}
          onClose={() => setModal(null)}
          onSubmit={(values) => {
            const input: LocationInput = {
              name: values.name.trim(),
              description: values.description?.trim() || undefined,
              latitude: Number(values.latitude),
              longitude: Number(values.longitude),
            };
            if (modal === "add") create.mutate(input);
            else update.mutate({ id: modal.id, patch: input });
          }}
        />
      )}

      <ConfirmModal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={() => confirm && deactivate.mutate(confirm.id)}
        busy={deactivate.isPending}
        title="تعطيل الموقع"
        message={`هل تريد تعطيل موقع "${confirm?.name}"؟ سيبقى ظاهراً (معطّلاً) ويمكن إعادة تفعيله لاحقاً.`}
        confirmLabel="نعم، تعطيل"
      />
    </div>
  );
}

function LocationFormModal({
  location,
  onClose,
  onSubmit,
  busy,
}: {
  location: Location | null;
  onClose: () => void;
  onSubmit: (values: FormValues) => void;
  busy: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: location
      ? {
          name: location.name,
          description: location.description ?? "",
          latitude: location.latitude,
          longitude: location.longitude,
        }
      : { name: "", description: "", latitude: undefined, longitude: undefined },
  });

  return (
    <Modal
      open
      onClose={onClose}
      title={location ? "تعديل الموقع" : "إضافة موقع جديد"}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="اسم الموقع *"
          placeholder="مثال: مبنى المكتبة"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="الوصف"
          placeholder="وصف مختصر للموقع"
          {...register("description")}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="خط العرض *"
            type="number"
            step="any"
            placeholder="30.0444"
            error={errors.latitude?.message}
            {...register("latitude")}
          />
          <Input
            label="خط الطول *"
            type="number"
            step="any"
            placeholder="31.2357"
            error={errors.longitude?.message}
            {...register("longitude")}
          />
        </div>
        <div className="mt-2 flex justify-end gap-2.5">
          <Button type="button" variant="secondary" onClick={onClose}>
            {ar.cancel}
          </Button>
          <Button type="submit" disabled={busy}>
            {location ? "حفظ التغييرات" : "إضافة"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
