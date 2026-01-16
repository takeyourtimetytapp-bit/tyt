"use client";

import { useEffect, useState } from "react";
import {
  getHistoryEntries,
  LABEL_EMOJI,
  LABEL_TEXT,
} from "../lib/tiltguardHistory";
import type { HistoryEntry } from "../lib/tiltguardHistory";

function relativeDayJa(dateIso: string): string {
  const d = new Date(dateIso);
  if (Number.isNaN(d.getTime())) return "";

  const now = new Date();
  const start = (x: Date) =>
    new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();

  // 小数ズレ対策で整数化
  const diff = Math.floor((start(now) - start(d)) / (1000 * 60 * 60 * 24));

  if (diff === 0) return "今日";
  if (diff === 1) return "昨日";
  if (diff === 2) return "一昨日";
  if (diff > 2 && diff < 8) return `${diff}日前`;

  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
}

export default function HistoryListOneLine() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const list = getHistoryEntries()
      .slice()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setEntries(list);
  }, []);

  if (entries.length === 0) {
    return <p style={{ opacity: 0.6 }}>まだ履歴はありません</p>;
  }

  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {entries.map((e) => (
        <li
          key={e.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <span>
            {LABEL_EMOJI[e.label]} {LABEL_TEXT[e.label]}
          </span>
          <span style={{ fontSize: 12, opacity: 0.6 }}>
            {relativeDayJa(e.createdAt)}
          </span>
        </li>
      ))}
    </ul>
  );
}
