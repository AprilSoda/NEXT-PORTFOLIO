// Dates are formatted in Seoul time so the server render and the visitor's
// browser agree (a UTC server and a KST browser otherwise disagree near midnight).
const TIME_ZONE = "Asia/Seoul"

const tag = (locale) => (locale === "ko" ? "ko-KR" : "en-US")

export function formatDate(iso, locale, options) {
  if (!iso) return ""
  return new Intl.DateTimeFormat(tag(locale), { timeZone: TIME_ZONE, ...options }).format(new Date(iso))
}

// Year of an ISO date. A bare "2026-08-14" (Notion date without time) is read
// as written; a timestamp is converted to Seoul time first.
export function yearOf(iso) {
  if (!iso) return null
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) return Number(iso.slice(0, 4))
  return Number(new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, year: "numeric" }).format(new Date(iso)))
}

export const currentYear = () => yearOf(new Date().toISOString())
