import { createSlug } from "./slugify"
import { yearOf } from "./dates"

// Trim Notion pages down to what list views render, so page props stay small

const plain = (prop) => (prop?.rich_text || []).map((t) => t.plain_text).join("").trim()

// Legacy uppercase `sort` options, renamed to match `format` so filters don't split
const SORT_TO_FORMAT = { SCREENX: "ScreenX", "FEATURE FILM": "Feature Film", "SHORT FILM": "Short Film", "MUSIC VIDEO": "Music Video", COMMERCIAL: "Commercial", "PERSONAL PROJECT": "Personal" }
export const workFormat = (props) => {
  const format = props.format?.select?.name
  if (format) return format
  const sort = props.sort?.select?.name || ""
  return SORT_TO_FORMAT[sort.toUpperCase()] || sort
}

export const toWorkSummary = (post) => ({
  id: post.id,
  title: post.properties.title?.title?.[0]?.plain_text || "",
  category: workFormat(post.properties),
  role: plain(post.properties.role) || null,
  honor: plain(post.properties.honor) || null,
  status: post.properties.status?.select?.name || null,
  featured: post.properties.featured?.checkbox || false,
  year: yearOf(post.properties.date?.date?.start),
  cover: post.cover?.external?.url || post.cover?.file?.url || null,
  preview: post.properties.preview?.url || null,
  ai: ["Assisted", "Generated"].includes(post.properties.ai_usage?.select?.name),
})

// Originals still being made, with their one-line logline (en/ko) for the home slate
export const IN_PROGRESS = ["In development", "In production"]
export const toDevelopingSummary = (post) => ({
  ...toWorkSummary(post),
  logline: { en: plain(post.properties.summary_en), ko: plain(post.properties.summary_ko) || plain(post.properties.summary_en) },
})

// Notion option names with typos, shown corrected on the site
const CATEGORY_LABELS = { Mangement: "Management" }

export const toJournalSummary = (post) => {
  const title = post.properties.title?.title?.[0]?.plain_text || ""
  return {
    id: post.id,
    title,
    slug: createSlug(title, post.id),
    date: post.created_time || null,
    categories: (post.properties.cateogry?.multi_select || []).map((c) => CATEGORY_LABELS[c.name] || c.name),
  }
}
