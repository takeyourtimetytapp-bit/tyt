"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { saveMatch } from "../lib/store";
import type { Mood } from "../lib/store";
import {
  addHistoryEntry,
  decideLabel,
  LABEL_TEXT,
  pickSubtextByLang,
  LABEL_TEXT_EN,
  REASON_TEXT_JP,
  REASON_TEXT_EN,
  setHistoryReason,
} from "../lib/tiltguardHistory";
import type { RedReason, TiltLabel } from "../lib/tiltguardHistory";
import { getLangFromStorage, ui, type Lang } from "../lib/i18n";
import LangToggle from "../components/LangToggle";

/** 3択 → 内部5段階（悪→良） */
const map3to5 = { low: 2, mid: 3, high: 4 } as const;
type Level3 = keyof typeof map3to5;

const shell: CSSProperties = { minHeight: "100vh", padding: 20 };

const card: CSSProperties = {
  maxWidth: 520,
  margin: "0 auto",
  background: "var(--card)",
  borderRadius: "var(--r-card)",
  boxShadow: "var(--shadow-card)",
  overflow: "hidden",
};

const header: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px 18px",
  background: "rgba(255,255,255,.55)",
  borderBottom: "1px solid var(--line)",
};

const headerTitle: CSSProperties = {
  fontWeight: 800,
  fontSize: 22,
  letterSpacing: 0.2,
};

const headerNav: CSSProperties = {
  display: "flex",
  gap: 14,
  color: "var(--muted)",
  fontSize: 14,
  fontWeight: 700,
};

const body: CSSProperties = { padding: 18 };

const h1: CSSProperties = {
  fontSize: 26,
  fontWeight: 900,
  margin: "4px 0 18px",
};

const label: CSSProperties = {
  fontSize: 18,
  fontWeight: 800,
  margin: "18px 0 10px",
  color: "rgba(0,0,0,.65)",
};

const row: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 12,
};

const chip = (active: boolean): CSSProperties => ({
  padding: "12px 10px",
  borderRadius: 12,
  minWidth: 0,

  border: active ? "2px solid rgba(0,0,0,.28)" : "2px solid rgba(0,0,0,.22)",
  background: active ? "rgba(0,0,0,.06)" : "rgba(255,255,255,.6)",

  transform: active ? "translateY(1px)" : "none",
  boxShadow: active ? "0 1px 0 rgba(0,0,0,.10) inset" : "0 1px 2px rgba(0,0,0,.06)",

  textAlign: "center",
  fontWeight: 800,
  color: "rgba(0,0,0,.75)",
  cursor: "pointer",
});

const saveBtn: CSSProperties = {
  width: "100%",
  marginTop: 16,
  padding: "16px 14px",
  borderRadius: 14,
  border: "1px solid rgba(0,0,0,.08)",
  background: "rgba(0,0,0,.04)",
  fontWeight: 900,
  color: "rgba(0,0,0,.65)",
  cursor: "pointer",
};

const resultCard: CSSProperties = {
  marginTop: 18,
  padding: 18,
  borderRadius: 16,
  background: "var(--card2)",
  border: "2px solid rgba(0,0,0,.25)",
  boxShadow: "0 4px 20px rgba(0,0,0,.08)",
};

const resultMain: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  fontSize: 24,
  fontWeight: 950,
};

const resultSub: CSSProperties = {
  marginTop: 8,
  marginLeft: 43.5,
  color: "rgba(0,0,0,.62)",
  fontWeight: 700,
};

const divider: CSSProperties = {
  marginTop: 14,
  borderTop: "1px solid rgba(0,0,0,.08)",
};

const resultBtns: CSSProperties = {
  marginTop: 14,
  display: "flex",
  justifyContent: "flex-end",
  gap: 12,
};

const smallBtn = (primary?: boolean): CSSProperties => ({
  padding: "10px 18px",
  borderRadius: 12,
  border: `1px solid ${primary ? "rgba(0,0,0,.20)" : "rgba(0,0,0,.12)"}`,
  background: primary ? "rgba(255,255,255,.9)" : "rgba(255,255,255,.55)",
  fontWeight: 900,
  color: "rgba(0,0,0,.70)",
  cursor: "pointer",
});

function dotColor(label: TiltLabel) {
  if (label === "red") return "#e74c3c";
  if (label === "yellow") return "#f1c40f";
  return "#2ecc71";
}

