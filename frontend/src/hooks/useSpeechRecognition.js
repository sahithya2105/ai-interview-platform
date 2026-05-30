import { useState, useRef, useCallback } from 'react';

export function useSpeechRecognition() {
  const [transcript, setTranscript]   = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef                = useRef(null);

  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return false;

    const recognition         = new SR();
    recognition.continuous    = true;
    recognition.interimResults = true;
    recognition.lang          = 'en-US';

    recognition.onresult = (e) => {
      const text = Array.from(e.results).map((r) => r[0].transcript).join('');
      setTranscript(text);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend   = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
    return true;
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const reset = useCallback(() => setTranscript(''), []);

  return { transcript, isListening, startListening, stopListening, reset };
}