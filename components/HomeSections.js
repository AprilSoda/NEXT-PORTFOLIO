import Link from "next/link"
import { useState } from "react"
import { motion } from "framer-motion"
import { identity } from "../content/site"
import CreditList from "./CreditList"
import HoverPreview from "./HoverPreview"
import WorkBadges from "./WorkBadges"
import { useT } from "../lib/i18n"
import { formatDate } from "../lib/dates"

const reveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-10% 0px" },
  transition: { duration: 1, ease: [0.19, 1, 0.22, 1] },
}

const formatMonth = (iso, locale) => formatDate(iso, locale, { year: "numeric", month: "short" })

export default function HomeSections({ works = [], journal = [], developing = [], creditLinks = {} }) {
  const { t, pick, fmt, locale } = useT()
  const [hovered, setHovered] = useState(null)

  return (
    <div className="home ds-container">
      <motion.section className="home-intro" {...reveal}>
        <p className="home-intro__statement">{pick(identity.statement)}</p>
        <p className="home-intro__summary">{pick(identity.summary)}</p>
      </motion.section>

      <motion.section className="home-credits" {...reveal}>
        <h2 className="home-label u-mono">{t("home.credits")}</h2>
        <CreditList links={creditLinks} />
      </motion.section>

      {works.length > 0 && (
        <motion.section className="home-work" {...reveal}>
          <div className="home-head">
            <h2 className="home-label u-mono">{t("home.work")}</h2>
            <Link href="/works" className="home-more u-mono">{t("home.allWork")} →</Link>
          </div>
          <div className="home-work__grid">
            {works.map((w, i) => (
              <Link
                key={w.id}
                href={`/works/${w.id}`}
                className="home-work__card"
                onMouseEnter={() => setHovered(w.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <div className="home-work__media">
                  <HoverPreview
                    cover={w.cover}
                    preview={w.preview}
                    alt={w.title}
                    active={hovered === w.id}
                    priority={i < 2}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <WorkBadges work={w} />
                </div>
                <div className="home-work__meta u-mono">
                  <span>{w.title}</span>
                  <span>{[fmt(w.category), w.role, w.year].filter(Boolean).join(" · ")}</span>
                </div>
              </Link>
            ))}
          </div>
        </motion.section>
      )}

      {developing.length > 0 && (
        <motion.section className="home-next" {...reveal}>
          <h2 className="home-label u-mono">{t("home.next")}</h2>
          <ul>
            {developing.map((w) => (
              <li key={w.id}>
                <Link href={`/works/${w.id}`} className="home-next__item">
                  <span className="home-next__title">{w.title}</span>
                  <span className="home-next__stage u-mono">{t(`status.${w.status}`, w.status)}</span>
                  {pick(w.logline) && <span className="home-next__logline">{pick(w.logline)}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </motion.section>
      )}

      {journal.length > 0 && (
        <motion.section className="home-journal" {...reveal}>
          <div className="home-head">
            <h2 className="home-label u-mono">{t("home.journal")}</h2>
            <Link href="/journal" className="home-more u-mono">{t("home.allJournal")} →</Link>
          </div>
          <ul className="journal-list">
            {journal.map((j) => (
              <li key={j.id}>
                <Link href={`/journal/${j.slug}`} className="journal-list__item">
                  <span className="journal-list__title">{j.title}</span>
                  <span className="journal-list__meta u-mono">
                    {[j.categories[0], formatMonth(j.date, locale)].filter(Boolean).join(" · ")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </motion.section>
      )}

    </div>
  )
}
