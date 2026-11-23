import { useEffect, useState } from "react";
import { Audio, Video } from "@remotion/media";
import type { Caption } from "@remotion/captions";
import { getStaticFiles, watchPublicFolder } from "@remotion/studio";
import {
  AbsoluteFill,
  getRemotionEnvironment,
  Img,
  Interactive,
  Sequence,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import captionPages from "./captions.json";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Skeleton = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(ellipse at 50% 42%, #40372d, #171512 75%)",
      }}
    >
      <Img
        src={staticFile("shot_1_skeleton.jpg")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center center",
          scale: interpolate(frame, [0, 319], [1, 1.08], clamp),
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse, transparent 30%, rgba(15,12,9,.65))",
        }}
      />
      {Array.from({ length: 28 }, (_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${random(i) * 100}%`,
            top: `${(random(i + 100) * 100 - frame * 0.018 + 100) % 100}%`,
            width: 2 + random(i + 200) * 4,
            height: 3,
            borderRadius: "50%",
            background: "#efdec0",
            opacity: 0.08 + random(i + 300) * 0.18,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

const Kling = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        scale: interpolate(frame, [0, 341], [1.54, 1.48], clamp),
        translate: "0px -44px",
      }}
    >
      <Video
        name="Kling · slow zoom out · muted"
        src={staticFile("shot_2_kling.mp4")}
        playbackRate={(121 / 24) / (342 / 30)}
        muted
        volume={0}
        objectFit="cover"
        style={{ width: "100%", height: "100%" }}
      />
    </AbsoluteFill>
  );
};

const HailuoCloseup = () => (
  <AbsoluteFill style={{ scale: 1.14, translate: "0px -26px" }}>
    <Video
      name="Hailuo close-up · muted"
      src={staticFile("shot_3_hailuo.mp4")}
      playbackRate={(124 / 24) / (423 / 30)}
      muted
      volume={0}
      objectFit="cover"
      style={{ width: "100%", height: "100%" }}
    />
  </AbsoluteFill>
);

const Grazing = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ scale: interpolate(frame, [0, 291], [1.26, 1.18], clamp), translate: "0px -26px" }}>
      <Video
        name="Hailuo grazing · slow zoom out · muted"
        src={staticFile("shot_4_hailuo.mp4")}
        playbackRate={(124 / 24) / (292 / 30)}
        muted
        volume={0}
        objectFit="cover"
        style={{ width: "100%", height: "100%" }}
      />
    </AbsoluteFill>
  );
};

const Statue = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Img
        src={staticFile("shot_5_statue.jpg")}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "blur(28px) brightness(0.65)",
          scale: 1.12,
        }}
      />
      <Img
        src={staticFile("shot_5_statue.jpg")}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "contain",
          objectPosition: "center center",
          filter: "drop-shadow(0 18px 48px rgba(0,0,0,0.55))",
          transformOrigin: "15% 40%",
          scale: interpolate(frame, [0, 225], [1, 1.05], clamp),
        }}
      />
    </AbsoluteFill>
  );
};

const Hook = () => {
  const frame = useCurrentFrame();
  return (
    <Interactive.Div
      name="Opening hook"
      style={{
        position: "absolute",
        top: 340,
        left: 85,
        right: 85,
        textAlign: "center",
        color: "#fff8e9",
        opacity: interpolate(frame, [0, 8, 95, 104], [0, 1, 1, 0], clamp),
        textShadow: "0 4px 24px #000",
      }}
    >
      <div
        style={{
          fontSize: 30,
          letterSpacing: 8,
          fontWeight: 700,
          color: "#e5bd79",
          marginBottom: 22,
        }}
      >
        PREHISTORIC INDIA
      </div>
      <div
        style={{
          fontSize: 88,
          fontWeight: 900,
          lineHeight: 1.02,
          letterSpacing: -3,
        }}
      >
        INDIA&apos;S
        <br />
        4-HORNED
        <br />
        GIANT GIRAFFE
      </div>
      <div style={{ marginTop: 30, fontSize: 38, fontWeight: 600 }}>
        Shivalik Hills • 1836
      </div>
    </Interactive.Div>
  );
};

const Location = ({ children }: { children: React.ReactNode }) => {
  const frame = useCurrentFrame();
  return (
    <Interactive.Div
      name="Location badge"
      style={{
        position: "absolute",
        top: 190,
        left: 90,
        right: 90,
        padding: "26px 24px",
        background: "transparent",
        textShadow: "0 2px 3px #000, 0 4px 10px #000, 0 8px 24px rgba(0,0,0,.9)",
        WebkitTextStroke: "1px rgba(0,0,0,.85)",
        paintOrder: "stroke fill",
        color: "#fff5de",
        fontSize: 34,
        fontWeight: 700,
        textAlign: "center",
        opacity: interpolate(frame, [0, 14], [0, 1], clamp),
        translate: interpolate(frame, [0, 18], ["0px -18px", "0px 0px"], clamp),
      }}
    >
      <svg
        width="30"
        height="38"
        viewBox="0 0 24 30"
        style={{ verticalAlign: "middle", marginRight: 14 }}
      >
        <path
          d="M12 28S2 16 2 11a10 10 0 0 1 20 0c0 5-10 17-10 17Z"
          fill="#e5bd79"
        />
        <circle cx="12" cy="11" r="4" fill="#26291e" />
      </svg>
      {children}
    </Interactive.Div>
  );
};

const StoryCaptions = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const now = (frame / fps) * 1000;
  const page: Caption[] | undefined = captionPages.find(
    (words) => now >= words[0].startMs && now < words[words.length - 1].endMs,
  );
  if (!page || (frame >= 759 && frame < 809)) return null;
  return (
    <Interactive.Div
      name="Narration · word highlights"
      style={{
        position: "absolute",
        bottom: "24%",
        left: 100,
        right: 120,
        textAlign: "center",
        fontSize: 58,
        lineHeight: 1.2,
        fontWeight: 800,
        color: "#F8FAFC",
        textShadow: "0 2px 3px #000, 0 4px 10px #000, 0 8px 24px rgba(0,0,0,.9)",
        WebkitTextStroke: "1px rgba(0,0,0,.85)",
        paintOrder: "stroke fill",
        padding: "20px 24px",
        background: "transparent",
      }}
    >
      {page.map((word) => (
        <span
          key={word.startMs}
          style={{
            color:
              now >= word.startMs && now < word.endMs ? "#F59E0B" : "#F8FAFC",
          }}
        >
          {word.text}
        </span>
      ))}
    </Interactive.Div>
  );
};

const Rumble = () => (
  <>
    <Audio
      name="Sivatherium rumble"
      src={staticFile("Sivatherium_sound.mp3")}
      // Strongest rumble section, fitted inside the recorded speech pause.
      trimBefore={8}
      durationInFrames={50}
      volume={(f) =>
        interpolate(f, [0, 6, 39.5, 50], [0, 1, 1, 0], clamp)
      }
    />
    <Interactive.Div
      name="Rumble sound cue"
      style={{
        position: "absolute",
        bottom: "24%",
        left: 110,
        right: 110,
        textAlign: "center",
        padding: "24px 18px",
        background: "transparent",
        color: "#F8FAFC",
        fontWeight: 800,
        textShadow: "0 2px 3px #000, 0 4px 10px #000, 0 8px 24px rgba(0,0,0,.9)",
        WebkitTextStroke: "1px rgba(0,0,0,.85)",
        paintOrder: "stroke fill",
        fontSize: 33,
        fontStyle: "italic",
        letterSpacing: 1.5,
      }}
    >
      [ DEEP CLOSED-MOUTH HUM ]
    </Interactive.Div>
  </>
);

const OptionalVoiceover = () => {
  const [present, setPresent] = useState(() =>
    getStaticFiles().some((f) => f.name === "voiceover.mp3"),
  );
  useEffect(() => {
    if (!getRemotionEnvironment().isStudio) return;
    const watcher = watchPublicFolder((files) =>
      setPresent(files.some((f) => f.name === "voiceover.mp3")),
    );
    return () => watcher.cancel();
  }, []);
  return present ? (
    <Audio
      name="Voiceover"
      src={staticFile("voiceover.mp3")}
      durationInFrames={1620}
      volume={(frame) => interpolate(frame, [1602, 1619], [1, 0], clamp)}
    />
  ) : null;
};

const EndingFade = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{ backgroundColor: "black", opacity: interpolate(frame, [1602, 1619], [0, 1], clamp), pointerEvents: "none" }} />;
};

export const SivatheriumReel = () => (
  <AbsoluteFill
    style={{
      backgroundColor: "#171512",
      fontFamily: "Arial, Helvetica, sans-serif",
      overflow: "hidden",
    }}
  >
    <svg width="0" height="0" aria-hidden style={{ position: "absolute" }}>
      <defs>
        <filter id="gentle-sharpen" colorInterpolationFilters="sRGB">
          <feConvolveMatrix
            order="3"
            kernelMatrix="0 -0.08 0 -0.08 1.32 -0.08 0 -0.08 0"
            preserveAlpha
          />
        </filter>
      </defs>
    </svg>
    <AbsoluteFill
      style={{ filter: "contrast(1.05) saturate(1.06) url(#gentle-sharpen)" }}
    >
      <Sequence name="01 · Skeleton" durationInFrames={320}>
        <Skeleton />
      </Sequence>
      <Sequence name="02 · Kling" from={320} durationInFrames={342}>
        <Kling />
      </Sequence>
      <Sequence
        name="03 · Continuous Hailuo close-up"
        from={662}
        durationInFrames={423}
      >
        <HailuoCloseup />
      </Sequence>
      <Sequence name="04 · Hailuo" from={1085} durationInFrames={292}>
        <Grazing />
      </Sequence>
      <Sequence
        name="05 · Saketi reconstruction"
        from={1377}
        durationInFrames={243}
      >
        <Statue />
      </Sequence>
    </AbsoluteFill>
    <Sequence name="Hook title" durationInFrames={105}>
      <Hook />
    </Sequence>
    <Sequence name="Shivalik Hills location" durationInFrames={320}>
      <Location>Shivalik Hills • Himalayan Foothills</Location>
    </Sequence>
    <Sequence name="Saketi location" from={1377} durationInFrames={243}>
      <Location>Shivalik Fossil Park • Saketi, HP</Location>
    </Sequence>
    <StoryCaptions />
    <Sequence name="Recorded creature pause" from={759} durationInFrames={50}>
      <Rumble />
    </Sequence>
    <OptionalVoiceover />
    <EndingFade />
  </AbsoluteFill>
);
