"use client";

import { useEffect, useState, type ReactNode } from "react";

export default function LangGate({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<"ja" | "en">("ja");

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved === "ja" || saved === "en") setLang(saved);
  }, []);

  const toggleLang = () => {
    const next = lang === "ja" ? "en" : "ja";
    setLang(next);
    localStorage.setItem("lang", next);

    // page.tsx 側が localStorage を読むだけなので、確実に反映させるためリロード
    window.location.reload();
  };

  return <div data-lang={lang}>{children}</div>;
}
