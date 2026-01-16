export type TiltLabel = "red" | "yellow" | "green";

export const TILT_TEXT: Record<TiltLabel, string> = {
  red: "今日は止めてもいい",
  yellow: "今日は少しだけ",
  green: "今日はいつも通り",
};

export function emojiFor(label: TiltLabel): string {
  if (label === "red") return "🔴";
  if (label === "yellow") return "🟡";
  return "🟢";
}
