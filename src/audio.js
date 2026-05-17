// =====================================================================
//  Generativer Ambient + Sound-Effekte (Tone.js)
//  Kein MP3, keine externen Dateien – Web Audio direkt im Browser.
//  Pro Mood: Akkord, Drone, Filter-Cutoff. Wechsel per setMood().
// =====================================================================

import * as Tone from 'tone'

const MOODS = {
  start:  { chord: ['C3', 'E3', 'G3', 'B3'], drone: 'C2',  cutoff: 800,  detune: 0 },
  main:   { chord: ['C3', 'E3', 'G3', 'A3'], drone: 'C2',  cutoff: 1400, detune: 0 },
  false:  { chord: ['C3', 'Eb3', 'G3', 'Bb3'], drone: 'Bb1', cutoff: 600, detune: -8 },
  trap:   { chord: ['C2', 'Db3', 'F#3', 'A3'], drone: 'C1',  cutoff: 350, detune: -22 },
  final:  { chord: ['C3', 'E3', 'G3', 'C4'], drone: 'C2',  cutoff: 2200, detune: 4 }
}

class AmbientEngine {
  constructor() {
    this.started = false
    this.muted = true
    this.currentMood = 'start'
    this.lastTrap = 0
    this.padLoop = null
    this.droneLoop = null
  }

  _build() {
    // Master chain: pad/drone → filter → master volume.
    // Tone v15 Reverb braucht await ready, sonst bleibt der gesamte Bus
    // stumm. Reverb komplett raus — Atmosphaere kommt durch Filter-Sweep
    // und langsame Hüllkurven.
    this.master = new Tone.Volume(-10).toDestination()
    this.filter = new Tone.Filter({ frequency: 800, type: 'lowpass', Q: 0.7 })
      .connect(this.master)

    // Soft AM pad — slow attack/release, mehrstimmig
    this.pad = new Tone.PolySynth(Tone.AMSynth, {
      harmonicity: 1.5,
      envelope: { attack: 5, decay: 2, sustain: 0.7, release: 8 },
      modulation: { type: 'sine' },
      modulationEnvelope: { attack: 3, decay: 0, sustain: 1, release: 6 }
    })
    this.pad.volume.value = -18
    this.pad.connect(this.filter)

    // Low drone
    this.bass = new Tone.MonoSynth({
      oscillator: { type: 'sine' },
      envelope: { attack: 6, decay: 0.5, sustain: 1, release: 8 },
      filter: { Q: 1, type: 'lowpass' },
      filterEnvelope: {
        attack: 4, decay: 0, sustain: 1, release: 4,
        baseFrequency: 90, octaves: 2
      }
    })
    this.bass.volume.value = -24
    this.bass.connect(this.filter)

    // Subtle stereo shimmer
    this.shimmerNoise = new Tone.Noise('pink')
    this.shimmerFilter = new Tone.Filter({ frequency: 3000, type: 'bandpass', Q: 6 })
    this.shimmerGain = new Tone.Gain(0.02)
    this.shimmerNoise.connect(this.shimmerFilter)
    this.shimmerFilter.connect(this.shimmerGain)
    this.shimmerGain.connect(this.filter)

    // SFX channel
    this.sfx = new Tone.Volume(-6).connect(this.master)
    this.step = new Tone.MembraneSynth({
      pitchDecay: 0.06, octaves: 4,
      envelope: { attack: 0.001, decay: 0.25, sustain: 0, release: 0.1 }
    })
    this.step.volume.value = -16
    this.step.connect(this.sfx)

    this.whoosh = new Tone.NoiseSynth({
      noise: { type: 'white' },
      envelope: { attack: 0.02, decay: 0.5, sustain: 0 }
    })
    this.whooshFilter = new Tone.Filter({ frequency: 1500, type: 'bandpass', Q: 1 })
    this.whoosh.volume.value = -22
    this.whoosh.connect(this.whooshFilter)
    this.whooshFilter.connect(this.sfx)

    this.trapSting = new Tone.PolySynth(Tone.FMSynth, {
      harmonicity: 0.5,
      modulationIndex: 12,
      envelope: { attack: 0.05, decay: 1.2, sustain: 0.5, release: 3 },
      modulationEnvelope: { attack: 0.1, decay: 0.6, sustain: 0.3, release: 2 }
    })
    this.trapSting.volume.value = -6
    this.trapSting.connect(this.filter)

    this.rumble = new Tone.NoiseSynth({
      noise: { type: 'brown' },
      envelope: { attack: 0.4, decay: 3, sustain: 0 }
    })
    this.rumble.volume.value = -14
    this.rumble.connect(this.filter)
  }

