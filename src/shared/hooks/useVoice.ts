import { useCallback, useEffect, useState } from 'react';

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
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
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
          console.log(`🎙️ Selected voice: ${found.name}`);
          return;
        }
      }

      // Fallback to first English voice
      const englishVoice = voices.find(v => v.lang.startsWith('en'));
      if (englishVoice) {
        setVoice(englishVoice);
        console.log(`🎙️ Fallback voice: ${englishVoice.name}`);
      }
    };

    // Voices may load asynchronously
    selectBestVoice();
    speechSynthesis.onvoiceschanged = selectBestVoice;

    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speak = useCallback((text: string, options: VoiceOptions = {}) => {
    if (!isSupported) return;

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    if (voice) {
      utterance.voice = voice;
    }

    utterance.rate = options.rate ?? DEFAULT_RATE;
    utterance.pitch = options.pitch ?? DEFAULT_PITCH;

    if (options.onEnd) {
      utterance.onend = options.onEnd;
    }

    speechSynthesis.speak(utterance);
  }, [voice, isSupported]);

  const stop = useCallback(() => {
    if (isSupported) {
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
