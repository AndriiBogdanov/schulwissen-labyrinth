// =====================================================================
//  Audio-Engine — nur kurze Sound-Effekte, KEINE Hintergrundmusik.
//  Alles generativ via Web Audio API, keine MP3-Downloads.
// =====================================================================

class AudioEngine {
  constructor() {
    this.started = false
    this.muted = true
    this.currentMood = 'main'
    this.ctx = null
    this.master = null
    this.lastTrap = 0
  }

  async start() {
    if (this.started) return
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext
      if (!Ctx) return
      this.ctx = new Ctx()
      if (this.ctx.state === 'suspended') await this.ctx.resume()
      this.master = this.ctx.createGain()
      this.master.gain.value = this.muted ? 0 : 0.7
      this.master.connect(this.ctx.destination)
    } catch (err) {
      console.warn('[audio] start() Fehler:', err)
      return
    }
    this.started = true
  }

  setMuted(muted) {
    this.muted = muted
    if (this.master) this.master.gain.value = muted ? 0 : 0.7
  }

  isMuted() { return this.muted }

  // Mood-Wechsel beeinflusst nichts mehr — keine Hintergrundmusik.
  // Methode bleibt, damit App.jsx nichts anpassen muss.
  setMood(mood) { this.currentMood = mood }

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
    if (this.muted || !this.ctx) return
    const now = this.ctx.currentTime
    if (now - this.lastTrap < 0.5) return
    this.lastTrap = now
    ;[65.41, 138.59, 185.00, 220.00].forEach((f) => {
      const osc = this.ctx.createOscillator()
      osc.type = 'sawtooth'
      osc.frequency.value = f
      const g = this.ctx.createGain()
      g.gain.setValueAtTime(0, now)
      g.gain.linearRampToValueAtTime(0.08, now + 0.05)
      g.gain.exponentialRampToValueAtTime(0.0001, now + 1.5)
      osc.connect(g).connect(this.master)
      osc.start(now)
      osc.stop(now + 1.6)
    })
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
