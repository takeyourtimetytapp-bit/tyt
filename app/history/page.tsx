"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import {
  getHistoryEntries,
  LABEL_TEXT,
  LABEL_TEXT_EN,
  REASON_TEXT_JP,
  REASON_TEXT_EN,
} from "../lib/tiltguardHistory";
import type { HistoryEntry } from "../lib/tiltguardHistory";
import { getLangFromStorage, ui, type Lang } from "../lib/i18n";
import LangToggle from "../components/LangToggle";

/* ===== 画面全体 ===== */
const shell: CSSProperties = { minHeight: "100vh", padding: 16, background: "#f3f1ee" };

/* ===== 中央カード ===== */
const card: CSSProperties = {
  maxWidth: 520,
  margin: "0 auto",
  background: "#fbfaf8",
  border: "1px solid #e6e2dd",
  borderRadius: 18,
  padding: 18,
};

/* ===== 上部ナビ ===== */
const topbar: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 12,
};

const navLink: CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  opacity: 0.7,
  textDecoration: "none",
  color: "inherit",
};

/* ===== 最新カード ===== */
const latestCard: CSSProperties = {
  padding: 16,
  borderRadius: 14,
  background: "#fff",
  border: "2px solid rgba(0,0,0,.32)",
  boxShadow: "0 3px 18px rgba(0,0,0,0.08)",
  marginBottom: 18,
};

/* ===== 履歴カード ===== */
const historyCard: CSSProperties = {
  padding: 16,
  borderRadius: 14,
  background: "#fff",
  border: "2px solid rgba(0,0,0,.22)",
  boxShadow: "0 3px 18px rgba(0,0,0,0.04)",
};

/* ===== Pro表示 ===== */
const proNote: CSSProperties = {
  marginTop: 12,
  fontSize: 12,
  color: "rgba(0,0,0,.45)",
};

/* ===== 色 ===== */
function dotColor(label: HistoryEntry["label"]) {
  if (label === "red") return "#c97a7a";
  if (label === "yellow") return "#d6bf7c";
  return "#7fae8a";
}

function chunk5<T>(arr: T[]) {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += 5) out.push(arr.slice(i, i + 5));
  return out;
}

function Dot({
  label,
  size = 14,
  faded = false,
}: {
  label: HistoryEntry["label"];
  size?: number;
  faded?: boolean;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 6,
        background: dotColor(label),
        opacity: faded ? 0.8 : 1,
        margin: "0 auto",
      }}
    />
  );
}

