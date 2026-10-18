import { credits } from "../content/site"
import { useT } from "../lib/i18n"

export default function CreditList() {
  const { pick, locale } = useT()
  return (
    <ul className="credit-list">
      {credits.map((c) => (
        <li key={c.title} className="credit-list__item">
          <span className="credit-list__title">
            {locale === "ko" && c.titleKo ? c.titleKo : c.title}
            {c.note && <em> — {pick(c.note)}</em>}
          </span>
          <span className="credit-list__meta u-mono">
            {[c.format, pick(c.role), pick(c.honor), c.year].filter(Boolean).join(" · ")}
          </span>
        </li>
      ))}
    </ul>
  )
}
