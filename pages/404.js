import Link from "next/link"
import Transition from "../components/Transition"
import { useT } from "../lib/i18n"

export default function NotFound() {
  const { t } = useT()
  return (
    <Transition>
      <section className="not-found ds-container">
        <p className="u-mono">404</p>
        <h1>{t("404.title")}</h1>
        <p className="not-found__sub">{t("404.sub")}</p>
        <div className="not-found__links u-mono">
          <Link href="/">{t("404.home")} →</Link>
          <Link href="/works">{t("nav.work")} →</Link>
          <Link href="/journal">{t("nav.journal")} →</Link>
        </div>
      </section>
    </Transition>
  )
}
