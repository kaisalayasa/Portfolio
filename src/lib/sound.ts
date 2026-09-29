import { createStore } from './store'

/** Tiny synthesized UI sounds (no audio files). Off by default; the choice persists. */
const KEY = 'qa-sound'
const initial = (() => {
  try {
    return localStorage.getItem(KEY) === 'on'
  } catch {
    return false
  }
})()

const soundStore = createStore(initial, false)
export const useSoundEnabled = soundStore.use

export function toggleSound() {
  const next = !soundStore.get()
  soundStore.set(next)
  try {
    localStorage.setItem(KEY, next ? 'on' : 'off')
  } catch {
    /* ignore */
  }
  if (next) play('click')
}

let ctx: AudioContext | null = null
const audio = () => (ctx ??= new AudioContext())

export function play(kind: 'click' | 'stamp' | 'pop') {
  if (!soundStore.get()) return
  try {
    const ac = audio()
    const t = ac.currentTime
    const gain = ac.createGain()
    gain.connect(ac.destination)

    if (kind === 'stamp') {
      // A soft, low "thock": filtered noise burst + a sine body.
      const buf = ac.createBuffer(1, ac.sampleRate * 0.12, ac.sampleRate)
      const data = buf.getChannelData(0)
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length) ** 3
      const noise = ac.createBufferSource()
      noise.buffer = buf
      const lp = ac.createBiquadFilter()
      lp.type = 'lowpass'
      lp.frequency.value = 900
      noise.connect(lp).connect(gain)
      const osc = ac.createOscillator()
      osc.frequency.setValueAtTime(140, t)
      osc.frequency.exponentialRampToValueAtTime(60, t + 0.12)
      osc.connect(gain)
      gain.gain.setValueAtTime(0.18, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18)
      noise.start(t)
      osc.start(t)
      osc.stop(t + 0.2)
      return
    }

    const osc = ac.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(kind === 'pop' ? 660 : 1800, t)
    osc.frequency.exponentialRampToValueAtTime(kind === 'pop' ? 990 : 1200, t + 0.04)
    osc.connect(gain)
    gain.gain.setValueAtTime(kind === 'pop' ? 0.06 : 0.035, t)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.06)
    osc.start(t)
    osc.stop(t + 0.07)
  } catch {
    /* audio unsupported */
  }
}
