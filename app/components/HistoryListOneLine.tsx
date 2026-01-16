"use client";

import { useEffect, useState } from "react";
import { TILT_TEXT, emojiFor } from "../lib/tilt";
import { getEntries } from "../lib/storage";
import type { Entry } from "../lib/storage";

function relativeDayJa(dateIso: string): string {
  const d = new Date(dateIso);
  if (Number.isNaN(d.getTime())) return "";

  const now = new Date();
  const start = (x: Date) =>
    new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();

  // 小数ズレで diff === 1 が外れないように整数化
  const diff = Math.floor((start(now) - start(d)) / (1000 * 60 * 60 * 24));

  if (diff === 0) return "今日";
  if (diff === 1) return "昨日";
  if (diff === 2) return "一昨日";
  if (diff < 7) return `${diff}日前`;

  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
}

export default function HistoryListOneLine() {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    const data = getEntries().slice().sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    setEntries(data);
  }, []);

  if (entries.length === 0) {
    return <p style={{ opacity: 0.6 }}>まだ履歴はありません</p>;
  }

  return (
    <ul>
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
            {emojiFor(e.label)} {TILT_TEXT[e.label]}
          </span>
          <span style={{ fontSize: 12, opacity: 0.6 }}>
            {relativeDayJa(e.createdAt)}
          </span>
        </li>
      ))}
    </ul>
  );
}
