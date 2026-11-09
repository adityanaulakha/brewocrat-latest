import { useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useScroll, useTransform, type MotionValue, type Variants } from 'framer-motion'
import { gallery } from '../data/extracted'
import { galleryCopy, interiors } from '../data/content'
import { Icon } from './ui'
import { rs } from '../lib/img'

/** Production journal entrance. Other sections keep the shorter Meeting 2 reveal. */
function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }} transition={{ duration: 1.4, delay, ease: [0.25, 0.1, 0.25, 1] }}>
      {children}
    </motion.div>
  )
}

const wordV: Variants = { hidden: { opacity: 0, y: 8 }, show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 1.4, delay: i * 0.05, ease: [0.25, 0.1, 0.25, 1] } }) }

/** Production journal heading: accent words stay in Dancing Script. */
function SplitHeading({ text, className = '', accent }: { text: string; className?: string; accent?: string }) {
  const words = text.split(' ')
  const accWords = accent ? accent.split(' ') : []
  const all = [...words.map((w) => ({ w, a: false })), ...accWords.map((w) => ({ w, a: true }))]
  return (
    <h2 className={className}>
      <motion.span className="inline" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>
        {all.map(({ w, a }, i) => (
          <span key={i} className="inline-block pb-[0.08em] align-bottom">
            <motion.span custom={i} variants={wordV} className={`inline-block ${a ? 'gold-text italic' : ''}`}>{w}&nbsp;</motion.span>
          </span>
        ))}
      </motion.span>
    </h2>
  )
}

const items = [
  ...gallery.map((g) => ({ src: g.src, title: g.title })),
  ...interiors.map((src) => ({ src, title: 'Brewocrat Gallery' })),
  ...['/images/meat_platter_wings.webp', '/images/maindish1.webp', '/images/appetizers1.webp', '/images/dessert1.webp'].map((src) => ({ src, title: 'Brewocrat Kitchen Delights' })),
]

/** Gift-card fan: a stack of photo cards deals out into a fanned hand as the section scrolls in. */
function FanCard({ g, k, n, p, onOpen, mobile }: { g: (typeof items)[number]; k: number; n: number; p: MotionValue<number>; onOpen: () => void; mobile: boolean }) {
  const c = k - (n - 1) / 2
  const spread = mobile ? 34 : 128, tilt = mobile ? 7 : 6.5
  const x = useTransform(p, (v) => c * spread * v)
  const rotate = useTransform(p, (v) => c * tilt * v + (1 - v) * ((k % 3) - 1) * 4)
  const y = useTransform(p, (v) => Math.abs(c) * Math.abs(c) * (mobile ? 3.2 : 5) * v + (1 - v) * k * -2)
  return (
    <motion.button style={{ x, y, rotate, zIndex: 50 - Math.round(Math.abs(c) * 2) }} onClick={onOpen} aria-label={g.title}
      whileHover={{ y: -26, scale: 1.04, zIndex: 60 }}
      className="absolute left-1/2 top-0 -ml-[70px] aspect-[5/7] w-[140px] origin-bottom overflow-hidden rounded-[18px] bg-cask shadow-[0_24px_50px_-18px_rgba(20,4,2,.75)] ring-1 ring-[#DEB258]/40 sm:-ml-[105px] sm:w-[210px]">
      <img src={g.src} {...rs(g.src, '(min-width: 640px) 210px, 140px')} alt={g.title} loading="lazy" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-white/5" />
      <span className="absolute inset-2 rounded-[12px] border border-[#F3D79A]/30" />
    </motion.button>
  )
}

export default function Gallery() {
  const ref = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState<number | null>(null)
  const [all, setAll] = useState(false)
  const [mobile] = useState(() => innerWidth < 640)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  const p = useTransform(scrollYProgress, (v) => { const k = Math.min(1, Math.max(0, (v - 0.15) / 0.75)); return 1 - Math.pow(1 - k, 3) })
  const deck = items.filter((_, i) => i % 2 === 0).slice(0, mobile ? 7 : 9)

  return (
    <section id="gallery" className="t-red relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-ink py-12 lg:py-14">
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(60% 50% at 50% 60%, rgba(212,166,74,.16), transparent 70%)' }} />
      <div className="relative mx-auto w-full max-w-6xl px-5 text-center sm:px-10">
        <Reveal><span className="eyebrow">{galleryCopy.eyebrow}</span></Reveal>
        <SplitHeading text={galleryCopy.title[0].trim()} accent={galleryCopy.title[1]} className="mt-3 font-display text-[2rem] font-bold text-foam sm:text-5xl" />
        <Reveal delay={0.1}><p className="mx-auto mt-3 max-w-md font-sans text-sm leading-relaxed text-foam/75">{galleryCopy.desc}</p></Reveal>
        <div ref={ref} className="relative mx-auto mt-10 h-[250px] sm:h-[360px]">
          {deck.map((g, k) => <FanCard key={g.src} g={g} k={k} n={deck.length} p={p} mobile={mobile} onOpen={() => setOpen(items.indexOf(g))} />)}
        </div>
        <button onClick={() => setAll(true)} className="btn-gold mt-6 shadow-none hover:shadow-none">Explore experience <Icon.Arrow /></button>
      </div>

      {createPortal(<AnimatePresence>
        {all && (
          <motion.div className="fixed inset-0 z-[1100] overflow-y-auto bg-[#2a0c06]/95 p-4 pt-20 backdrop-blur sm:p-10 sm:pt-24" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} data-lenis-prevent>
            <button aria-label="Close gallery" onClick={() => setAll(false)} className="fixed right-5 top-5 z-10 grid h-11 w-11 place-items-center rounded-full border border-foam/25 bg-black/30 text-foam"><Icon.Close /></button>
            <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((g, i) => (
                <motion.button key={g.src} onClick={() => setOpen(i)} initial={{ opacity: 0, y: 20, rotate: (i % 3 - 1) * 4 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ delay: Math.min(i, 12) * 0.03, duration: 0.5 }}
                  className="overflow-hidden rounded-2xl"><img src={g.src} {...rs(g.src, '(min-width: 1024px) 25vw, 50vw')} alt={g.title} loading="lazy" className="aspect-[4/5] w-full object-cover" /></motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>, document.body)}

      {createPortal(<AnimatePresence>
        {open !== null && (
          <motion.div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/90 p-4 backdrop-blur" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)}>
            <motion.img key={open} src={items[open].src} alt={items[open].title} className="max-h-[82vh] max-w-full rounded-2xl object-contain" initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }} onClick={(e) => e.stopPropagation()} />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-display text-xl text-foam">{items[open].title}</div>
            <button aria-label="Close" className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-foam/20 text-foam"><Icon.Close /></button>
            <button aria-label="Previous" onClick={(e) => { e.stopPropagation(); setOpen((open - 1 + items.length) % items.length) }} className="absolute left-4 grid h-11 w-11 place-items-center rounded-full border border-foam/20 text-foam"><Icon.Left /></button>
            <button aria-label="Next" onClick={(e) => { e.stopPropagation(); setOpen((open + 1) % items.length) }} className="absolute right-4 grid h-11 w-11 place-items-center rounded-full border border-foam/20 text-foam"><Icon.Right /></button>
          </motion.div>
        )}
      </AnimatePresence>, document.body)}
    </section>
  )
}
