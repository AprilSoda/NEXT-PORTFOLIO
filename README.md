# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Running the Application
```bash
npm run dev        # Start dev server on http://0.0.0.0:5000
npm run build      # Build for production
npm run start      # Start production server
```

### Code Quality
```bash
npm run lint       # Run ESLint
npm run prettier   # Format code (note: script currently has typo, should be --write not -write)
```

## Architecture Overview

This is a **Next.js 15 (Pages Router)** portfolio website for a VFX artist, integrated with Notion as a CMS for dynamic content.

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

#### Dynamic Routing with Custom Slugs
- Blog and work URLs use **descriptive slugs** instead of Notion IDs
- `lib/slugify.js` handles slug generation:
  - Extracts English characters only from titles
  - Falls back to `post-{id}` for non-English titles (e.g., Korean)
  - `createSlug()` - Converts title to URL-safe slug
  - `findBlogBySlug()` - Matches URL slug to Notion page

**Example**: Blog with title "Understanding React Hooks" → `/blogs/understanding-react-hooks`

#### Static Generation Flow
```
User requests /blogs/my-post
    ↓
getStaticPaths() - Pre-generates all blog paths at build time
    ↓
Fetches all blogs via lib/notion.js (official SDK)
    ↓
Creates slug for each post (lib/slugify.js)
    ↓
getStaticProps() - Fetches full page content for specific slug
    ↓
Uses notion-client (NotionX) to get full recordMap
    ↓
Renders with react-notion-x components
```

#### Page Animation System
- **Framer Motion** handles page transitions via `AnimatePresence` in `_app.js`
- **Custom cursor** system using `MouseContext`:
  - Provider wraps entire app (`MouseContextProvider`)
  - Context tracks cursor state (size, variant)
  - `CustomCursor` component renders cursor overlay
  - Components trigger cursor changes via context (e.g., hover states)

#### Font Loading Strategy
The app loads **5 font families** (see `pages/_app.js`):
- **17 variants of Helvetica Now Display** (local font, all weights + italics)
- Canyon Black (local, display font)
- ProFont Windows (local, monospace)
- Roboto (Google Fonts)
- Exo (Google Fonts)

All use `display: swap` to prevent FOIT. Fonts are exposed as CSS variables.

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
├── blogs/
│   ├── index.js          # Blog list (fetches NOTION_DATABASE_ID2)
│   └── [id].js           # Blog post detail (uses NotionX renderer)
├── contact/index.js      # Contact form
└── api/
    └── contact.js        # Email submission handler

lib/
├── notion.js             # Official Notion SDK functions
└── slugify.js            # URL slug generation utilities

components/
├── Layout.js             # Global layout wrapper (Header + Arrow)
├── Header.js             # Navigation header
├── Footer.js             # Footer
├── Hero.js               # Homepage hero section
├── CustomCursor.js       # Custom cursor overlay
├── MouseContext.js       # Cursor state management
├── Transition.js         # Page transition wrapper
├── BlogNavigation.js     # Blog prev/next navigation
└── PageCard.js           # Blog card component

styles/
├── globals.scss          # Global styles entry
├── variable.scss         # SCSS variables
└── [component].scss      # Component-specific styles
```

### Next.js Configuration Notes

#### Webpack Customization (`next.config.js`)
- **SVG imports as React components**: Uses `@svgr/webpack` loader
- **SASS support**: Custom include paths for styles directory
- **Server externals**: `@notionhq/client` marked as external package

#### Image Configuration
- **Remote patterns** currently allow all HTTPS hosts (`hostname: "**"`)
- This is overly permissive - should be restricted to specific domains (Notion, YouTube, etc.)

### Important Environment Variables

Required for the application to function:
```
NOTION_TOKEN              # Official Notion API integration token
NOTION_DATABASE_ID        # Works database ID
NOTION_DATABASE_ID2       # Blogs database ID
NOTION_ACTIVE_USER        # NotionX user ID (for private pages)
NOTION_AUTH_TOKEN         # NotionX auth token (for private pages)
MAIL_USER                 # SMTP email address
MAIL_PASS                 # SMTP password
NEXT_PUBLIC_API_URL       # API base URL (for contact form)
GOOGLE_ANALYTICS          # GA measurement ID (optional)
```

See `.env.example` for template with documentation.

### Common Development Patterns

#### Fetching Content from Notion
Always use `lib/notion.js` for database queries:
```javascript
import { getDatabase } from '../lib/notion'

