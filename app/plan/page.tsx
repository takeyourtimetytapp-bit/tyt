"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import { getLangFromStorage, type Lang } from "../lib/i18n";
import LangToggle from "../components/LangToggle";

const shell: CSSProperties = { minHeight: "100vh", padding: 16 };

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
  alignItems: "center",
  marginBottom: 12,
};

const navLink: CSSProperties = {
  fontSize: 12,
  opacity: 0.7,
  textDecoration: "none",
  color: "inherit",
  fontWeight: 700,
};

const sectionTitle: CSSProperties = {
  fontWeight: 900,
  fontSize: 18,
  margin: "6px 0 10px",
};

const bodyText: CSSProperties = {
  fontSize: 13,
  lineHeight: 1.6,
  opacity: 0.8,
};

const hr: CSSProperties = {
  marginTop: 18,
  borderTop: "1px solid rgba(0,0,0,.08)",
};

const cta: CSSProperties = {
  display: "inline-block",
  marginTop: 12,
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid rgba(0,0,0,.12)",
  background: "rgba(0,0,0,.03)",
  fontWeight: 800,
  color: "inherit",
  textDecoration: "none",
};

export default function PricingPage() {
  const [lang, setLang] = useState<Lang>("ja");
  useEffect(() => setLang(getLangFromStorage()), []);

  // TODO: 後でGoogleフォームURLを入れる（日本語/英語で出し分け）
  const FORM_JA_URL = "https://forms.gle/LzmbHjTBXBZAXh4h7";
  const FORM_EN_URL = "https://forms.gle/gdKUnLEKRGCZ1gSt6";

  const formUrl = lang === "en" ? FORM_EN_URL : FORM_JA_URL;

  return (
    <main style={shell}>
      <section style={card}>
        <div style={topbar}>
          <Link href="/" style={navLink}>
            {lang === "en" ? "Home" : "トップ"}
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href="/input" style={navLink}>
              {lang === "en" ? "Check-in" : "入力"}
            </Link>
            <LangToggle />
          </div>
        </div>

        <div style={sectionTitle}>Plan</div>

        {/* Pro Plan */}
        <div style={{ marginTop: 16 }}>
          <div style={{ fontWeight: 900, fontSize: 16, marginBottom: 8 }}>
            {lang === "en" ? "Pro Plan ($2.99 / month)" : "Pro Plan（月額300円）"}
          </div>

          <div style={{ fontSize: 13, opacity: 0.8, marginTop: -8, fontWeight: 700, marginBottom: 6 }}>
            {lang === "en" ? "Storage: Free 10 / Pro 50" : "保存件数：無料 10件 / Pro 50件"}
          </div>

          <ul
            style={{
              paddingLeft: 18,
              margin: 0,
              lineHeight: 1.7,
              marginTop: 5,
              fontWeight: 600,
              fontSize: 14,
              opacity: 0.8,
            }}
          >
            {lang === "en" ? (
              <>
                <li>You can keep more records</li>
                <li>You can review reasons behind past red decisions</li>
                <li>The input and decision logic are the same as the free version</li>
              </>
            ) : (
              <>
                <li>記録の保存件数が多くなります</li>
                <li>過去の赤丸の判断理由をあとから見返せます</li>
                <li>入力方法や判断の仕組みは無料版と変わりません</li>
              </>
            )}
          </ul>

          <div style={{ marginTop: 10, fontSize: 13, opacity: 0.9, fontWeight: 700 }}>
            {lang === "en"
              ? "*The free version is enough to see what to do right now.*"
              : "※ 無料版でも、今の判断を見るには十分です"}
          </div>

          <button
            type="button"
            style={{
              marginTop: 12,
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,.15)",
              background: "rgba(0,0,0,.03)",
              fontSize: 13,
              fontWeight: 700,
              color: "#222",
              cursor: "pointer",
            }}
            onClick={() => {
              // TODO: 決済実装時に差し替え
              alert(lang === "en" ? "Pro purchase is not available yet." : "Proの購入は準備中です");
            }}
          >
            Pro
          </button>
        </div>

        <div style={hr} />

        {/* For Coaches / Teams（最下部） */}
        <div style={{ marginTop: 16 }}>
          <div style={{ fontWeight: 900, marginBottom: 8 }}>
            {lang === "en" ? "For Coaches / Teams" : "コーチ・チーム利用をご検討の方へ"}
          </div>

          <div style={bodyText}>
            {lang === "en" ? (
              <>
                <div>TYT is also available for team use (coaches, trainers, teams).</div>
                <div>If you’re interested, please leave your contact below.</div>
                <div>We will only build this feature if there is actual demand.</div>
              </>
            ) : (
              <>
                <div>TYTは、コーチ・チーム向けの利用にも対応予定です。</div>
                <div>ご興味がある方は、以下のフォームからご連絡ください。</div>
                <div>※実際のご要望があった場合にのみ開発します。</div>
              </>
            )}
          </div>

          <a href={formUrl} target="_blank" rel="noopener noreferrer" style={cta}>
            Contact form
          </a>

          {(FORM_JA_URL.includes("REPLACE_ME") || FORM_EN_URL.includes("REPLACE_ME")) && (
            <div style={{ marginTop: 10, fontSize: 12, opacity: 0.6 }}>
              ⚠️ GoogleフォームURLを入れてから公開
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
