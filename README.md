# Sivatherium Reel

Final vertical video: **54.0 seconds, 1080×1920, 30fps, 1,620 frames**.

## Preview and export

Run `npm run dev` and choose **SivatheriumReel**.

```sh
npm run lint
npx remotion render src/index.ts SivatheriumReel out/sivatherium-reel.mp4 --crf=16
```

Export: H.264, CRF 16, `yuv420p`, scale 1, ANGLE rendering. Source video audio is muted.

## Timeline (end-exclusive frames)

| Frames | Visual |
| --- | --- |
| 0–320 | Skeleton zoom-out; transparent location label; hook through frame 104 |
| 320–662 | Kling, 5.041667s fitted to 11.4s |
| 662–1085 | Close-up, 5.166667s fitted to 14.1s |
| 1085–1377 | Grazing, 5.166667s fitted to 9.733333s; no location badge |
| 1377–1620 | Statue full-bleed horizontal pan; transparent Saketi label |

Kling zooms 1.54→1.48 at −44px, tightened beyond the suggested values to exclude the bottom-right star. Grazing and close-up framing are unchanged.

Shot 1 uses one full-bleed cover image centered with a 1.0→1.08 zoom across local frames 0–319. Shot 5 uses one full-bleed cover image at fixed `22% 50%`, zooming 1.0→1.06 through local frame 225 and holding during the fade. Cover framing crops some far-left head detail; these are the specified photo positions, not full-image containment.

The etymology banner is entirely removed. Story captions use transparent backgrounds, #F8FAFC text, #F59E0B active highlights, layered dark shadows and a 1px outline. “India until one million years ago.” shares one caption page; “ago.” holds an additional 450ms, ending at 45.37675s, before Shot 5 at 45.9s.

All visuals, including overlays, fade to black over frames 1602–1619, reaching full black on the final rendered frame. Voiceover gain follows the same 1→0 envelope. The timeline ends at frame 1620.

## Audio edit

The original voiceover is preserved at `out/backups/voiceover-before-pause-trim.mp3`. The original silence measured 35.629188–36.752438s. Removed samples **1718601–1755716** at 48kHz (35.8041875–36.5774375s, end-exclusive): exactly **37,116 samples / 0.77325s**. The edited `public/voiceover.mp3` preserves a natural 0.35s breath without changing speech speed or gain. MP3 re-encoding measures approximately 0.3504s silence. The final spoken word ends around 52.747s, leaving roughly 1.25s before the 54s finish, as selected by the user.

The hum remains at frames 759–808 (25.30–26.966667s), using source frames 8–57 at normal speed and gain 1 with a 6-frame fade-in and 10.5-frame fade-out. The transparent hum indicator shares that interval.

## Caption workflow

`scripts/voiceover-source-segments.json` stores the immutable pre-edit Whisper timing baseline. `node scripts/align-captions.mjs` reconciles this baseline with the exact script, applies the 773.25ms shift once to subsequent timestamps, groups captions, and applies the “ago.” hold. Re-running it is idempotent.

`node scripts/transcribe-voiceover.mjs` transcribes the current edited audio locally with GPU Whisper into `out/voiceover-*.json` for review. It does not overwrite the immutable baseline used by alignment. New recordings require reviewed timing mappings; do not replace the baseline with edited-audio timestamps and apply the trim again.
