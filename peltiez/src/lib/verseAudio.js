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

/** Timbres distincts par profil (procédural, volume bas). */
const TIMBRE_BY_PROFILE = {
  matter: { types: ["triangle", "sine"], filter: "lowpass", filterMult: 2.6, q: 0.35, detune: 0, lfo: 0.05 },
  sens: { types: ["sine", "sine"], filter: "bandpass", filterMult: 3.2, q: 0.55, detune: 4, lfo: 0.09 },
  heart: { types: ["sine", "triangle"], filter: "lowpass", filterMult: 2.4, q: 0.5, detune: -3, lfo: 0.07 },
  myth: { types: ["sine", "sine"], filter: "highpass", filterMult: 1.8, q: 0.3, detune: 7, lfo: 0.04, playDiv: 2 },
  earth: { types: ["sine"], filter: "lowpass", filterMult: 1.2, q: 0.2, detune: 0, lfo: 0 },
  verse: { types: ["triangle", "triangle"], filter: "lowpass", filterMult: 3.5, q: 0.45, detune: 2, lfo: 0.08 },
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
  if (realm?.frequencyKey && FREQUENCY_PROFILES[realm.frequencyKey]) return realm.frequencyKey;
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

/** Partiels carillon symboliques dérivés d’une Hz (pas claim thérapeutique). */
export function symbolicChimePartials(hz) {
  if (!hz || hz < 0) return [392, 493.88, 587.33];
  if (hz < 20) {
    const base = 65.41 * 2;
    return [base, base * 1.2599, base * 1.4983];
  }
  let f0 = hz > 600 ? hz / 2 : hz;
  f0 = Math.min(784, Math.max(196, f0 * 0.92));
  return [f0, f0 * 1.2599, f0 * 1.4983];
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
    this._crossfadeToken = 0;
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

  _playHzForProfile(profileId, hz) {
    const timbre = TIMBRE_BY_PROFILE[profileId] ?? TIMBRE_BY_PROFILE.verse;
    const div = timbre.playDiv ?? 1;
    return hz > 600 ? hz / (2 * div) : hz / div;
  }

  _buildPad(profileId) {
    const ctx = this.ctx;
    const profile = getFrequencyProfile(profileId);
    const timbre = TIMBRE_BY_PROFILE[profileId] ?? TIMBRE_BY_PROFILE.verse;
    const playHz = this._playHzForProfile(profileId, profile.hz);
    const count = this.reduced ? 1 : 2;

    for (let i = 0; i < count; i++) {
      const osc = ctx.createOscillator();
      osc.type = this.reduced ? "sine" : timbre.types[i] ?? "sine";
      osc.frequency.value = playHz * (i === 0 ? 1 : 1.002);
      if (timbre.detune) osc.detune.value = timbre.detune * (i === 0 ? 1 : -0.5);

      const g = ctx.createGain();
      g.gain.value = this.reduced ? 0.32 : 0.2 + i * 0.02;

      const filter = ctx.createBiquadFilter();
      filter.type = timbre.filter;
      filter.frequency.value = Math.min(2800, playHz * (timbre.filterMult ?? 2.8));
      filter.Q.value = timbre.q ?? 0.4;

      osc.connect(filter);
      filter.connect(g);
      g.connect(this.profileGain);
      osc.start();
      this.nodes.push(osc, g, filter);

      const lfoRate = timbre.lfo ?? 0;
      if (!this.reduced && lfoRate > 0 && profile.pulse !== true) {
        const lfo = ctx.createOscillator();
        lfo.frequency.value = lfoRate + i * 0.015;
        const lfoG = ctx.createGain();
        lfoG.gain.value = g.gain.value * 0.32;
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

    const token = ++this._crossfadeToken;
    const now = this.ctx.currentTime;
    const fadeOut = this.reduced ? 1.1 : 1.85;

    this.profileGain.gain.cancelScheduledValues(now);
    this.profileGain.gain.setValueAtTime(this.profileGain.gain.value, now);
    this.profileGain.gain.exponentialRampToValueAtTime(Math.max(0.0001, this.profileGain.gain.value * 0.15), now + fadeOut * 0.55);
    this.profileGain.gain.exponentialRampToValueAtTime(0.0001, now + fadeOut);

    const overlapMs = this.reduced ? 520 : 720;
    window.setTimeout(() => {
      if (!this.ctx || token !== this._crossfadeToken) return;
      this._clearNodes(this.nodes);
      this._buildPad(profileId);
      this.currentProfile = profileId;
      const t = this.ctx.currentTime;
      this.profileGain.gain.cancelScheduledValues(t);
      this.profileGain.gain.setValueAtTime(0.0001, t);
      const fadeIn = this.reduced ? 1.2 : 2.1;
      this.profileGain.gain.exponentialRampToValueAtTime(1, t + fadeIn);
    }, overlapMs);
  }

  async playPortalChime(profileId = null) {
    if (!(await this.resume())) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const profile = getFrequencyProfile(profileId ?? this.currentProfile);
    const partials = symbolicChimePartials(profile.hz);
    const peak = this.reduced ? 0.035 : 0.065;

    for (let i = 0; i < partials.length; i++) {
      const osc = ctx.createOscillator();
      osc.type = this.reduced ? "sine" : "triangle";
      osc.frequency.value = partials[i];
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(peak, now + 0.03 + i * 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.65 + i * 0.06);
      osc.connect(g);
      g.connect(this.master);
      osc.start(now);
      osc.stop(now + 0.85);
    }
  }

  stop() {
    if (!this.ctx) return;
    this._crossfadeToken++;
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
