import { useEffect, useRef } from 'react';

export const SOUND_EFFECTS = {
  click: 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==',
  success: 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==',
  hover: 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==',
};

export function useAudio() {
  const audioRef = useRef({});

  useEffect(() => {
    // Preload sounds
    Object.entries(SOUND_EFFECTS).forEach(([name, data]) => {
      const audio = new Audio(data);
      audio.volume = 0.3;
      audioRef.current[name] = audio;
    });

    return () => {
      Object.values(audioRef.current).forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, []);

  const playSound = (name) => {
    if (audioRef.current[name]) {
      const audio = audioRef.current[name].cloneNode();
      audio.play().catch(() => {});
    }
  };

  return { playSound };
}