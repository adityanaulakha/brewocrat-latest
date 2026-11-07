import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { moments } from '../data/content'
import { Icon, Reveal, SplitHeading, ease } from './ui'
import Backdrop from './Backdrop'
import { rs } from '../lib/img'

export default function Moments({ onBook }: { onBook: (n?: string) => void }) {
  const [a, setA] = useState(1)
  return (
    <section id="moments" className="t-ivory relative overflow-hidden bg-ink py-14 lg:py-20">
      <Backdrop src="/images/backdrops/moments.webp" srcSet="/images/backdrops/moments-800w.webp 800w, /images/backdrops/moments.webp 1200w" tone="light" />
      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10">
        <div className="text-center">
          <Reveal><span className="eyebrow">Family · Corporate · DJ Sets · Gatherings · Parties</span></Reveal>
          <SplitHeading text="Moments at" accent="Brewocrat" className="mt-3 font-display text-4xl font-bold uppercase text-foam sm:text-6xl" />
        </div>

        {/* desktop: expanding slats */}
        <div className="mt-8 hidden h-[460px] gap-3 lg:flex">
          {moments.map((m, i) => {
            const on = a === i
            return (
              <motion.div key={m.title} onMouseEnter={() => setA(i)} onClick={() => setA(i)}
                animate={{ flexGrow: on ? 5 : 1 }} transition={{ duration: 1.1, ease: [0.25, 0.1, 0.25, 1] }} style={{ flexBasis: 0 }}
                className="relative cursor-pointer overflow-hidden rounded-2xl border border-brass/15">
                <motion.img src={m.image} {...rs(m.image, '60vw')} alt={m.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover"
                  animate={{ scale: on ? 1.04 : 1.2, filter: on ? 'saturate(1) brightness(.85)' : 'saturate(.5) brightness(.45)' }} transition={{ duration: 1.2, ease }} />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                <AnimatePresence>
                  {!on && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col items-center justify-between py-8">
                      <span className="font-display text-xl text-brass">0{i + 1}</span>
                      <span className="font-display text-lg uppercase tracking-[0.25em] text-foam [writing-mode:vertical-rl] rotate-180">{m.title}</span>
                      <span className="h-8 w-px bg-brass/50" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {on && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9, delay: 0.35, ease }}
                      className="absolute inset-x-0 bottom-0 max-w-2xl p-10">
                      <span className="font-display text-xl text-brass">0{i + 1}</span>
                      <h3 className="mt-2 font-display text-5xl font-bold uppercase italic tracking-[0.03em] text-foam">{m.title}</h3>
                      <p className="mt-1 font-display text-xl italic text-honey/90">{m.subtitle}</p>
                      <p className="mt-4 font-sans text-sm leading-relaxed text-foam/75">{m.desc}</p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {m.features.map((f) => <span key={f} className="flex items-center gap-1.5 border-b border-brass/25 pb-1 pr-3 font-sans text-[11px] tracking-[0.04em] text-foam/80"><Icon.Check className="h-3 w-3 text-brass" />{f}</span>)}
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); onBook(m.cta) }} className="btn-gold mt-6">{m.cta} <Icon.Arrow /></button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        {/* mobile: swipe cards */}
        <div className="-mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 no-scrollbar lg:hidden">
          {moments.map((m, i) => (
            <article key={m.title} className="relative h-[460px] w-[84vw] max-w-[380px] shrink-0 snap-center overflow-hidden rounded-2xl border border-brass/15">
              <img src={m.image} {...rs(m.image, '90vw')} alt={m.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/10" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <span className="font-display text-lg text-brass">0{i + 1}</span>
                <h3 className="font-display text-3xl font-semibold uppercase italic text-foam">{m.title}</h3>
                <p className="font-display text-lg italic text-honey/90">{m.subtitle}</p>
                <p className="mt-3 font-sans text-[13px] leading-relaxed text-foam/75">{m.desc}</p>
                <ul className="mt-3 space-y-1">{m.features.map((f) => <li key={f} className="flex items-center gap-2 font-sans text-xs text-foam/80"><Icon.Check className="h-3 w-3 text-brass" />{f}</li>)}</ul>
                <button onClick={() => onBook(m.cta)} className="btn-gold mt-5 w-full">{m.cta}</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
