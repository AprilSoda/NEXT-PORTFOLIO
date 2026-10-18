import { embedSrc, parseVideoUrl } from "../lib/video"

// 16:9 player with real controls — the finished film is meant to be watched,
// so nothing autoplays here
export default function VideoEmbed({ url, title = "Video" }) {
  const video = parseVideoUrl(url)
  if (!video) return null

  if (video.kind === "file") {
    return (
      <div className="video-embed">
        <video src={video.src} controls playsInline preload="metadata" />
      </div>
    )
  }

  const src = embedSrc(video)

  return (
    <div className="video-embed">
      <iframe
        src={src}
        title={title}
        loading="lazy"
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
      />
    </div>
  )
}
