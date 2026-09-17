# VideoMaker (Brave Cross)

Remotion pipeline for polished product-demo ad spots (9:16 Meta / TikTok / YouTube Shorts).

## Quality bar

Motion design at the level of [Pipedrive BAU Short](https://www.youtube.com/shorts/psE5ZJm1ax4) — abstracted UI, brand solid background, programmatic cursor drag, springs — not CapCut slideshow.

## Quick start

```bash
cd videomaker
npm install
npm run dev          # Remotion Studio preview
npm run render:demo  # MP4 1080×1920 @ 30fps
```

## MVP composition

| Id | Format | Duration |
|---|---|---|
| `ProductDemoMotion` | 1080×1920 @ 30fps | 13s (390 frames) |

Swap brand/copy via `props/demo.json` (or `--props` on render). Tokens live in `src/brand/tokens.ts`.

## Scripts

- `npm run dev` — Studio
- `npm run render:demo` — export `out/mvp-product-demo.mp4`
- `npm run lint` — ESLint + `tsc`
