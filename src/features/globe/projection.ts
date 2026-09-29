/**
 * Mirrors cobe's internal projection so HTML markers line up with the WebGL globe.
 * Returns x/y as fractions of the canvas and whether the point faces the viewer.
 */
export function project(lat: number, lon: number, phi: number, theta: number, radius = 0.81, scale = 1) {
  const la = (lat * Math.PI) / 180
  const lo = (lon * Math.PI) / 180 - Math.PI
  const p = [-Math.cos(la) * Math.cos(lo) * radius, Math.sin(la) * radius, Math.cos(la) * Math.sin(lo) * radius]
  const cT = Math.cos(theta)
  const cP = Math.cos(phi)
  const sT = Math.sin(theta)
  const sP = Math.sin(phi)
  const c = cP * p[0] + sP * p[2]
  const s = sP * sT * p[0] + cT * p[1] - cP * sT * p[2]
  const depth = -sP * cT * p[0] + sT * p[1] + cP * cT * p[2]
  return { x: (c * scale + 1) / 2, y: (-s * scale + 1) / 2, visible: depth >= 0 || c * c + s * s >= 0.64 }
}

/** The phi that rotates a longitude to face the viewer. */
export const phiFor = (lon: number) => (3 * Math.PI) / 2 - (lon * Math.PI) / 180

/** Shortest rotation from `from` to `to` (radians). */
export const shortest = (from: number, to: number) => {
  const d = (((to - from) % (2 * Math.PI)) + 3 * Math.PI) % (2 * Math.PI) - Math.PI
  return from + d
}