export default function InputPage() {
  const [lang, setLang] = useState<Lang>("ja");
  useEffect(() => setLang(getLangFromStorage()), []);

  const T = ui[lang];

  const [focus3, setFocus3] = useState<Level3>("mid");
  const [fatigue3, setFatigue3] = useState<Level3>("mid");
  const [mood, setMood] = useState<Mood>("neutral");

  const moodBad = "😣";
  const moodMid = "😐";
  const moodGood = "😊";

  const [result, setResult] = useState<null | TiltLabel>(null);

  const isPro =
    typeof window !== "undefined" && localStorage.getItem("tiltguard:pro") === "1";

  const [lastEntryId, setLastEntryId] = useState<string | null>(null);
  const [showReasonPicker, setShowReasonPicker] = useState(false);

  // 結果が出たタイミングで1回だけ決まる（表示中に変わらない）
  const sub = useMemo(() => (result ? pickSubtextByLang(result, lang) : ""), [result, lang]);

  function submit() {
    const createdAt = new Date().toISOString();
    const focus = map3to5[focus3];
    const fatigue = map3to5[fatigue3];

    saveMatch({ date: createdAt, focus, fatigue, mood });

    const label = decideLabel({ focus, fatigue, mood });

    // ✅ ここで履歴エントリを作成してIDを取る
    const entryId = addHistoryEntry({ createdAt, label });
    setLastEntryId(entryId);

    setResult(label);

    // ✅ Proかつ🔴だけ、理由選択を出す（スキップ可）
    if (isPro && label === "red") {
      setShowReasonPicker(true);
    } else {
      setShowReasonPicker(false);
    }
  }

  return (
    <main style={shell}>
      <section style={card}>
       <header style={header}>
  <div style={headerTitle}>TiltGuard</div>

  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
    <nav style={headerNav}>
      <Link href="/">{T.nav_top}</Link>
      <span style={{ opacity: 0.35 }}>|</span>
      <Link href="/history">{T.nav_history}</Link>

      <span style={{ opacity: 0.35 }} className="pro-link">|</span>
      <Link href="/plan" className="pro-link">Pro</Link>
    </nav>

    <LangToggle />
  </div>
</header>




        <div style={body}>
          <div style={h1}>{T.h1}</div>

          <div style={label}>{T.focus}</div>
          <div style={row}>
            <button type="button" style={chip(focus3 === "low")} onClick={() => setFocus3("low")}>
              {T.bad}
            </button>
            <button type="button" style={chip(focus3 === "mid")} onClick={() => setFocus3("mid")}>
              {T.mid}
            </button>
            <button type="button" style={chip(focus3 === "high")} onClick={() => setFocus3("high")}>
              {T.good}
            </button>
          </div>

          <div style={label}>{T.fatigue}</div>
          <div style={row}>
            <button type="button" style={chip(fatigue3 === "high")} onClick={() => setFatigue3("high")}>
              {T.bad}
            </button>
            <button type="button" style={chip(fatigue3 === "mid")} onClick={() => setFatigue3("mid")}>
              {T.mid}
            </button>
            <button type="button" style={chip(fatigue3 === "low")} onClick={() => setFatigue3("low")}>
              {T.good}
            </button>
          </div>

          <div style={label}>{T.mood}</div>
          <div style={row}>
            <button
              type="button"
              style={{ ...chip(mood === "bad"), fontSize: 22, lineHeight: "1.1" }}
              onClick={() => setMood("bad")}
              aria-label={T.aria_bad}
            >
              {moodBad}
            </button>

            <button
              type="button"
              style={{ ...chip(mood === "neutral"), fontSize: 22, lineHeight: "1.1" }}
              onClick={() => setMood("neutral")}
              aria-label={T.aria_mid}
            >
              {moodMid}
            </button>

            <button
              type="button"
              style={{ ...chip(mood === "good"), fontSize: 22, lineHeight: "1.1" }}
              onClick={() => setMood("good")}
              aria-label={T.aria_good}
            >
              {moodGood}
            </button>
          </div>

          <button style={saveBtn} onClick={submit}>
            {T.save}
          </button>

          {result && (
            <section style={resultCard}>
              <div style={resultMain}>
                <span
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 999,
                    background: dotColor(result),
                    display: "inline-block",
                    boxShadow: "0 1px 0 rgba(255,255,255,.65) inset, 0 2px 10px rgba(0,0,0,.10)",
                  }}
                />
                <span>{lang === "en" ? LABEL_TEXT_EN[result] : LABEL_TEXT[result]}</span>
              </div>

              <div style={resultSub}>{sub}</div>

              {/* ✅ Pro & 🔴 のときだけ：理由選択（スキップ可） */}
              {isPro && result === "red" && showReasonPicker && lastEntryId && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(0,0,0,.55)" }}>
                    {T.reason_optional}
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: 10,
                      marginTop: 10,
                    }}
                  >
                    {(["people", "event", "condition", "environment", "unknown"] as RedReason[]).map((r) => (
                      <button
                        key={r}
                        type="button"
                        style={{
                          padding: "10px 12px",
                          borderRadius: 12,
                          border: "1px solid rgba(0,0,0,.14)",
                          background: "rgba(0,0,0,.03)",
                          fontWeight: 800,
                          color: "rgba(0,0,0,.75)",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setHistoryReason(lastEntryId, r);
                          setShowReasonPicker(false);
                        }}
                      >
                        {lang === "en" ? REASON_TEXT_EN[r] : REASON_TEXT_JP[r]}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    style={{
                      marginTop: 10,
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 12,
                      border: "1px solid rgba(0,0,0,.12)",
                      background: "transparent",
                      fontWeight: 800,
                      color: "rgba(0,0,0,.55)",
                      cursor: "pointer",
                    }}
                    onClick={() => setShowReasonPicker(false)}
                  >
                    {T.skip}
                  </button>
                </div>
              )}

              <div style={divider} />

              <div style={resultBtns}>
                <Link href="/history">
                  <button style={smallBtn(true)}>{T.btn_history}</button>
                </Link>
                <button
                  style={smallBtn()}
                  onClick={() => {
                    setResult(null);
                    setShowReasonPicker(false);
                    setLastEntryId(null);
                  }}
                  type="button"
                >
                  {T.btn_back}
                </button>
              </div>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}
