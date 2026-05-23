import { useCallback, useEffect, useRef, useState } from 'react';

interface VoiceOptions {
  rate?: number;
  pitch?: number;
  onEnd?: () => void;
}

// Preferred voices ranked by quality (Samantha is the best on macOS)
const PREFERRED_VOICES = [
  'Samantha',           // macOS - very natural female voice
  'Karen',              // macOS - Australian English
  'Daniel',             // macOS - British English
  'Google US English',  // Chrome - good quality
  'Microsoft Zira',     // Windows - clear female voice
  'Microsoft David',    // Windows - clear male voice
];

// Toddler-friendly defaults
const DEFAULT_RATE = 0.85;  // Slightly slower for clarity
const DEFAULT_PITCH = 1.15; // Slightly higher for warmth

export const useVoice = () => {
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [isSupported, setIsSupported] = useState(
    () => 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
  );
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);

    const selectBestVoice = () => {
      const voices = speechSynthesis.getVoices();
      if (voices.length === 0) return;

      // Try to find a preferred voice
      for (const preferredName of PREFERRED_VOICES) {
        const found = voices.find(v =>
          v.name.includes(preferredName) && v.lang.startsWith('en')
        );
        if (found) {
          setVoice(found);
          return;
        }
      }

      // Fallback to first English voice
      const englishVoice = voices.find(v => v.lang.startsWith('en'));
      if (englishVoice) {
        setVoice(englishVoice);
      }
    };

    const resumeSpeech = () => {
      speechSynthesis.resume();
    };

    // Voices may load asynchronously
    selectBestVoice();
    speechSynthesis.onvoiceschanged = selectBestVoice;
    window.addEventListener('pointerdown', resumeSpeech);
    window.addEventListener('touchstart', resumeSpeech);

    return () => {
      speechSynthesis.onvoiceschanged = null;
      window.removeEventListener('pointerdown', resumeSpeech);
      window.removeEventListener('touchstart', resumeSpeech);
    };
  }, []);

  const speak = useCallback((text: string, options: VoiceOptions = {}) => {
    if (!isSupported || !text.trim()) return;

    utteranceRef.current = null;
    speechSynthesis.resume();
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    if (voice) {
      utterance.voice = voice;
    }

    utterance.rate = options.rate ?? DEFAULT_RATE;
    utterance.pitch = options.pitch ?? DEFAULT_PITCH;

    utterance.onend = () => {
      utteranceRef.current = null;
      options.onEnd?.();
    };

    utterance.onerror = () => {
      utteranceRef.current = null;
    };

    speechSynthesis.speak(utterance);
  }, [voice, isSupported]);

  const stop = useCallback(() => {
    if (isSupported) {
      utteranceRef.current = null;
      speechSynthesis.cancel();
    }
  }, [isSupported]);

  return {
    speak,
    stop,
    isSupported,
    voiceName: voice?.name ?? 'default',
  };
};
