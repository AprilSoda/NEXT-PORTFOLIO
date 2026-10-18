import { getDatabase, WORKS_DB, JOURNAL_DB } from "../lib/notion"
import { createSlug } from "../lib/slugify"
import { SITE_URL } from "../components/Layout"

const LOCALES = ["en", "ko"]
const STATIC_PATHS = ["/", "/works", "/journal", "/about", "/contact"]

const url = (locale, path) => `${SITE_URL}${locale === "en" ? "" : `/${locale}`}${path === "/" ? "" : path}`

// One <url> per locale, each listing every language version (hreflang)
const entry = (path, lastmod) =>
  LOCALES.map(
    (locale) => `  <url>
    <loc>${url(locale, path)}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""}
${LOCALES.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${url(l, path)}"/>`).join("\n")}
    <xhtml:link rel="alternate" hreflang="x-default" href="${url("en", path)}"/>
  </url>`
  ).join("\n")

export async function getServerSideProps({ res }) {
  const [works, journal] = await Promise.all([
    getDatabase(WORKS_DB).catch(() => []),
    getDatabase(JOURNAL_DB).catch(() => []),
  ])
  const day = (iso) => (iso ? iso.slice(0, 10) : null)
  const paths = [
    ...STATIC_PATHS.map((p) => entry(p)),
    ...works.map((w) => entry(`/works/${w.id}`, day(w.last_edited_time))),
    ...journal.map((j) =>
      entry(`/journal/${createSlug(j.properties.title?.title?.[0]?.plain_text || "", j.id)}`, day(j.last_edited_time))
    ),
  ]
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${paths.join("\n")}
</urlset>`

  res.setHeader("Content-Type", "application/xml; charset=utf-8")
  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800")
  res.write(xml)
  res.end()
  return { props: {} }
}

export default function Sitemap() {
  return null
}
