import { readFileSync, writeFileSync } from "node:fs";

// Reviewed Whisper word ranges, corrected to the supplied script. Punctuation
// and scientific/place names come from the script, not the speech model.
const segments = JSON.parse(
  readFileSync("scripts/voiceover-source-segments.json", "utf8"),
);
const range = (s, a, b = a) => [
  segments[s].words[a].startInSeconds,
  segments[s].words[b].endInSeconds,
];
const span = (s, a, b) =>
  Array.from({ length: b - a + 1 }, (_, i) => range(s, a + i));
const sentences = [
  {
    text: "In 1836, scientists digging in the Shivalik Hills found a skull so bizarre they thought it was a four-horned elephant.",
    times: [...span(0, 0, 17), range(0, 18, 19), range(0, 20)],
  },
  {
    text: "They named it Sivatherium giganteum—meaning 'Shiva’s giant beast'—the largest giraffe that ever lived, built like a tank with moose-like antlers.",
    times: [...span(1, 0, 19), range(1, 20, 21), range(1, 22)],
  },
  {
    text: "Weighing over 1,200 kilos, it didn't roar...",
    // Whisper collapses the number to zero duration; split its acoustic phrase.
    times: [range(2, 0), [22.42, 22.65], [22.65, 23.65], [23.65, 24.28], range(2, 4), range(2, 5), [25.08, 25.26]],
  },
  {
    text: "...instead, like modern giraffes and okapis, it communicated with deep, rumbling hums and nasal snorts.",
    times: [[26.989, 27.86], ...span(3, 1, 13), [35.28, 35.63]],
  },
  {
    text: "Fossil tooth wear proves it browsed both tough bushes and floodplain grasses across ancient North India until one million years ago.",
    times: [range(4, 0), [37.32, 37.65], [37.65, 38.06], ...span(4, 2, 8), range(4, 9, 10), ...span(4, 11, 19), [45.6, 45.7]],
  },
  {
    text: "And you can stand right next to a life-size reconstruction today at Shivalik Fossil Park in Himachal Pradesh.",
    times: [...span(5, 0, 7), range(5, 8, 9), ...span(5, 10, 17), [53.26, 53.52]],
  },
];
// Immutable pre-edit timing source. Apply the 37,116-sample silence removal once.
const pages = [];
for (const sentence of sentences) {
  const words = sentence.text.match(/[^\s—]+—?/g);
  if (words.length !== sentence.times.length)
    throw new Error(`Word/range mismatch: ${sentence.text}`);
  // Fill zero-duration recognition tokens from the surrounding acoustic gap.
  for (let i = 0; i < sentence.times.length; i++) {
    const t = sentence.times[i];
    if (t[1] <= t[0])
      t[1] = Math.min(sentence.times[i + 1]?.[0] ?? t[0] + 0.1, t[0] + 0.22);
  }
  const captions = words.map((text, i) => ({
    text: (i > 0 && words[i - 1].endsWith("—") ? "" : " ") + text,
    startMs: Math.round(sentence.times[i][0] * 1000) - (sentence.times[i][0] >= 36.5774375 ? 773.25 : 0),
    endMs: Math.round(sentence.times[i][1] * 1000) - (sentence.times[i][1] >= 36.5774375 ? 773.25 : 0),
    timestampMs: Math.round((sentence.times[i][0] + sentence.times[i][1]) * 500)
      - (sentence.times[i][0] >= 36.5774375 ? 773.25 : 0),
    confidence: null,
  }));
  // Group by a conservative character budget, never more than five words.
  let page = [];
  let chars = 0;
  for (const caption of captions) {
    if (page.length && (page.length >= 5 || chars + caption.text.length > 44)) {
      pages.push(page);
      page = [];
      chars = 0;
    }
    page.push(caption);
    chars += caption.text.length;
  }
  if (page.length) pages.push(page);
}
// Keep the final fossil phrase together and hold the last active word.
const agoIndex = pages.findIndex((page) => page.length === 1 && page[0].text.trim() === "ago.");
if (agoIndex < 1) throw new Error("Expected standalone ago caption");
const ago = pages[agoIndex][0];
ago.endMs = Math.min(ago.endMs + 450, (1377 / 30) * 1000);
pages[agoIndex - 1].push(ago);
pages.splice(agoIndex, 1);
writeFileSync("src/captions.json", JSON.stringify(pages, null, 2) + "\n");
console.log(
  `Aligned ${pages.flat().length} words (recorded timing).`,
);
