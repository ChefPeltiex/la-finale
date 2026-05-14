import { useState } from "react";
import { Music, Volume2, VolumeX } from "lucide-react";
import { AMBIENT_TRACKS } from "./AmbientMusic";

export default function AudioControl() {
  const [currentTrack, setCurrentTrack] = useState(() => {
    return localStorage.getItem("ambientTrack") || "silence";
  });
  const [volume, setVolume] = useState(() => {
    return parseFloat(localStorage.getItem("ambientVolume") || "0.3");
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleTrackChange = (trackId) => {
    setCurrentTrack(trackId);
    localStorage.setItem("ambientTrack", trackId);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    localStorage.setItem("ambientVolume", newVolume.toString());
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Main button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 group"
        title="Musique d'ambiance"
      >
        <Music className="h-6 w-6 group-hover:animate-bounce" />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-64 bg-card rounded-2xl border border-border shadow-2xl p-5 space-y-4 animate-in fade-in slide-in-from-bottom-2">
          {/* Track selector */}
          <div>
            <label className="text-xs font-semibold text-foreground uppercase tracking-widest mb-3 block">
              🎵 Ambiance sonore
            </label>
            <div className="space-y-2">
              {AMBIENT_TRACKS.map((track) => (
                <button
                  key={track.id}
                  onClick={() => handleTrackChange(track.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentTrack === track.id
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  {track.name}
                </button>
              ))}
            </div>
          </div>

          {/* Volume control */}
          {currentTrack !== "silence" && (
            <div className="space-y-2 border-t border-border pt-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-widest">
                  Volume
                </label>
                <span className="text-xs text-muted-foreground">
                  {Math.round(volume * 100)}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <VolumeX className="h-4 w-4 text-muted-foreground" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="flex-1 h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                />
                <Volume2 className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          )}

          {/* Info */}
          <div className="text-[10px] text-muted-foreground italic pt-2 border-t border-border space-y-1">
            <p>✨ La plateforme reflète ton âme. Chaque track = une vibration</p>
            <p>
              Planet Earth (Zimmer) : dépose ton fichier sous{" "}
              <code className="text-[9px] bg-muted px-1 rounded">public/audio/planet-earth-theme.mp3</code> ou variables{" "}
              <code className="text-[9px] bg-muted px-1 rounded">VITE_PLANET_EARTH_THEME_URL</code>.
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="w-full text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Fermer
          </button>
        </div>
      )}
    </div>
  );
}