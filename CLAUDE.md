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

- `app/layout.tsx` - root layout (sidebar/main grid, theme init, link colorizer)
- `app/page.tsx` - homepage (server component, fetches data)
- `components/HomeContent.tsx` - homepage client component
- `components/Navigation.tsx` - shared nav component
- `components/PageHeader.tsx` / `components/SiteFooter.tsx` - shared page chrome
- `components/ThemeToggle.tsx` - light/dark toggle (`data-theme` on `<html>`)
- `app/publications/page.tsx` - publications with paper citation card
- `app/bookshelf/page.tsx` - bookshelf (fetches from Goodreads)

## Styling

Minimal CSS in `styles/globals.css`. Layout is a CSS grid (`.site`): left sidebar nav + centered main column (`--main-width`), collapsing to a single column below 1080px. Light/dark themes via CSS variables keyed off `data-theme`. Body uses Linden Hill (League of Moveable Type, OFL; regular + italic, no bold face — bold is synthesized), self-hosted via `next/font/local` from `app/fonts/` in `app/layout.tsx`. Scrollbar is always visible (`overflow-y: scroll` on html) to prevent layout shift between pages.

Publication cards use `.paper-card` with `.paper-title`, `.paper-authors`, `.paper-venue`, `.paper-links` classes.

## APIs

- Goodreads RSS → recently read books
- Last.fm → weekly top album (getWeeklyAlbumChart)

## Caching

Homepage and bookshelf use ISR (`export const revalidate = 3600`) — served as static HTML, data refreshed in the background at most hourly. Goodreads is also cached via `unstable_cache` (tag: `goodreads`, on-demand revalidation via `/api/revalidate`). Don't add `force-dynamic` or `cache: 'no-store'` to these pages.
