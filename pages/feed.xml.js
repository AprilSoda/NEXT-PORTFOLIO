import { getDatabase, JOURNAL_DB } from "../lib/notion"
import { toJournalSummary } from "../lib/summaries"
import { SITE_URL } from "../components/Layout"

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

// RSS for the Journal, so people can follow along without social media
export async function getServerSideProps({ res }) {
  const entries = (await getDatabase(JOURNAL_DB).catch(() => [])).map(toJournalSummary)
  const items = entries
    .map(
      (e) => `    <item>
      <title>${esc(e.title)}</title>
      <link>${SITE_URL}/journal/${e.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/journal/${e.slug}</guid>
      ${e.date ? `<pubDate>${new Date(e.date).toUTCString()}</pubDate>` : ""}
${e.categories.map((c) => `      <category>${esc(c)}</category>`).join("\n")}
    </item>`
    )
    .join("\n")
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Kim Tae Kyun — Journal</title>
    <link>${SITE_URL}/journal</link>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <description>Notes on filmmaking, VFX and building with AI</description>
${items}
  </channel>
</rss>`
  res.setHeader("Content-Type", "application/rss+xml; charset=utf-8")
  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800")
  res.write(xml)
  res.end()
  return { props: {} }
}

export default function Feed() {
  return null
}
