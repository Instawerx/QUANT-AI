'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export type SoundName = 'spin' | 'win' | 'lose' | 'click' | 'coin' | 'doubleup' | 'fanfare';

interface SoundEffectsReturn {
  play: (sound: SoundName) => void;
  stop: (sound: SoundName) => void;
  muted: boolean;
  setMuted: (muted: boolean) => void;
  volume: number;
  setVolume: (volume: number) => void;
}

export function useSoundEffects(): SoundEffectsReturn {
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const sounds = useRef<Record<string, HTMLAudioElement>>({});
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Initialize all sound effects
    const soundFiles: Record<SoundName, string> = {
      spin: '/sounds/wheel-spin.mp3',
      win: '/sounds/win-celebration.mp3',
      lose: '/sounds/lose-sound.mp3',
      click: '/sounds/click.mp3',
      coin: '/sounds/coin-drop.mp3',
      doubleup: '/sounds/double-up.mp3',
      fanfare: '/sounds/fanfare.mp3',
    };

    Object.entries(soundFiles).forEach(([name, path]) => {
      const audio = new Audio(path);
      audio.volume = volume;
      audio.preload = 'auto';
      sounds.current[name] = audio;
    });

    // Cleanup
    return () => {
      Object.values(sounds.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []);

  // Update volume when it changes
  useEffect(() => {
    Object.values(sounds.current).forEach(audio => {
      audio.volume = volume;
    });
  }, [volume]);

  const play = useCallback((sound: SoundName) => {
    if (muted || !sounds.current[sound]) return;

    try {
      const audio = sounds.current[sound];
      audio.currentTime = 0; // Reset to start
      audio.play().catch(error => {
        console.warn(`Failed to play sound: ${sound}`, error);
      });
    } catch (error) {
      console.warn(`Error playing sound: ${sound}`, error);
    }
  }, [muted]);

  const stop = useCallback((sound: SoundName) => {
    if (!sounds.current[sound]) return;

    try {
      const audio = sounds.current[sound];
      audio.pause();
      audio.currentTime = 0;
    } catch (error) {
      console.warn(`Error stopping sound: ${sound}`, error);
    }
  }, []);

  return {
    play,
    stop,
    muted,
    setMuted,
    volume,
    setVolume,
  };
}
