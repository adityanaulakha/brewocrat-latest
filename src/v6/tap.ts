/**
 * Draft beer tap: a column tower with a standard rear-sealing faucet, modelled from real part
 * dimensions (3" / 76 mm column, 24 mm faucet body, 13 mm spout bore, 3/8" lever, 100 mm handle).
 * Every part is a surface of revolution with filleted edges, shaded with the scene's studio env.
 * Local frame: origin at the spout outlet centre; the faucet runs along +x into the tower.
 */
import * as THREE from 'three'
import type { RY } from './profile'

/** quarter-arc fillet from (r0,y0) around centre (cr,cy), n steps (angles in degrees) */
function arc(cr: number, cy: number, rad: number, a0: number, a1: number, n = 8): RY[] {
  const out: RY[] = []
  for (let i = 0; i <= n; i++) { const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180; out.push([Math.max(0, cr + rad * Math.cos(a)), cy + rad * Math.sin(a)]) }
  return out
}
const rev = (p: RY[], seg = 96) => new THREE.LatheGeometry(p.map(([r, y]) => new THREE.Vector2(r, y)), seg)

export const TAP = {
  bodyY: 0.024, // faucet axis height above the outlet
  bodyR: 0.012,
  leverX: 0.021, // lever pivot, behind the spout
  towerR: 0.038,
}

