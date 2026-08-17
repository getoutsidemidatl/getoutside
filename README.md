# Get Outside Mid Atlantic

Source for [get-outside.info](https://get-outside.info) — your guide to better weekends across the Mid-Atlantic.

Get Outside Mid Atlantic covers outdoor recreation across Maryland, Virginia, Pennsylvania, Delaware, and West Virginia: boating, fishing, hiking, camping, breweries, and live music, organized around seven regions so people can find what's happening near them instead of scrolling a generic events feed.

## Pages

- **`index.html`** — the main landing page: hero, about, and links to our social channels (Instagram, TikTok, Facebook, YouTube, X).

## Regions

1. Upper Chesapeake (MD)
2. Blue Ridge & Shenandoah (VA)
3. Western MD Mountains (MD)
4. West Virginia Highlands (WV)
5. PA Laurel Highlands & Poconos (PA)
6. Delaware & Coastal Beaches (DE / MD)
7. DC Metro / Piedmont (VA / MD)

## Tech

Plain HTML with [Tailwind CSS](https://tailwindcss.com) via CDN, no build step. Fonts are [Outfit](https://fonts.google.com/specimen/Outfit) (display) and [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) (body), loaded from Google Fonts.

## Visual Style (locked 2026-08-16)

**Primary style for website cards + social carousels:** Grok Imagine construction-paper / South Park deadpan aesthetic.
- Flat colors, bold simple outlines, minimal shading
- Round heads, small facial features, blank/deadpan expressions
- Original recurring characters only (never real South Park IP)

### Core Characters
- **Dan** — green beanie, orange life jacket, khaki shorts. The steady one.
- **Kevin** — messy hair, soaked blue hoodie, broken paddle. Always somehow wet or injured.
- **Riley** — curly hair, olive fleece, hiking pants, marshmallow stick. The outdoor optimist.
- **Jax** — blond hair under red cap, blue life vest, board shorts, kayak paddle. Focused paddler.

**Usage rule:** Pre-generate high-value featured cards and carousel hero slides with these characters via Grok Imagine. Keep the existing pure-SVG `scene-generator.js` for bulk/low-priority weekly cards (zero cost, fully automatic).

## Deployment

This repo deploys automatically to [Netlify](https://netlify.com) on every push to **`main`** (and a synced **`master`** branch for older Netlify branch settings). No build command — Netlify just serves the static files as-is.

To publish a change: commit it here, and the live site updates within a couple minutes. If the site stays stale, check Netlify → Site settings → Build & deploy → Production branch is set to `main` (or `master`).

## Social

- Instagram: [@getoutsidemidatlantic](https://instagram.com/getoutsidemidatlantic)
- TikTok: [@getoutsidemidatlantic](https://tiktok.com/@getoutsidemidatlantic)
- Facebook: [Get Outside Mid Atlantic](https://facebook.com/getoutsidemidatlantic)
- YouTube: [@getoutsidemidatlantic](https://youtube.com/@getoutsidemidatlantic)
- X: [@getoutsidematl](https://x.com/getoutsidematl)

<!-- deploy-bust 2026-08-17T00:25Z -->
