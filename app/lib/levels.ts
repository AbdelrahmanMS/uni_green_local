// Level is an integer 0–4 (constitution principle IV). Map to a localized label + badge color.
// Rookie (0) MUST be handled — new students start there.

export type LevelColor =
  | "gray"
  | "bronze"
  | "silver"
  | "gold"
  | "platinum";

interface LevelInfo {
  label: string;
  color: LevelColor;
}

const LEVELS: Record<number, LevelInfo> = {
  0: { label: "مبتدئ", color: "gray" },
  1: { label: "برونزي", color: "bronze" },
  2: { label: "فضي", color: "silver" },
  3: { label: "ذهبي", color: "gold" },
  4: { label: "بلاتيني", color: "platinum" },
};

export function levelInfo(level: number): LevelInfo {
  return LEVELS[level] ?? { label: "غير معروف", color: "gray" };
}
