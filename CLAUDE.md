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

## APIs

- Goodreads RSS → recently read books
- Last.fm → weekly top album (getWeeklyAlbumChart)
