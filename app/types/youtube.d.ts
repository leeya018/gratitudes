import type { Player } from "youtube";

declare global {
  interface Window {
    YT: typeof YT & { Player: typeof Player };
    onYouTubeIframeAPIReady: () => void;
  }
}
