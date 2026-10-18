// Single source for identity copy and the public credits list.
// Every user-facing string has an `en` and a `ko` version; pick with useT().

export const identity = {
  name: { en: "Kim Tae Kyun", ko: "김태균" },
  role: { en: "VFX Artist & Filmmaker", ko: "VFX 아티스트 · 영화 만드는 사람" },
  location: { en: "Seoul, KR", ko: "서울" },
  status: { en: "Open to collaborations", ko: "협업 문의 환영" },
  // Draft positioning line — confirm with Tae Kyun before launch
  statement: {
    en: "The future looks dark from here. I choose the problems worth solving — and keep dreaming well.",
    ko: "미래는 어둡게 보일지 몰라도, 풀 가치가 있는 문제는 내가 고르고 좋은 꿈을 계속 꿉니다.",
  },
  summary: {
    en: "VFX artist and filmmaker in Seoul. I build AI-native pipelines for immersive cinema at CJ OliveNetworks (with CJ 4DPLEX on ScreenX), and make films about people, technology and the distance between us.",
    ko: "서울에서 일하는 VFX 아티스트이자 영화를 만드는 사람입니다. CJ 올리브네트웍스에서 CJ 4DPLEX와 함께 ScreenX 몰입형 상영을 위한 AI 파이프라인을 만들고, 사람과 기술, 그리고 우리 사이의 거리에 대한 영화를 만듭니다.",
  },
}

// Hero headline stays in English in both locales — it is set in the display face
export const heroLines = [
  ["KIM", "TAE", "KYUN"],
  ["VFX", "ARTIST", "&", "FILMMAKER"],
  ["CHOOSE", "THE", "PROBLEM."],
  ["DREAM", "WELL."],
]

// Public credits only. Unreleased titles stay out of this list.
export const credits = [
  { title: "Street Fighter", year: 2026, format: "ScreenX", role: { en: "VFX", ko: "VFX" } },
  { title: "Avengers: Endgame", note: { en: "Re-release", ko: "재개봉" }, year: 2026, format: "ScreenX", role: { en: "VFX", ko: "VFX" } },
  { title: "The Dog Stars", year: 2026, format: "ScreenX", role: { en: "VFX", ko: "VFX" } },
  { title: "The End of Oak Street", year: 2026, format: "ScreenX", role: { en: "VFX", ko: "VFX" } },
  { title: "부활남 더 레드", format: "ScreenX", role: { en: "VFX", ko: "VFX" } },
  { title: "Last Mankind", titleKo: "종말의 인간", year: 2026, format: "Film", role: { en: "VFX Supervisor", ko: "VFX 슈퍼바이저" }, honor: { en: "Cannes Fantastic 7", ko: "칸 Fantastic 7" } },
  { title: "너를 위해서", year: 2026, format: "Short film", role: { en: "VFX Artist", ko: "VFX 아티스트" }, honor: { en: "22nd Mise-en-scène Short Film Festival", ko: "제22회 미쟝센단편영화제" } },
]

export const social = [
  { label: "IMDb", href: "https://www.imdb.com/name/nm16975542/" },
  { label: "Instagram", href: "https://www.instagram.com/lsingleplayer/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/tae-kyun-kim/" },
]
