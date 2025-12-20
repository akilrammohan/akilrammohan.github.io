# Design Guidelines

## Typography
- **Headings (h1, h2, h3)**: Abril Fatface, 400 weight
- **Body text**: Crimson Text, 400/600/700 weights available
- Both fonts loaded from Google Fonts in BaseLayout.astro

## Links
- All links are bold (font-weight: 600) with colored text from the rainbow palette
- Rainbow text colors assigned via JS in BaseLayout.astro (uses `is:inline` for Astro)
- Links in lists: cycle through colors 1-6 with randomized starting offset per list
- Standalone/inline links (not in lists): get a random color each page load
- On hover: underline appears

## Color Scheme
- `--color-tri-1`: #8d03f9 (link hover)
- `--color-tri-2`: #500099
- `--color-tri-3`: #ed3600
- `--color-tri-4`: #ff9f88
- `--color-tri-5`: #00af22
- `--color-tri-6`: #007d5a
- `--bg-warm`: #faf8f5 (background)
- `--text-color`: #333
- `--text-muted`: #666
