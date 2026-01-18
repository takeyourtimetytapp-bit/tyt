export type Lang = "ja" | "en";

export const getLangFromStorage = (): Lang => {
  if (typeof window === "undefined") return "ja";
  const saved = localStorage.getItem("lang");
  return saved === "en" ? "en" : "ja";
};

// Input画面で必要な最小セットだけ
export const ui = {
  ja: {
    nav_top: "トップ",
    nav_history: "履歴",

    h1: "現在の気分は？",

    focus: "集中力",
    fatigue: "疲労度",
    mood: "今の気分",

    bad: "悪い",
    mid: "普通",
    good: "良い",

    save: "保存",

    reason_optional: "理由（任意）",
    skip: "スキップ",

    btn_history: "履歴",
    btn_back: "戻る",

    aria_bad: "気分：悪い",
    aria_mid: "気分：普通",
    aria_good: "気分：良い",
    nav_home: "トップ",


nav_input: "入力",
history_empty: "まだ履歴はありません",

latest: "最新",
prev: "その前",
older: "それ以前",
now: "今",

show_more: "表示する",
show_less: "戻す",
home_headline: "勝つためじゃない　壊れないために",
home_sub: "数秒で入力、今どうするかだけを見る",
go_input: "入力する",
go_history: "履歴を見る",

plan_title: "Plan",

pro_title: "Pro Plan（月額300円）",
pro_counts: "保存件数：無料 10件 / Pro 50件",
pro_b1: "記録の保存件数が多くなります",
pro_b2: "過去の赤丸の判断理由をあとから見返せます",
pro_b3: "入力方法や判断の仕組みは無料版と変わりません",
pro_note: "※ 無料版でも、今の判断を見るには十分です",
pro_button: "Pro",

coaches_title: "コーチ・チーム利用をご検討の方へ",
coaches_l1: "TYTは、コーチ・チーム向けの利用にも対応予定です。",
coaches_l2: "ご興味がある方は、以下のフォームからご連絡ください。",
coaches_l3: "※実際のご要望があった場合にのみ開発します。",
contact_form: "Contact form",
warn_form: "GoogleフォームURLを入れてから公開",



  },
  en: {
    nav_top: "Home",
    nav_history: "History",

    h1: "How are you right now?",

    focus: "Focus",
    fatigue: "Fatigue",
    mood: "Mood",

    bad: "Low",
    mid: "OK",
    good: "Good",

    save: "Save",

    reason_optional: "Reason (optional)",
    skip: "Skip",

    btn_history: "History",
    btn_back: "Back",

    aria_bad: "Mood: bad",
    aria_mid: "Mood: neutral",
    aria_good: "Mood: good",
    // ui.en に追加
nav_input: "Check-in",
history_empty: "No history yet.",

latest: "Latest",
prev: "Previous",
older: "Earlier",
now: "Now",

show_more: "Show more",
show_less: "Collapse",
home_headline: "Not to win. Just don’t break.",
home_sub: "Log in seconds. See only what to do now.",
go_input: "Start",
go_history: "History",

plan_title: "Plan",

pro_title: "Pro Plan (¥300 / month)",
pro_counts: "Storage: Free 10 / Pro 50",
pro_b1: "You can keep more records",
pro_b2: "You can review reasons behind past red decisions",
pro_b3: "The input and decision logic are the same as the free version",
pro_note: "*The free version is enough to see what to do right now.*",
pro_button: "Pro",

coaches_title: "For Coaches / Teams",
coaches_l1: "TYT is also available for team use (coaches, trainers, teams).",
coaches_l2: "If you’re interested, please leave your contact below.",
coaches_l3: "We will only build this feature if there is actual demand.",
contact_form: "Contact form",
warn_form: "Add Google Form URLs before publishing",



  },
} as const;
