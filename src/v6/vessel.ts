/** Glass built from the rings of the CC0 GLB meshes (see CREDITS.md). */
import * as THREE from 'three'
import { RY, lathe, radiusFn, rimArc, ringsOf, smoothCurve } from './profile'

export type Vessel = {
  /** closed wall profile (bottom centre → outer wall → lip → inner wall → floor centre) */
  wall: RY[]
  inner: RY[] // inner wall, bottom → top
  innerR: (y: number) => number
  floorY: number // inner floor at the centre
  innerBottomY: number // where the inner wall meets the floor
  rimY: number
  vol: (y: number) => number // interior volume below height y (upright)
  levelFor: (v: number) => number
  geometry: (segments?: number) => THREE.BufferGeometry
}

export function vesselFromRings(r: ReturnType<typeof ringsOf>, opts: { extraOuter?: RY[]; step?: number } = {}): Vessel {
  const outer = [...r.outer, ...(opts.extraOuter ?? [])].sort((a, b) => a[1] - b[1])
  const inner = r.inner
  const top = outer[outer.length - 1], itop = inner[inner.length - 1]
  const rimY = Math.max(top[1], itop[1])
  const oC = smoothCurve([[0, r.baseY], ...outer.slice(0, -1), [top[0], rimY]], 220, opts.step)
  const iC = smoothCurve(inner.map(([a, y]) => [a, Math.min(y, rimY)] as RY), 200, opts.step)
  const innerBottomY = inner[0][1]
  const floorY = Math.min(r.floorY, innerBottomY)
  const wall: RY[] = [
    ...oC,
    ...rimArc(top[0], itop[0], rimY).slice(1, -1),
    ...[...iC].reverse(),
    [inner[0][0] * 0.55, floorY + (innerBottomY - floorY) * 0.35],
    [0, floorY],
  ]
  const innerR = radiusFn(iC)
  // volume table
  const ys: number[] = [], vs: number[] = []
  const dy = 0.0002
  let v = Math.PI * innerR(innerBottomY) ** 2 * (innerBottomY - floorY) * 0.5
  for (let y = innerBottomY; y <= rimY + 1e-9; y += dy) { ys.push(y); vs.push(v); v += Math.PI * innerR(y + dy / 2) ** 2 * dy }
  const vol = (y: number) => {
    if (y <= ys[0]) return Math.max(0, vs[0] * (y - floorY) / (innerBottomY - floorY || 1))
    const i = (y - ys[0]) / dy, k = Math.floor(i)
    if (k >= ys.length - 1) return vs[vs.length - 1] + Math.PI * innerR(rimY) ** 2 * (y - ys[ys.length - 1])
    return vs[k] + (vs[k + 1] - vs[k]) * (i - k)
  }
  const levelFor = (target: number) => {
    let lo = floorY, hi = rimY + 0.1
    for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (vol(m) < target) lo = m; else hi = m }
    return (lo + hi) / 2
  }
  return {
    wall, inner: iC, innerR, floorY, innerBottomY, rimY, vol, levelFor,
    geometry: (segments = 180) => lathe(wall, segments),
  }
}
