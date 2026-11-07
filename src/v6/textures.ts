/** Procedural support textures (deterministic): condensation, foam cells, label, backdrop, contact glow. */
import * as THREE from 'three'

let seed = 20261103
export const rand = () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}
export const rnd = (a: number, b: number) => a + rand() * (b - a)

const canvas = (w: number, h = w) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c }

/** Tileable normal map of water droplets (+ fine mist) and a matching roughness map. */
export function condensation(size = 1024, drops = 1400, mist = 9000) {
  const N = new Float32Array(size * size * 3)
  const R = new Float32Array(size * size).fill(0.16) // mist roughness
  for (let i = 0; i < size * size; i++) { N[i * 3 + 2] = 1 }
  const put = (cx: number, cy: number, r: number, elong: number) => {
    const ry = r * elong
    for (let y = Math.floor(cy - ry - 1); y <= cy + ry + 1; y++) for (let x = Math.floor(cx - r - 1); x <= cx + r + 1; x++) {
      const dx = (x - cx) / r, dy = (y - cy) / ry, d2 = dx * dx + dy * dy
      if (d2 >= 1) continue
      const xx = ((x % size) + size) % size, yy = ((y % size) + size) % size, k = yy * size + xx
      const nz = Math.sqrt(1 - d2)
      // droplets are flatter than spheres: soften the slope
      const s = 0.85
      N[k * 3] = dx * s; N[k * 3 + 1] = -dy * s; N[k * 3 + 2] = nz
      R[k] = 0.04
    }
  }
  for (let i = 0; i < mist; i++) put(rnd(0, size), rnd(0, size), rnd(0.6, 1.6), 1)
  for (let i = 0; i < drops; i++) {
    const r = Math.pow(rand(), 2.2) * 9 + 1.5
    put(rnd(0, size), rnd(0, size), r, r > 6 ? rnd(1.05, 1.35) : 1)
  }
  // a few running drips
  for (let i = 0; i < 14; i++) {
    const x = rnd(0, size), y0 = rnd(0, size), len = rnd(40, 160), w = rnd(1.5, 3)
    for (let y = 0; y < len; y += 1.5) put(x + Math.sin(y * 0.05) * 2, y0 + y, w * (0.7 + 0.3 * (y / len)), 1)
    put(x, y0 + len, w * 2.2, 1.2)
  }
  const nc = canvas(size), nctx = nc.getContext('2d')!, nd = nctx.createImageData(size, size)
  const rc = canvas(size), rctx = rc.getContext('2d')!, rd = rctx.createImageData(size, size)
  for (let i = 0; i < size * size; i++) {
    const l = Math.hypot(N[i * 3], N[i * 3 + 1], N[i * 3 + 2]) || 1
    nd.data[i * 4] = (N[i * 3] / l * 0.5 + 0.5) * 255
    nd.data[i * 4 + 1] = (N[i * 3 + 1] / l * 0.5 + 0.5) * 255
    nd.data[i * 4 + 2] = (N[i * 3 + 2] / l * 0.5 + 0.5) * 255
    nd.data[i * 4 + 3] = 255
    const r = R[i] * 255
    rd.data[i * 4] = r; rd.data[i * 4 + 1] = r; rd.data[i * 4 + 2] = r; rd.data[i * 4 + 3] = 255
  }
  nctx.putImageData(nd, 0, 0); rctx.putImageData(rd, 0, 0)
  const nt = new THREE.CanvasTexture(nc), rt = new THREE.CanvasTexture(rc)
  for (const t of [nt, rt]) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; t.colorSpace = THREE.NoColorSpace }
  return { normal: nt, rough: rt }
}

