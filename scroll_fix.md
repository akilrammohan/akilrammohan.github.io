# Unified Scrollbar & Territory System Fix

## Problem

CSS percentage-based layout (`margin-left: 25%`) recomputes when scrollbar appears because `%` is relative to the containing block width, which shrinks when scrollbar takes space.

## Solution: Use `vw` Units

`vw` (viewport width) units are based on `window.innerWidth`, which DOES NOT change when scrollbar appears. Only `clientWidth` changes.

This means:
- `25vw` is always the same value regardless of scrollbar
- Content left edge stays fixed
- No JavaScript compensation needed
- No timing/flicker issues

## Implementation

### CSS (`styles/globals.css`)

```css
.sidebar {
  width: 25vw;  /* Not 25% */
}

.content {
  width: 75vw;   /* Not 75% */
  margin-left: 25vw;  /* Not 25% */
}

html, body {
  overflow-x: hidden;  /* Clip any overflow from vw extending past visible area */
}
```

### No JavaScript Compensation

ContentWrapper just renders plain `<main className="content">` - no transform needed.

### Territory Calculation

- `layoutWidth` = `innerWidth` (stable, for territory calculations)
- `visibleWidth` = `clientWidth` (for right edge clamping when scrollbar present)
- Rightmost territory edges use `visibleWidth`, so rings shrink when scrollbar appears

### Height Calculation

`getContentHeight()` returns `Math.max(innerHeight, contentBottom + 32)`:
- Always fills screen
- Extends when content grows
- Shrinks when content collapses

## Why `vw` Works

| Unit | Based on | Changes with scrollbar? |
|------|----------|------------------------|
| `%`  | Containing block width | YES (block shrinks) |
| `vw` | Viewport width (innerWidth) | NO |

## Requirements Satisfied

1. **Content never shifts** - `vw` units are stable
2. **No horizontal scroll** - `overflow-x: hidden` clips vw overflow
3. **No reserved scrollbar space** - Rings use `visibleWidth` for right edges
4. **Scrollbar disappears when unneeded** - Proper height calculation
5. **Always fills screen** - Height = max(innerHeight, contentBottom)
