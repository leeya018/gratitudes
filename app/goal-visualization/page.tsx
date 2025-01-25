"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Trash2, Volume2 } from "lucide-react";

interface SentenceRecord {
  id: string;
  text: string;
  audioData?: string;
}

type RepeatDuration = "none" | "10min" | "30min" | "1hour" | "forever";

export default function GoalVisualization() {
  const [target, setTarget] = useState("");
  const [emotions, setEmotions] = useState("");
  const [characters, setCharacters] = useState("");
  const [sentences, setSentences] = useState<SentenceRecord[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioData, setAudioData] = useState<string | null>(null);
  const [repeatDuration, setRepeatDuration] = useState<RepeatDuration>("none");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState<number | null>(
    null
  );
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [sentenceToDelete, setSentenceToDelete] = useState<string | null>(null);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [playAllRepeatDuration, setPlayAllRepeatDuration] =
    useState<RepeatDuration>("none");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [isYoutubeAudioPlaying, setIsYoutubeAudioPlaying] = useState(false);
  const [youtubeVolume, setYoutubeVolume] = useState(100);
  const [isRecordingSupported, setIsRecordingSupported] = useState(false); // Added state for recording support
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement[]>([]);
  const repeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const youtubePlayerRef = useRef<YT.Player | null>(null);

  useEffect(() => {
    const savedSentences = localStorage.getItem("psychokiberneticSentences");
    if (savedSentences) {
      setSentences(JSON.parse(savedSentences));
    }

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    window.onYouTubeIframeAPIReady = () => {
      youtubePlayerRef.current = new YT.Player("youtube-player", {
        height: "0",
        width: "0",
        videoId: "",
        playerVars: {
          playsinline: 1,
          controls: 0,
          disablekb: 1,
        },
        events: {
          onStateChange: onPlayerStateChange,
        },
      });
    };

    return () => {
      if (repeatIntervalRef.current) {
        clearInterval(repeatIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (youtubePlayerRef.current) {
      youtubePlayerRef.current.setVolume(youtubeVolume);
    }
  }, [youtubeVolume]);

  const onPlayerStateChange = (event: YT.OnStateChangeEvent) => {
    if (event.data === YT.PlayerState.PLAYING) {
      setIsYoutubeAudioPlaying(true);
    } else if (
      event.data === YT.PlayerState.PAUSED ||
      event.data === YT.PlayerState.ENDED
    ) {
      setIsYoutubeAudioPlaying(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSentence = {
      id: Date.now().toString(),
      text: `I am ${characters} and I am feeling ${emotions} now that I have ${target}.`,
    };
    const updatedSentences = [...sentences, newSentence];
    setSentences(updatedSentences);
    localStorage.setItem(
      "psychokiberneticSentences",
      JSON.stringify(updatedSentences)
    );
    setTarget("");
    setEmotions("");
    setCharacters("");
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.addEventListener(
        "dataavailable",
        handleDataAvailable
      );
      mediaRecorderRef.current.addEventListener("stop", handleStop);
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing the microphone", err);
      alert(
        "Unable to access the microphone. Please ensure you've granted the necessary permissions and are using a compatible browser."
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleDataAvailable = (e: BlobEvent) => {
    if (e.data.size > 0) {
      audioChunksRef.current.push(e.data);
    }
  };

  const handleStop = () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setAudioData(reader.result);
      }
    };
    reader.readAsDataURL(audioBlob);
    audioChunksRef.current = [];
  };

  const attachAudioToLastSentence = () => {
    if (audioData) {
      const updatedSentences = [...sentences];
      updatedSentences[updatedSentences.length - 1].audioData = audioData;
      setSentences(updatedSentences);
      localStorage.setItem(
        "psychokiberneticSentences",
        JSON.stringify(updatedSentences)
      );
      setAudioData(null);
    }
  };

  const playSentenceAudio = (
    audioData: string,
    index: number,
    repeat: RepeatDuration = "none"
  ) => {
    if (isPlaying) {
      stopPlayback();
    }

    setIsPlaying(true);
    setRepeatDuration(repeat);
    setCurrentPlayingIndex(index);

    const audio = new Audio(audioData);
    audioRef.current[index] = audio;

    const playOnce = () => {
      audio.play();
    };

    const setupRepeat = () => {
      audio.addEventListener("ended", playOnce);
      playOnce();

      if (repeat !== "forever") {
        const duration =
          repeat === "10min" ? 600000 : repeat === "30min" ? 1800000 : 3600000;
        repeatIntervalRef.current = setTimeout(() => {
          stopPlayback();
        }, duration);
      }
    };

    if (repeat === "none") {
      playOnce();
    } else {
      setupRepeat();
    }
  };

  const stopPlayback = () => {
    audioRef.current.forEach((audio) => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    if (repeatIntervalRef.current) {
      clearTimeout(repeatIntervalRef.current);
    }
    setIsPlaying(false);
    setIsPlayingAll(false);
    setRepeatDuration("none");
    setPlayAllRepeatDuration("none");
    setCurrentPlayingIndex(null);
  };

  const handleDeleteClick = (id: string) => {
    setSentenceToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (sentenceToDelete) {
      const updatedSentences = sentences.filter(
        (sentence) => sentence.id !== sentenceToDelete
      );
      setSentences(updatedSentences);
      localStorage.setItem(
        "psychokiberneticSentences",
        JSON.stringify(updatedSentences)
      );
      setDeleteModalOpen(false);
      setSentenceToDelete(null);
    }
  };

  const playAllSentences = (repeat: RepeatDuration = "none") => {
    if (isPlaying || isPlayingAll) {
      stopPlayback();
    }

    setIsPlayingAll(true);
    setPlayAllRepeatDuration(repeat);

    const playNextSentence = (index: number) => {
      if (index >= sentences.length) {
        if (repeat === "none") {
          stopPlayback();
          return;
        }
        index = 0;
      }

      const sentence = sentences[index];
      if (sentence.audioData) {
        const audio = new Audio(sentence.audioData);
        audioRef.current[index] = audio;

        audio.onended = () => {
          playNextSentence(index + 1);
        };

        audio.play();
        setCurrentPlayingIndex(index);
      } else {
        playNextSentence(index + 1);
      }
    };

    playNextSentence(0);

    if (repeat !== "forever" && repeat !== "none") {
      const duration =
        repeat === "10min" ? 600000 : repeat === "30min" ? 1800000 : 3600000;
      repeatIntervalRef.current = setTimeout(() => {
        stopPlayback();
      }, duration);
    }
  };

  const playYoutubeAudio = () => {
    if (youtubePlayerRef.current) {
      const videoId = getYoutubeVideoId(youtubeUrl);
      if (videoId) {
        youtubePlayerRef.current.loadVideoById(videoId);
        youtubePlayerRef.current.playVideo();
      } else {
        alert("Invalid YouTube URL");
      }
    }
  };

  const stopYoutubeAudio = () => {
    if (youtubePlayerRef.current) {
      youtubePlayerRef.current.stopVideo();
      setIsYoutubeAudioPlaying(false);
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

  const checkRecordingSupport = () => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  };

  useEffect(() => {
    setIsRecordingSupported(checkRecordingSupport());
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Goal Visualization</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mb-4">
        <div>
          <label
            htmlFor="target"
            className="block text-sm font-medium text-gray-700"
          >
            Your Target
          </label>
          <input
            type="text"
            id="target"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div>
          <label
            htmlFor="emotions"
            className="block text-sm font-medium text-gray-700"
          >
            Emotions After Achieving
          </label>
          <input
            type="text"
            id="emotions"
            value={emotions}
            onChange={(e) => setEmotions(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div>
          <label
            htmlFor="characters"
            className="block text-sm font-medium text-gray-700"
          >
            Characters of Someone Who Achieved This
          </label>
          <input
            type="text"
            id="characters"
            value={characters}
            onChange={(e) => setCharacters(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Generate Sentence
        </button>
      </form>

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
            onClick={playYoutubeAudio}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            disabled={isYoutubeAudioPlaying}
          >
            Play
          </button>
          <button
            onClick={stopYoutubeAudio}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            disabled={!isYoutubeAudioPlaying}
          >
            Stop
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
      </div>

      {sentences.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">
            Psychokibernetic Sentences
          </h2>
          <div className="mb-4 flex items-center space-x-2">
            <button
              onClick={() => playAllSentences("none")}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              disabled={isPlayingAll}
            >
              Play All Once
            </button>
            <select
              onChange={(e) =>
                playAllSentences(e.target.value as RepeatDuration)
              }
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              value={isPlayingAll ? playAllRepeatDuration : "none"}
              disabled={isPlayingAll}
            >
              <option value="none">Repeat All...</option>
              <option value="10min">10 minutes</option>
              <option value="30min">30 minutes</option>
              <option value="1hour">1 hour</option>
              <option value="forever">Forever</option>
            </select>
            {isPlayingAll && (
              <button
                onClick={stopPlayback}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Stop All
              </button>
            )}
          </div>
          <ul className="space-y-4">
            {sentences.map((sentence, index) => (
              <li key={sentence.id} className="bg-gray-100 p-4 rounded">
                <div className="flex justify-between items-start">
                  <p>{sentence.text}</p>
                  <button
                    onClick={() => handleDeleteClick(sentence.id)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Delete sentence"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                {sentence.audioData && (
                  <div className="mt-2 flex items-center space-x-2">
                    <button
                      onClick={() =>
                        playSentenceAudio(sentence.audioData!, index, "none")
                      }
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      disabled={isPlayingAll}
                    >
                      Play Once
                    </button>
                    <select
                      onChange={(e) =>
                        playSentenceAudio(
                          sentence.audioData!,
                          index,
                          e.target.value as RepeatDuration
                        )
                      }
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      value={
                        isPlaying && index === currentPlayingIndex
                          ? repeatDuration
                          : "none"
                      }
                      disabled={isPlayingAll}
                    >
                      <option value="none">Repeat...</option>
                      <option value="10min">10 minutes</option>
                      <option value="30min">30 minutes</option>
                      <option value="1hour">1 hour</option>
                      <option value="forever">Forever</option>
                    </select>
                    {isPlaying &&
                      index === currentPlayingIndex &&
                      !isPlayingAll && (
                        <button
                          onClick={stopPlayback}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Stop
                        </button>
                      )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {sentences.length > 0 && !sentences[sentences.length - 1].audioData && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Record Your Sentence</h3>
          {checkRecordingSupport() ? (
            <>
              {!isRecording && !audioData && (
                <button
                  onClick={startRecording}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Start Recording
                </button>
              )}
              {isRecording && (
                <button
                  onClick={stopRecording}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Stop Recording
                </button>
              )}
            </>
          ) : (
            <p className="text-red-500">
              Recording is not supported on your device or browser.
            </p>
          )}
          {audioData && (
            <div>
              <audio src={audioData} controls className="mt-2" />
              <button
                onClick={attachAudioToLastSentence}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Attach Recording to Sentence
              </button>
            </div>
          )}
        </div>
      )}

      <Link
        href="/"
        className="text-blue-500 hover:underline mt-8 inline-block"
      >
        Back to Gratitude Journal
      </Link>

      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this psychokibernetic sentence?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div id="youtube-player"></div>
    </div>
  );
}
