import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { identity } from "../content/site"
import CreditList from "./CreditList"
import { useT } from "../lib/i18n"

const reveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-10% 0px" },
  transition: { duration: 1, ease: [0.19, 1, 0.22, 1] },
}

const formatDate = (iso, locale) =>
  iso
    ? new Date(iso).toLocaleDateString(locale === "ko" ? "ko-KR" : "en-US", {
        year: "numeric",
        month: "short",
      })
    : ""

export default function HomeSections({ works = [], journal = [] }) {
  const { t, pick, locale } = useT()

  return (
    <div className="home ds-container">
      <motion.section className="home-intro" {...reveal}>
        <p className="home-intro__statement">{pick(identity.statement)}</p>
        <p className="home-intro__summary">{pick(identity.summary)}</p>
      </motion.section>

      <motion.section className="home-credits" {...reveal}>
        <h2 className="home-label u-mono">{t("home.credits")}</h2>
        <CreditList />
      </motion.section>

      {works.length > 0 && (
        <motion.section className="home-work" {...reveal}>
          <div className="home-head">
            <h2 className="home-label u-mono">{t("home.work")}</h2>
            <Link href="/works" className="home-more u-mono">{t("home.allWork")} →</Link>
          </div>
          <div className="home-work__grid">
            {works.map((w, i) => (
              <Link key={w.id} href={`/works/${w.id}`} className="home-work__card">
                <div className="home-work__media">
                  {w.cover && (
                    <Image
                      src={w.cover}
                      alt={w.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{ objectFit: "cover" }}
                      priority={i < 2}
                    />
                  )}
                </div>
                <div className="home-work__meta u-mono">
                  <span>{w.title}</span>
                  <span>{[w.category, w.year].filter(Boolean).join(" · ")}</span>
                </div>
              </Link>
            ))}
          </div>
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
                    {[j.categories[0], formatDate(j.date, locale)].filter(Boolean).join(" · ")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </motion.section>
      )}

      <motion.section className="home-contact" {...reveal}>
        <h2 className="home-contact__title">{t("home.contactTitle")}</h2>
        <Link href="/contact" className="home-contact__cta u-mono">{t("home.contactCta")} →</Link>
      </motion.section>
    </div>
  )
}
