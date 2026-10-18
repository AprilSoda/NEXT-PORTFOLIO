import Link from "next/link"
import { credits } from "../content/site"
import { useT } from "../lib/i18n"

// `links` maps a credit title to its published work page id, when there is one
export default function CreditList({ links = {} }) {
  const { pick, locale } = useT()
  return (
    <ul className="credit-list">
      {credits.map((c) => {
        const body = (
          <>
            <span className="credit-list__title">
              {locale === "ko" && c.titleKo ? c.titleKo : c.title}
              {c.note && <em> — {pick(c.note)}</em>}
              {links[c.title] && <span className="credit-list__arrow" aria-hidden="true"> →</span>}
            </span>
            <span className="credit-list__meta u-mono">
              {[c.format, pick(c.role), pick(c.honor), c.year].filter(Boolean).join(" · ")}
            </span>
          </>
        )
        return (
          <li key={c.title} className="credit-list__item">
            {links[c.title] ? <Link href={`/works/${links[c.title]}`} className="credit-list__link">{body}</Link> : body}
          </li>
        )
      })}
    </ul>
  )
}
