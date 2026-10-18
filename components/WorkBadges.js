import { useT } from "../lib/i18n"

// Small mono badges for a festival selection or a film still in progress
export default function WorkBadges({ work }) {
  const { t } = useT()
  const status = work.status && work.status !== "Released" ? t(`status.${work.status}`, work.status) : null
  if (!work.honor && !status) return null
  return (
    <span className="work-badges u-mono">
      {status && <span className="work-badge work-badge--status">{status}</span>}
      {work.honor && <span className="work-badge">{work.honor}</span>}
    </span>
  )
}
