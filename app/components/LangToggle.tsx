"use client";

import { useEffect, useState } from "react";

type Lang = "ja" | "en";

export default function LangToggle() {
  const [lang, setLang] = useState<Lang>("ja");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = localStorage.getItem("lang");
    if (saved === "ja" || saved === "en") setLang(saved);
  }, []);

  const toggle = () => {
    const next: Lang = lang === "ja" ? "en" : "ja";
    localStorage.setItem("lang", next);
    setLang(next);
    window.location.reload(); // ←確実に全画面へ反映
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      <span
        style={{
          fontSize: 11,
          opacity: 0.65,
          fontWeight: 700,
          userSelect: "none",
        }}
      >
        Language
      </span>

      <button
        type="button"
        onClick={toggle}
        style={{
          fontSize: 12,
          fontWeight: 800,
          opacity: 0.6,
          border: "1px solid rgba(0,0,0,.12)",
          background: "rgba(255,255,255,.55)",
          borderRadius: 10,
          padding: "6px 10px",
          cursor: "pointer",
        }}
      >
        {lang === "ja" ? "EN" : "JA"}
      </button>
    </div>
  );
}
