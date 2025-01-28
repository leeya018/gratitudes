"use client";

import { useState, useRef, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Volume2 } from "lucide-react";

export default function YouTubePlayer() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [isYoutubeAudioPlaying, setIsYoutubeAudioPlaying] = useState(false);
  const [youtubeVolume, setYoutubeVolume] = useState(100);
  const [isYoutubePlayerReady, setIsYoutubePlayerReady] = useState(false);
  const [isYoutubeLoading, setIsYoutubeLoading] = useState(false);
  const youtubePlayerRef = useRef<YT.Player | null>(null);

  useEffect(() => {
    if (!window.YT) {
      const loadYouTubeAPI = () => {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      };

      loadYouTubeAPI();

      window.onYouTubeIframeAPIReady = () => {
        console.log("YouTube API is ready");
        initializeYouTubePlayer();
      };
    } else {
      initializeYouTubePlayer();
    }

    return () => {
      if (youtubePlayerRef.current) {
        youtubePlayerRef.current.destroy();
      }
    };
  }, []);

  const initializeYouTubePlayer = () => {
    if (window.YT && window.YT.Player) {
      youtubePlayerRef.current = new window.YT.Player("youtube-player", {
        height: "1",
        width: "1",
        videoId: "",
        playerVars: {
          playsinline: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
          onError: (event: any) => {
            console.error("YouTube player error:", event.data);
            setIsYoutubeLoading(false);
            setIsYoutubeAudioPlaying(false);
            alert(
              "An error occurred with the YouTube player. Please try again."
            );
          },
        },
      });
    } else {
      console.error("YouTube API is not loaded yet");
      setTimeout(initializeYouTubePlayer, 100);
    }
  };

  const onPlayerReady = (event: YT.PlayerEvent) => {
    console.log("YouTube player is ready");
    setIsYoutubePlayerReady(true);
  };

  const onPlayerStateChange = (event: YT.OnStateChangeEvent) => {
    if (event.data === YT.PlayerState.PLAYING) {
      setIsYoutubeAudioPlaying(true);
    } else if (
      event.data === YT.PlayerState.PAUSED ||
      event.data === YT.PlayerState.ENDED
    ) {
      setIsYoutubeAudioPlaying(false);
    } else if (event.data === YT.PlayerState.UNSTARTED) {
      console.error("YouTube video failed to start");
      setIsYoutubeLoading(false);
      setIsYoutubeAudioPlaying(false);
    }
  };

  useEffect(() => {
    if (youtubePlayerRef.current && isYoutubePlayerReady) {
      youtubePlayerRef.current.setVolume(youtubeVolume);
    }
  }, [youtubeVolume, isYoutubePlayerReady]);

  const playYoutubeAudio = () => {
    if (
      youtubePlayerRef.current &&
      youtubePlayerRef.current.loadVideoById &&
      isYoutubePlayerReady
    ) {
      const videoId = getYoutubeVideoId(youtubeUrl);
      if (videoId) {
        setIsYoutubeLoading(true);
        try {
          youtubePlayerRef.current.loadVideoById({
            videoId: videoId,
            startSeconds: 0,
          });
          youtubePlayerRef.current.playVideo();
          setTimeout(() => {
            setIsYoutubeLoading(false);
            setIsYoutubeAudioPlaying(true);
          }, 1000);
        } catch (error) {
          console.error("Error playing YouTube video:", error);
          setIsYoutubeLoading(false);
          alert("Error playing YouTube video. Please try again.");
        }
      } else {
        alert("Invalid YouTube URL");
      }
    } else {
      console.error("YouTube player is not ready or fully initialized");
      alert("YouTube player is not ready. Please try again in a few seconds.");
    }
  };

  const stopYoutubeAudio = () => {
    if (youtubePlayerRef.current && isYoutubePlayerReady) {
      youtubePlayerRef.current.stopVideo();
      setIsYoutubeAudioPlaying(false);
    } else {
      console.error("YouTube player is not ready");
    }
  };

  const toggleYoutubeAudio = () => {
    if (isYoutubeAudioPlaying) {
      stopYoutubeAudio();
    } else {
      playYoutubeAudio();
    }
  };

  const getYoutubeVideoId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleVolumeChange = (value: number[]) => {
    setYoutubeVolume(value[0]);
  };

  return (
    <div className="mt-8 mb-4">
      <h2 className="text-2xl font-bold mb-4">YouTube Background Audio</h2>
      <div className="flex items-center space-x-2 mb-2">
        <input
          type="text"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          placeholder="Enter YouTube URL"
          className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={toggleYoutubeAudio}
          className={`px-4 py-2 text-white rounded ${
            isYoutubeAudioPlaying
              ? "bg-gray-500 hover:bg-gray-600"
              : "bg-red-500 hover:bg-red-600"
          }`}
          disabled={!isYoutubePlayerReady || isYoutubeLoading}
        >
          {isYoutubeLoading
            ? "Loading..."
            : isYoutubeAudioPlaying
            ? "Stop"
            : "Play"}
        </button>
      </div>
      <div className="flex items-center space-x-2">
        <Volume2 className="w-6 h-6 text-gray-500" />
        <Slider
          value={[youtubeVolume]}
          onValueChange={handleVolumeChange}
          max={100}
          step={1}
          className="w-48"
        />
        <span className="text-sm text-gray-500">{youtubeVolume}%</span>
      </div>
      <div
        id="youtube-player"
        style={{
          position: "absolute",
          top: "-9999px",
          left: "-9999px",
          pointerEvents: "none",
          width: "1px",
          height: "1px",
        }}
      ></div>
    </div>
  );
}
