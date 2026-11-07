import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { taps, tapNotes } from '../data/content'
import { Icon, Reveal, SplitHeading } from './ui'
import Backdrop from './Backdrop'
import { rs } from '../lib/img'

const calm = [0.25, 0.1, 0.25, 1] as const

/**
 * The microbrewery, on screen two: the four house beers as four glasses in a row (a swipe carousel on
 * phones). Tap one for its notes. Ivory Warm ground, per meeting 1.
 */
export default function Taps({ onBook }: { onBook: () => void }) {
  const [i, setI] = useState(0)
  const beer = taps[i]
  return (
    <section id="taps" className="t-ivory relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-ink py-12 lg:py-14">
      <Backdrop src="/images/backdrops/taps.webp" srcSet="/images/backdrops/taps-800w.webp 800w, /images/backdrops/taps.webp 1200w" tone="light" />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-10">
        <div className="text-center">
          <Reveal><span className="eyebrow">The microbrewery · Brewed on-site · No preservatives</span></Reveal>
          <SplitHeading text="Four house taps." accent="Poured to the brim." className="mt-3 font-display text-[2rem] font-bold leading-[1.05] text-foam sm:text-5xl" />
        </div>

        <div className="-mx-5 mt-7 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 no-scrollbar sm:mx-0 sm:grid sm:grid-cols-4 sm:gap-5 sm:overflow-visible sm:px-0">
          {taps.map((t, k) => (
            <motion.button key={t.id} onClick={() => setI(k)} aria-pressed={k === i}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.9, delay: k * 0.08, ease: calm }}
              className={`group relative w-[62vw] max-w-[240px] shrink-0 snap-center overflow-hidden rounded-[22px] text-left transition-shadow duration-500 sm:w-auto sm:max-w-none ${k === i ? 'shadow-[0_24px_50px_-24px_rgba(90,30,15,.65)] ring-2 ring-[#8F2E1C]' : 'ring-1 ring-[#8F2E1C]/15'}`}>
              <div className="relative aspect-[3/4] overflow-hidden bg-cask">
                <img src={t.image} {...rs(t.image, '(min-width: 640px) 25vw, 62vw')} alt={t.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-[1.05]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3a120b]/85 via-transparent to-transparent" />
                <span className="absolute left-3 top-3 rounded-full bg-[#F6E9D2]/90 px-2.5 py-1 font-sans text-[10px] font-semibold tracking-[0.18em] text-[#8F2E1C]">TAP 0{k + 1}</span>
                <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4">
                  <div className="font-display text-lg font-bold leading-tight text-[#F8ECD6] sm:text-xl">{t.title.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}</div>
                  <div className="mt-0.5 font-sans text-[11px] italic text-[#ECCC8A]">{tapNotes[t.id]} · {t.abv}</div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="mt-6 flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
          <AnimatePresence mode="wait">
            <motion.dl key={beer.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: calm }}
              className="flex items-center divide-x divide-[#8F2E1C]/20 rounded-full border border-[#8F2E1C]/20 bg-cask/60 px-2 py-2">
              <span className="px-4 font-display text-base font-bold text-foam">{beer.title.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}</span>
              {[['ABV', beer.abv], ['IBU', beer.ibu], ['Pour', beer.temp]].map(([k, v]) => (
                <div key={k} className="px-4 text-center"><dd className="font-display text-base font-bold text-foam">{v}</dd><dt className="font-sans text-[9px] uppercase tracking-[0.25em] text-foam/60">{k}</dt></div>
              ))}
            </motion.dl>
          </AnimatePresence>
          <button onClick={onBook} className="btn-gold">Reserve a table to taste <Icon.Arrow className="h-3.5 w-3.5" /></button>
        </div>
      </div>
    </section>
  )
}
