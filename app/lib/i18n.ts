// Central Arabic string map. English keys (materials, roles, states) stay internal
// and are translated only at the display layer (constitution principle VI).

export const ar = {
  appName: "UniGreen — لوحة التحكم",
  brand: "UniGreen",

  // generic
  loading: "جارٍ التحميل...",
  retry: "إعادة المحاولة",
  empty: "لا توجد بيانات",
  save: "حفظ",
  cancel: "إلغاء",
  add: "إضافة",
  edit: "تعديل",
  delete: "حذف",
  confirm: "تأكيد",
  search: "بحث",
  results: "نتيجة",
  back: "رجوع",
  genericError: "حدث خطأ ما. حاول مرة أخرى.",
  networkError: "تعذّر الاتصال بالخادم. تحقق من الشبكة.",
  forbidden: "ليست لديك صلاحية لهذا الإجراء.",
  page: "صفحة",
  of: "من",

  // auth
  login: "تسجيل الدخول",
  loginSubtitle: "أدخل بياناتك للوصول إلى لوحة التحكم",
  email: "البريد الإلكتروني",
  password: "كلمة المرور",
  loggingIn: "جارٍ الدخول...",
  logout: "تسجيل الخروج",
  badCredentials: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
  accountDeactivated: "هذا الحساب موقوف. تواصل مع المشرف الرئيسي.",
  tagline: "منصة جامعية لتحفيز إعادة التدوير وتشجيع الاستدامة البيئية",

  // roles
  roleAdmin: "مشرف",
  roleSuperAdmin: "مشرف رئيسي",

  // nav
  navDashboard: "لوحة التحكم",
  navStudents: "الطلاب",
  navSessions: "جلسات التدوير",
  navRecycles: "الأنشطة المكتملة",
  navLocations: "المواقع",
  navBins: "الحاويات",
  navAdmins: "المشرفون",
  navProfile: "الملف الشخصي",

  // statuses
  active: "نشط",
  inactive: "معطل",
  suspended: "موقوف",

  notFound: "الصفحة غير موجودة",
  goHome: "العودة للوحة التحكم",
} as const;

export const MATERIAL_AR: Record<string, string> = {
  glass: "زجاج",
  metal: "معدن",
  paper: "ورق",
  plastic: "بلاستيك",
  trash: "نفايات عامة",
};

export const MATERIALS = ["glass", "metal", "paper", "plastic", "trash"] as const;
export type Material = (typeof MATERIALS)[number];

// Each material has a fixed bin color — mirrors the backend MATERIAL_BIN_COLORS
// (materials.config.ts). Admins never pick a color; it follows the material.
export const MATERIAL_COLORS: Record<string, string> = {
  glass: "#388E3C",
  metal: "#9E9E9E",
  paper: "#1976D2",
  plastic: "#FDD835",
  trash: "#D32F2F",
};

export function materialColor(material: string): string {
  return MATERIAL_COLORS[material] ?? "#9ca3af";
}

export const STATE_AR: Record<string, string> = {
  pending: "معلقة",
  completed: "مكتملة",
  expired: "منتهية",
};

export const STATE_COLOR: Record<string, "blue" | "green" | "red"> = {
  pending: "blue",
  completed: "green",
  expired: "red",
};

export const FAILURE_REASON_AR: Record<string, string> = {
  material_mismatch: "عدم تطابق المادة",
  expired: "منتهية الصلاحية",
  already_used: "مستخدمة مسبقاً",
  bin_not_found: "الحاوية غير موجودة",
};

export function materialLabel(key: string): string {
  return MATERIAL_AR[key] ?? key;
}

export function failureReasonLabel(key: string | null | undefined): string {
  if (!key) return "—";
  return FAILURE_REASON_AR[key] ?? key;
}
