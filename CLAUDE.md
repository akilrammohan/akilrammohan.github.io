# Personal Website

Next.js 14 app router site with dynamic concentric ring design system.

## Project Layout

```
app/           - pages (page.tsx, layout.tsx)
components/    - React components
contexts/      - React context providers (ConcentricContext)
lib/           - utilities, API clients (goodreads, lastfm, fonts)
styles/        - globals.css
```

## Key Files

- `app/layout.tsx` - root layout with ConcentricWrapper
- `app/page.tsx` - homepage (server component, fetches data)
- `components/HomeContent.tsx` - homepage client component
- `contexts/ConcentricContext.tsx` - element position tracking
- `lib/territoryCalculator.ts` - ring boundary math
- `components/ConcentricCanvas.tsx` - SVG ring renderer

## Concentric Ring System

Only the grouped sections box has concentric rings. Nav links and social links float above rings (like the title). The `GroupedSections` wrapper component registers with ConcentricContext.

Elements register with ConcentricContext and own rectangular "territories":
- **Boundaries**: midpoint between adjacent elements (or viewport edge)
- **Ring spacing**: constant 12px
- **Gap**: 4px between adjacent ring systems

Territory recalculates when:
- Any element resizes (ResizeObserver)
- Viewport resizes
- Sections expand/collapse

## Styling

Key CSS classes:
- `.main-content-column` - wrapper for nav + sections + social (shared width)
- `.floating-title` - title floats above rings (z-index + background)
- `.nav-links` / `.social-links` - evenly spaced via justify-content: space-between
- `.nav-link-item.floating` / `.social-link-item.floating` - float above rings
- `.grouped-sections` - single box wrapper for expandable sections
- `.expandable-section` - individual section (no padding, 0.5rem margin-bottom)
- `.expandable-label` / `.expandable-content` - right-aligned text

## Color System

Two separate color randomization systems:

**Global links (`ClientColorizer.tsx`):**
- Shuffles 8 accent colors (`--color-tet-1` to `--color-tet-8`) using Fisher-Yates
- Applies to all `<a>` elements except those inside `.expandable-section`
- Re-shuffles on route change

**Expandable section links (`ExpandableSection.tsx`):**
- Recursively traverses React children (not DOM) via `colorizeLinks()`
- Assigns colors sequentially across all lines using a shared index ref
- Only reshuffles when expanding from fully collapsed state

## Theme System

- Light/dark mode via `data-theme` attribute on `<html>`
- Theme state managed in `ThemeContext.tsx`, persisted to sessionStorage
- All themed elements have `transition: 0.3s ease` for smooth fade between modes
- Colors: white `#f0eee7` (RGB 240,238,231), gray `#1f1e1d` (RGB 31,30,29)

## CSS Variables

- `--content-box-width: 340px` - base width for grouped sections (both pages)
- `--bg-warm` / `--text-color` - theme colors (swap in dark mode)
- `--color-tet-1` to `--color-tet-8` - accent colors (oklch)

## APIs

- Goodreads RSS → recently read books
- Last.fm → weekly top album (getWeeklyAlbumChart)
