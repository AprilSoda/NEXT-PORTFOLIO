// Sample Notion rows for NOTION_MOCK=1 — lets the site build and run without
// a Notion token (local checks, CI, cloud sessions). Shapes mirror the API.

const rt = (s) => ({ rich_text: s ? [{ type: "text", plain_text: s, text: { content: s, link: null }, annotations: {} }] : [] })
const title = (s) => ({ title: [{ type: "text", plain_text: s, text: { content: s, link: null } }] })

const work = (id, name, date, extra = {}) => ({
  id,
  object: "page",
  created_time: `${date}T00:00:00.000Z`,
  last_edited_time: `${date}T00:00:00.000Z`,
  // cover: null → no cover (falls back to the trailer thumbnail when `video` is YouTube)
  cover: extra.cover === null ? null : { type: "external", external: { url: extra.cover || "/about-2.jpg" } },
  properties: {
    title: title(name),
    date: { date: { start: date } },
    pub: { checkbox: true },
    sort: { select: { name: extra.sort || "FEATURE FILM" } },
    client: { select: extra.client ? { name: extra.client } : null },
    format: { select: extra.format ? { name: extra.format } : null },
    role: rt(extra.role),
    honor: rt(extra.honor),
    summary_en: rt(extra.summary_en),
    summary_ko: rt(extra.summary_ko),
    status: { select: extra.status ? { name: extra.status } : null },
    featured: { checkbox: Boolean(extra.featured) },
    tools: { multi_select: (extra.tools || []).map((name) => ({ name })) },
    models: { multi_select: (extra.models || []).map((name) => ({ name })) },
    ai_usage: { select: extra.ai_usage ? { name: extra.ai_usage } : null },
    ai_script: { select: extra.ai_script ? { name: extra.ai_script } : null },
    ai_visuals: { select: extra.ai_visuals ? { name: extra.ai_visuals } : null },
    ai_performance: { select: extra.ai_performance ? { name: extra.ai_performance } : null },
    credits: rt(extra.credits),
    video: { url: extra.video || null },
    making: { url: null },
    preview: { url: null },
    before: { url: extra.before || null },
    after: { url: extra.after || null },
  },
})

export const works = [
  work("00000000-0000-4000-8000-000000000001", "The Dog Stars", "2026-08-28", { format: "ScreenX", sort: "SCREENX", role: "VFX", cover: null, video: "https://www.youtube.com/watch?v=sVCrTJdNtSs" }),
  work("00000000-0000-4000-8000-000000000002", "Last Mankind (종말의 인간)", "2026-07-03", {
    format: "Feature Film", role: "VFX Supervisor", honor: "Cannes Fantastic 7", featured: true,
    summary_en: "Sample summary.", summary_ko: "샘플 소개.", tools: ["Nuke", "ComfyUI"], models: ["LTX"], ai_usage: "Assisted",
    ai_script: "Human", ai_visuals: "Assisted", ai_performance: "Human",
    credits: "Director: Sample\nVFX Supervisor: Kim Tae Kyun", cover: "/about-4.jpg",
    before: "/about-2.jpg", after: "/about-4.jpg",
  }),
  work("00000000-0000-4000-8000-000000000003", "너를 위해서", "2026-07-05", { format: "Short Film", role: "VFX Artist", honor: "22nd Mise-en-scène Short Film Festival", featured: true }),
  work("00000000-0000-4000-8000-000000000004", "Acropolis", "2024-11-07", { format: "Personal", status: "In production", cover: "/about-1.webp", summary_en: "Sample logline for an original in production.", summary_ko: "제작 중인 오리지널의 샘플 로그라인." }),
]

const entry = (id, name, created, categories) => ({
  id,
  object: "page",
  created_time: `${created}T00:00:00.000Z`,
  last_edited_time: `${created}T00:00:00.000Z`,
  cover: null,
  properties: {
    title: title(name),
    date: { created_time: `${created}T00:00:00.000Z` },
    pub: { checkbox: true },
    cateogry: { multi_select: categories.map((name) => ({ name })) },
  },
})

export const journal = [
  entry("00000000-0000-4000-9000-000000000001", "Nuke Python Snippets", "2025-09-05", ["Nuke", "Scripting"]),
  entry("00000000-0000-4000-9000-000000000002", "Real Focal Distance using Arri Metadata", "2025-02-04", ["Nuke"]),
  entry("00000000-0000-4000-9000-000000000003", "Nuke 첫 세팅 가이드", "2025-01-16", ["Nuke", "Mangement"]),
]

export const blocks = [
  { id: "b-1", type: "paragraph", has_children: false, paragraph: { rich_text: rt("Sample body paragraph from the mock Notion page.").rich_text.map((r) => ({ ...r, annotations: { bold: false, code: false, color: "default", italic: false, strikethrough: false, underline: false } })) } },
]
