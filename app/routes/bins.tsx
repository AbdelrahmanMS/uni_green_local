import { useState } from "react";
import { useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Badge, Button, Card, PageHeader, Select, StatusBadge } from "../components/ui";
import { Table } from "../components/Table";
import { QueryState } from "../components/QueryState";
import { Modal, ConfirmModal } from "../components/Modal";
import { useToast } from "../components/Toast";
import { BinQrCard } from "../components/BinQrCard";
import { binsApi, type BinInput } from "../lib/api/bins";
import { locationsApi } from "../lib/api/locations";
import { errorMessage } from "../lib/http";
import {
  MATERIALS,
  MATERIAL_AR,
  materialColor,
  materialLabel,
  ar,
} from "../lib/i18n";
import type { Bin, Location } from "../lib/api/types";

const schema = z.object({
  location_id: z.string().min(1, "اختر الموقع"),
  material: z.enum(MATERIALS),
});
type FormValues = z.infer<typeof schema>;

export default function Bins() {
  const [params, setParams] = useSearchParams();
  const locationId = params.get("location_id") ?? "";
  const qc = useQueryClient();
  const toast = useToast();

  const [modal, setModal] = useState<"add" | Bin | null>(null);
  const [qrBin, setQrBin] = useState<Bin | null>(null);
  const [confirm, setConfirm] = useState<Bin | null>(null);

  const locationsQuery = useQuery({
    queryKey: ["locations"],
    queryFn: locationsApi.list,
  });
  const binsQuery = useQuery({
    queryKey: ["bins", locationId],
    queryFn: () => binsApi.list(locationId || undefined),
  });

  const locations = locationsQuery.data ?? [];
  const activeLocations = locations.filter((l) => l.is_active);
  const locName = (id: string) =>
    locations.find((l) => l.id === id)?.name ?? "—";

  const invalidate = () => qc.invalidateQueries({ queryKey: ["bins"] });

  const create = useMutation({
    mutationFn: (input: BinInput) => binsApi.create(input),
    onSuccess: (bin) => {
      toast.success("تم إضافة الحاوية وإنشاء رمز QR");
      invalidate();
      setModal(null);
      setQrBin(bin);
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const update = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<BinInput> }) =>
      binsApi.update(id, patch),
    onSuccess: () => {
      toast.success("تم تحديث الحاوية");
      invalidate();
      setModal(null);
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const deactivate = useMutation({
    mutationFn: (id: string) => binsApi.deactivate(id),
    onSuccess: () => {
      toast.success("تم تعطيل الحاوية");
      invalidate();
    },
    onError: (e) => toast.error(errorMessage(e)),
    onSettled: () => setConfirm(null),
  });

  const reactivate = (bin: Bin) =>
    update.mutate({ id: bin.id, patch: { is_active: true } as never });

  const setLocFilter = (id: string) => {
    const sp = new URLSearchParams(params);
    if (id) sp.set("location_id", id);
    else sp.delete("location_id");
    setParams(sp);
  };

  return (
    <div>
      <PageHeader
        title={ar.navBins}
        subtitle="إدارة الحاويات ورموز QR"
        action={
          <Button
            icon="plus"
            disabled={activeLocations.length === 0}
            onClick={() => setModal("add")}
          >
            إضافة حاوية
          </Button>
        }
      />
      <Card>
        <div className="flex flex-wrap gap-2 border-b border-line px-5 py-4">
          <FilterChip
            active={!locationId}
            label="كل المواقع"
            onClick={() => setLocFilter("")}
          />
          {locations.map((l) => (
            <FilterChip
              key={l.id}
              active={locationId === l.id}
              label={l.name}
              onClick={() => setLocFilter(l.id)}
            />
          ))}
        </div>

        <QueryState<Bin[]>
          isLoading={binsQuery.isLoading}
          isError={binsQuery.isError}
          error={binsQuery.error}
          data={binsQuery.data}
          isEmpty={(d) => d.length === 0}
          onRetry={() => binsQuery.refetch()}
          emptyText="لا توجد حاويات — أضف حاوية جديدة"
        >
          {(bins) => (
            <Table<Bin>
              rowClassName={(row) => (row.is_active ? "" : "opacity-60")}
              columns={[
                {
                  key: "material",
                  label: "المادة",
                  render: (row) => materialLabel(row.material),
                },
                {
                  key: "color",
                  label: "اللون",
                  render: (row) => (
                    <span
                      className="inline-block h-4 w-4 shrink-0 rounded-full ring-1 ring-black/15"
                      style={{ background: materialColor(row.material) }}
                    />
                  ),
                },
                {
                  key: "location",
                  label: "الموقع",
                  render: (row) => locName(row.location_id),
                },
                {
                  key: "qr_code",
                  label: "رمز QR",
                  render: (row) => (
                    <span dir="ltr" className="font-mono text-[11px] text-muted">
                      {row.qr_code.slice(0, 18)}…
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
                      <Button
                        size="sm"
                        variant="secondary"
                        icon="qr"
                        onClick={() => setQrBin(row)}
                      >
                        QR
                      </Button>
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
              rows={bins}
            />
          )}
        </QueryState>
      </Card>

      {modal && (
        <BinFormModal
          bin={modal === "add" ? null : modal}
          locations={modal === "add" ? activeLocations : locations}
          busy={create.isPending || update.isPending}
          onClose={() => setModal(null)}
          onSubmit={(values) => {
            if (modal === "add") create.mutate(values);
            else update.mutate({ id: modal.id, patch: values });
          }}
        />
      )}

      <Modal
        open={!!qrBin}
        onClose={() => setQrBin(null)}
        title="رمز QR للحاوية"
        width={340}
      >
        {qrBin && (
          <BinQrCard qrCode={qrBin.qr_code} material={qrBin.material} />
        )}
      </Modal>

      <ConfirmModal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={() => confirm && deactivate.mutate(confirm.id)}
        busy={deactivate.isPending}
        title="تعطيل الحاوية"
        message={`هل تريد تعطيل حاوية "${
          confirm ? materialLabel(confirm.material) : ""
        }"؟ لن تتمكن التطبيقات من مسح رمزها.`}
        confirmLabel="نعم، تعطيل"
      />
    </div>
  );
}

function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-[13px] transition-colors ${
        active
          ? "border-primary bg-primary text-white"
          : "border-line bg-white text-muted hover:bg-page"
      }`}
    >
      {label}
    </button>
  );
}

function BinFormModal({
  bin,
  locations,
  onClose,
  onSubmit,
  busy,
}: {
  bin: Bin | null;
  locations: Location[];
  onClose: () => void;
  onSubmit: (values: FormValues) => void;
  busy: boolean;
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: bin
      ? { location_id: bin.location_id, material: bin.material as never }
      : {
          location_id: locations[0]?.id ?? "",
          material: "plastic",
        },
  });
  const material = watch("material");

  return (
    <Modal open onClose={onClose} title={bin ? "تعديل الحاوية" : "إضافة حاوية جديدة"}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Select
          label="الموقع *"
          error={errors.location_id?.message}
          options={locations.map((l) => ({ value: l.id, label: l.name }))}
          {...register("location_id")}
        />
        <Select
          label="نوع المادة *"
          error={errors.material?.message}
          options={MATERIALS.map((m) => ({ value: m, label: MATERIAL_AR[m] }))}
          {...register("material")}
        />

        <div className="mb-3.5">
          <label className="mb-2 block text-[13px] font-semibold text-ink">
            لون الحاوية
          </label>
          <div className="flex items-center gap-2.5">
            <span
              className="h-7 w-7 rounded-full ring-1 ring-black/15"
              style={{ background: materialColor(material) }}
            />
            <span className="text-xs text-muted">
              يتحدد تلقائياً حسب نوع المادة
            </span>
          </div>
        </div>

        {!bin && (
          <p className="mb-3 rounded-lg bg-very-light px-3 py-2 text-xs text-muted">
            سيتم إنشاء رمز QR تلقائياً عند الإضافة.
          </p>
        )}

        <div className="mt-2 flex justify-end gap-2.5">
          <Button type="button" variant="secondary" onClick={onClose}>
            {ar.cancel}
          </Button>
          <Button type="submit" disabled={busy}>
            {bin ? "حفظ" : "إضافة"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
