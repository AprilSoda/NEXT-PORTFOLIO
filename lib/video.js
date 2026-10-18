// Player URL for a parsed YouTube/Vimeo video (privacy-friendly hosts)
export function embedSrc(video) {
  if (video?.kind === "youtube") return `https://www.youtube-nocookie.com/embed/${video.id}?rel=0&modestbranding=1`
  if (video?.kind === "vimeo") return `https://player.vimeo.com/video/${video.id}?dnt=1${video.hash ? `&h=${video.hash}` : ""}`
  return video?.src || null
}

// Turn a pasted video URL (YouTube, Vimeo or a direct file) into something we can embed
export function parseVideoUrl(url) {
  if (!url) return null
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, "")
    if (host === "youtu.be") return { kind: "youtube", id: u.pathname.slice(1) }
    if (host.endsWith("youtube.com")) {
      if (u.pathname.startsWith("/embed/")) return { kind: "youtube", id: u.pathname.split("/")[2] }
      if (u.pathname.startsWith("/shorts/")) return { kind: "youtube", id: u.pathname.split("/")[2] }
      const id = u.searchParams.get("v")
      if (id) return { kind: "youtube", id }
    }
    if (host.endsWith("vimeo.com")) {
      // vimeo.com/123, vimeo.com/123/abcdef (unlisted), player.vimeo.com/video/123?h=abcdef,
      // vimeo.com/showcase/111/video/123 — the video id follows "video", else it's the last number
      const parts = u.pathname.split("/").filter(Boolean)
      const after = parts.findIndex((p, i) => /^videos?$/.test(parts[i - 1] || "") && /^\d+$/.test(p))
      const at = after !== -1 ? after : parts.findLastIndex((p) => /^\d+$/.test(p))
      if (at !== -1) {
        const next = parts[at + 1]
        const hash = u.searchParams.get("h") || (next && /^[0-9a-f]{6,}$/i.test(next) ? next : null)
        return { kind: "vimeo", id: parts[at], hash }
      }
    }
    if (/\.(mp4|webm|mov|m4v)(\?|$)/i.test(u.pathname)) return { kind: "file", src: url }
  } catch {
    return null
  }
  return null
}
