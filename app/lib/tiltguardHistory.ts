// app/lib/tiltguardHistory.ts
import type { Mood } from "./store";

export type TiltLabel = "red" | "yellow" | "green";
export type RedReason = "people" | "event" | "condition" | "environment" | "unknown";

export type HistoryEntry = {
  id: string;
  createdAt: string;
  label: TiltLabel;
  reason?: RedReason;
};

const STORAGE_KEY = "tiltguard:entries";

/** メイン文言（確定） */
export const LABEL_TEXT: Record<TiltLabel, string> = {
  red: "今日は一度止まろう",
  yellow: "今日は控えめに",
  green: "今日はそのままでOK",
};

export const LABEL_EMOJI: Record<TiltLabel, string> = {
  red: "🔴",
  yellow: "🟡",
  green: "🟢",
};

export const LABEL_TEXT_EN: Record<TiltLabel, string> = {
  red: "Stop for today",
  yellow: "Take it easy",
  green: "Keep going",
};

export const REASON_TEXT_EN: Record<RedReason, string> = {
  people: "People",
  event: "Event",
  condition: "Condition",
  environment: "Environment",
  unknown: "Unknown",
};

export const LABEL_SUBTEXTS: Record<TiltLabel, string[]> = {
  red: ["ここで切り上げるのも判断です", "一度距離を置く時間かも", "続けない選択もあります"],
  yellow: ["少し様子を見よう", "今日は慎重めで", "一度区切りを意識して"],
  green: ["今はそのままで大丈夫", "判断は今のままでいい", "今の流れを保とう"],
};

export function pickSubtext(label: TiltLabel): string {
  const arr = LABEL_SUBTEXTS[label] ?? [];
  if (arr.length === 0) return "";
  return arr[Math.floor(Math.random() * arr.length)];
}

export function pickSubtextEn(label: TiltLabel): string {
  if (label === "red") return "No push. End here.";
  if (label === "yellow") return "Proceed carefully.";
  return "Stable. Continue.";
}

export function pickSubtextByLang(label: TiltLabel, lang: "ja" | "en"): string {
  return lang === "en" ? pickSubtextEn(label) : pickSubtext(label);
}

export const REASON_TEXT_JP: Record<RedReason, string> = {
  people: "人",
  event: "結果・出来事",
  condition: "体調",
  environment: "環境",
  unknown: "よく分からない",
};

export function decideLabel(args: {
  focus: 2 | 3 | 4;
  fatigue: 2 | 3 | 4;
  mood: Mood;
}): TiltLabel {
  const { focus, fatigue, mood } = args;

  if (fatigue === 4 || mood === "bad") return "red";
  if (fatigue === 2 && mood === "good" && focus >= 3) return "green";
  return "yellow";
}

export function getHistoryEntries(): HistoryEntry[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = JSON.parse(raw ?? "[]");
    if (!Array.isArray(data)) return [];
    return data.filter(Boolean);
  } catch {
    return [];
  }
}

function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

export function addHistoryEntry(entry: Omit<HistoryEntry, "id">): string {
  if (typeof window === "undefined") return "";

  const prev = getHistoryEntries();

  const created: HistoryEntry = {
    id: generateId(),
    ...entry,
  };

  prev.push(created);

  const sorted = prev.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const stored = sorted.slice(0, 50);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));

  return created.id;
}

export function setHistoryReason(entryId: string, reason: RedReason) {
  if (typeof window === "undefined") return;

  const prev = getHistoryEntries();
  const next = prev.map((e) => (e.id === entryId ? { ...e, reason } : e));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
