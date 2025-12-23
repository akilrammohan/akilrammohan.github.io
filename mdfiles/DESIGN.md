# Design Guidelines

## Typography
- **Headings (h1-h6)**: Istok Web, 700 weight (bold)
- **Body text**: Istok Web, 400/700 weights available (regular and italic)
- Fonts loaded from Google Fonts in BaseLayout.astro

## Links
- All links are bold (font-weight: 600) with colored text from the rainbow palette
- Rainbow text colors assigned via JS in BaseLayout.astro (uses `is:inline` for Astro)
- Links in lists: cycle through colors 1-6 with randomized starting offset per list
- Standalone/inline links (not in lists): get a random color each page load
- On hover: underline appears

## Color Scheme
- `--color-tet-1`: oklch(69% 0.22 143) - green
- `--color-tet-2`: oklch(79% 0.198 233) - blue
- `--color-tet-3`: oklch(48% 0.132 240) - navy blue
- `--color-tet-4`: oklch(74% 0.209 323) - pink
- `--color-tet-5`: oklch(85% 0.176 53) - light orange
- `--color-tet-6`: oklch(52% 0.242 53) - red
- `--bg-warm`: #faf8f5 (background)
- `--text-color`: #333
- `--text-muted`: #666

## Bookshelf Page

### Layout
- Full-width mode (no max-width constraint)
- Favorites: 2-column grid
- Other Read Books: 4-column grid (covers only)

### Book Covers
- Linked to Goodreads book page
- Subtle scale transform on hover (1.03x)
- Lazy loading enabled
- Fallback to placeholder for missing covers

### Ratings
- Star color: `--color-tet-4` (pink)
- Display 5 stars, filled/empty based on user rating
- Only shown for ratings > 0
