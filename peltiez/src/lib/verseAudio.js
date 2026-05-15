/**
 * Ambiance procédurale du Verse — tons symboliques (Web Audio API).
 * Aucun extrait YouTube ; profils inspirés du Codex (432, 528, 852, 963, 7,83 Hz).
 */

export const VERSE_AUDIO_STORAGE_KEY = "egor69_verse_audio";

/** Profils symboliques — non médicaux, volume très bas. */
export const FREQUENCY_PROFILES = {
  matter: {
    id: "matter",
    hz: 432,
    label: "432 Hz",
    pole: "matière",
    hint: "Ancrage matériel · circulation des biens et du vivant.",
  },
  sens: {
    id: "sens",
    hz: 528,
    label: "528 Hz",
    pole: "sens",
    hint: "Ouverture sensorielle · bien-être contextualisé, sans promesse.",
  },
  heart: {
    id: "heart",
    hz: 852,
    label: "852 Hz",
    pole: "cœur",
    hint: "Clarté intérieure · intention honnête avant le seuil.",
  },
  myth: {
    id: "myth",
    hz: 963,
    label: "963 Hz",
    pole: "mythologie",
    hint: "Hauteur symbolique · mythes lus avec distance critique.",
  },
  earth: {
    id: "earth",
    hz: 7.83,
    label: "7,83 Hz",
    pole: "Terre",
    hint: "Pulse Schumann symbolique · ancrage au sol du Verse.",
    pulse: true,
  },
  verse: {
    id: "verse",
    hz: 396,
    label: "396 Hz",
    pole: "accueil",
    hint: "Seuil du voyage · dérive contemplative entre les anneaux.",
  },
};

const SLUG_PROFILE_RULES = [
  { test: (s) => s.startsWith("myth-"), profile: "myth" },
  { test: (s) => s.startsWith("well-"), profile: "sens" },
  { test: (s) => s.startsWith("div-"), profile: "heart" },
  { test: (s) => ["accueil", "feed", "market", "genome", "pricing"].includes(s), profile: "matter" },
  { test: (s) => ["atlas", "bible", "pantheon", "cosmic", "numerology", "esoteric", "magic"].includes(s), profile: "myth" },
];

/** Associe un realm 3D à un profil symbolique. */
export function getRealmFrequencyProfile(realm) {
  if (!realm?.slug) return "earth";
  const slug = realm.slug;
  for (const { test, profile } of SLUG_PROFILE_RULES) {
    if (test(slug)) return profile;
  }
  return "verse";
}

export function getFrequencyProfile(id) {
  return FREQUENCY_PROFILES[id] ?? FREQUENCY_PROFILES.verse;
}