/* ===== 5件ブロック ===== */
function Block5({
  title,
  items,
  strong,
  showNowLabel,
  isPro,
  lang,
}: {
  title: string;
  items: HistoryEntry[];
  strong?: boolean;
  showNowLabel?: boolean;
  isPro: boolean;
  lang: Lang;
}) {
  const T = ui[lang];
  const isEn = lang === "en";

  const filled = [...items];
  while (filled.length < 5) {
    filled.push({ id: `empty-${filled.length}`, createdAt: "", label: "yellow" } as HistoryEntry);
  }

  const titleStyle: CSSProperties = {
    fontSize: 14,
    fontWeight: 600,
    color: strong ? "#555" : "rgba(0,0,0,.50)",
    marginBottom: 6,
    marginLeft: 32,
  };

  return (
    <div style={{ marginTop: strong ? 0 : 10 }}>
      <div
      className="hist-block-title"
        style={{
          ...titleStyle,

          // 英語だけ位置を微調整
          marginLeft: showNowLabel
            ? isEn
              ? 34
              : 42 // NOW
            : title === T.prev
              ? isEn
                ? 22
                : 30 // Previous
              : 30, // Earlier（そのまま）
        }}
      >
        {showNowLabel ? T.now : title}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 12,
          padding: "6px 8px",
          opacity: strong ? 1 : 0.9,
        }}
      >
        {filled.slice(0, 5).map((e, i) => {
          const isEmpty = !e.createdAt;
          const isHot = strong && i === 0 && !isEmpty;

          return (
            <div
              key={e.id}
              style={{
                padding: 6,
                borderRadius: 8,
                boxSizing: "border-box",
                outline: isHot ? "1.5px solid rgba(0,0,0,.35)" : "1.5px solid transparent",
                outlineOffset: 0,
                opacity: isEmpty ? 0 : 1,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <Dot label={e.label} size={strong ? 14 : 12} faded={!strong} />

                {isPro && e.label === "red" && e.reason && (
                  <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(0,0,0,.38)" }}>
                    {lang === "en" ? REASON_TEXT_EN[e.reason] : REASON_TEXT_JP[e.reason]}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const [expanded, setExpanded] = useState(false);

  const [lang, setLang] = useState<Lang>("ja");
  useEffect(() => setLang(getLangFromStorage()), []);
  const T = ui[lang];

  const isPro =
    typeof window !== "undefined" && localStorage.getItem("tiltguard:pro") === "1";

  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const list = getHistoryEntries()
      .slice()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setEntries(list);
  }, []);

  const visible = entries.slice(0, isPro ? 50 : 10);

  if (entries.length === 0) {
    return (
      <main style={shell}>
        <section style={card}>
          <div style={topbar}>
            <Link href="/" style={navLink}>
              TiltGuard
            </Link>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Link href="/input" style={navLink}>
                {T.nav_input}
              </Link>

              <LangToggle />
            </div>
          </div>

          <p style={{ opacity: 0.6, margin: 0 }}>{T.history_empty}</p>
        </section>
      </main>
    );
  }

  const latest = entries[0];

  const blocks = chunk5(visible);
  const maxCollapsed = 2;
  const shownCount = expanded ? blocks.length : Math.min(blocks.length, maxCollapsed);
  const shownBlocks = blocks.slice(0, shownCount);

  return (
    <main style={shell}>
      <section style={card}>
        <div style={topbar}>
          <Link href="/" style={navLink}>
            TiltGuard
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href="/input" style={navLink}>
              {T.nav_input}
            </Link>

            <LangToggle />
          </div>
        </div>

        {/* 最新の判断 */}
        <section style={latestCard}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: 999,
                background: dotColor(latest.label),
              }}
            />
            <div style={{ fontSize: 22, fontWeight: 800 }}>
              {lang === "en" ? LABEL_TEXT_EN[latest.label] : LABEL_TEXT[latest.label]}
            </div>
          </div>
        </section>

        {/* 履歴（5件ブロック） */}
        <section style={historyCard}>
          {shownBlocks.map((items, idx) => {
            const title = idx === 0 ? T.latest : idx === 1 ? T.prev : idx === 2 ? T.older : "";

            return (
              <Block5
                key={`b-${idx}`}
                title={title}
                items={items}
                strong={idx === 0}
                showNowLabel={idx === 0}
                isPro={isPro}
                lang={lang}
              />
            );
          })}

          {/* Proだけ：たたんでる時に「表示する」 */}
          {isPro && blocks.length > 2 && !expanded && (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              style={{
                marginTop: 10,
                width: "100%",
                padding: "12px 14px",
                borderRadius: 12,
                border: "1px solid rgba(0,0,0,.12)",
                background: "rgba(0,0,0,.03)",
                fontWeight: 800,
                color: "rgba(0,0,0,.70)",
                cursor: "pointer",
              }}
            >
              {T.show_more}
            </button>
          )}

          {/* Proだけ：展開後に「戻す」 */}
          {isPro && blocks.length > 3 && expanded && (
            <button
              type="button"
              onClick={() => setExpanded(false)}
              style={{
                marginTop: 10,
                width: "100%",
                padding: "12px 14px",
                borderRadius: 12,
                border: "1px solid rgba(0,0,0,.12)",
                background: "rgba(0,0,0,.03)",
                fontWeight: 800,
                color: "rgba(0,0,0,.70)",
                cursor: "pointer",
              }}
            >
              {T.show_less}
            </button>
          )}

          {/* 無料だけ：Pro表示 */}
          {!isPro && <div style={proNote}>Pro (coming soon)</div>}
        </section>
      </section>
    </main>
  );
}
