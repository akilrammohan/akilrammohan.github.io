# Personal Website

Next.js 14 app router site — minimal, prose-driven personal website. Deployed at https://akilr.com via Vercel.

## Project Layout

```
app/           - pages (page.tsx, layout.tsx)
components/    - React components
lib/           - utilities, API clients (goodreads, lastfm)
styles/        - globals.css
```

## Key Files

- `app/layout.tsx` - root layout (sidebar/main grid, font, link colorizer)
- `app/page.tsx` - homepage (server component, fetches data)
- `components/HomeContent.tsx` - homepage client component
- `components/Navigation.tsx` - shared nav component
- `components/PageHeader.tsx` / `components/SiteFooter.tsx` - shared page chrome
- `app/publications/page.tsx` - publications with paper citation card
- `app/bookshelf/page.tsx` - bookshelf (fetches from Goodreads)

## Styling

Minimal CSS in `styles/globals.css`. Layout is a CSS grid (`.site`): left sidebar nav + centered main column (`--main-width`), collapsing to a single column below 1080px. One fixed theme: flat gray ground (`--bg-color`), black text, and five link hues in OKLCH (`--link-c0`..`--link-c4`, stamped onto anchors by the colorizer script). Body uses Ostrich Sans Medium (League of Moveable Type, OFL; caps-only, single weight — bold is synthesized), self-hosted via `next/font/local` from `app/fonts/` in `app/layout.tsx`. The body is uppercased with slight tracking and a hairline `-webkit-text-stroke` to thicken it; `.ipa` undoes those. The WOFF2 was converted from the repo OTF. Scrollbar is always visible (`overflow-y: scroll` on html) to prevent layout shift between pages.

Publication cards use `.paper-card` with `.paper-title`, `.paper-authors`, `.paper-venue`, `.paper-links` classes.

## APIs

- Goodreads RSS → recently read books
- Last.fm → weekly top album (getWeeklyAlbumChart)

## Caching

Homepage and bookshelf use ISR (`export const revalidate = 3600`) — served as static HTML, data refreshed in the background at most hourly. Goodreads is also cached via `unstable_cache` (tag: `goodreads`, on-demand revalidation via `/api/revalidate`). Don't add `force-dynamic` or `cache: 'no-store'` to these pages.
