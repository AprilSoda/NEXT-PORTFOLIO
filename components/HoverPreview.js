import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import Image from "next/image"

const QUERY = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)"
const subscribe = (onChange) => {
  const mq = window.matchMedia(QUERY)
  mq.addEventListener("change", onChange)
  return () => mq.removeEventListener("change", onChange)
}
// Previews only for a mouse, no reduced motion, no Save-Data; never during SSR
const canPreview = () => window.matchMedia(QUERY).matches && !navigator.connection?.saveData

// Cover image with an optional silent loop that only loads and plays while the
// card is hovered — on a fine pointer, without reduced motion or Save-Data.
export default function HoverPreview({ cover, preview, alt, active, priority, sizes }) {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const allowed = useSyncExternalStore(subscribe, canPreview, () => false) && Boolean(preview)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return undefined
    if (active) {
      // Small delay so a cursor sweeping across the grid doesn't start downloads
      const t = setTimeout(() => {
        if (!video.getAttribute("src")) video.src = preview
        video.play().catch(() => {})
      }, 150)
      return () => clearTimeout(t)
    }
    video.pause()
    return undefined
  }, [active, preview])

  return (
    <>
      {cover && (
        <Image src={cover} alt={alt} fill style={{ objectFit: "cover" }} priority={priority} sizes={sizes} />
      )}
      {allowed && (
        <video
          ref={videoRef}
          className={`hover-preview${playing ? " is-playing" : ""}`}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          onPlaying={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
      )}
    </>
  )
}
