// =====================================================================
//  Ambient + Sound-Effekte — pure Web Audio API, keine Bibliothek.
//  Tone.js v15 hatte breaking changes (Reverb-ready async etc.), die
//  zu Totalstille fuehrten. Hier 100% nativ, kein Bundle-Overhead.
// =====================================================================

const MOODS = {
  start: { freqs: [130.81, 164.81, 196.00, 246.94], cutoff:  800 }, // C3 E3 G3 B3
  main:  { freqs: [130.81, 164.81, 196.00, 220.00], cutoff: 1400 }, // C3 E3 G3 A3
  false: { freqs: [130.81, 155.56, 196.00, 233.08], cutoff:  600 }, // C3 Eb3 G3 Bb3
  trap:  { freqs: [ 65.41, 138.59, 185.00, 220.00], cutoff:  350 }, // C2 Db3 F#3 A3
  final: { freqs: [130.81, 164.81, 196.00, 261.63], cutoff: 2200 }  // C3 E3 G3 C4
}

class AmbientEngine {
  constructor() {
    this.ctx = null
    this.master = null
    this.padFilter = null
    this.padGain = null
    this.padOscs = []
    this.started = false
    this.muted = true
    this.currentMood = 'start'
    this.lastTrap = 0
  }

  async start() {
    if (this.started) return
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext
      if (!Ctx) throw new Error('Web Audio API nicht verfuegbar')
      this.ctx = new Ctx()
      if (this.ctx.state === 'suspended') await this.ctx.resume()
    } catch (err) {
      console.warn('[audio] AudioContext fehlgeschlagen:', err)
      return
    }
    this._build()
    this.started = true
    this._applyMood(this.currentMood, true)
    console.log('[audio] gestartet, ctx =', this.ctx.state, 'muted =', this.muted)
  }

  _build() {
    const ctx = this.ctx
    this.master = ctx.createGain()
    this.master.gain.value = this.muted ? 0 : 0.8
    this.master.connect(ctx.destination)

    this.padFilter = ctx.createBiquadFilter()
    this.padFilter.type = 'lowpass'
    this.padFilter.frequency.value = MOODS[this.currentMood].cutoff
    this.padFilter.Q.value = 0.7
    this.padFilter.connect(this.master)

    this.padGain = ctx.createGain()
    this.padGain.gain.value = 0.18
    this.padGain.connect(this.padFilter)

    // Vier kontinuierliche Sinus/Dreieck-Oszillatoren als Akkord-Pad
    const { freqs } = MOODS[this.currentMood]
    this.padOscs = freqs.map((freq, i) => {
      const osc = ctx.createOscillator()
      osc.type = i === 0 ? 'sine' : 'triangle'
      osc.frequency.value = freq
      const g = ctx.createGain()
      g.gain.value = i === 0 ? 0.55 : 0.28
      osc.connect(g).connect(this.padGain)
      osc.start()
      return { osc, gain: g }
    })
  }

  setMuted(muted) {
    this.muted = muted
    if (!this.master || !this.ctx) return
    const now = this.ctx.currentTime
    const target = muted ? 0 : 0.8
    this.master.gain.cancelScheduledValues(now)
    this.master.gain.setValueAtTime(this.master.gain.value, now)
    this.master.gain.linearRampToValueAtTime(target, now + 0.4)
  }

  isMuted() { return this.muted }

  setMood(mood) {
    if (!MOODS[mood] || mood === this.currentMood) return
    this.currentMood = mood
    if (!this.ctx) return
    this._applyMood(mood, false)
  }

  _applyMood(mood, immediate) {
    const m = MOODS[mood]
    if (!this.padFilter) return
    const now = this.ctx.currentTime
    const dur = immediate ? 0.05 : 2.5
    this.padFilter.frequency.cancelScheduledValues(now)
    this.padFilter.frequency.setValueAtTime(this.padFilter.frequency.value, now)
    this.padFilter.frequency.linearRampToValueAtTime(m.cutoff, now + dur)
    this.padOscs.forEach(({ osc }, i) => {
      const target = m.freqs[i] ?? m.freqs[0]
      osc.frequency.cancelScheduledValues(now)
      osc.frequency.setValueAtTime(osc.frequency.value, now)
      osc.frequency.linearRampToValueAtTime(target, now + dur)
    })
  }

  // -- SFX ---------------------------------------------------------

  _beep(freq, duration, type, volume) {
    if (this.muted || !this.ctx) return
    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    osc.type = type
    osc.frequency.value = freq
    const g = this.ctx.createGain()
    g.gain.setValueAtTime(0, now)
    g.gain.linearRampToValueAtTime(volume, now + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration)
    osc.connect(g).connect(this.master)
    osc.start(now)
    osc.stop(now + duration + 0.05)
  }

  _noiseSweep(startFreq, endFreq, duration, volume) {
    if (this.muted || !this.ctx) return
    const ctx = this.ctx
    const now = ctx.currentTime
    const bufferSize = Math.floor(ctx.sampleRate * duration)
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1
    const src = ctx.createBufferSource()
    src.buffer = buffer

    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.Q.value = 1.5
    filter.frequency.setValueAtTime(startFreq, now)
    filter.frequency.linearRampToValueAtTime(endFreq, now + duration)

    const g = ctx.createGain()
    g.gain.setValueAtTime(0, now)
    g.gain.linearRampToValueAtTime(volume, now + 0.02)
    g.gain.linearRampToValueAtTime(0, now + duration)

    src.connect(filter).connect(g).connect(this.master)
    src.start(now)
    src.stop(now + duration + 0.05)
  }

  playStep()    { this._beep(80, 0.12, 'sine', 0.2) }
  playWhoosh()  { this._noiseSweep(800, 2400, 0.35, 0.12) }
  playDoor()    { this._noiseSweep(400, 120, 0.5, 0.18) }

  playSuccess() {
    if (this.muted || !this.ctx) return
    const notes = [261.63, 329.63, 392.00, 523.25] // C E G C
    notes.forEach((f, i) => setTimeout(() => this._beep(f, 0.35, 'triangle', 0.22), i * 110))
  }

  playTrap() {
    if (this.muted || !this.ctx) return
    const now = this.ctx.currentTime
    if (now - this.lastTrap < 0.5) return
    this.lastTrap = now
    const chord = [65.41, 138.59, 185.00, 220.00]
    chord.forEach((f) => {
      const osc = this.ctx.createOscillator()
      osc.type = 'sawtooth'
      osc.frequency.value = f
      const g = this.ctx.createGain()
      g.gain.setValueAtTime(0, now)
      g.gain.linearRampToValueAtTime(0.09, now + 0.05)
      g.gain.exponentialRampToValueAtTime(0.0001, now + 1.5)
      osc.connect(g).connect(this.master)
      osc.start(now)
      osc.stop(now + 1.6)
    })
  }
}

export const audio = new AmbientEngine()

export function moodForRoom(room, branch) {
  if (!room) return 'main'
  if (room.type === 'start') return 'start'
  if (room.type === 'trap') return 'trap'
  if (room.type === 'final') return 'final'
  if (branch === 'false' || room.type === 'falseCorridor' || room.branch === 'false') return 'false'
  return 'main'
}
