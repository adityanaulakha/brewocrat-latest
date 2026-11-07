/**
 * Brewocrat pour v6 — lager drawn from a brass draft tap into a weizen glass, rendered with Three.js.
 * Real CC0 GLB glass (Innerscene beer glass, see CREDITS.md) re-revolved at high resolution; the tap is original procedural geometry (tap.ts),
 * physical transmission for beer, HDRI + softbox studio reflections, deterministic timeline.
 */
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { ringsOf, lathe, RY } from './profile'
import { vesselFromRings, Vessel } from './vessel'
import * as T from './timeline'
import { badgeTexture, backdrop, condensation, contactMaps, foamMaps, rand, rnd } from './textures'
import { buildTap } from './tap'

const BASE = '/pour-v6/'
const pathLen = (p: RY[]) => p.reduce((s, q, i) => (i ? s + Math.hypot(q[0] - p[i - 1][0], q[1] - p[i - 1][1]) : 0), 0)
const QS = new URLSearchParams(location.search)
const qn = (k: string, d: number) => (QS.has(k) ? Number(QS.get(k)) : d)

/* ------------------------------------------------------------------ small noise */
const hash = (x: number, y: number, z: number) => { const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return s - Math.floor(s) }
function vnoise(x: number, y: number, z: number) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z)
  const xf = x - xi, yf = y - yi, zf = z - zi
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf)
  const l = (a: number, b: number, t: number) => a + (b - a) * t
  const c = (dx: number, dy: number, dz: number) => hash(xi + dx, yi + dy, zi + dz)
  return l(l(l(c(0, 0, 0), c(1, 0, 0), u), l(c(0, 1, 0), c(1, 1, 0), u), v), l(l(c(0, 0, 1), c(1, 0, 1), u), l(c(0, 1, 1), c(1, 1, 1), u), v), w) * 2 - 1
}
const fbm = (x: number, y: number, z: number) => vnoise(x, y, z) * 0.6 + vnoise(x * 2.1, y * 2.1, z * 2.1) * 0.28 + vnoise(x * 4.3, y * 4.3, z * 4.3) * 0.12

/* ------------------------------------------------------------------ glass overlay material
 * Reflections are added on top (ONE), the background is attenuated by a fresnel-driven alpha, so
 * edges read dark/thick like real glass while the faces stay crystal clear. */
function glassMaterial(cond: ReturnType<typeof condensation>, opts: { tint?: THREE.Color; base?: number; repeat: [number, number]; ns?: number }) {
  const n = cond.normal.clone(), r = cond.rough.clone()
  for (const t of [n, r]) { t.repeat.set(...opts.repeat); t.needsUpdate = true }
  const m = new THREE.MeshPhysicalMaterial({
    color: 0x000000, metalness: 0, roughness: 1, roughnessMap: r, normalMap: n, normalScale: new THREE.Vector2(opts.ns ?? 0.7, opts.ns ?? 0.7),
    ior: 1.52, specularIntensity: 1, envMapIntensity: 1.0, transparent: true, depthWrite: false, opacity: 0.025,
    blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendEquation: THREE.AddEquation,
    blendDst: opts.tint ? THREE.ConstantColorFactor : THREE.OneMinusSrcAlphaFactor,
  })
  if (opts.tint) m.blendColor.copy(opts.tint)
  const base = opts.base ?? -1
  m.onBeforeCompile = (s) => {
    s.vertexShader = s.vertexShader.replace('#include <common>', '#include <common>\nvarying float vLY;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvLY = position.y;')
    s.fragmentShader = s.fragmentShader.replace('#include <common>', '#include <common>\nvarying float vLY;').replace('#include <opaque_fragment>', `#include <opaque_fragment>
      float cv = clamp(abs(dot(normalize(normal), normalize(vViewPosition))), 0.0, 1.0);
      float fr = pow(1.0 - cv, 2.2);
      float thick = vLY < ${base.toFixed(4)} ? 0.12 : 0.0;
      gl_FragColor.a = clamp(opacity + fr * 0.5 + thick, 0.0, 0.85);
      gl_FragColor.rgb += vec3(0.010, 0.014, 0.012) * fr;`)
  }
  return m
}

