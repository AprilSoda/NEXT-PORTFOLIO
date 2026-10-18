import { createSlug } from "./slugify"
import { yearOf } from "./dates"

// Trim Notion pages down to what list views render, so page props stay small

const plain = (prop) => (prop?.rich_text || []).map((t) => t.plain_text).join("").trim()

export const toWorkSummary = (post) => ({
  id: post.id,
  title: post.properties.title?.title?.[0]?.plain_text || "",
  category: post.properties.format?.select?.name || post.properties.sort?.select?.name || "",
  role: plain(post.properties.role) || null,
  honor: plain(post.properties.honor) || null,
  status: post.properties.status?.select?.name || null,
  featured: post.properties.featured?.checkbox || false,
  year: yearOf(post.properties.date?.date?.start),
  cover: post.cover?.external?.url || post.cover?.file?.url || null,
  preview: post.properties.preview?.url || null,
  ai: ["Assisted", "Generated"].includes(post.properties.ai_usage?.select?.name),
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
