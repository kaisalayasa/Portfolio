import { useEffect, useState } from 'react'

/** Re-renders every `ms` (default 1s). Pauses while the tab is hidden. */
export function useNow(ms = 1000) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    let id: ReturnType<typeof setInterval> | undefined
    const start = () => {
      setNow(new Date())
      id = setInterval(() => setNow(new Date()), ms)
    }
    const onVis = () => (document.hidden ? clearInterval(id) : start())
    start()
    document.addEventListener('visibilitychange', onVis)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [ms])
  return now
}