/** Foam: packed bubble cells. Returns colour + normal maps (tileable). */
export function foamMaps(size = 1024) {
  const H = new Float32Array(size * size) // height field
  const S = new Float32Array(size * size).fill(1) // shade (cell walls darker)
  const cells = 9000
  for (let i = 0; i < cells; i++) {
    const big = rand() < 0.04
    const r = big ? rnd(14, 26) : Math.pow(rand(), 1.8) * 9 + 2.2
    const cx = rnd(0, size), cy = rnd(0, size)
    for (let y = Math.floor(cy - r); y <= cy + r; y++) for (let x = Math.floor(cx - r); x <= cx + r; x++) {
      const d2 = ((x - cx) ** 2 + (y - cy) ** 2) / (r * r)
      if (d2 >= 1) continue
      const xx = ((x % size) + size) % size, yy = ((y % size) + size) % size, k = yy * size + xx
      const h = Math.sqrt(1 - d2) * r * 0.6
      if (h > H[k]) { H[k] = h; S[k] = 0.9 + 0.1 * Math.sqrt(1 - d2) - (d2 > 0.84 ? 0.09 : 0) }
    }
  }
  const cc = canvas(size), cctx = cc.getContext('2d')!, cd = cctx.createImageData(size, size)
  const nc = canvas(size), nctx = nc.getContext('2d')!, nd = nctx.createImageData(size, size)
  const at = (x: number, y: number) => H[(((y % size) + size) % size) * size + (((x % size) + size) % size)]
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const i = y * size + x
    const s = S[i] * (H[i] === 0 ? 0.86 : 1)
    cd.data[i * 4] = 255 * Math.min(1, s * 1.0); cd.data[i * 4 + 1] = 255 * Math.min(1, s * 0.975); cd.data[i * 4 + 2] = 255 * Math.min(1, s * 0.93); cd.data[i * 4 + 3] = 255
    const dx = (at(x + 1, y) - at(x - 1, y)) * 0.4, dy = (at(x, y + 1) - at(x, y - 1)) * 0.4
    const l = Math.hypot(dx, dy, 1)
    nd.data[i * 4] = (-dx / l * 0.5 + 0.5) * 255; nd.data[i * 4 + 1] = (dy / l * 0.5 + 0.5) * 255; nd.data[i * 4 + 2] = (1 / l * 0.5 + 0.5) * 255; nd.data[i * 4 + 3] = 255
  }
  cctx.putImageData(cd, 0, 0); nctx.putImageData(nd, 0, 0)
  const ct = new THREE.CanvasTexture(cc), nt = new THREE.CanvasTexture(nc)
  ct.colorSpace = THREE.SRGBColorSpace; nt.colorSpace = THREE.NoColorSpace
  for (const t of [ct, nt]) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8 }
  return { color: ct, normal: nt }
}

/** Bottle label with the real Brewocrat logo (public/Logopng-02.webp). */
export async function labelTexture(logoUrl: string) {
  const img = new Image(); img.src = logoUrl; await img.decode()
  const W = 2048, Hh = 768
  const c = canvas(W, Hh), g = c.getContext('2d')!
  // kraft-black paper
  const grad = g.createLinearGradient(0, 0, 0, Hh)
  grad.addColorStop(0, '#1d140d'); grad.addColorStop(0.5, '#24180f'); grad.addColorStop(1, '#1a110a')
  g.fillStyle = grad; g.fillRect(0, 0, W, Hh)
  for (let i = 0; i < 26000; i++) { g.fillStyle = `rgba(${rand() < 0.5 ? '255,230,190' : '0,0,0'},${rnd(0.01, 0.05)})`; g.fillRect(rnd(0, W), rnd(0, Hh), rnd(1, 3), rnd(1, 3)) }
  const gold = g.createLinearGradient(0, 0, 0, Hh)
  gold.addColorStop(0, '#f3d58b'); gold.addColorStop(0.5, '#c89434'); gold.addColorStop(1, '#f0cf80')
  g.strokeStyle = gold; g.lineWidth = 10; g.strokeRect(26, 26, W - 52, Hh - 52)
  g.lineWidth = 3; g.strokeRect(50, 50, W - 100, Hh - 100)
  // logo, tinted gold (front of the label = centre of the canvas)
  const lh = 430, lw = (img.width / img.height) * lh
  const tmp = canvas(Math.ceil(lw), lh), tg = tmp.getContext('2d')!
  tg.drawImage(img, 0, 0, lw, lh); tg.globalCompositeOperation = 'source-in'
  const lg = tg.createLinearGradient(0, 0, 0, lh); lg.addColorStop(0, '#f8e2a6'); lg.addColorStop(1, '#d6a446')
  tg.fillStyle = lg; tg.fillRect(0, 0, lw, lh)
  g.drawImage(tmp, W / 2 - lw / 2, 70)
  g.fillStyle = gold; g.textAlign = 'center'; g.textBaseline = 'middle'
  g.font = '600 84px Georgia, "Times New Roman", serif'
  g.fillText('CRAFT  LAGER', W / 2, 568)
  g.font = '500 40px Georgia, serif'
  g.fillText('BREWED  IN-HOUSE  ·  330 ML  ·  5.0% ABV', W / 2, 652)
  // side panels
  g.font = '500 44px Georgia, serif'
  g.fillText('BREWOCRAT', W * 0.13, Hh / 2); g.fillText('SKYBAR & KITCHEN', W * 0.87, Hh / 2)
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8
  return t
}

