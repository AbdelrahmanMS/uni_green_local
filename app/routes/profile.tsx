import { Avatar, Badge, Card, PageHeader } from "../components/ui";
import { useAuth, roleLabel } from "../lib/auth";
import { ar } from "../lib/i18n";

export default function Profile() {
  const { admin } = useAuth();
  if (!admin) return null;

  const rows = [
    { label: ar.email, value: admin.email },
    { label: "الدور", value: roleLabel(admin.role) },
  ];

  return (
    <div>
      <PageHeader title={ar.navProfile} />
      <Card className="max-w-lg p-8">
        <div className="mb-6 flex items-center gap-4">
          <Avatar name={admin.full_name} size={60} />
          <div>
            <div className="text-lg font-bold text-ink">{admin.full_name}</div>
            <Badge color={admin.role === "super_admin" ? "primary" : "gray"}>
              {roleLabel(admin.role)}
            </Badge>
          </div>
        </div>
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex justify-between border-b border-line py-3"
          >
            <span className="text-sm text-muted">{r.label}</span>
            <span className="text-sm font-semibold text-ink">{r.value}</span>
          </div>
        ))}
        <p className="mt-5 text-[13px] text-muted">
          لتغيير كلمة المرور أو بياناتك، تواصل مع المشرف الرئيسي.
        </p>
      </Card>
    </div>
  );
}
