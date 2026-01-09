# Design Guidelines

## Typography
- **Headings**: BBH Bogle (Google Fonts)
- **Body text**: Exo 2, 400/600/700 weights
- **IPA text**: Istok Web
- Fonts loaded in `app/layout.tsx`

## Color Scheme (Dark Theme)
- `--bg-warm`: #1e2021 (dark background)
- `--text-color`: #faf8f5 (light cream text)
- `--text-muted`: #faf8f5

Rainbow link colors (OKLCH):
- `--color-tet-1`: oklch(69% 0.22 143) - green
- `--color-tet-2`: oklch(79% 0.198 233) - blue
- `--color-tet-3`: oklch(48% 0.132 240) - navy
- `--color-tet-4`: oklch(74% 0.209 323) - pink
- `--color-tet-5`: oklch(85% 0.176 53) - light orange
- `--color-tet-6`: oklch(52% 0.242 53) - red

## Links
- Bold (font-weight: 600), colored from rainbow palette
- Colors randomized via `ClientColorizer.tsx` (Fisher-Yates shuffle)
- Underline on hover

## Layout
- Fixed sidebar (25% width) with navigation
- Main content (75% width, offset by margin-left)
- Responsive: stacks vertically below 768px

## Concentric Rings
- Stroke color: `var(--text-color)` at 0.8 opacity
- Spacing: 8px constant between rings
- Gap: 8px between adjacent element territories

## Expandable Sections
- Click to toggle expanded state
- No border (rings serve as visual boundary)
- Label format: `[ label ]`
- Underline on hover

## Social Links
- Evenly spaced via `justify-content: space-between`
- Width matches content sections above
- Lowercase labels

## Bookshelf Page
- Full-width mode
- Favorites: grid layout
- Book covers: linked to Goodreads, scale on hover (1.03x)
- Star ratings: `--color-tet-4` (pink)
