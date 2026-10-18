import { useEffect, useState } from "react"
import Link from "next/link"
import { identity, social } from "../content/site"
import { useT } from "../lib/i18n"
import { currentYear } from "../lib/dates"

// Seoul time, rendered on the client only so SSR and hydration agree
function SeoulClock() {
  const [now, setNow] = useState(null)
  useEffect(() => {
    const tick = () => setNow(new Date())
    const first = setTimeout(tick, 0)
    const id = setInterval(tick, 30_000)
    return () => { clearTimeout(first); clearInterval(id) }
  }, [])
  if (!now) return <span className="site-footer__clock">—</span>
  const time = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Seoul", hour: "2-digit", minute: "2-digit" }).format(now)
  return <span className="site-footer__clock">{time} KST</span>
}

export default function Footer() {
  const { t, pick } = useT()
  const year = currentYear()

  return (
    <footer className="site-footer">
      <div className="site-footer__top">
        <p className="site-footer__cta">{t("footer.cta")}</p>
        <a className="site-footer__mail" href="mailto:hello@kimtaekyun.dev">hello@kimtaekyun.dev</a>
      </div>
      <div className="site-footer__grid u-mono">
        <span className="site-footer__status"><i aria-hidden="true" /> {pick(identity.status)}</span>
        <span>{pick(identity.location)} · <SeoulClock /></span>
        <ul className="site-footer__social">
          {social.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noreferrer noopener">{s.label} ↗</a>
            </li>
          ))}
          <li><Link href="/contact">{t("nav.contact")}</Link></li>
        </ul>
        <span className="site-footer__copy" suppressHydrationWarning>© {year} {pick(identity.name)}</span>
      </div>
    </footer>
  )
}