export function isVerseAudioEnabled() {
  try {
    return localStorage.getItem(VERSE_AUDIO_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function setVerseAudioEnabled(on) {
  try {
    localStorage.setItem(VERSE_AUDIO_STORAGE_KEY, on ? "1" : "0");
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent("egor69-verse-audio-change", { detail: { enabled: !!on } }));
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

class VerseAudioEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.profileGain = null;
    this.earthGain = null;
    this.nodes = [];
    this.earthNodes = [];
    this.currentProfile = "earth";
    this.started = false;
    this.reduced = false;
  }

  ensureContext() {
    if (this.ctx) return this.ctx;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = prefersReducedMotion() ? 0.045 : 0.07;
    this.profileGain = this.ctx.createGain();
    this.profileGain.gain.value = 0;
    this.earthGain = this.ctx.createGain();
    this.earthGain.gain.value = 0;
    this.profileGain.connect(this.master);
    this.earthGain.connect(this.master);
    this.master.connect(this.ctx.destination);
    this.reduced = prefersReducedMotion();
    return this.ctx;
  }

  async resume() {
    const ctx = this.ensureContext();
    if (!ctx) return false;
    if (ctx.state === "suspended") await ctx.resume();
    return true;
  }

  _clearNodes(target) {
    for (const n of target) {
      try {
        n.stop?.();
        n.disconnect?.();
      } catch {
        /* ignore */
      }
    }
    target.length = 0;
  }

  _buildPad(profileId) {
    const ctx = this.ctx;
    const profile = getFrequencyProfile(profileId);
    const hz = profile.hz;
    const playHz = hz > 600 ? hz / 2 : hz;
    const count = this.reduced ? 1 : 2;

    for (let i = 0; i < count; i++) {
      const osc = ctx.createOscillator();
      osc.type = this.reduced ? "sine" : "triangle";
      osc.frequency.value = playHz * (i === 0 ? 1 : 1.002);
      const g = ctx.createGain();
      g.gain.value = this.reduced ? 0.35 : 0.22;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = Math.min(2200, playHz * 2.8);
      filter.Q.value = 0.4;
      osc.connect(filter);
      filter.connect(g);
      g.connect(this.profileGain);
      osc.start();
      this.nodes.push(osc, g, filter);

      if (!this.reduced && profile.pulse !== true) {
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.06 + i * 0.02;
        const lfoG = ctx.createGain();
        lfoG.gain.value = g.gain.value * 0.35;
        lfo.connect(lfoG);
        lfoG.connect(g.gain);
        lfo.start();
        this.nodes.push(lfo, lfoG);
      }
    }
  }

  _buildEarthPulse() {
    const ctx = this.ctx;
    const sub = ctx.createOscillator();
    sub.type = "sine";
    sub.frequency.value = 58;
    const subG = ctx.createGain();
    subG.gain.value = this.reduced ? 0.12 : 0.18;

    if (!this.reduced) {
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 7.83;
      const lfoDepth = ctx.createGain();
      lfoDepth.gain.value = 0.14;
      lfo.connect(lfoDepth);
      lfoDepth.connect(subG.gain);
      lfo.start();
      this.earthNodes.push(lfo, lfoDepth);
    }

    sub.connect(subG);
    subG.connect(this.earthGain);
    sub.start();
    this.earthNodes.push(sub, subG);
  }

  async start(profileId = "earth") {
    if (!(await this.resume())) return;
    if (this.started) {
      await this.crossfadeTo(profileId);
      return;
    }
    this.started = true;
    this.reduced = prefersReducedMotion();
    this._buildEarthPulse();
    this._buildPad(profileId);
    this.currentProfile = profileId;
    const now = this.ctx.currentTime;
    this.earthGain.gain.cancelScheduledValues(now);
    this.earthGain.gain.setValueAtTime(0, now);
    this.earthGain.gain.linearRampToValueAtTime(1, now + 2.8);
    this.profileGain.gain.cancelScheduledValues(now);
    this.profileGain.gain.setValueAtTime(0, now);
    this.profileGain.gain.linearRampToValueAtTime(1, now + 3.2);
  }

  async crossfadeTo(profileId) {
    if (!this.ctx || !this.started) {
      await this.start(profileId);
      return;
    }
    if (profileId === this.currentProfile) return;
    const now = this.ctx.currentTime;
    this.profileGain.gain.cancelScheduledValues(now);
    this.profileGain.gain.setValueAtTime(this.profileGain.gain.value, now);
    this.profileGain.gain.linearRampToValueAtTime(0, now + 0.9);

    window.setTimeout(() => {
      if (!this.ctx) return;
      this._clearNodes(this.nodes);
      this._buildPad(profileId);
      this.currentProfile = profileId;
      const t = this.ctx.currentTime;
      this.profileGain.gain.cancelScheduledValues(t);
      this.profileGain.gain.setValueAtTime(0, t);
      this.profileGain.gain.linearRampToValueAtTime(1, t + 1.4);
    }, 950);
  }

  async playPortalChime() {
    if (!(await this.resume())) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const partials = [523.25, 659.25, 783.99];
    for (let i = 0; i < partials.length; i++) {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = partials[i];
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(this.reduced ? 0.04 : 0.07, now + 0.02 + i * 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.55 + i * 0.05);
      osc.connect(g);
      g.connect(this.master);
      osc.start(now);
      osc.stop(now + 0.7);
    }
  }

  stop() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this.profileGain?.gain.cancelScheduledValues(now);
    this.earthGain?.gain.cancelScheduledValues(now);
    this.profileGain?.gain.linearRampToValueAtTime(0, now + 0.6);
    this.earthGain?.gain.linearRampToValueAtTime(0, now + 0.6);
    window.setTimeout(() => {
      this._clearNodes(this.nodes);
      this._clearNodes(this.earthNodes);
      this.started = false;
    }, 700);
  }

  dispose() {
    this.stop();
    try {
      this.ctx?.close();
    } catch {
      /* ignore */
    }
    this.ctx = null;
  }
}

let singleton = null;

export function getVerseAudioEngine() {
  if (!singleton) singleton = new VerseAudioEngine();
  return singleton;
}
