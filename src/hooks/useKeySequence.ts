import { useEffect, useRef } from 'react'

const isTyping = (el: EventTarget | null) =>
  el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))

/**
 * Fires when the visitor types one of the sequences anywhere outside a form field.
 * Sequences are arrays of KeyboardEvent.key values (case-insensitive).
 */
export function useKeySequence(sequences: Record<string, string[]>, onMatch: (name: string) => void) {
  const buffer = useRef<string[]>([])
  const cb = useRef(onMatch)
  cb.current = onMatch
  useEffect(() => {
    const max = Math.max(...Object.values(sequences).map((s) => s.length))
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e.target) || e.metaKey || e.ctrlKey || e.altKey) return
      buffer.current = [...buffer.current, e.key.toLowerCase()].slice(-max)
      for (const [name, seq] of Object.entries(sequences)) {
        const tail = buffer.current.slice(-seq.length)
        if (tail.length === seq.length && tail.every((k, i) => k === seq[i].toLowerCase())) {
          buffer.current = []
          cb.current(name)
        }
      }
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [sequences])
}
