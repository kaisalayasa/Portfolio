// Minimal BrowserRouter: routes are / and /projects/:slug, plus the 404 page.
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from 'react'
import { flushSync } from 'react-dom'

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '') // '' or '/repo'

type Loc = { pathname: string; hash: string }
type NavOpts = { replace?: boolean; viewTransition?: boolean }

const parse = (pathname: string, hash = ''): Loc => {
  let p = pathname
  if (BASE && p.startsWith(BASE)) p = p.slice(BASE.length)
  if (p === '/index.html') p = '/'
  return { pathname: p.replace(/(.)\/$/, '$1') || '/', hash }
}

const read = (): Loc => parse(location.pathname, location.hash)

const Ctx = createContext<{ loc: Loc; navigate: (to: string, opts?: NavOpts) => void } | null>(null)

/** `initial` is the URL when prerendering at build time (there is no `location` in Node). */
export function Router({ children, initial }: { children: ReactNode; initial?: string }) {
  const [loc, setLoc] = useState(() => (initial != null ? parse(initial) : read()))

  useEffect(() => {
    const onPop = () => setLoc(read())
    addEventListener('popstate', onPop)
    return () => removeEventListener('popstate', onPop)
  }, [])

  const navigate = useCallback((to: string, opts: NavOpts = {}) => {
    const url = BASE + (to.startsWith('/') ? to : `/${to}`)
    const apply = () => {
      history[opts.replace ? 'replaceState' : 'pushState'](null, '', url)
      setLoc(read())
    }
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (opts.viewTransition && document.startViewTransition && !reduced) document.startViewTransition(() => flushSync(apply))
    else apply()
  }, [])

  const value = useMemo(() => ({ loc, navigate }), [loc, navigate])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

function useRouter() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('Router hooks must be used inside <Router>')
  return ctx
}

export const useLocation = () => useRouter().loc
export const useNavigate = () => useRouter().navigate

/** Matches '/projects/:slug' style patterns against the current path. */
export function matchPath(pattern: string, pathname: string): Record<string, string> | null {
  const keys: string[] = []
  const re = new RegExp(`^${pattern.replace(/:(\w+)/g, (_, k: string) => (keys.push(k), '([^/]+)'))}/?$`)
  const m = pathname.match(re)
  return m ? Object.fromEntries(keys.map((k, i) => [k, decodeURIComponent(m[i + 1])])) : null
}

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { to: string; viewTransition?: boolean; replace?: boolean }

/** In-app link: real href (works without JS, middle-click, copy link), client-side navigation on click. */
export function Link({ to, viewTransition, replace, onClick, target, ...rest }: LinkProps) {
  const { navigate } = useRouter()
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || (target && target !== '_self')) return
    e.preventDefault()
    navigate(to, { viewTransition, replace })
  }
  return <a href={BASE + to} onClick={handle} target={target} {...rest} />
}
