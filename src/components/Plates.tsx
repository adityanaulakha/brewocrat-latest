import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { plates } from '../data/content'
import { Icon, Reveal, SplitHeading, ease } from './ui'
import { rs } from '../lib/img'

export default function Plates({ onBook }: { onBook: (n?: string) => void }) {
  const [i, setI] = useState(4)
  const [paused, setPaused] = useState(false)
  const n = plates.length
  const p = plates[i]
  const touch = useRef(0)
  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setI((x) => (x + 1) % n), 5200)
    return () => clearInterval(t)
  }, [paused, n])
  const go = (d: number) => setI((x) => (x + d + n) % n)

  return (
    <section id="plates" className="t-red relative overflow-hidden bg-gradient-to-b from-ink via-cask to-ink py-14 lg:py-20"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="pointer-events-none absolute inset-0 opacity-30" style={{ background: 'radial-gradient(50% 40% at 50% 50%, rgba(181,72,42,.10), transparent 70%)' }} />
      <div className="relative mx-auto max-w-7xl px-6 sm:px-10">
        <div className="text-center">
          <Reveal><span className="eyebrow">The Kitchen · Chef’s specials</span></Reveal>
          <SplitHeading text="Signature" accent="plates." className="mt-3 font-display text-4xl font-bold text-foam sm:text-6xl" />
        </div>

        <div className="relative mt-8 flex h-[340px] items-center justify-center sm:h-[440px]"
          onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
          onTouchEnd={(e) => { const d = e.changedTouches[0].clientX - touch.current; if (Math.abs(d) > 40) go(d < 0 ? 1 : -1) }}>
          {plates.map((pl, k) => {
            let off = k - i
            if (off > n / 2) off -= n
            if (off < -n / 2) off += n
            const abs = Math.abs(off)
            return (
              <motion.button key={pl.title} onClick={() => setI(k)} aria-label={pl.title}
                className="absolute aspect-square w-[230px] rounded-full sm:w-[340px]"
                animate={{ x: `${off * 62}%`, scale: abs === 0 ? 1 : abs === 1 ? 0.55 : 0.35, opacity: abs > 2 ? 0 : abs === 0 ? 1 : abs === 1 ? 0.55 : 0.2, rotate: 0, zIndex: 10 - abs }}
                transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1] }}>
                <div className="relative h-full w-full overflow-hidden rounded-full border border-brass/35 p-2 shadow-[0_40px_80px_-30px_rgba(40,30,15,.45)]">
                  <img src={pl.image} {...rs(pl.image, '(min-width: 640px) 340px, 230px')} alt={pl.title} className="h-full w-full rounded-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/10" />
                </div>
              </motion.button>
            )
          })}
          <button onClick={() => go(-1)} aria-label="Previous plate" className="absolute left-0 z-20 grid h-12 w-12 place-items-center rounded-full border border-brass/30 bg-ink/40 text-foam/80 transition-colors duration-500 hover:border-brass hover:text-brass sm:left-8"><Icon.Left /></button>
          <button onClick={() => go(1)} aria-label="Next plate" className="absolute right-0 z-20 grid h-12 w-12 place-items-center rounded-full border border-brass/30 bg-ink/40 text-foam/80 transition-colors duration-500 hover:border-brass hover:text-brass sm:right-8"><Icon.Right /></button>
        </div>

        <div className="mt-8 text-center">
          <AnimatePresence mode="wait">
            <motion.div key={p.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.5, ease }}>
              <div className="font-sans text-[11px] uppercase tracking-[0.3em] text-brass">{p.category}</div>
              <h3 className="mt-3 font-display text-3xl font-bold uppercase tracking-[0.06em] text-foam sm:text-5xl">{p.title}</h3>
              <div className="mt-2 font-display text-2xl text-honey">{p.price}</div>
            </motion.div>
          </AnimatePresence>
          <div className="mt-6 flex justify-center gap-2">
            {plates.map((_, k) => <button key={k} aria-label={`Plate ${k + 1}`} onClick={() => setI(k)} className={`h-px transition-all duration-700 ${k === i ? 'w-10 bg-brass' : 'w-5 bg-brass/25'}`} />)}
          </div>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button onClick={() => onBook(`Book table to taste: ${p.title}`)} className="btn-gold">Book table to taste <Icon.Arrow /></button>
            <Link to="/menu" className="btn-ghost">Full menu</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
