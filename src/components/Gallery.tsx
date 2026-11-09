import { useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { gallery } from '../data/extracted'
import { galleryCopy, interiors } from '../data/content'
import { Icon, Reveal, SplitHeading } from './ui'
import { rs } from '../lib/img'

const items = [
  ...gallery.map((g) => ({ src: g.src, title: g.title })),
  ...interiors.map((src) => ({ src, title: 'Brewocrat Gallery' })),
  ...['/images/meat_platter_wings.webp', '/images/maindish1.webp', '/images/appetizers1.webp', '/images/dessert1.webp'].map((src) => ({ src, title: 'Brewocrat Kitchen Delights' })),
]

const FAN_COUNT = 7
const fanDeck = items.filter((_, i) => i % 2 === 0).slice(0, FAN_COUNT)

type FanLayout = {
  cardW: number
  cardH: number
  step: number
  drop: number
  rise: number
  tilt: number
}

/** Fit a shallow, even arc inside the stage. Edges may kiss the sides; they do not leave the viewport. */
function layoutFor(width: number): FanLayout {
  const n = fanDeck.length
  const tilt = 6
  const stepRatio = 0.8
  const theta = (tilt * Math.PI) / 180
  const extra = 2 * (7 / 5) * Math.sin(theta)
  const factor = 1 + (n - 1) * stepRatio + extra
  const cardW = Math.min(200, Math.max(112, (width - 8) / factor))
  const cardH = cardW * (7 / 5)
  const rise = Math.ceil((cardW / 2) * Math.sin(theta) + 12)
  return {
    cardW,
    cardH,
    step: cardW * stepRatio,
    drop: Math.round(cardH * 0.065),
    rise,
    tilt,
  }
}

function Fan({ onOpen }: { onOpen: (i: number) => void }) {
  const stage = useRef<HTMLDivElement>(null)
  const [layout, setLayout] = useState<FanLayout>(() => layoutFor(1024))

  useLayoutEffect(() => {
    const el = stage.current
    if (!el) return
    const measure = () => setLayout(layoutFor(el.clientWidth))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const n = fanDeck.length
  const maxC = (n - 1) / 2
  const stageH = layout.rise + layout.cardH + layout.drop + 16

  return (
    <div ref={stage} className="relative mx-auto mt-8 hidden w-full max-w-[1440px] overflow-hidden md:block" style={{ height: stageH }}>
      {fanDeck.map((g, k) => {
        const c = k - maxC
        const t = maxC === 0 ? 0 : c / maxC
        const arcY = t * t * layout.drop
        /* 2D only. No translateZ, and the z-index stays inside the isolated section. */
        const transform = `translate(${c * layout.step}px, ${arcY}px) rotate(${t * layout.tilt}deg)`
        return (
          <div
            key={g.src}
            className="absolute origin-bottom"
            style={{
              width: layout.cardW,
              height: layout.cardH,
              left: '50%',
              top: layout.rise,
              marginLeft: -layout.cardW / 2,
              transform,
              zIndex: 1 + Math.round(maxC - Math.abs(c)),
            }}
          >
            <button
              type="button"
              aria-label={g.title}
              onClick={() => onOpen(items.indexOf(g))}
              className="h-full w-full overflow-hidden rounded-[18px] bg-cask shadow-[0_18px_36px_-16px_rgba(20,4,2,.6)] ring-1 ring-[#DEB258]/40"
            >
              <img src={g.src} {...rs(g.src, `${Math.round(layout.cardW)}px`)} alt={g.title} loading="lazy" className="h-full w-full object-cover" />
              <div className="photo-fade pointer-events-none absolute inset-0 opacity-70" />
              <span className="pointer-events-none absolute inset-2 rounded-[12px] border border-[#F3D79A]/30" />
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default function Gallery() {
  const [open, setOpen] = useState<number | null>(null)
  const [all, setAll] = useState(false)
  const [reduce] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)

  return (
    <section id="gallery" className="t-red relative overflow-x-clip bg-ink px-5 pb-14 pt-28 sm:px-8 sm:pb-16 sm:pt-28 lg:px-10 lg:pb-20" style={{ isolation: 'isolate', zIndex: 0 }}>
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(60% 50% at 50% 55%, rgba(212,166,74,.14), transparent 68%)' }} />
      <div className="relative mx-auto w-full max-w-6xl text-center">
        <Reveal><span className="eyebrow">{galleryCopy.eyebrow}</span></Reveal>
        <SplitHeading text={galleryCopy.title[0].trim()} accent={galleryCopy.title[1]} className="mt-3 font-display text-[2rem] font-bold leading-[1.05] text-foam sm:text-5xl" />
        <Reveal delay={0.05}><p className="mx-auto mt-3 max-w-md font-sans text-sm leading-relaxed text-foam/75">{galleryCopy.desc}</p></Reveal>

        <div className="mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-3 no-scrollbar md:hidden">
          {fanDeck.map((g) => (
            <button
              key={g.src}
              type="button"
              aria-label={g.title}
              onClick={() => setOpen(items.indexOf(g))}
              className="aspect-[5/7] w-36 shrink-0 snap-start overflow-hidden rounded-[18px] bg-cask shadow-[0_16px_32px_-16px_rgba(20,4,2,.55)] ring-1 ring-[#DEB258]/40"
            >
              <img src={g.src} {...rs(g.src, '144px')} alt={g.title} loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>

        <Fan onOpen={setOpen} />
        <button type="button" onClick={() => setAll(true)} className="btn-gold mt-8">Explore experience <Icon.Arrow /></button>
      </div>

      {createPortal(
        <AnimatePresence>
          {all && (
            <motion.div className="fixed inset-0 z-[1100] overflow-y-auto bg-[#1C1E10]/95 p-4 pt-20 sm:p-10 sm:pt-24" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} data-lenis-prevent>
              <button aria-label="Close gallery" onClick={() => setAll(false)} className="fixed right-5 top-5 z-10 grid h-11 w-11 place-items-center rounded-full border border-foam/25 bg-black/30 text-foam"><Icon.Close /></button>
              <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {items.map((g, i) => (
                  <button key={`${g.src}-${i}`} type="button" onClick={() => setOpen(i)} className="overflow-hidden rounded-2xl shadow-[0_16px_32px_-18px_rgba(20,4,2,.55)]">
                    <img src={g.src} {...rs(g.src, '(min-width: 1024px) 25vw, 50vw')} alt={g.title} loading="lazy" className="aspect-[4/5] w-full object-cover" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}

      {createPortal(
        <AnimatePresence>
          {open !== null && (
            <motion.div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/92 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)}>
              <motion.img key={open} src={items[open].src} alt={items[open].title} className="max-h-[82vh] max-w-full rounded-2xl object-contain shadow-[0_24px_50px_-20px_rgba(0,0,0,.65)]" initial={reduce ? false : { scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: reduce ? 0 : 0.3 }} onClick={(e) => e.stopPropagation()} />
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-display text-xl text-foam">{items[open].title}</div>
              <button aria-label="Close" className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-foam/20 text-foam"><Icon.Close /></button>
              <button aria-label="Previous" onClick={(e) => { e.stopPropagation(); setOpen((open - 1 + items.length) % items.length) }} className="absolute left-4 grid h-11 w-11 place-items-center rounded-full border border-foam/20 text-foam"><Icon.Left /></button>
              <button aria-label="Next" onClick={(e) => { e.stopPropagation(); setOpen((open + 1) % items.length) }} className="absolute right-4 grid h-11 w-11 place-items-center rounded-full border border-foam/20 text-foam"><Icon.Right /></button>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </section>
  )
}
