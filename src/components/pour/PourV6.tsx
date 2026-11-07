import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { pour } from './state'
import { createPour, type Ctx } from '../../v6/scene'

/** Pour v6 (brass draft tap + real CC0 weizen glass, see CREDITS.md) driven by the preloader's GSAP timeline:
 *  pour.time → scene time, pour.dive → closing push into the beer. Renders only when those change,
 *  on the GSAP ticker (so it is always in step with the timeline), and stops once the screen is covered. */
export default function PourV6({ mobile, onReady }: { mobile: boolean; onReady: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    let alive = true
    let ctx: Ctx | undefined
    let last = ''
    const draw = () => {
      if (!ctx || pour.time > 8.2) return // fully covered by the amber/dark overlays from here on
      const key = pour.time.toFixed(4) + '|' + pour.dive.toFixed(4)
      if (key === last) return
      last = key
      ctx.update(Math.min(pour.time, 8.2), pour.dive)
      ctx.renderer.render(ctx.scene, ctx.camera)
    }
    const onResize = () => { if (ctx) { ctx.resize(); last = ''; draw() } }
    createPour(ref.current!, { capture: false, maxDpr: 2, lite: mobile }).then((c) => {
      if (!alive) { c.dispose(); return }
      ctx = c
      c.renderer.compile(c.scene, c.camera)
      draw()
      gsap.ticker.add(draw)
      addEventListener('resize', onResize)
      let n = 0
      const tick = () => { if (!alive) return; if (++n >= 2) onReady(); else requestAnimationFrame(tick) }
      requestAnimationFrame(tick)
    }).catch((e) => console.error('pour v6 failed', e))
    return () => {
      alive = false
      gsap.ticker.remove(draw)
      removeEventListener('resize', onResize)
      ctx?.dispose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <canvas ref={ref} className="absolute inset-0 block h-full w-full" />
}
