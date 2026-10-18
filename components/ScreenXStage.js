import { useT } from "../lib/i18n"

// ScreenX explained in one picture: the film on the screen, and the same world
// carried onto the side walls of the auditorium (270°). Uses the work's cover;
// without one, the walls are drawn as an empty grid.
export default function ScreenXStage({ image }) {
  const { t } = useT()
  // One resized copy via the image optimizer, shared by all three panels
  const bg = image ? { backgroundImage: `url("/_next/image?url=${encodeURIComponent(image)}&w=1200&q=75")` } : undefined

  return (
    <figure className="screenx">
      <div className="screenx__stage" aria-hidden="true">
        <div className="screenx__wall screenx__wall--left" style={bg} />
        <div className="screenx__screen" style={bg} />
        <div className="screenx__wall screenx__wall--right" style={bg} />
      </div>
      <div className="screenx__labels u-mono" aria-hidden="true">
        <span>{t("screenx.wall")}</span>
        <span>{t("screenx.screen")}</span>
        <span>{t("screenx.wall")}</span>
      </div>
      <figcaption className="screenx__caption">
        <span className="u-mono">{t("screenx.title")}</span>
        <p>{t("screenx.body")}</p>
      </figcaption>
    </figure>
  )
}
