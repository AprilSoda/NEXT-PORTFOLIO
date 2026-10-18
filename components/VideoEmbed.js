import { useState } from "react"
import Image from "next/image"
import { embedSrc, parseVideoUrl, posterFor } from "../lib/video"
import { useT } from "../lib/i18n"

// 16:9 player with real controls — the finished film is meant to be watched,
// so nothing autoplays on load. YouTube/Vimeo start as a poster and a play
// button; the player (~1 MB of script) loads only when someone presses play.
export default function VideoEmbed({ url, title = "Video", poster, priority = false }) {
  const { t } = useT()
  const [playing, setPlaying] = useState(false)
  const video = parseVideoUrl(url)
  if (!video) return null

  if (video.kind === "file") {
    return (
      <div className="video-embed">
        <video src={video.src} controls playsInline preload="metadata" poster={poster} />
      </div>
    )
  }

  if (!playing) {
    const still = poster || posterFor(url)
    return (
      <div className="video-embed">
        <button type="button" className="video-embed__facade" onClick={() => setPlaying(true)} aria-label={`${t("video.play")}: ${title}`}>
          {still && <Image src={still} alt="" fill priority={priority} sizes="100vw" style={{ objectFit: "cover" }} />}
          <span className="video-embed__play" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          </span>
        </button>
      </div>
    )
  }

  const src = embedSrc(video)
  return (
    <div className="video-embed">
      <iframe
        src={`${src}${src.includes("?") ? "&" : "?"}autoplay=1`}
        title={title}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
      />
    </div>
  )
}
