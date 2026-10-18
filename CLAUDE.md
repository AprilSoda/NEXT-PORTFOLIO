# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Running the Application
```bash
npm run dev          # Dev server on http://0.0.0.0:5000 (webpack)
npm run build        # Production build (needs NOTION_TOKEN + database ids)
npm run build:mock   # Production build with sample data (NOTION_MOCK=1, no token)
npm run start        # Serve the production build
```

### Code Quality
```bash
npm run lint         # ESLint (must pass clean)
npm run prettier     # Format code
```

## Architecture Overview

This is a **Next.js 16 (Pages Router, built-in i18n: en at /, ko at /ko)** portfolio website for a VFX artist, integrated with Notion as a CMS for dynamic content.

### Key Architectural Patterns

#### Notion Integration
The project uses **two Notion client libraries**:
- **`@notionhq/client`** - Official SDK for database queries/filtering
- **`notion-client`** - NotionX client for full page rendering with `react-notion-x`

This dual setup is the standard pattern for Notion-based sites, as the official API alone cannot render pages with full fidelity.

#### Content Structure
- **Two Notion databases** power the site:
  - `NOTION_DATABASE_ID` - Works/Projects database
  - `NOTION_DATABASE_ID2` - Blog posts database
- Both databases must have a `pub` (checkbox) property to control visibility
- Content is fetched at build time via ISR (Incremental Static Regeneration)

#### Content model (Notion WORKS database)
Besides `title`, `date`, `pub`, `sort`, `client`, the works database has:
`role`, `format`, `honor`, `status`, `featured`, `summary_en`, `summary_ko`,
`video` (finished film/trailer, shown first), `making`, `preview` (hover loop),
`before`/`after` (compare slider), `tools`, `models`, `ai_usage`, `credits`
("Role: Name" per line). All are optional — pages render without them.
`lib/summaries.js` trims rows to what list views need.

#### Routing
- `/works/[id]` uses the Notion page id; `/journal/[slug]` uses `createSlug()`
  (English characters only, `post-{id}` fallback for Korean titles)
- `/blogs/*` permanently redirects to `/journal/*`
- `getStaticPaths` returns one path per locale; `fallback: 'blocking'`

#### Bilingual (i18n)
- Next.js Pages Router i18n: English at `/`, Korean at `/ko`
- UI strings: `lib/i18n.js` → `const { t, pick, locale } = useT()`
- Identity copy, credits, About text: `content/site.js` (`{ en, ko }` objects)
- Notion content is shown as written; `summary_en` / `summary_ko` per work

#### SEO
- `components/Layout.js`: canonical, hreflang (en/ko/x-default), og tags
- JSON-LD: Person (home), CreativeWork/VideoObject (work), BlogPosting (journal)
- `/sitemap.xml` and `/feed.xml` are server-rendered; `public/robots.txt`, `public/llms.txt`

#### Page Animation System
- **Framer Motion** handles page transitions via `AnimatePresence` in `_app.js`
- **Custom cursor** system using `MouseContext`:
  - Provider wraps entire app (`MouseContextProvider`)
  - Context tracks cursor state (size, variant)
  - `CustomCursor` component renders cursor overlay
  - Components trigger cursor changes via context (e.g., hover states)

#### Performance rules (keep Lighthouse ≥80 / a11y 100)
- First page load renders immediately: `Transition` skips its wipe/fade on the
  first render; above-the-fold entrances use CSS `.reveal` / `.reveal--slide`
  (styles/renewal.scss), not Framer Motion, so they don't wait for hydration
- Never start the largest visible element at `opacity: 0`
- Hero: poster `<Image priority>` under the loop; the loop plays only in view
- Shader backdrop skips low-end / Save-Data / reduced-motion, pauses in background tabs
- Lenis runs on the GSAP ticker (one frame loop)
- Fonts: Helvetica Now (4 weights, not preloaded), Canyon, ProFont, JetBrains Mono
  via next/font; Pretendard (Hangul) from the jsDelivr dynamic-subset CSS, attached by script

#### Email Contact System
- API route at `pages/api/contact.js` handles form submissions
- Uses **nodemailer** with SMTP (smtp.hiworks.com)
- Credentials from env vars: `MAIL_USER`, `MAIL_PASS`
- Sends email to `hello@kimtaekyun.dev`

### File Structure Conventions

```
pages/
├── index.js              # Homepage
├── about/index.js        # About page
├── works/
│   ├── index.js          # Works gallery (fetches NOTION_DATABASE_ID)
│   └── [id].js           # Individual work detail (dynamic route)
├── journal/              # formerly /blogs (old URLs redirect)
│   ├── index.js          # Journal list (fetches NOTION_DATABASE_ID2)
│   └── [id].js           # Journal entry detail (uses NotionX renderer)
├── contact/index.js      # Contact form (enquiry type → email subject)
├── 404.js                # Bilingual not-found page
├── sitemap.xml.js        # Sitemap with hreflang alternates
├── feed.xml.js           # Journal RSS
└── api/
    └── contact.js        # Email submission handler

lib/
├── notion.js             # Official Notion SDK functions (+ NOTION_MOCK, WORKS_DB/JOURNAL_DB)
├── mock/notion-fixtures.js  # Sample rows for NOTION_MOCK=1
├── slugify.js            # URL slug generation utilities
├── i18n.js               # UI strings (en/ko) + useT() hook
├── summaries.js          # Trim Notion rows for list views
└── video.js              # Parse YouTube/Vimeo/file URLs

content/
└── site.js               # Identity copy, credits, About text (en/ko)

components/
├── Layout.js             # Head/SEO, skip link, Header, back-to-top
├── Header.js             # Navigation + language switch
├── Footer.js             # Contact line, Seoul clock, labelled links
├── Hero.js               # Home hero (headline, loop, showreel button)
├── HomeSections.js       # Home: statement, credits, work, journal
├── CreditList.js         # Public credits (content/site.js)
├── HoverPreview.js       # Cover + hover-only silent loop
├── WorkBadges.js         # Festival / in-progress badges
├── VideoEmbed.js         # YouTube/Vimeo/file player with controls
├── CompareSlider.js      # Plate vs final wipe
├── modal-showreel.js     # Showreel modal (media-chrome)
├── CustomCursor.js       # Custom cursor overlay
├── MouseContext.js       # Cursor state management
├── Transition.js         # Page transition wrapper (skipped on first load)
└── BlogNavigation.js     # Journal prev/next navigation

styles/
├── globals.scss          # Global styles entry
├── variable.scss         # SCSS variables
├── design-system.scss    # Tokens (color, type scale, spacing, motion)
├── renewal.scss          # 2026 renewal — new work goes here
└── [component].scss      # Legacy component/page styles
```

