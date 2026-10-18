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

// Public credits only, newest release first. Unreleased titles stay out of this list.
// A credit links to its work page when a published Notion work's title starts with it.
export const credits = [
  { title: "Street Fighter", year: 2026, format: "ScreenX", role: { en: "VFX", ko: "VFX" } },
  { title: "부활남: 더 레드", year: 2026, format: "ScreenX", role: { en: "VFX", ko: "VFX" } },
  { title: "Avengers: Endgame", note: { en: "Re-release", ko: "재개봉" }, year: 2026, format: "ScreenX", role: { en: "VFX", ko: "VFX" } },
  { title: "The Dog Stars", year: 2026, format: "ScreenX", role: { en: "VFX", ko: "VFX" } },
  { title: "The End of Oak Street", year: 2026, format: "ScreenX", role: { en: "VFX", ko: "VFX" } },
  { title: "Last Mankind", titleKo: "종말의 인간", year: 2026, format: "Film", role: { en: "VFX Supervisor", ko: "VFX 슈퍼바이저" }, honor: { en: "Cannes Fantastic 7", ko: "칸 Fantastic 7" } },
  { title: "너를 위해서", year: 2026, format: "Short film", role: { en: "VFX Artist", ko: "VFX 아티스트" }, honor: { en: "22nd Mise-en-scène Short Film Festival", ko: "제22회 미쟝센단편영화제" } },
]

export const social = [
  { label: "IMDb", href: "https://www.imdb.com/name/nm16975542/" },
  { label: "Instagram", href: "https://www.instagram.com/lsingleplayer/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/tae-kyun-kim/" },
]

// About page — draft copy built from Tae Kyun's own answers (2026-10-18); confirm before launch
export const about = {
  manifesto: [
    {
      en: "I grew up on films about space. Seen from out there we are specks of dust — and still we fight. What I keep coming back to is the opposite: people wanting to be understood, wanting to share what they feel.",
      ko: "우주를 다룬 영화를 보며 자랐습니다. 저 멀리서 보면 우리는 먼지처럼 작은데, 그래도 서로 싸웁니다. 제가 계속 돌아가는 건 그 반대편입니다. 이해받고 싶고, 감정을 나누고 싶은 사람들.",
    },
    {
      en: "AI is changing how films get made, faster than anyone can price it. It was built from all of us, so in a way it belongs to all of us. What I want to protect is the human part — the right to express, and to connect.",
      ko: "AI는 영화를 만드는 방식을 누구도 값을 매기기 어려울 만큼 빠르게 바꾸고 있습니다. 우리 모두에게서 만들어졌으니 어떤 의미에선 모두의 자산이기도 합니다. 제가 지키고 싶은 건 사람의 몫, 표현하고 연결될 권리입니다.",
    },
    {
      en: "History repeats because people don't change. I try to see what we want before the tools decide it for us.",
      ko: "역사가 반복되는 건 사람이 바뀌지 않기 때문입니다. 도구가 대신 정하기 전에, 우리가 무엇을 원하는지 먼저 보려고 합니다.",
    },
    {
      en: "My stories have often ended dark. I'm learning to end them differently: the world is hard, but I'd rather choose the problem I give my life to — and keep dreaming well until the end.",
      ko: "제 이야기는 자주 어둡게 끝났습니다. 이제는 다르게 끝내는 법을 배우는 중입니다. 세상은 힘들지만, 평생 붙들 문제는 내가 고르고 끝까지 좋은 꿈을 꾸고 싶습니다.",
    },
  ],
  now: {
    en: "At CJ OliveNetworks I work with CJ 4DPLEX on ScreenX releases, building AI-native VFX pipelines and the tools our team uses every day. On my own, I make films and teach Nuke compositing.",
    ko: "CJ 올리브네트웍스에서 CJ 4DPLEX와 함께 ScreenX 개봉작을 작업하며, AI 기반 VFX 파이프라인과 팀이 매일 쓰는 도구를 만듭니다. 개인으로는 영화를 만들고 Nuke 컴포지팅을 가르칩니다.",
  },
  practice: [
    { en: "Films — directing, VFX supervision, compositing", ko: "영화 — 연출, VFX 슈퍼비전, 컴포지팅" },
    { en: "ScreenX releases — immersive, multi-screen cinema", ko: "ScreenX 개봉작 — 다면 상영 몰입형 영화" },
    { en: "Music videos — artists telling their own story", ko: "뮤직비디오 — 자기 이야기를 하는 아티스트와 함께" },
    { en: "AI pipelines & tools — ComfyUI workflows, Nuke tooling", ko: "AI 파이프라인과 도구 — ComfyUI 워크플로, Nuke 툴" },
    { en: "Teaching — Nuke compositing", ko: "강의 — Nuke 컴포지팅" },
  ],
  // How I work — three steps that keep the decisions human (draft)
  approach: [
    {
      title: { en: "Direct", ko: "연출" },
      text: {
        en: "The story, the frame and every choice that shapes it stay with people. I decide what a shot is for before any tool touches it.",
        ko: "이야기와 프레임, 그리고 그것을 만드는 모든 선택은 사람에게 남습니다. 어떤 도구를 쓰기 전에 이 장면이 무엇을 위한 것인지 먼저 정합니다.",
      },
    },
    {
      title: { en: "Build", ko: "구축" },
      text: {
        en: "I build the pipeline myself — ComfyUI workflows, Nuke tools, small apps — so generative models serve the shot instead of steering it.",
        ko: "파이프라인은 직접 만듭니다. ComfyUI 워크플로, Nuke 툴, 작은 앱까지. 생성 모델이 장면을 끌고 가지 않고 장면을 돕도록.",
      },
    },
    {
      title: { en: "Finish", ko: "완성" },
      text: {
        en: "Every frame is composited and checked by hand to theatrical standard, from festival shorts to ScreenX releases.",
        ko: "모든 장면은 극장 상영 기준에 맞춰 손으로 합성하고 확인합니다. 영화제 단편부터 ScreenX 개봉작까지.",
      },
    },
  ],
  tools: ["Nuke", "ComfyUI", "Python", "Blender", "DaVinci Resolve", "3DEqualizer", "After Effects", "Premiere Pro"],
  // How this site is made — practising the AI disclosure on the site itself (DRAFT)
  colophon: {
    en: "Designed by Kim Tae Kyun. Built with Next.js, written in Notion, media on Cloudflare R2. Type: Helvetica Now, Canyon, JetBrains Mono, Pretendard. Code written with Claude Code as an assistant; direction and final calls are mine.",
    ko: "디자인 김태균. Next.js로 만들고, 글은 Notion에 쓰고, 미디어는 Cloudflare R2에 둡니다. 글꼴은 Helvetica Now, Canyon, JetBrains Mono, Pretendard. 코드는 Claude Code를 보조로 썼고, 방향과 최종 결정은 제가 했습니다.",
  },
}

