import { useEffect, useRef, useState } from "react";

/** Thème « Planet Earth » (Hans Zimmer) : pas de fichier inclus (droits d’auteur). Place une copie personnelle licenciée sous `public/audio/planet-earth-theme.mp3` ou définis `VITE_PLANET_EARTH_THEME_URL`. */
const PLANET_EARTH_THEME_URL =
  import.meta.env.VITE_PLANET_EARTH_THEME_URL || "/audio/planet-earth-theme.mp3";

const AMBIENT_TRACKS = [
  { id: "silence", name: "Silence", url: null },
  {
    id: "planet-earth",
    name: "Planet Earth — Hans Zimmer",
    url: PLANET_EARTH_THEME_URL,
  },
  { id: "cosmic", name: "Cosmic Flow", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: "forest", name: "Forest Dreams", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: "ocean", name: "Ocean Waves", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  { id: "meditation", name: "Meditation", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
  { id: "urban", name: "Urban Vibe", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
];

export default function AmbientMusic() {
  const audioRef = useRef(null);
  const [currentTrack] = useState(() => {
    return localStorage.getItem("ambientTrack") || "silence";
  });
  const [volume] = useState(() => {
    return parseFloat(localStorage.getItem("ambientVolume") || "0.3");
  });

  const currentTrackData = AMBIENT_TRACKS.find(t => t.id === currentTrack);

  // Handle track changes
  useEffect(() => {
    localStorage.setItem("ambientTrack", currentTrack);

    if (audioRef.current) {
      audioRef.current.pause();

      if (currentTrack !== "silence" && currentTrackData?.url) {
        audioRef.current.src = currentTrackData.url;
        audioRef.current.play().catch(() => {});
      }
    }
  }, [currentTrack, currentTrackData]);

  // Handle volume changes
  useEffect(() => {
    localStorage.setItem("ambientVolume", volume.toString());
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle audio loop
  const handleAudioEnd = () => {
    if (audioRef.current && currentTrack !== "silence") {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  return (
    <audio
      ref={audioRef}
      onEnded={handleAudioEnd}
      crossOrigin="anonymous"
      style={{ display: "none" }}
    />
  );
}

export { AMBIENT_TRACKS };