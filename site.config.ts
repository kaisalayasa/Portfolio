// Where the site is deployed. Read by vite.config.ts (base), the router, and /scripts.
const GITHUB_USER = 'kaisalayasa'
const REPO_NAME = 'Portfolio'
export const CUSTOM_DOMAIN = ''
/** GoatCounter site code ('qais' → qais.goatcounter.com). Empty = analytics off. */
export const GOATCOUNTER = 'qaisalayasa'

const isUserSite = REPO_NAME.toLowerCase() === `${GITHUB_USER.toLowerCase()}.github.io`

export const BASE = CUSTOM_DOMAIN || isUserSite ? '/' : `/${REPO_NAME}/`

export const SITE_URL = CUSTOM_DOMAIN
  ? `https://${CUSTOM_DOMAIN}`
  : `https://${GITHUB_USER}.github.io${BASE === '/' ? '' : BASE.replace(/\/$/, '')}`

export const REPO_URL = `https://github.com/${GITHUB_USER}/${REPO_NAME}`
