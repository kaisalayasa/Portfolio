import { useSyncExternalStore } from 'react'

/** Minimal global store for UI state shared by distant components. `serverState` is what the prerendered HTML showed. */
export function createStore<T>(initial: T, serverState: T = initial) {
  let state = initial
  const listeners = new Set<() => void>()
  const get = () => state
  const set = (next: T | ((prev: T) => T)) => {
    state = typeof next === 'function' ? (next as (p: T) => T)(state) : next
    listeners.forEach((l) => l())
  }
  const subscribe = (l: () => void) => {
    listeners.add(l)
    return () => listeners.delete(l)
  }
  const use = () => useSyncExternalStore(subscribe, get, () => serverState)
  return { get, set, subscribe, use }
}

export const ui = createStore({
  palette: false,
  shiritori: false,
  menu: false,
})

export const toasts = createStore<{ id: number; text: string }[]>([])
let toastId = 0
export function toast(text: string) {
  const id = ++toastId
  toasts.set((t) => [...t, { id, text }])
  setTimeout(() => toasts.set((t) => t.filter((x) => x.id !== id)), 2200)
}
