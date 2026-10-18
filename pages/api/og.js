import { ImageResponse } from "next/og"

// Share card (1200×630) for pages without a permanent cover image:
// /api/og?title=…&kicker=…&meta=…  — used by work and journal pages
export const config = { runtime: "edge" }

const clip = (value, max) => (value || "").slice(0, max)

const helveticaBold = fetch(new URL("../../styles/font/HelveticaNowDisplay-Bold.woff", import.meta.url)).then((r) =>
  r.arrayBuffer()
)

// Korean glyphs: ask Google Fonts for just the characters on this card
async function koreanFont(text) {
  if (!/[ㄱ-힣]/.test(text)) return null
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700&text=${encodeURIComponent(text)}`
    ).then((r) => r.text())
    const url = css.match(/src: url\((.+?)\) format/)?.[1]
    return url ? await fetch(url).then((r) => r.arrayBuffer()) : null
  } catch {
    return null
  }
}

export default async function handler(req) {
  const { searchParams } = new URL(req.url)
  const title = clip(searchParams.get("title"), 90) || "Kim Tae Kyun"
  const kicker = clip(searchParams.get("kicker"), 40)
  const meta = clip(searchParams.get("meta"), 80)

  const [helvetica, korean] = await Promise.all([helveticaBold, koreanFont(title + kicker + meta)])
  const fonts = [{ name: "Helvetica", data: helvetica, weight: 700 }]
  if (korean) fonts.push({ name: "NotoKR", data: korean, weight: 700 })

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#0f1113",
          color: "#f2f2f0",
          fontFamily: "Helvetica, NotoKR",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, letterSpacing: 4, color: "#8a9096" }}>
          <span>KIM TAE KYUN</span>
          <span>{kicker.toUpperCase()}</span>
        </div>
        <div style={{ display: "flex", fontSize: title.length > 40 ? 64 : 88, lineHeight: 1.05, letterSpacing: -2 }}>
          {title}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, letterSpacing: 2, color: "#8a9096" }}>
          <span>{meta}</span>
          <span>kimtaekyun.dev</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts,
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800, immutable" },
    }
  )
}
