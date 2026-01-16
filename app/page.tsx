"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import { getLangFromStorage, ui, type Lang } from "./lib/i18n";
import LangToggle from "./components/LangToggle";

const shell: CSSProperties = {
  minHeight: "100vh",
  padding: 16,
};

const card: CSSProperties = {
  maxWidth: 520,
  margin: "0 auto",
  background: "#fff",
  border: "1px solid #e5e5e5",
  borderRadius: 14,
  padding: 16,
};

const topbar: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: 12,
};

const brand: CSSProperties = { fontWeight: 800 };

const primaryLink: CSSProperties = {
  display: "block",
  textDecoration: "none",
};

const primaryBtn: CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #ddd",
  background: "#111",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};

const secondaryBtn: CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #ddd",
  background: "#f5f5f5",
  color: "#444",
  fontWeight: 700,
  cursor: "pointer",
};

export default function Home() {
  const [lang, setLang] = useState<Lang>("ja");
  useEffect(() => setLang(getLangFromStorage()), []);
  const T = ui[lang];

  return (
    <main style={shell}>
      <section style={card}>
        <div style={topbar}>
          {/* 左側：ブランド + 思想 */}
          <div>
            <div style={brand}>TiltGuard</div>

            <div
              style={{
                marginTop: 4,
                marginBottom: 12,
                fontSize: 12,
                lineHeight: 1.4,
                opacity: 0.45,
              }}
            >
              <div>No analysis. No advice. Just a decision.</div>
              <div>For competitive games like VALORANT / League of Legends</div>
            </div>
          </div>

          {/* 右側：タグライン + 言語 */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ fontSize: 12, opacity: 0.55 }}>Take Your Time</div>
            <LangToggle />
          </div>
        </div>

        {/* 日本語メインコピー（そのまま） */}
        <div style={{ marginTop: 6 }}>
          <div style={{ fontWeight: 700, fontSize: 18 }}>{T.home_headline}</div>

          <div style={{ marginTop: 6, opacity: 0.75, lineHeight: 1.6 }}>{T.home_sub}</div>
        </div>

        <div style={{ marginTop: 30, display: "grid", gap: 20 }}>
          <Link href="/input" style={primaryLink}>
            <button style={primaryBtn}>{T.go_input}</button>
          </Link>

          <Link href="/history" style={primaryLink}>
            <button style={secondaryBtn}>{T.go_history}</button>
          </Link>
        </div>

        <div
          style={{
            marginTop: 14,
            fontSize: 12,
            opacity: 0.45,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>TiltGuard by TYT</span>
          <Link href="/plan" style={{ color: "inherit", textDecoration: "none" }}>
            Plan
          </Link>
        </div>
      </section>
    </main>
  );
}
