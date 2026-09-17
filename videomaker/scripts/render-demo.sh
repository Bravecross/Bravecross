#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="${1:-$ROOT/out/mvp-product-demo.mp4}"
PROPS="${2:-$ROOT/props/demo.json}"

cd "$ROOT"
npx remotion render ProductDemoMotion "$OUT" \
  --props="$PROPS" \
  --codec=h264 \
  --image-format=jpeg \
  --crf=18 \
  --pixel-format=yuv420p \
  --overwrite

echo "Rendered: $OUT"
