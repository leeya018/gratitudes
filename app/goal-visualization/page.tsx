"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface SentenceRecord {
  text: string;
  audioUrl?: string;
}

export default function GoalVisualization() {
  const [target, setTarget] = useState("");
  const [emotions, setEmotions] = useState("");
  const [characters, setCharacters] = useState("");
  const [sentences, setSentences] = useState<SentenceRecord[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    const savedSentences = localStorage.getItem("psychokiberneticSentences");
    if (savedSentences) {
      setSentences(JSON.parse(savedSentences));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSentence = `I am ${characters} and I am feeling ${emotions} now that I have ${target}.`;
    const updatedSentences = [...sentences, { text: newSentence }];
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
    const audioUrl = URL.createObjectURL(audioBlob);
    setAudioUrl(audioUrl);
    audioChunksRef.current = [];
  };

  const attachAudioToLastSentence = () => {
    if (audioUrl) {
      const updatedSentences = [...sentences];
      updatedSentences[updatedSentences.length - 1].audioUrl = audioUrl;
      setSentences(updatedSentences);
      localStorage.setItem(
        "psychokiberneticSentences",
        JSON.stringify(updatedSentences)
      );
      setAudioUrl(null);
    }
  };

  const playSentenceAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play();
  };

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

      {sentences.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">
            Psychokibernetic Sentences
          </h2>
          <ul className="space-y-4">
            {sentences.map((sentence, index) => (
              <li key={index} className="bg-gray-100 p-4 rounded">
                <p>{sentence.text}</p>
                {sentence.audioUrl && (
                  <button
                    onClick={() => playSentenceAudio(sentence.audioUrl!)}
                    className="mt-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Play Recording
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {sentences.length > 0 && !sentences[sentences.length - 1].audioUrl && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Record Your Sentence</h3>
          {!isRecording && !audioUrl && (
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
          {audioUrl && (
            <div>
              <audio src={audioUrl} controls className="mt-2" />
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
    </div>
  );
}
