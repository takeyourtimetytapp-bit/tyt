import type { TiltLabel } from "./tilt";

export type Entry = {
  id: string;
  createdAt: string;
  label: TiltLabel;
};

const STORAGE_KEY = "tiltguard:entries";

function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

export function getEntries(): Entry[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = JSON.parse(raw ?? "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function addEntry(label: TiltLabel) {
  if (typeof window === "undefined") return;

  const entries = getEntries();

  entries.push({
    id: generateId(),
    createdAt: new Date().toISOString(),
    label,
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}
