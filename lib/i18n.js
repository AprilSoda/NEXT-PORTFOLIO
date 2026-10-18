import { useRouter } from "next/router"

// UI strings. Content copy (bio, credits) lives in content/site.js.
const strings = {
  en: {
    "nav.work": "WORK",
    "nav.journal": "JOURNAL",
    "nav.about": "ABOUT",
    "nav.contact": "CONTACT",
    "lang.switch": "한국어",
    "hero.watchReel": "Watch reel",
    "home.credits": "Selected credits",
    "home.work": "Selected work",
    "home.allWork": "All work",
    "home.journal": "Journal",
    "home.allJournal": "All entries",
    "home.contactTitle": "Have a story worth telling?",
    "home.contactCta": "Get in touch",
    "work.eyebrow": "Work",
    "work.intro": "Films, ScreenX releases and music videos — the finished frame first. How it was made lives inside each project.",
    "journal.title": "JOURNAL",
    "journal.sub": "Notes on filmmaking, VFX and building with AI",
    "journal.back": "← All entries",
    "meta.description": "Kim Tae Kyun — VFX artist and filmmaker in Seoul. ScreenX, films and AI-native VFX pipelines.",
  },
  ko: {
    "nav.work": "작업",
    "nav.journal": "저널",
    "nav.about": "소개",
    "nav.contact": "연락",
    "lang.switch": "English",
    "hero.watchReel": "쇼릴 보기",
    "home.credits": "주요 크레딧",
    "home.work": "대표 작업",
    "home.allWork": "모든 작업",
    "home.journal": "저널",
    "home.allJournal": "모든 글",
    "home.contactTitle": "함께 만들 이야기가 있나요?",
    "home.contactCta": "연락하기",
    "work.eyebrow": "작업",
    "work.intro": "영화, ScreenX 개봉작, 뮤직비디오 — 완성된 장면을 먼저 보여드립니다. 만든 과정은 각 프로젝트 안에 있습니다.",
    "journal.title": "저널",
    "journal.sub": "영화, VFX, 그리고 AI로 만드는 일에 대한 기록",
    "journal.back": "← 모든 글",
    "meta.description": "김태균 — 서울의 VFX 아티스트이자 영화를 만드는 사람. ScreenX, 영화, AI 기반 VFX 파이프라인.",
  },
}

// Returns { t, pick, locale }: t("key") for UI strings, pick({ en, ko }) for content
export function useT() {
  const { locale = "en" } = useRouter()
  const table = strings[locale] || strings.en
  const t = (key) => table[key] ?? strings.en[key] ?? key
  const pick = (value) =>
    value && typeof value === "object" ? value[locale] ?? value.en : value
  return { t, pick, locale }
}
