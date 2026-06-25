import { Select, Button, Badge } from "./ui";
import { MATERIAL_AR, MATERIALS, STATE_AR, ar } from "../lib/i18n";

export interface AuditFilters {
  material: string;
  state: string;
  user_id: string;
}

export const EMPTY_FILTERS: AuditFilters = {
  material: "",
  state: "",
  user_id: "",
};

const materialOptions = [
  { value: "", label: "كل المواد" },
  ...MATERIALS.map((m) => ({ value: m, label: MATERIAL_AR[m] })),
];

const stateOptions = [
  { value: "", label: "كل الحالات" },
  ...Object.entries(STATE_AR).map(([value, label]) => ({ value, label })),
];

export function FilterBar({
  value,
  onChange,
  showState = false,
}: {
  value: AuditFilters;
  onChange: (next: AuditFilters) => void;
  showState?: boolean;
}) {
  const set = (patch: Partial<AuditFilters>) =>
    onChange({ ...value, ...patch });

  return (
    <div className="flex flex-wrap items-end gap-3 border-b border-line px-5 py-4">
      <div className="w-40">
        <Select
          label="المادة"
          value={value.material}
          onChange={(e) => set({ material: e.target.value })}
          options={materialOptions}
        />
      </div>
      {showState && (
        <div className="w-40">
          <Select
            label="الحالة"
            value={value.state}
            onChange={(e) => set({ state: e.target.value })}
            options={stateOptions}
          />
        </div>
      )}
      <div className="mb-3.5 flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onChange(EMPTY_FILTERS)}
        >
          مسح المرشحات
        </Button>
        {value.user_id && (
          <button
            onClick={() => set({ user_id: "" })}
            title="إلغاء تصفية الطالب"
            className="inline-flex"
          >
            <Badge color="primary">طالب محدد ✕</Badge>
          </button>
        )}
      </div>
    </div>
  );
}

export { ar };