export type Ctx = {
  renderer: THREE.WebGLRenderer; scene: THREE.Scene; camera: THREE.PerspectiveCamera; portrait: boolean
  /** t: seconds on the pour timeline; dive: 0..1 final push into the beer */
  update: (t: number, dive?: number) => void
  resize: () => void
  dispose: () => void
}

export async function createPour(canvas: HTMLCanvasElement, opts: { capture: boolean; maxDpr?: number; lite?: boolean }): Promise<Ctx> {
  const W = () => canvas.clientWidth || innerWidth, H = () => canvas.clientHeight || innerHeight
  const portrait = W() / H() < 0.9
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !QS.has('post'), stencil: false, preserveDrawingBuffer: opts.capture, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(devicePixelRatio, opts.maxDpr ?? (opts.capture ? 1 : 2)))
  renderer.setSize(W(), H(), false)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = qn('exp', 1.0)
  renderer.localClippingEnabled = true

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(25, W() / H(), 0.01, 20)

  /* ---------------- assets */
  const gltf = new GLTFLoader()
  const tex = new THREE.TextureLoader()
  const [glassesG, hdr, woodD, woodN, woodR] = await Promise.all([
    gltf.loadAsync(BASE + 'weizen_glass.glb'),
    // phones get half-resolution lighting/wood maps (~0.4 MB instead of ~2.1 MB; the env is PMREM-blurred anyway)
    new RGBELoader().loadAsync(BASE + (opts.lite ? 'studio_small_09_512.hdr' : 'studio_small_09_1k.hdr')),
    tex.loadAsync(BASE + `wood_table_001_diffuse_${opts.lite ? '512' : '1k'}.jpg`),
    tex.loadAsync(BASE + `wood_table_001_nor_gl_${opts.lite ? '512' : '1k'}.jpg`),
    tex.loadAsync(BASE + `wood_table_001_rough_${opts.lite ? '512' : '1k'}.jpg`),
  ])
  const meshByName = (root: THREE.Object3D, prefix: string) => {
    let found: THREE.Mesh | undefined
    root.traverse((o) => { if (!found && (o as THREE.Mesh).isMesh && o.name.replace(/_/g, ' ').startsWith(prefix)) found = o as THREE.Mesh })
    if (!found) throw new Error('mesh not found: ' + prefix)
    return found
  }
  const wheat = meshByName(glassesG.scene, 'Wheat beer glass')
  wheat.geometry.computeBoundingBox()
  const wb = wheat.geometry.boundingBox!
  const GL: Vessel = vesselFromRings(ringsOf(wheat.geometry, (wb.min.x + wb.max.x) / 2, (wb.min.z + wb.max.z) / 2))
  ;(window as any).__v6vessels = { GL }

  /* ---------------- environment: CC0 studio HDRI + softbox strips (product-shot reflections) */
  hdr.mapping = THREE.EquirectangularReflectionMapping
  const envScene = new THREE.Scene()
  const sky = new THREE.Mesh(new THREE.SphereGeometry(10, 64, 32), new THREE.MeshBasicMaterial({ map: hdr, side: THREE.BackSide, toneMapped: false, color: new THREE.Color(1, 0.9, 0.78).multiplyScalar(qn('skyk', 0.3)) }))
  hdr.mapping = THREE.UVMapping
  sky.rotation.y = qn('rot', 1.2)
  envScene.add(sky)
  const box = (w: number, h: number, x: number, y: number, z: number, k: number, warm = false) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(warm ? '#ffd9a8' : '#fff6ea').multiplyScalar(k), toneMapped: false, side: THREE.DoubleSide }))
    m.position.set(x, y, z); m.lookAt(0, 0.12, 0); envScene.add(m)
  }
  box(0.6, 4, -2.2, 0.8, 0.6, qn('sb', 5)) // left strip
  box(0.6, 4, 2.2, 0.8, 0.2, qn('sb', 5) * 0.8) // right strip
  box(2.0, 1.2, 0.2, 3.0, 0.6, 2.2) // overhead
  box(3.0, 1.6, 0, 0.8, -3.0, 2.4, true) // warm backlight panel
  const pmrem = new THREE.PMREMGenerator(renderer)
  scene.environment = pmrem.fromScene(envScene, 0, 0.1, 50).texture

  /* ---------------- set: backdrop + bar top */
  const bd = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.6), new THREE.MeshBasicMaterial({ map: backdrop(), color: new THREE.Color(1, 1, 1).multiplyScalar(qn('bgk', 1.0)) }))
  bd.position.set(0.0, 0.298, -0.11)
  scene.add(bd)
  for (const t of [woodD, woodN, woodR]) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2.6, 2.6); t.anisotropy = 8 }
  woodD.colorSpace = THREE.SRGBColorSpace
  const counter = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.8), new THREE.MeshPhysicalMaterial({
    map: woodD, normalMap: woodN, roughnessMap: woodR, roughness: 1, color: new THREE.Color(QS.get('wood') ?? '#8a5634'), clearcoat: qn('cc', 0.0), clearcoatRoughness: 0.3, specularIntensity: qn('spec', 0.25), envMapIntensity: qn('wenv', 0.5),
  }))
  counter.rotation.x = -Math.PI / 2
  counter.position.set(0, 0, 0.29)
  scene.add(counter)
  const cm = contactMaps()
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(0.13, 0.13), new THREE.MeshBasicMaterial({ map: cm.shadow, color: 0x000000, transparent: true, depthWrite: false, opacity: 0.75 }))
  shadow.rotation.x = -Math.PI / 2; shadow.position.set(0.004, 0.0006, -0.006); scene.add(shadow)
  const caustic = new THREE.Mesh(new THREE.PlaneGeometry(0.09, 0.14), new THREE.MeshBasicMaterial({ map: cm.caustic, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 }))
  caustic.rotation.x = -Math.PI / 2; caustic.position.set(0.012, 0.0008, 0.06); scene.add(caustic)

  const key = new THREE.DirectionalLight('#fff1dc', 2.2); key.position.set(-0.6, 1.2, 0.9); scene.add(key)
  const rim = new THREE.DirectionalLight('#ffc27a', 1.6); rim.position.set(0.5, 0.6, -1.0); scene.add(rim)
  scene.add(new THREE.HemisphereLight('#fff4e0', '#5a3418', 0.35))

  /* ---------------- glass */
  const cond = condensation()
  const glassGeo = GL.geometry(220)
  const glass = new THREE.Mesh(glassGeo, glassMaterial(cond, { base: GL.innerBottomY - 0.0005, repeat: [7, pathLen(GL.wall) / 0.036] }))
  glass.renderOrder = 3
  scene.add(glass)

  /* ---------------- beer + foam (rebuilt every frame from the glass's inner wall) */
  const INSET = 0.00045
  const beerMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#fff0c4'), transmission: 1, roughness: 0.1, metalness: 0, ior: 1.34, thickness: 0.05,
    attenuationColor: new THREE.Color(QS.get('beer') ?? '#f2b234'), attenuationDistance: qn('ad', 0.06), specularIntensity: 1, envMapIntensity: 1, depthWrite: false,
  })
  const beer = new THREE.Mesh(new THREE.BufferGeometry(), beerMat)
  scene.add(beer)
  const fm = foamMaps()
  const foamMat = new THREE.MeshPhysicalMaterial({
    map: fm.color, normalMap: fm.normal, normalScale: new THREE.Vector2(0.7, 0.7), color: new THREE.Color('#fffaf2'), roughness: 0.55,
    sheen: 0.4, sheenColor: new THREE.Color('#fff3da'), sheenRoughness: 0.5, emissive: new THREE.Color('#3b2a14'), emissiveIntensity: 0.25, envMapIntensity: 0.75,
  })
  const foamU = { uBeerY: { value: 0 }, uWet: { value: 0.004 } }
  foamMat.onBeforeCompile = (s) => {
    Object.assign(s.uniforms, foamU)
    s.vertexShader = s.vertexShader.replace('#include <common>', '#include <common>\nvarying float vWY;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvWY = position.y;')
    s.fragmentShader = s.fragmentShader.replace('#include <common>', '#include <common>\nvarying float vWY;\nuniform float uBeerY; uniform float uWet;')
      .replace('#include <color_fragment>', `#include <color_fragment>
        float wet = 1.0 - smoothstep(uBeerY, uBeerY + uWet, vWY);
        float big = texture2D(map, vMapUv * 0.27 + 0.31).r;
        diffuseColor.rgb *= 0.9 + 0.1 * big;
        diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * vec3(0.98, 0.8, 0.42), wet * 0.8);`)
  }
  const foam = new THREE.Mesh(new THREE.BufferGeometry(), foamMat)
  scene.add(foam)

  const SIDE = 48, CAP = 22, SEG = 128
  function beerProfile(h: number): RY[] {
    const y0 = GL.innerBottomY + 0.0002
    const p: RY[] = [[0, GL.floorY + 0.0006], [GL.innerR(y0) * 0.6, GL.floorY + (y0 - GL.floorY) * 0.5]]
    for (let i = 0; i <= SIDE; i++) { const y = y0 + ((h - y0) * i) / SIDE; p.push([GL.innerR(y) - INSET, y]) }
    p.push([0, h])
    return p
  }
  function foamGeometry(yb: number, ye: number, dome: number, t: number, impact: { x: number; on: number }) {
    const p: RY[] = [[Math.max(GL.innerR(yb) - INSET - 0.0016, 0), yb - 0.0006]]
    for (let i = 0; i <= SIDE / 2; i++) { const y = yb + ((ye - yb) * i) / (SIDE / 2); p.push([GL.innerR(y) - INSET, y]) }
    const re = GL.innerR(ye) - INSET
    for (let i = 1; i <= CAP; i++) { const r = re * (1 - i / CAP); const k = 1 - (r / re) ** 2; p.push([r, ye + dome * Math.pow(Math.max(k, 0), 0.65) + 0.0012 * Math.sqrt(Math.max(k, 0))]) }
    const g = lathe(p, SEG)
    // lumpy, slowly breathing head; a dimple where the stream punches in
    const pos = g.attributes.position as THREE.BufferAttribute
    const sideN = SIDE / 2 + 2
    for (let i = 0; i < pos.count; i++) {
      const row = i % p.length
      if (row < sideN) continue
      const x = pos.getX(i), z = pos.getZ(i), y = pos.getY(i)
      const lump = fbm(x * 260, z * 260, t * 0.25) * 0.0011 + fbm(x * 900, z * 900, t * 0.15) * 0.0003
      const d2 = (x - impact.x) ** 2 + z * z
      const dimple = -impact.on * 0.006 * Math.exp(-d2 / (0.008 * 0.008))
      const edge = Math.min(1, (re - Math.hypot(x, z)) / 0.004)
      pos.setY(i, y + (lump * (0.4 + 0.6 * T.churnAt(t)) + dimple) * Math.max(edge, 0))
    }
    g.computeVertexNormals()
    const len = (ye - yb) + re + dome
    const m = foamMat.map!, nm = foamMat.normalMap!
    m.repeat.set(7, len / 0.034); nm.repeat.copy(m.repeat)
    return g
  }

  /* ---------------- bubbles: nucleation chains + free bubbles + pour churn */
  const NUC = 16, PER = 26, FREE = 320, CHURN = 2600
  const NB = NUC * PER + FREE + CHURN
  const bPos = new Float32Array(NB * 3), bSize = new Float32Array(NB), bAlpha = new Float32Array(NB)
  const bGeo = new THREE.BufferGeometry()
  bGeo.setAttribute('position', new THREE.BufferAttribute(bPos, 3).setUsage(THREE.DynamicDrawUsage))
  bGeo.setAttribute('size', new THREE.BufferAttribute(bSize, 1).setUsage(THREE.DynamicDrawUsage))
  bGeo.setAttribute('alpha', new THREE.BufferAttribute(bAlpha, 1).setUsage(THREE.DynamicDrawUsage))
  const bMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { uScale: { value: 1 } },
    vertexShader: `attribute float size; attribute float alpha; varying float vA; uniform float uScale;
      void main(){ vec4 mv = modelViewMatrix * vec4(position,1.); gl_Position = projectionMatrix * mv; gl_PointSize = max(size * uScale / -mv.z, 1.2); vA = alpha * clamp(size * uScale / -mv.z / 1.2, 0.25, 1.0); }`,
    fragmentShader: `varying float vA;
      void main(){ vec2 p = gl_PointCoord * 2. - 1.; float d = length(p); if (d > 1.) discard;
        float ring = smoothstep(0.5, 0.92, d) * (1. - smoothstep(0.92, 1., d));
        float hl = 1. - smoothstep(0., 0.42, length(p - vec2(-0.32, -0.32)));
        vec3 c = vec3(1.0, 0.95, 0.82) * (ring * 0.85 + hl * 1.3) + vec3(0.9, 0.62, 0.2) * 0.25;
        gl_FragColor = vec4(c, clamp(ring * 0.8 + hl * 0.9 + 0.12, 0., 1.) * vA); }`,
  })
  const bubbles = new THREE.Points(bGeo, bMat)
  bubbles.frustumCulled = false
  bubbles.renderOrder = 2
  scene.add(bubbles)
  type Site = { a: number; f: number; y: number; v: number; rate: number }
  const sites: Site[] = Array.from({ length: NUC }, (_, i) => ({ a: rnd(0, Math.PI * 2), f: i < 6 ? rnd(0.05, 0.6) : rnd(0.75, 0.93), y: i < 6 ? GL.innerBottomY + 0.001 : rnd(GL.innerBottomY + 0.004, 0.07), v: rnd(0.035, 0.06), rate: rnd(14, 26) }))
  const free = Array.from({ length: FREE }, () => ({ a: rnd(0, Math.PI * 2), f: Math.sqrt(rand()) * 0.92, h: rand(), v: rnd(0.02, 0.07), s: rnd(0.0003, 0.0009) }))
  const churn = Array.from({ length: CHURN }, () => ({ a: rnd(0, Math.PI * 2), f: Math.sqrt(rand()) * 0.95, h: rand(), w: rnd(-1.6, 2.4), s: rnd(0.00018, 0.0005), up: rnd(0.04, 0.12), ph: rnd(0, 6.28) }))

  function placeBubbles(t: number, level: number) {
    let n = 0
    const put = (a: number, f: number, y: number, s: number, al: number) => {
      const R = Math.max(GL.innerR(y) - INSET - s * 1.2 - 0.0006, 0) * f
      bPos[n * 3] = Math.cos(a) * R; bPos[n * 3 + 1] = y; bPos[n * 3 + 2] = Math.sin(a) * R
      bSize[n] = s; bAlpha[n] = y < level - 0.0012 && y > GL.innerBottomY ? al : 0; n++
    }
    const cl = T.churnAt(t)
    const settle = T.smooth(T.T_OFF - 0.5, T.T_OFF + 1.0, t)
    for (const s of sites) for (let k = 0; k < PER; k++) {
      const age = ((t * s.rate + k) % PER) / s.rate // seconds since this bubble left the site
      const y = s.y + s.v * age + 0.06 * age * age
      put(s.a + Math.sin(age * 7 + k) * 0.01, s.f, y, 0.00028 + age * 0.00055, 0.9 * settle + 0.25)
    }
    for (const b of free) { const y = GL.innerBottomY + ((b.h + b.v * t * 4) % 1) * (level - GL.innerBottomY); put(b.a + t * 0.05, b.f, y, b.s, 0.55 + 0.3 * settle) }
    for (const c of churn) {
      // swirling micro-bubble cloud while beer crashes in; once the pour stops it lifts and clears
      const span = Math.max(level - GL.innerBottomY, 0.001)
      const after = Math.max(0, t - T.T_OFF)
      let y = GL.innerBottomY + ((c.h + c.w * t * 0.35) % 1 + 1) % 1 * span + c.up * after * after * 0.5 * 9
      const a = c.a + t * (0.8 + c.w * 0.4) + Math.sin(t * 3 + c.ph) * 0.2
      put(a, c.f, y, c.s, Math.min(1, cl * 1.15))
    }
    bGeo.attributes.position.needsUpdate = true; bGeo.attributes.size.needsUpdate = true; bGeo.attributes.alpha.needsUpdate = true
  }

  /* ---------------- draft tap (replaces the bottle; see tap.ts) */
  const tapWood = woodD.clone(); tapWood.wrapS = tapWood.wrapT = THREE.RepeatWrapping; tapWood.repeat.set(0.35, 1.2); tapWood.rotation = Math.PI / 2
  // tower stands at the back of the bar, behind and right of the glass; the faucet reaches forward over it (3/4 view)
  const TOWER = { x: 0.104, z: -0.096 }
  const tdx = TOWER.x - T.SPOUT.x, tdz = TOWER.z
  const tapRot = Math.atan2(-tdz, tdx)
  const badge = await badgeTexture('/Logopng-02-300.webp')
  const tapRig = buildTap({ wood: tapWood, counterY: -T.SPOUT.y, towerX: Math.hypot(tdx, tdz), badge, face: -tapRot + 0.35 })
  tapRig.group.position.set(T.SPOUT.x, T.SPOUT.y, 0)
  tapRig.group.rotation.y = Math.atan2(-tdz, tdx)
  scene.add(tapRig.group)

  /* ---------------- stream */
  const SS = 110, SR = 16
  const sPos = new Float32Array(SS * SR * 3), sNor = new Float32Array(SS * SR * 3)
  const sIdx: number[] = []
  for (let i = 0; i < SS - 1; i++) for (let j = 0; j < SR; j++) { const a = i * SR + j, b = i * SR + ((j + 1) % SR), c = a + SR, d = b + SR; sIdx.push(a, b, c, b, d, c) }
  const sGeo = new THREE.BufferGeometry()
  sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3).setUsage(THREE.DynamicDrawUsage))
  sGeo.setAttribute('normal', new THREE.BufferAttribute(sNor, 3).setUsage(THREE.DynamicDrawUsage))
  sGeo.setIndex(sIdx)
  const stream = new THREE.Mesh(sGeo, new THREE.MeshPhysicalMaterial({
    color: QS.get('sc') ?? '#f8c656', transmission: qn('st', 0.82), roughness: 0.02, ior: 1.34, thickness: 0.012, attenuationColor: new THREE.Color('#e9a11e'), attenuationDistance: 0.02, envMapIntensity: 1.1, emissive: new THREE.Color('#a8650a'), emissiveIntensity: qn('se', 0.1), clearcoat: 1, clearcoatRoughness: 0.02,
  }))
  stream.frustumCulled = false
  scene.add(stream)

  /* aeration bubbles inside the stream, splash droplets at the impact, last drips after close */
  const dotTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d')!; const gr = g.createRadialGradient(32, 32, 2, 32, 32, 30); gr.addColorStop(0, 'rgba(255,250,235,1)'); gr.addColorStop(0.5, 'rgba(255,240,200,0.55)'); gr.addColorStop(1, 'rgba(255,240,200,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c) })()
  const NAB = 90, NSP = 70
  const fxPos = new Float32Array((NAB + NSP) * 3)
  const fxGeo = new THREE.BufferGeometry(); fxGeo.setAttribute('position', new THREE.BufferAttribute(fxPos, 3).setUsage(THREE.DynamicDrawUsage))
  const fxPts = new THREE.Points(fxGeo, new THREE.PointsMaterial({ map: dotTex, size: 0.0048, transparent: true, depthWrite: false, opacity: 0.5, color: '#fffaf0', depthTest: false, blending: THREE.AdditiveBlending }))
  fxPts.renderOrder = 20
  fxPts.frustumCulled = false; scene.add(fxPts)
  const seeds = Array.from({ length: NAB + NSP }, (_, i) => [Math.sin(i * 12.9898) * 43758.5453 % 1, Math.sin(i * 78.233) * 12543.31 % 1, Math.sin(i * 39.425) * 9631.7 % 1].map(v => Math.abs(v)))
  function fx(t: number, pts: { x: number; y: number; r: number; tau: number }[], hit: boolean, surfY: number) {
    for (let i = 0; i < NAB; i++) {
      const [a, b, c] = seeds[i]
      const p = pts[Math.floor(((a + t * (0.8 + b)) % 1) * (pts.length - 1))]
      const ang = c * 6.283 + t * 3, rr = p.r * 0.55 * Math.sqrt(b)
      fxPos[i * 3] = p.x + Math.cos(ang) * rr; fxPos[i * 3 + 1] = p.y + (((a * 7.3 + b * 3.1) % 1) - 0.5) * 0.009; fxPos[i * 3 + 2] = Math.sin(ang) * rr
    }
    const last = pts[pts.length - 1]
    for (let k = 0; k < NSP; k++) {
      const i = NAB + k, [a, b, c] = seeds[i]
      const ph = (t * (3.1 + b) + a) % 1, life = ph * 0.11
      const v = 0.22 + 0.35 * c, ang = a * 6.283
      const ok = hit
      fxPos[i * 3] = ok ? last.x + Math.cos(ang) * (0.003 + v * 0.6 * life) : 0
      fxPos[i * 3 + 1] = ok ? Math.max(surfY + 0.0005, surfY + v * life - 4.9 * life * life) : -9
      fxPos[i * 3 + 2] = ok ? Math.sin(ang) * (0.003 + v * 0.6 * life) : 0
    }
    fxGeo.attributes.position.needsUpdate = true
  }
  const dripMat = (stream.material as THREE.MeshPhysicalMaterial)
  const DRIPS = [0.22, 0.62, 1.25].map(d => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.0021, 16, 12), dripMat); m.scale.y = 1.35; m.visible = false; scene.add(m); return { d, m } })
  function drips(t: number, surfY: number) {
    for (const { d, m } of DRIPS) {
      const s = t - (T.T_OFF + d)
      const y = T.SPOUT.y - 0.002 - 0.5 * T.G * Math.max(0, s) * Math.max(0, s)
      m.visible = s > -0.12 && y > surfY
      const grow = Math.min(1, (s + 0.12) / 0.12)
      m.scale.setScalar(Math.max(0.01, grow)); m.scale.y *= s > 0 ? 1.5 : 1.15
      m.position.set(T.SPOUT.x, y, 0)
    }
  }
  // straight down out of the spout bore
  const lipOf = (tt: number) => ({ x: T.SPOUT.x, y: T.SPOUT.y - 0.0004, vx: 0, vy: -T.exitSpeed(tt) })
  function buildStream(t: number, surfY: number) {
    const DTAU = 0.0042
    const pts: { x: number; y: number; r: number; tau: number }[] = []
    let started = false
    for (let j = 0; j < 160 && pts.length < SS; j++) {
      const tau = t - j * DTAU
      const q = T.flowAt(tau)
      if (q < T.QMAX * 0.015) { if (started) break; else continue }
      started = true
      const L = lipOf(tau), s = t - tau
      const x = L.x + L.vx * s + s * s * 0.16 * Math.sin(tau * 9.3) + 0.0012 * s * 6 * Math.sin(tau * 31 + s * 18), y = L.y + L.vy * s - 0.5 * T.G * s * s
      const vy = L.vy - T.G * s, sp = Math.hypot(L.vx, vy)
      const r = Math.min(0.0068, Math.sqrt(q / sp / Math.PI)) * 0.95 * (1 + 0.07 * Math.sin(tau * 23) + 0.05 * Math.sin(tau * 57 + 1.3)) * (1 + 0.25 * Math.max(0, 1 - (tau - T.T_ON + 0.06) / 0.12))
      if (y < surfY && Math.abs(x) < GL.innerR(Math.max(surfY, GL.innerBottomY)) - 0.001) { pts.push({ x, y: surfY - 0.002, r, tau }); break }
      pts.push({ x, y, r, tau })
    }
    drips(t, surfY)
    if (pts.length < 2) { stream.visible = false; fxPts.visible = false; return { on: 0, x: 0 } }
    fxPts.visible = true
    stream.visible = true
    const n = new THREE.Vector3(), b = new THREE.Vector3(0, 0, 1), tg = new THREE.Vector3()
    for (let i = 0; i < SS; i++) {
      const k = Math.min(i, pts.length - 1), p = pts[k]
      const p0 = pts[Math.max(k - 1, 0)], p1 = pts[Math.min(k + 1, pts.length - 1)]
      tg.set(p1.x - p0.x, p1.y - p0.y, 0).normalize()
      n.set(-tg.y, tg.x, 0)
      // round the falling head and the fresh tail
      let r = p.r
      if (k === pts.length - 1 && i >= pts.length - 1) r *= 0.0
      if (k === 0) r *= 0.75
      const head = pts.length - 1 - k
      if (head < 3 && pts[pts.length - 1].y > surfY) r *= Math.sqrt(head / 3)
      for (let j = 0; j < SR; j++) {
        const a = (j / SR) * Math.PI * 2
        const age = t - p.tau
        const wob = 1 + (0.05 + age * 0.5) * Math.sin(a * 2 + p.tau * 40 + age * 25) + 0.05 * Math.sin(a * 3 - p.tau * 63) + 0.04 * Math.sin(p.tau * 90)
          // travelling surface ripples (move with the fluid) + fine uneven noise that grows as the stream thins and breaks up
          + (0.045 + age * 0.6) * Math.sin(p.tau * 120 + a) * Math.sin(p.tau * 37 + a * 2 + 1.7) + (0.03 + age * 0.4) * Math.sin(p.tau * 70 - a * 3 + age * 60) + 0.025 * Math.sin(a * 5 + p.tau * 180)
        const ca = Math.cos(a), sa = Math.sin(a)
        const o = (i * SR + j) * 3
        sPos[o] = p.x + (n.x * ca) * r * wob; sPos[o + 1] = p.y + (n.y * ca) * r * wob; sPos[o + 2] = sa * r * wob * 0.92 + (t - p.tau) * (t - p.tau) * 0.12 * Math.sin(p.tau * 7.7 + 1)
        sNor[o] = n.x * ca; sNor[o + 1] = n.y * ca; sNor[o + 2] = sa
      }
    }
    sGeo.attributes.position.needsUpdate = true; sGeo.computeVertexNormals()
    sGeo.computeBoundingSphere()
    const last = pts[pts.length - 1]
    fx(t, pts, last.y <= surfY + 0.0005, surfY)
    return { on: last.y <= surfY + 0.0005 ? 1 : 0, x: last.x }
  }

  /* ---------------- per-frame update */
  const look = new THREE.Vector3()
  const dome = (t: number) => T.mix(0.0022, 0.0105, T.smooth(T.T_OFF - 0.6, T.T_OFF + 1.6, t))
  const divePos = new THREE.Vector3(0.004, 0.104, portrait ? 0.1 : 0.088), diveLook = new THREE.Vector3(0.0, 0.1, 0)
  function update(t: number, dive = 0) {
    // camera (+ the closing push into the beer)
    const c = T.cameraAt(t, portrait)
    const k = T.smoother(0, 1, dive)
    camera.position.set(...c.pos).lerp(divePos, k); look.set(...c.look).lerp(diveLook, k); camera.lookAt(look)
    camera.fov = T.mix(c.fov, 30, k); camera.aspect = W() / H(); camera.updateProjectionMatrix()
    bMat.uniforms.uScale.value = renderer.domElement.height / (2 * Math.tan((camera.fov * Math.PI) / 360))

    // glass contents
    const vb = T.beerVol(t), vf = T.foamVol(t)
    const level = GL.levelFor(vb)
    const top = Math.min(GL.levelFor(vb + vf), GL.rimY - 0.0008)
    const hasBeer = level > GL.innerBottomY + 0.0008
    beer.visible = hasBeer
    if (hasBeer) { beer.geometry.dispose(); beer.geometry = lathe(beerProfile(level), SEG) }
    const cl = T.churnAt(t)
    beerMat.roughness = T.mix(0.08, 0.32, cl)
    beerMat.attenuationDistance = T.mix(qn('ad', 0.06), 0.045, cl)
    const surf = top > level + 0.0005 ? top + dome(t) * 0.5 : level

    // tap handle
    tapRig.lever.rotation.z = T.leverAt(t)

    const imp = buildStream(t, surf)
    if (vf > 1e-7 && top > level + 0.0003) {
      foam.visible = true
      foamU.uBeerY.value = level
      foamU.uWet.value = T.mix(0.003, 0.011, cl)
      foam.geometry.dispose(); foam.geometry = foamGeometry(level, top, dome(t), t, imp)
    } else foam.visible = false
    placeBubbles(t, level)

    const fill = T.clamp((level - GL.innerBottomY) / (GL.rimY - GL.innerBottomY))
    ;(caustic.material as THREE.MeshBasicMaterial).opacity = 0.55 * fill
  }

  const resize = () => renderer.setSize(W(), H(), false)
  const dispose = () => {
    scene.traverse((o) => {
      const m = o as THREE.Mesh
      if (m.geometry) m.geometry.dispose()
      const mats = m.material ? (Array.isArray(m.material) ? m.material : [m.material]) : []
      for (const mat of mats) { for (const v of Object.values(mat)) if (v && (v as THREE.Texture).isTexture) (v as THREE.Texture).dispose(); mat.dispose() }
    })
    scene.environment?.dispose(); pmrem.dispose(); hdr.dispose()
    renderer.dispose(); renderer.forceContextLoss()
  }
  return { renderer, scene, camera, portrait, update, resize, dispose }
}
