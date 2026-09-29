import { useCallback } from 'react'
import { toast } from '@/lib/store'

export function useCopy() {
  return useCallback(async (text: string, message: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = Object.assign(document.createElement('textarea'), { value: text })
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    toast(message)
  }, [])
}