  async start() {
    if (this.started) return
    // iOS Safari schliesst den AudioContext, wenn Tone.start() nicht
    // SOFORT im User-Gesture aufgerufen wird. Deshalb zuerst entsperren,
    // dann erst die schweren Synth-Graphen bauen.
    try {
      await Tone.start()
    } catch (err) {
      console.warn('[audio] Tone.start() schlug fehl:', err)
      return
    }
    if (!this.master) this._build()
    this.shimmerNoise.start()
    this._startLoops()
    this.started = true
    console.log('[audio] gestartet, ctx =', Tone.getContext().state)
  }

  _startLoops() {
    const padPlay = (time) => {
      if (this.muted) return
      const mood = MOODS[this.currentMood] || MOODS.main
      const note = mood.chord[Math.floor(Math.random() * mood.chord.length)]
      this.pad.detune.value = mood.detune
      this.pad.triggerAttackRelease(note, '2n', time, 0.55)
    }
    this.padLoop = new Tone.Loop(padPlay, '4n').start(0)
    this.padLoop.interval = '0:2'

    const dronePlay = (time) => {
      if (this.muted) return
      const mood = MOODS[this.currentMood] || MOODS.main
      this.bass.triggerAttackRelease(mood.drone, '2m', time, 0.5)
    }
    this.droneLoop = new Tone.Loop(dronePlay, '2m').start(0)

    Tone.Transport.bpm.value = 50
    Tone.Transport.start()
  }

  setMood(mood) {
    if (!MOODS[mood] || mood === this.currentMood) return
    this.currentMood = mood
    if (!this.filter) return
    this.filter.frequency.cancelScheduledValues(Tone.now())
    this.filter.frequency.linearRampTo(MOODS[mood].cutoff, 2.5)
  }

  setMuted(muted) {
    this.muted = muted
    if (this.master) this.master.mute = muted
  }

  isMuted() { return this.muted }

  // -- SFX ---------------------------------------------------------

  playStep() {
    if (this.muted || !this.step) return
    this.step.triggerAttackRelease('C1', '16n', undefined, 0.25)
  }

  playWhoosh() {
    if (this.muted || !this.whoosh) return
    this.whooshFilter.frequency.cancelScheduledValues(Tone.now())
    this.whooshFilter.frequency.setValueAtTime(800, Tone.now())
    this.whooshFilter.frequency.linearRampToValueAtTime(2400, Tone.now() + 0.35)
    this.whoosh.triggerAttackRelease('4n')
  }

  playDoor() {
    if (this.muted || !this.whoosh) return
    this.whooshFilter.frequency.cancelScheduledValues(Tone.now())
    this.whooshFilter.frequency.setValueAtTime(400, Tone.now())
    this.whooshFilter.frequency.linearRampToValueAtTime(120, Tone.now() + 0.5)
    this.whoosh.triggerAttackRelease('2n')
  }

  playTrap() {
    if (this.muted || !this.trapSting) return
    const now = Tone.now()
    if (now - this.lastTrap < 0.5) return
    this.lastTrap = now
    this.trapSting.triggerAttackRelease(['C2', 'Db3', 'F#3', 'A3'], '2n', now, 0.6)
    this.rumble.triggerAttackRelease('1m', now)
  }

  playSuccess() {
    if (this.muted || !this.pad) return
    const now = Tone.now()
    this.pad.triggerAttackRelease('C4', '8n', now, 0.4)
    this.pad.triggerAttackRelease('E4', '8n', now + 0.12, 0.4)
    this.pad.triggerAttackRelease('G4', '8n', now + 0.24, 0.4)
    this.pad.triggerAttackRelease('C5', '4n', now + 0.36, 0.5)
  }
}

export const audio = new AmbientEngine()

// Mood-Helper: ein Raum → eine passende Stimmung
export function moodForRoom(room, branch) {
  if (!room) return 'main'
  if (room.type === 'start') return 'start'
  if (room.type === 'trap') return 'trap'
  if (room.type === 'final') return 'final'
  if (branch === 'false' || room.type === 'falseCorridor' || room.branch === 'false') return 'false'
  return 'main'
}
