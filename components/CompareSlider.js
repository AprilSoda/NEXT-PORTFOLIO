import { useRef, useState } from "react"
import { useT } from "../lib/i18n"

const isVideo = (url) => /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url || "")

function Layer({ src, label }) {
  return isVideo(src) ? (
    <video src={src} muted loop playsInline autoPlay preload="metadata" aria-label={label} />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element -- arbitrary R2 URLs, sized by the frame
    <img src={src} alt={label} loading="lazy" />
  )
}

// Drag (or arrow-key) wipe between a plate and the final frame
export default function CompareSlider({ before, after }) {
  const { t } = useT()
  const [pos, setPos] = useState(50)
  const ref = useRef(null)

  const moveTo = (clientX) => {
    const rect = ref.current.getBoundingClientRect()
    setPos(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)))
  }

  return (
    <div
      ref={ref}
      className="compare"
      onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); moveTo(e.clientX) }}
      onPointerMove={(e) => { if (e.buttons) moveTo(e.clientX) }}
    >
      <Layer src={after} label={t("compare.after")} />
      <div className="compare__before" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Layer src={before} label={t("compare.before")} />
      </div>
      <span className="compare__tag compare__tag--before u-mono">{t("compare.before")}</span>
      <span className="compare__tag compare__tag--after u-mono">{t("compare.after")}</span>
      <div
        className="compare__handle"
        style={{ left: `${pos}%` }}
        role="slider"
        tabIndex={0}
        aria-label={t("compare.label")}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 5))
          if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 5))
        }}
      />
    </div>
  )
}
