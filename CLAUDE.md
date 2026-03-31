# Personal Website

Next.js 14 app router site — minimal, prose-driven personal website.

## Project Layout

```
app/           - pages (page.tsx, layout.tsx)
components/    - React components
lib/           - utilities, API clients (goodreads, lastfm)
styles/        - globals.css
```

## Key Files

- `app/layout.tsx` - root layout
- `app/page.tsx` - homepage (server component, fetches data)
- `components/HomeContent.tsx` - homepage client component
- `components/Navigation.tsx` - shared nav component
- `app/publications/page.tsx` - publications with paper citation card
- `app/bookshelf/page.tsx` - bookshelf (fetches from Goodreads)

## Styling

Minimal CSS in `styles/globals.css`. Content is in a `.container` (max-width 600px, centered). Body uses Times New Roman. Scrollbar is always visible (`overflow-y: scroll` on html) to prevent layout shift between pages.

Publication cards use `.paper-card` with `.paper-title`, `.paper-authors`, `.paper-venue`, `.paper-links` classes.

## APIs

- Goodreads RSS → recently read books
- Last.fm → weekly top album (getWeeklyAlbumChart)