/** towerX: distance from the spout to the tower axis along the faucet (local +x). */
export function buildTap(opts: { wood: THREE.Texture; counterY: number; towerX: number; badge?: { map: THREE.Texture; bump: THREE.Texture; metal: THREE.Texture }; face?: number }) {
  const { bodyY, bodyR, towerR } = TAP
  const towerX = opts.towerX
  const g = new THREE.Group()

  const brass = new THREE.MeshPhysicalMaterial({ color: '#d6a75e', metalness: 1, roughness: 0.17, clearcoat: 0.35, clearcoatRoughness: 0.08, envMapIntensity: 1.25 })
  const brushed = new THREE.MeshPhysicalMaterial({ color: '#b98a48', metalness: 1, roughness: 0.36, anisotropy: 0.7, anisotropyRotation: Math.PI / 2, envMapIntensity: 0.8 })
  const bore = new THREE.MeshStandardMaterial({ color: '#120c07', metalness: 0.6, roughness: 0.55, side: THREE.DoubleSide })
  const wood = new THREE.MeshPhysicalMaterial({ map: opts.wood, color: '#6b3f22', roughness: 0.38, clearcoat: 0.8, clearcoatRoughness: 0.12, envMapIntensity: 0.9 })

  /* tower: flanged column standing on the bar top */
  const ty0 = opts.counterY
  const tower = new THREE.Mesh(rev([
    [0, ty0], [towerR + 0.016, ty0], ...arc(towerR + 0.012, ty0 + 0.004, 0.004, 0, 90, 6),
    ...arc(towerR + 0.006, ty0 + 0.010, 0.002, -90, 0, 4).reverse().map(([r, y]) => [r, y] as RY),
    [towerR, ty0 + 0.016], [towerR, ty0 + 0.6], [0, ty0 + 0.6],
  ], 128), brushed)
  tower.position.set(towerX, 0, 0)
  g.add(tower)
  // shank escutcheon on the column face
  const escu = new THREE.Mesh(rev([[0, 0], [0.019, 0], ...arc(0.016, 0.003, 0.003, 0, 90, 5), [0, 0.006]], 64), brass)
  escu.rotation.z = Math.PI / 2
  escu.position.set(towerX - towerR + 0.0005, bodyY, 0)
  g.add(escu)

  /* faucet: shank → hex coupling nut → body with front dome (axis along x) */
  const axisX = (m: THREE.Mesh, x: number) => { m.rotation.z = -Math.PI / 2; m.position.set(x, bodyY, 0); g.add(m); return m }
  const front = -0.012
  axisX(new THREE.Mesh(rev([
    [0, 0], ...arc(0, 0.0105, 0.0105, -90, 0, 10).map(([r, y]) => [r * (bodyR / 0.0105), y] as RY), // dome
    [bodyR, 0.016], [bodyR - 0.0012, 0.0175], [bodyR, 0.019], // decorative groove
    [bodyR, 0.074], ...arc(bodyR - 0.001, 0.0745, 0.001, 0, 90, 4), [0.0105, 0.0755], [0.0105, 0.08], [0, 0.08],
  ], 128), brass), front)
  const hexBrass = brass.clone(); hexBrass.flatShading = true
  const nut = new THREE.Mesh(new THREE.CylinderGeometry(0.0158, 0.0158, 0.017, 6, 1), hexBrass)
  nut.rotation.set(Math.PI / 6, 0, -Math.PI / 2, 'ZXY'); nut.position.set(front + 0.087, bodyY, 0); g.add(nut)
  for (const dx of [-0.0088, 0.0088]) { // chamfered faces of the nut
    const c = new THREE.Mesh(new THREE.CylinderGeometry(0.0152, 0.0158, 0.0006, 48), brass); c.rotation.z = -Math.PI / 2; c.position.set(front + 0.087 + dx, bodyY, 0); g.add(c)
  }
  axisX(new THREE.Mesh(rev([[0, 0], [0.0102, 0], [0.0102, towerX - (front + 0.096)], [0, towerX - (front + 0.096)]], 64), brass), front + 0.096)

  /* spout: tapered, slight lip at the outlet, dark bore inside */
  const spout = new THREE.Mesh(rev([
    [0.0054, 0.0], [0.0072, 0.0], ...arc(0.0068, 0.0006, 0.0006, -90, 0, 3), [0.0072, 0.002], [0.0066, 0.004], [0.0068, 0.016], [0.0078, bodyY - bodyR * 0.7], [0.0082, bodyY], [0, bodyY],
  ], 96), brass)
  g.add(spout)
  const hole = new THREE.Mesh(rev([[0.0054, 0.0], [0.0052, 0.018], [0, 0.019]], 48), bore)
  g.add(hole)

  /* lever + handle (pivots at the top of the body) */
  const lever = new THREE.Group()
  lever.position.set(TAP.leverX, bodyY + bodyR - 0.002, 0)
  g.add(lever)
  lever.add(new THREE.Mesh(rev([[0, 0], [0.0088, 0], ...arc(0.0078, 0.004, 0.001, 0, 90, 3), [0.006, 0.0055], [0.0042, 0.007], [0.0042, 0.028], [0, 0.028]], 64), brass))
  const ferrule = new THREE.Mesh(new THREE.CylinderGeometry(0.0082, 0.0082, 0.009, 6), hexBrass); ferrule.position.y = 0.024; lever.add(ferrule)
  // tap handle: turned wood, brass ferrule rings and cap
  const hy = 0.029
  lever.add(new THREE.Mesh(rev([[0, hy], [0.0098, hy], ...arc(0.0094, hy + 0.0018, 0.0006, 0, 90, 3), [0.0092, hy + 0.0025], [0.0098, hy + 0.007], [0.0094, hy + 0.009], [0, hy + 0.009]], 64), brass))
  const woodM = new THREE.Mesh(rev([[0, hy + 0.009], [0.0106, hy + 0.009], [0.0118, hy + 0.03], [0.0136, hy + 0.07], [0.0145, hy + 0.098], [0, hy + 0.098]], 96), wood)
  lever.add(woodM)
  lever.add(new THREE.Mesh(rev([[0, hy + 0.098], [0.0152, hy + 0.098], ...arc(0.0142, hy + 0.1, 0.002, 0, 90, 5), [0.011, hy + 0.103], ...arc(0, hy + 0.0985, 0.011, 90, 75, 3).reverse(), [0, hy + 0.105]], 96), brass))

  g.traverse((o) => { if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).renderOrder = 2 })
  // Brewocrat medallion on the handle front: domed brass bezel + enamel face with the raised gold logo
  if (opts.badge) {
    const by = hy + 0.064, br = 0.0128, rHandle = 0.0118 + (0.0136 - 0.0118) * ((0.064 - 0.03) / 0.04)
    const md = new THREE.Group(); md.position.y = by; md.rotation.y = opts.face ?? 0; lever.add(md)
    const holder = new THREE.Group(); holder.position.z = rHandle - 0.0012; md.add(holder)
    const bezel = new THREE.Mesh(rev([[br - 0.0006, 0.0034], [br + 0.0012, 0.0031], ...arc(br + 0.0008, 0.0018, 0.0012, 90, 0, 5).reverse(), [br + 0.0016, 0], [br - 0.0006, 0]], 96), brass)
    bezel.rotation.x = Math.PI / 2; bezel.position.z = 0; bezel.rotation.x = -Math.PI / 2
    holder.add(bezel)
    const face = new THREE.MeshPhysicalMaterial({ map: opts.badge.map, bumpMap: opts.badge.bump, bumpScale: 2.2, metalnessMap: opts.badge.metal, metalness: 1, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1.1 })
    const disc = new THREE.Mesh(new THREE.CircleGeometry(br - 0.0004, 96), face)
    disc.position.z = 0.0028; holder.add(disc)
  }
  return { group: g, lever }
}