export async function getStaticProps() {
  const databaseId = process.env.NOTION_DATABASE_ID2
  const posts = await getDatabase(databaseId)
  return { props: { posts }, revalidate: 1 }
}
```

#### Rendering Notion Pages
Use NotionX in dynamic routes:
```javascript
import { NotionAPI } from 'notion-client'
import { NotionRenderer } from 'react-notion-x'

const notion = new NotionAPI({
  activeUser: process.env.NOTION_ACTIVE_USER,
  authToken: process.env.NOTION_AUTH_TOKEN,
})

export async function getStaticProps({ params }) {
  const recordMap = await notion.getPage(pageId)
  return { props: { recordMap } }
}

export default function Page({ recordMap }) {
  return <NotionRenderer recordMap={recordMap} darkMode={true} />
}
```

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

1. **ISR revalidation is too aggressive** - Currently set to `revalidate: 1` (1 second), should be increased to reduce API calls
2. **No TypeScript** - Pure JavaScript codebase
3. **Multiple console.logs in production** - Should be removed or gated by environment
4. **Legacy Link syntax** - Some components use deprecated `legacyBehavior` prop
5. **Mixed component patterns** - Inconsistent use of function declarations vs arrow functions
6. **Google Analytics in _document.js** - Won't track SPA navigation, should move to _app.js with router events

## Complexity & Technical Debt Considerations

### Current Pain Points for Solo Maintenance

#### Styling Complexity
- **14 separate SCSS files** all imported globally via `globals.scss`
- Mix of SCSS modules and global styles
- `styled-components` in dependencies but unused
- No consistent styling pattern across components

#### Font Loading Overhead
- **17 Helvetica Now Display variants** (weights 100-900 + italics)
- **5 total font families** loading on every page
- Significant initial page load impact
- Most variants likely unused in production

#### Animation Library Redundancy
- **Framer Motion** - Used for page transitions
- **GSAP** - Also present with @gsap/react
- Both libraries serve similar purposes, only one needed

#### Unused Dependencies
```javascript
@reduxjs/toolkit          // Not used anywhere
redux-devtools-extension  // No Redux implementation
styled-components         // Not actively used
save-dev                  // Unknown purpose
```

#### Deployment Configuration Cruft
- Replit-specific settings in `next.config.js` (`allowedDevOrigins`)
- Overly permissive image hostname patterns (`hostname: "**"`)
- 9 environment variables to manage across environments

#### Email Infrastructure
- Direct SMTP management via nodemailer
- Requires credential management and server configuration
- Could be replaced with form service (Formspree, Web3Forms, etc.)

### Simplification Opportunities

#### Quick Wins (Low Risk)
1. Remove unused npm packages (Redux, styled-components)
2. Consolidate SCSS files (14 → 3-5 files)
3. Reduce font variants (17 → 3-5 variants)
4. Remove one animation library
5. Clean up console.logs and debug code
6. Fix prettier script typo (`-write` → `--write`)

#### Medium-Term Improvements
1. Consider Tailwind CSS migration (eliminate SCSS complexity)
2. Replace SMTP email with external service (reduce env vars)
3. Simplify Notion auth (remove private page support if unused)
4. Optimize ISR revalidation times
5. Restrict image remote patterns to specific domains

#### Long-Term Considerations
1. TypeScript migration for better maintainability
2. Migrate to App Router (Next.js 13+) when stable
3. Consider Markdown-based content (eliminate Notion dependency)
4. Standardize component patterns (function declarations vs arrows)
5. Add proper error boundaries and fallbacks

### Recommended Approach for Solo Developer
Focus on **reducing cognitive load** rather than adding features:
- Fewer files to navigate
- Single source of truth for styles
- Minimize external dependencies
- Automate deployment concerns
- Document what remains
