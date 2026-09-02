import { useEffect, useRef, useState } from "react";

type SpeechRecognitionLike = {
  lang?: string;
  interimResults?: boolean;
  maxAlternatives?: number;
  start: () => void;
  stop: () => void;
  onresult?: (event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void;
  onerror?: () => void;
  onend?: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

export const useSpeechRecognition = (onTranscript: (transcript: string) => void) => {
  const callbackRef = useRef(onTranscript);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  callbackRef.current = onTranscript;

  useEffect(() => {
    const browserWindow = window as Window & { SpeechRecognition?: SpeechRecognitionConstructor; webkitSpeechRecognition?: SpeechRecognitionConstructor };
    const Constructor = browserWindow.SpeechRecognition || browserWindow.webkitSpeechRecognition;
    if (!Constructor) return;

    const recognition = new Constructor();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript || "";
      if (transcript) callbackRef.current(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    setIsSupported(true);

    return () => recognition.stop();
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  return { isListening, isSupported, toggleListening };
};