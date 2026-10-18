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
      const id = u.pathname.split("/").filter(Boolean).pop()
      if (/^\d+$/.test(id)) return { kind: "vimeo", id }
    }
    if (/\.(mp4|webm|mov|m4v)(\?|$)/i.test(u.pathname)) return { kind: "file", src: url }
  } catch {
    return null
  }
  return null
}