// "How I use AI" (/ai) — a dated statement each work's disclosure links to.
// DRAFT: written from the branding Q&A; to be confirmed in Kim Tae Kyun's own words.
export const aiPolicy = {
  updated: "2026-10-18",
  intro: {
    en: "I build AI pipelines for VFX, and I use them on my own films. Models are tools inside a pipeline. The decisions — what the story is, which frame is right, when it's finished — stay with people.",
    ko: "VFX를 위한 AI 파이프라인을 만들고, 제 영화에도 씁니다. 모델은 파이프라인 안의 도구입니다. 무엇을 이야기할지, 어떤 장면이 맞는지, 언제 끝났는지는 사람이 정합니다.",
  },
  uses: {
    title: { en: "Where AI helps", ko: "AI가 돕는 곳" },
    items: [
      { en: "Exploring — trying looks, lighting and variations quickly before committing", ko: "탐색 — 정하기 전에 룩, 조명, 변형을 빠르게 시험해 보기" },
      { en: "Production — mattes, clean-up, depth and upscaling inside a compositing pipeline", ko: "제작 — 합성 파이프라인 안에서 매트, 클린업, 뎁스, 업스케일" },
      { en: "Tools — building ComfyUI pipelines so a team can repeat good results", ko: "도구 — 팀이 좋은 결과를 반복할 수 있도록 ComfyUI 파이프라인 만들기" },
    ],
  },
  limits: {
    title: { en: "What it doesn't replace", ko: "AI가 대신하지 않는 것" },
    items: [
      { en: "The story and the script", ko: "이야기와 각본" },
      { en: "Actors' performances", ko: "배우의 연기" },
      { en: "The final call on every frame", ko: "모든 장면의 최종 결정" },
      { en: "Credit for the people who made the work", ko: "작업을 만든 사람들의 크레딧" },
    ],
  },
  labels: {
    title: { en: "How each work is labelled", ko: "작업마다 표시하는 방법" },
    body: {
      en: "Every project shows three lines — Script, Visuals, Performance — each marked Human, Assisted or Generated. These are the same three questions film festivals now ask. Realistic generated imagery is always labelled.",
      ko: "모든 작업에 각본 · 영상 · 연기 세 줄을 두고, 각각 사람 · 보조 사용 · 생성으로 표시합니다. 영화제들이 요즘 묻는 세 가지 질문과 같습니다. 실제처럼 보이는 생성 이미지는 항상 표시합니다.",
    },
  },
}
