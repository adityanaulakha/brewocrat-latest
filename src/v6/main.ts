import { createPour } from './scene'
import { DURATION } from './timeline'
import * as THREE from 'three'
import { BloomEffect, EffectComposer, EffectPass, RenderPass, ToneMappingEffect, ToneMappingMode, VignetteEffect } from 'postprocessing'

const qs = new URLSearchParams(location.search)
const capture = qs.has('capture')
const canvas = document.getElementById('c') as HTMLCanvasElement

createPour(canvas, { capture }).then(({ renderer, scene, camera, update }) => {
  const post = qs.has('post')
  let composer: EffectComposer | undefined
  if (post) {
    renderer.toneMapping = THREE.NoToneMapping
    composer = new EffectComposer(renderer, { frameBufferType: THREE.HalfFloatType, multisampling: Number(qs.get('msaa') ?? 4) })
    composer.addPass(new RenderPass(scene, camera))
    composer.addPass(new EffectPass(camera,
      new BloomEffect({ mipmapBlur: true, intensity: Number(qs.get('bloom') ?? 0.45), luminanceThreshold: 0.82, luminanceSmoothing: 0.18, radius: 0.7 }),
      new ToneMappingEffect({ mode: ToneMappingMode.ACES_FILMIC }),
      new VignetteEffect({ offset: 0.3, darkness: 0.45 }),
    ))
    composer.setSize(innerWidth, innerHeight, false)
  }
  const draw = (t: number) => { update(t); if (composer) composer.render(); else renderer.render(scene, camera) }
  const w = window as any
  if (capture) {
    draw(0); renderer.compile(scene, camera)
    w.__v6 = { ready: true, frame: (t: number) => { draw(t); return true } }
    return
  }
  const t0 = performance.now()
  const loop = () => {
    let t = (performance.now() - t0) / 1000
    if (qs.has('loop')) t %= DURATION + 1.5
    draw(Math.min(t, DURATION))
    requestAnimationFrame(loop)
  }
  addEventListener('resize', () => { renderer.setSize(innerWidth, innerHeight, false); composer?.setSize(innerWidth, innerHeight, false) })
  w.__v6 = { ready: true }
  loop()
}).catch((e) => { console.error(e); (window as any).__v6err = String(e?.stack || e) })
