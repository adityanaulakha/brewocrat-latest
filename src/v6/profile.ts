/**
 * Turns the cross-section rings of a lathe-like GLB mesh (glass / bottle) into a smooth, dense
 * profile. The CC0 source models are modest-poly (56–130 radial segments, 5–10 height rings), which
 * shows as facets and kinks in an extreme close-up; we keep their exact dimensions but re-revolve
 * them at high resolution with a centripetal Catmull-Rom through the model's own ring points.
 * Units: metres (the models are authored at real-world scale).
 */
import * as THREE from 'three'

export type RY = [r: number, y: number]

/** Read outer / inner wall rings (r, y) from a mesh whose axis is vertical through x = cx, z = cz. */
export function ringsOf(geo: THREE.BufferGeometry, cx = 0, cz = 0) {
  const pos = geo.attributes.position, nor = geo.attributes.normal
  const outer = new Map<number, number>(), inner = new Map<number, number>()
  let floorY = Infinity, baseY = Infinity, topY = -Infinity
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i) - cx, y = pos.getY(i), z = pos.getZ(i) - cz
    const r = Math.hypot(x, z)
    const ny = nor.getY(i)
    topY = Math.max(topY, y)
    if (r < 1e-4) {
      if (ny > 0.9) floorY = Math.min(floorY, y)
      if (ny < -0.9) baseY = Math.min(baseY, y)
      continue
    }
    const rd = (nor.getX(i) * x + nor.getZ(i) * z) / r
    const k = Math.round(y * 1e4) / 1e4
    if (rd > 0.2 && ny > -0.9) outer.set(k, Math.max(outer.get(k) ?? 0, r))
    if (rd < -0.5) inner.set(k, Math.min(inner.get(k) ?? 1, r))
  }
  const sort = (m: Map<number, number>) => [...m.entries()].sort((a, b) => a[0] - b[0]).map(([y, r]) => [r, y] as RY)
  return { outer: sort(outer), inner: sort(inner), floorY, baseY: baseY === Infinity ? 0 : baseY, topY }
}

/** Insert evenly spaced points on long straight runs so the spline only rounds the real corners. */
function densify(p: RY[], step: number): RY[] {
  const out: RY[] = []
  for (let i = 0; i < p.length - 1; i++) {
    const [r0, y0] = p[i], [r1, y1] = p[i + 1]
    const n = Math.max(1, Math.round(Math.hypot(r1 - r0, y1 - y0) / step))
    for (let k = 0; k < n; k++) out.push([r0 + ((r1 - r0) * k) / n, y0 + ((y1 - y0) * k) / n])
  }
  out.push(p[p.length - 1])
  return out
}

export function smoothCurve(p: RY[], samples: number, step = 0.012): RY[] {
  if (p.length < 3) return densify(p, step / 4)
  const c = new THREE.CatmullRomCurve3(densify(p, step).map(([r, y]) => new THREE.Vector3(r, y, 0)), false, 'centripetal')
  return c.getSpacedPoints(samples).map((v) => [Math.max(v.x, 0), v.y] as RY)
}

/** Half-round lip joining the outer wall top (ro) to the inner wall top (ri) at height y. */
export function rimArc(ro: number, ri: number, y: number, n = 14): RY[] {
  const c = (ro + ri) / 2, R = (ro - ri) / 2
  const out: RY[] = []
  for (let k = 0; k <= n; k++) {
    const a = (Math.PI * k) / n
    out.push([c + R * Math.cos(a), y + R * Math.sin(a) * 1.2])
  }
  return out
}

/** Monotone (in y) radius lookup built from a dense curve. */
export function radiusFn(curve: RY[]) {
  const pts = [...curve].sort((a, b) => a[1] - b[1])
  const ys = pts.map((p) => p[1]), rs = pts.map((p) => p[0])
  return (y: number) => {
    if (y <= ys[0]) return rs[0]
    if (y >= ys[ys.length - 1]) return rs[rs.length - 1]
    let lo = 0, hi = ys.length - 1
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (ys[m] <= y) lo = m; else hi = m }
    const t = (y - ys[lo]) / (ys[hi] - ys[lo] || 1)
    return rs[lo] + (rs[hi] - rs[lo]) * t
  }
}

export function lathe(p: RY[], segments = 160) {
  const g = new THREE.LatheGeometry(p.map(([r, y]) => new THREE.Vector2(r, y)), segments)
  return g
}
