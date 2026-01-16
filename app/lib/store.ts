export type Mood = "good" | "neutral" | "bad";

export type Item = {
  date: string;
  focus: number;
  fatigue: number;
  mood: Mood;
};

const KEY = "tg_matches_v1";

export function loadMatches(): Item[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as Item[]) : [];
}

export function saveMatch(item: Item): Item[] {
  const list = loadMatches();
  const next = [item, ...list].slice(0, 10); // 直近10件
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}