### Next.js Configuration Notes

#### Webpack Customization (`next.config.js`)
- **SVG imports as React components**: Uses `@svgr/webpack` loader
- **SASS support**: Custom include paths for styles directory
- **Server externals**: `@notionhq/client` marked as external package

#### Image Configuration
- **Remote patterns** currently allow all HTTPS hosts (`hostname: "**"`); see Known Issues

#### i18n and redirects
- `i18n: { locales: ['en', 'ko'], defaultLocale: 'en' }`
- `/blogs` → `/journal` (permanent)

### Important Environment Variables

Required for the application to function:
```
NOTION_TOKEN              # Official Notion API integration token
NOTION_DATABASE_ID        # Works database ID
NOTION_DATABASE_ID2       # Journal database ID
MAIL_USER                 # SMTP email address
MAIL_PASS                 # SMTP password
NEXT_PUBLIC_GOOGLE_ANALYTICS  # GA measurement ID (optional)
NOTION_MOCK               # 1 = sample data, no Notion calls (optional)
```

See `.env.example` for template with documentation.

### Common Development Patterns

#### Fetching Content from Notion
Always use `lib/notion.js` for database queries:
```javascript
import { getDatabase, JOURNAL_DB } from '../lib/notion'
import { toJournalSummary } from '../lib/summaries'

export async function getStaticProps() {
  const posts = await getDatabase(JOURNAL_DB)
  return { props: { posts: posts.map(toJournalSummary) }, revalidate: 86400 }
}
```

#### Rendering Notion Pages
Journal entries use NotionX. Pages are published to web, so no auth token is
needed, but Notion rejects requests without a browser-like User-Agent — see
`pages/journal/[id].js`.

#### Creating New Dynamic Pages
1. Create `[id].js` route in appropriate pages directory
2. Implement `getStaticPaths()` to pre-generate all paths
3. Use `createSlug()` from `lib/slugify.js` for URL generation
4. Implement `getStaticProps({ params })` to fetch page data by slug
5. Use `findBlogBySlug()` to match slug to Notion page

### Styling Architecture

- **SCSS modules** for component-specific styles
- **Global styles** imported in `_app.js` via `styles/globals.scss`
- **CSS variables** for fonts set in `_app.js`, used throughout SCSS
- **Responsive design** uses SCSS mixins (defined in component files)
- **Dark mode** is default (Notion renderer uses `darkMode={true}`)

### Known Issues & Limitations

1. **No TypeScript** - Pure JavaScript codebase
2. **Styles are layered** - legacy `pages.scss`/`components.scss` plus the newer
   `design-system.scss` tokens and `renewal.scss`; new work goes in `renewal.scss`
3. **Image remote patterns allow all HTTPS hosts** - images are synced to R2 at
   build time (`scripts/notion-images-to-r2.mjs`); restrict once confirmed
4. **Media on r2.dev** - Cloudflare's r2.dev is rate-limited and uncached; move to a
   custom domain (e.g. media.kimtaekyun.dev) and update the URLs
5. **Mixed component patterns** - function declarations vs arrow functions

## Complexity & Technical Debt Considerations

### Current Pain Points for Solo Maintenance

#### Styling Complexity
- Many SCSS files imported globally via `globals.scss`; the 2026 renewal added
  `design-system.scss` (tokens) and `renewal.scss` on top of the legacy files
- No consistent styling pattern across older components

#### Animation Library Redundancy
- **Framer Motion** (page transitions, a few reveals) and **GSAP** (cursor, parallax,
  Lenis ticker) both ship; above-the-fold entrances are plain CSS

#### Email Infrastructure
- Direct SMTP management via nodemailer
- Could be replaced with a form service (Formspree, Web3Forms, etc.)

### Simplification Opportunities

#### Quick Wins (Low Risk)
1. Consolidate legacy SCSS into `design-system.scss` + `renewal.scss`
2. Drop the 4th Helvetica weight if unused (currently 400/500/600/700)
3. Remove one animation library

#### Medium-Term Improvements
1. Replace SMTP email with an external service (fewer env vars)
2. Restrict image remote patterns to R2 (+ any hosts still in Notion)
3. Move media from r2.dev to a custom domain with CDN caching

#### Long-Term Considerations
1. TypeScript migration
2. App Router migration
3. Standardize component patterns (function declarations vs arrows)
4. Error boundaries and fallbacks

### Recommended Approach for Solo Developer
Focus on **reducing cognitive load** rather than adding features:
- Fewer files to navigate
- Single source of truth for styles and copy (`content/site.js`, `lib/i18n.js`)
- Minimize external dependencies
- Document what remains