/** Studio backdrop: warm seamless with soft out-of-focus bar lights. */
export function backdrop(w = 2048, h = 1152) {
  const c = canvas(w, h), g = c.getContext('2d')!
  const base = g.createRadialGradient(w * 0.5, h * 0.66, 20, w * 0.5, h * 0.66, w * 0.5)
  base.addColorStop(0, '#ffe7b4'); base.addColorStop(0.22, '#f6c068'); base.addColorStop(0.55, '#b86c1f'); base.addColorStop(1, '#3a1a07')
  g.fillStyle = base; g.fillRect(0, 0, w, h)
  g.globalCompositeOperation = 'lighter'
  for (let i = 0; i < 34; i++) {
    const x = rnd(0, w), y = rnd(h * 0.04, h * 0.6), r = rnd(22, 80)
    const b = g.createRadialGradient(x, y, r * 0.35, x, y, r)
    const a = rnd(0.03, 0.1)
    b.addColorStop(0, `rgba(255,${200 + rnd(0, 40) | 0},${120 + rnd(0, 80) | 0},${a})`); b.addColorStop(0.9, `rgba(255,220,160,${a * 1.2})`); b.addColorStop(1, 'rgba(255,220,160,0)')
    g.fillStyle = b; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill()
  }
  g.globalCompositeOperation = 'source-over'
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace
  return t
}

/** Soft contact shadow + the golden caustic a glass of beer throws on the bar top. */
export function contactMaps(size = 512) {
  const c = canvas(size), g = c.getContext('2d')!
  const s = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  s.addColorStop(0, 'rgba(0,0,0,0.85)'); s.addColorStop(0.22, 'rgba(0,0,0,0.6)'); s.addColorStop(0.5, 'rgba(0,0,0,0.18)'); s.addColorStop(1, 'rgba(0,0,0,0)')
  g.fillStyle = s; g.fillRect(0, 0, size, size)
  const shadow = new THREE.CanvasTexture(c)
  const c2 = canvas(size), g2 = c2.getContext('2d')!
  const k = g2.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  k.addColorStop(0, 'rgba(255,214,120,1)'); k.addColorStop(0.35, 'rgba(255,170,60,0.55)'); k.addColorStop(1, 'rgba(255,140,30,0)')
  g2.fillStyle = k; g2.fillRect(0, 0, size, size)
  const caustic = new THREE.CanvasTexture(c2); caustic.colorSpace = THREE.SRGBColorSpace
  return { shadow, caustic }
}

/** Tap-handle medallion: real Brewocrat logo in gold on black enamel; returns colour + relief (bump) maps. */
export async function badgeTexture(logoUrl: string) {
  const img = new Image(); img.src = logoUrl; await img.decode()
  const N = 512, c = canvas(N, N), g = c.getContext('2d')!
  const bg = g.createRadialGradient(N * 0.42, N * 0.38, 10, N / 2, N / 2, N / 2)
  bg.addColorStop(0, '#2a2018'); bg.addColorStop(1, '#0d0906')
  g.fillStyle = bg; g.fillRect(0, 0, N, N)
  const lh = N * 1.0, lw = (img.width / img.height) * lh
  const tmp = canvas(Math.ceil(lw), Math.ceil(lh)), tg = tmp.getContext('2d')!
  tg.drawImage(img, 0, 0, lw, lh); tg.globalCompositeOperation = 'source-in'
  const lg = tg.createLinearGradient(0, 0, 0, lh); lg.addColorStop(0, '#f6dc98'); lg.addColorStop(1, '#c8963c')
  tg.fillStyle = lg; tg.fillRect(0, 0, lw, lh)
  g.drawImage(tmp, N / 2 - lw / 2, N / 2 - lh / 2)
  // relief: logo raised (white) on the enamel field (black)
  const b = canvas(N, N), bgc = b.getContext('2d')!
  bgc.fillStyle = '#000'; bgc.fillRect(0, 0, N, N); bgc.filter = 'blur(1.5px)'
  const t2 = canvas(Math.ceil(lw), Math.ceil(lh)), t2g = t2.getContext('2d')!
  t2g.drawImage(img, 0, 0, lw, lh); t2g.globalCompositeOperation = 'source-in'; t2g.fillStyle = '#fff'; t2g.fillRect(0, 0, lw, lh)
  bgc.drawImage(t2, N / 2 - lw / 2, N / 2 - lh / 2)
  const map = new THREE.CanvasTexture(c); map.colorSpace = THREE.SRGBColorSpace; map.anisotropy = 8
  const bump = new THREE.CanvasTexture(b)
  // mask: where the logo is, the surface is gold metal; elsewhere glossy enamel
  return { map, bump, metal: bump }
}
