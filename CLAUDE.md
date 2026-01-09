# Personal Website

Next.js 14 app router site with dynamic concentric ring design system.

## Project Layout

```
app/           - pages (page.tsx, layout.tsx)
components/    - React components
contexts/      - React context providers
lib/           - utilities, API clients (goodreads, lastfm, fonts)
styles/        - globals.css
```

## Key Files

- `app/layout.tsx` - root layout with ConcentricWrapper, Navigation
- `app/page.tsx` - homepage with expandable sections, social links
- `contexts/ConcentricContext.tsx` - element position tracking
- `lib/territoryCalculator.ts` - ring boundary math
- `components/ConcentricCanvas.tsx` - SVG ring renderer

## Concentric Territory System

Every interactive element registers with ConcentricContext and owns a rectangular "territory":
- **Boundaries**: midpoint between adjacent elements (or viewport edge)
- **Ring spacing**: constant 8px, uniform 0.8 opacity
- **Gap**: 8px between adjacent ring systems

Element types:
- `nav` - fixed position, viewport-relative coords, rendered in fixed SVG layer
- `section` - expandable boxes, document-relative coords
- `social` - bottom links, document-relative coords

Territory recalculates when:
- Any element resizes (ResizeObserver)
- Viewport resizes
- Sections expand/collapse

Height calculated from actual element positions (not scrollHeight) to avoid SVG affecting scroll area.

## Styling

See `mdfiles/DESIGN.md` for colors, typography, link styling.

Key CSS classes:
- `.main-content-column` - wrapper for sections + social links (shared width)
- `.floating-title` - title floats above rings with z-index
- `.sections-container` - expandable section wrapper
- `.social-links` - evenly spaced via justify-content: space-between

## APIs

- Goodreads RSS → recently read books
- Last.fm → weekly top album (getWeeklyAlbumChart)
