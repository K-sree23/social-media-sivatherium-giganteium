import { execFileSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import {
  canUseWhisperWebGpu,
  downloadWhisperModel,
  loadWhisperModel,
  transcribe,
  toCaptions,
} from "@remotion/whisper-webgpu";

const support = await canUseWhisperWebGpu();
if (!support.supported) throw new Error(support.detailedReason);
const pcm = execFileSync(
  "ffmpeg",
  [
    "-v",
    "error",
    "-i",
    "public/voiceover.mp3",
    "-ac",
    "1",
    "-ar",
    "16000",
    "-f",
    "f32le",
    "pipe:1",
  ],
  { maxBuffer: 32 * 1024 * 1024 },
);
const channelWaveform = new Float32Array(
  pcm.buffer.slice(pcm.byteOffset, pcm.byteOffset + pcm.byteLength),
);
const model = "small.en";
let lastProgress = -1;
await downloadWhisperModel({
  model,
  onProgress: ({ progress }) => {
    const rounded = Math.floor(progress * 10) * 10;
    if (rounded !== lastProgress) {
      console.log(`Model download: ${rounded}%`);
      lastProgress = rounded;
    }
  },
});
const handle = await loadWhisperModel({ model });
try {
  console.log("Transcribing voiceover locally...");
  const windows = [
    [0, 10.2],
    [10.2, 21.5],
    [21.5, 26.2],
    [26.2, 35.8],
    [35.8, 45.22675],
    [45.22675, 54.437438],
  ];
  const segments = [];
  for (const [start, end] of windows) {
    const result = await transcribe({
      channelWaveform: channelWaveform.slice(
        Math.round(start * 16000),
        Math.round(end * 16000),
      ),
      model,
    });
    segments.push({
      start,
      end,
      text: result.text,
      words: result.words.map((word) => ({
        ...word,
        startInSeconds: word.startInSeconds + start,
        endInSeconds: word.endInSeconds + start,
      })),
    });
    console.log(`${start}–${end}: ${result.text}`);
  }
  const result = {
    model,
    text: segments.map((s) => s.text).join(" "),
    words: segments.flatMap((s) => s.words),
  };
  await mkdir("out", { recursive: true });
  await writeFile(
    "out/voiceover-segments.json",
    JSON.stringify(segments, null, 2),
  );
  await writeFile(
    "out/voiceover-transcript.json",
    JSON.stringify(result, null, 2),
  );
  await writeFile(
    "out/voiceover-word-timings.json",
    JSON.stringify(
      toCaptions({ whisperWebGpuOutput: result }).captions,
      null,
      2,
    ),
  );
  console.log(result.text);
} finally {
  await handle[Symbol.asyncDispose]();
}
