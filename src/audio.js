// =====================================================================
//  Audio-Engine
//  Atmosphäre: gestreamte MP3-Loops (Kevin MacLeod, CC0 / public domain
//  via incompetech.com). SFX (step/whoosh/door/success): kurz, generativ
//  über Web Audio API — keine Latenz, kein Download.
// =====================================================================

const AMBIENT_URL = 'audio/ambient.mp3'  // Long Note Four — Kevin MacLeod
const TRAP_URL    = 'audio/trap.mp3'     // Hidden Past   — Kevin MacLeod

// Lautstärken pro Mood. Spielen lassen wir IMMER den gleichen Loop —
// nur die Lautstärke verändert sich, was den Wechsel der Stimmung
// dezent unterstützt, ohne harten Track-Wechsel.
const MOOD_VOL = {
  start: 0.45,
  main:  0.55,
  false: 0.40,
  trap:  0.30,
  final: 0.55
}

class AudioEngine {
  constructor() {
    this.started = false
    this.muted = true
    this.currentMood = 'start'
    this.ambient = null
    this.trapSting = null
    this.ctx = null       // für SFX
    this.master = null
    this.lastTrap = 0
  }

  async start() {
    if (this.started) return
    try {
      // 1) Ambient-Loop
      this.ambient = new Audio(AMBIENT_URL)
      this.ambient.loop = true
      this.ambient.volume = this.muted ? 0 : MOOD_VOL[this.currentMood]
      this.ambient.preload = 'auto'
      // play() braucht User-Gesture — wird vom Klick auf "Hineingehen" ausgelöst
      await this.ambient.play().catch(err => {
        console.warn('[audio] Ambient-Play geblockt:', err)
      })

      // 2) Trap-Sting (vorgeladen, gespielt nur on demand)
      this.trapSting = new Audio(TRAP_URL)
      this.trapSting.volume = 0
      this.trapSting.preload = 'auto'

      // 3) Web Audio Context für SFX (kurze Beeps + Noise-Sweeps)
      const Ctx = window.AudioContext || window.webkitAudioContext
      if (Ctx) {
        this.ctx = new Ctx()
        if (this.ctx.state === 'suspended') await this.ctx.resume()
        this.master = this.ctx.createGain()
        this.master.gain.value = this.muted ? 0 : 0.7
        this.master.connect(this.ctx.destination)
      }
    } catch (err) {
      console.warn('[audio] start() Fehler:', err)
      return
    }
    this.started = true
    console.log('[audio] gestartet, muted =', this.muted)
  }

  setMuted(muted) {
    this.muted = muted
    if (this.ambient) {
      this.ambient.volume = muted ? 0 : MOOD_VOL[this.currentMood]
      if (!muted && this.ambient.paused) this.ambient.play().catch(()=>{})
    }
    if (this.master) this.master.gain.value = muted ? 0 : 0.7
  }

  isMuted() { return this.muted }

  setMood(mood) {
    if (!MOOD_VOL[mood] || mood === this.currentMood) return
    this.currentMood = mood
    if (this.ambient && !this.muted) {
      // smooth volume crossfade
      const target = MOOD_VOL[mood]
      const start = this.ambient.volume
      const steps = 20, dur = 1500
      let i = 0
      const iv = setInterval(() => {
        i++
        const t = i / steps
        this.ambient.volume = start + (target - start) * t
        if (i >= steps) clearInterval(iv)
      }, dur / steps)
    }
  }

  // -- SFX (Web Audio, generativ) ----------------------------------

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

  playStep()   { this._beep(80, 0.12, 'sine', 0.18) }
  playWhoosh() { this._noiseSweep(800, 2400, 0.35, 0.12) }
  playDoor()   { this._noiseSweep(400, 120, 0.5, 0.18) }

  playSuccess() {
    if (this.muted || !this.ctx) return
    ;[261.63, 329.63, 392.00, 523.25].forEach((f, i) => {
      setTimeout(() => this._beep(f, 0.35, 'triangle', 0.22), i * 110)
    })
  }

  playTrap() {
    if (this.muted) return
    const now = performance.now() / 1000
    if (now - this.lastTrap < 1) return
    this.lastTrap = now
    if (this.trapSting) {
      this.trapSting.currentTime = 0
      this.trapSting.volume = 0.7
      this.trapSting.play().catch(()=>{})
    }
  }
}

export const audio = new AudioEngine()

export function moodForRoom(room, branch) {
  if (!room) return 'main'
  if (room.type === 'start') return 'start'
  if (room.type === 'trap') return 'trap'
  if (room.type === 'final') return 'final'
  if (branch === 'false' || room.type === 'falseCorridor' || room.branch === 'false') return 'false'
  return 'main'
}
