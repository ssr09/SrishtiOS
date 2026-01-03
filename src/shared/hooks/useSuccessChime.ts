import { useCallback, useRef } from 'react';

/**
 * A hook that plays a short, pleasant chime sound using Web Audio API.
 * Used for success feedback in games without over-the-top verbal praise.
 */
export function useSuccessChime() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    return audioContextRef.current;
  }, []);

  const playChime = useCallback(() => {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      // Create a pleasant two-note chime (like a soft "ding-ding")
      const frequencies = [523.25, 659.25]; // C5 and E5 - a happy major third

      frequencies.forEach((freq, i) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(freq, now);

        // Quick attack, gentle decay
        const noteStart = now + i * 0.08;
        gainNode.gain.setValueAtTime(0, noteStart);
        gainNode.gain.linearRampToValueAtTime(0.3, noteStart + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.01, noteStart + 0.3);

        oscillator.start(noteStart);
        oscillator.stop(noteStart + 0.35);
      });
    } catch {
      // Audio context not supported - fail silently
    }
  }, [getAudioContext]);

  return { playChime };
}
