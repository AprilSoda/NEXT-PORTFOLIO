import { createSlug } from "./slugify"

// Trim Notion pages down to what list views render, so page props stay small

export const toWorkSummary = (post) => ({
  id: post.id,
  title: post.properties.title?.title?.[0]?.plain_text || "",
  category: post.properties.sort?.select?.name || "",
  year: post.properties.date?.date?.start ? new Date(post.properties.date.date.start).getFullYear() : null,
  cover: post.cover?.external?.url || post.cover?.file?.url || null,
})

export const toJournalSummary = (post) => {
  const title = post.properties.title?.title?.[0]?.plain_text || ""
  return {
    id: post.id,
    title,
    slug: createSlug(title, post.id),
    date: post.created_time || null,
    categories: (post.properties.cateogry?.multi_select || []).map((c) => c.name),
  }
}
