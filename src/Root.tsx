import { Composition } from "remotion";
import { SivatheriumReel } from "./Composition";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="SivatheriumReel"
    component={SivatheriumReel}
    durationInFrames={1620}
    fps={30}
    width={1080}
    height={1920}
  />
);
