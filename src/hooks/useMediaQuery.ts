import { useCallback, useSyncExternalStore } from 'react'

function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (cb: () => void) => {
      const mq = matchMedia(query)
      mq.addEventListener('change', cb)
      return () => mq.removeEventListener('change', cb)
    },
    [query],
  )
  return useSyncExternalStore(subscribe, () => matchMedia(query).matches, () => false)
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')
/** True on phones/tablets: no hover, coarse pointer. Cursor + tilt effects are off here. */
export const useIsTouch = () => useMediaQuery('(hover: none), (pointer: coarse)')
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)')
