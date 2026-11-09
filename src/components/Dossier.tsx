import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { brewhouse } from '../data/extracted'
import { dossier, socialServes } from '../data/content'
import { Icon, Reveal, SplitHeading, ease } from './ui'
import { rs } from '../lib/img'

export default function Dossier({ onBook }: { onBook: (note?: string) => void }) {
  const [sel, setSel] = useState(0)
  const b = brewhouse[sel]
  return (
    <section id="brewhouse" className="t-red wood grain relative overflow-hidden py-8 sm:py-12 lg:py-20">
      <div className="relative mx-auto max-w-7xl px-6 sm:px-10">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <Reveal><span className="eyebrow">{dossier.eyebrow}</span></Reveal>
            <SplitHeading text="The Tap" accent="Dossier" className="mt-3 font-display text-[2rem] font-bold leading-[1.05] text-foam sm:text-5xl" />
          </div>
          <Reveal delay={0.1}><p className="max-w-md font-sans text-sm leading-relaxed text-foam/65">{dossier.desc}</p></Reveal>
        </div>

        <div className="mt-12 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {brewhouse.map((x, i) => (
            <button key={x.id} onClick={() => setSel(i)} className={`shrink-0 rounded-full border px-5 py-2.5 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-500 ${i === sel ? 'border-brass/80 text-honey' : 'border-foam/10 text-foam/55 hover:border-brass/40 hover:text-foam'}`}>
              {x.name}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={b.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease }}
            className="lift mt-6 grid overflow-hidden rounded-2xl bg-cask lg:mt-8 lg:grid-cols-2">
            <div className="relative min-h-[200px] overflow-hidden sm:min-h-[280px]">
              <motion.img src={b.image} {...rs(b.image, '(min-width: 1024px) 40vw, 100vw')} loading="lazy" alt={b.name} className="absolute inset-0 h-full w-full object-cover" initial={{ scale: 1.02 }} animate={{ scale: 1 }} transition={{ duration: 1.4, ease }} />
              <div className="photo-fade pointer-events-none absolute inset-0 lg:bg-none" />
              <div className="absolute bottom-5 left-5 flex flex-wrap gap-2">
                {[b.abv, b.ibu, b.temp].map((t) => <span key={t} className="border border-honey/30 bg-ink/50 px-3 py-1.5 font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-honey">{t}</span>)}
              </div>
            </div>
            <div className="p-7 sm:p-10">
              <div className="font-sans text-[11px] uppercase tracking-[0.3em] text-brass">{b.category}</div>
              <h3 className="mt-3 font-display text-4xl font-bold text-foam sm:text-5xl">{b.name}</h3>
              <p className="mt-1 font-display text-lg italic text-honey/80">{b.color}</p>
              <p className="mt-5 font-sans text-sm leading-relaxed text-foam/70">{b.flavor}</p>
              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <div><div className="eyebrow !text-[10px]">{dossier.notesLabel}</div><p className="mt-2 font-sans text-sm text-foam/75">{b.notes}</p></div>
                <div><div className="eyebrow !text-[10px]">{dossier.pairingsLabel}</div><p className="mt-2 font-sans text-sm text-foam/75">{b.pairings}</p></div>
              </div>
              <button onClick={() => onBook(`${dossier.cta}: ${b.name}`)} className="btn-gold mt-8">{dossier.cta} <Icon.Arrow /></button>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-12">
          <div className="text-center">
            <Reveal><span className="eyebrow">{socialServes.eyebrow}</span></Reveal>
            <SplitHeading text="Tabletop" accent="social formats" className="mt-3 font-display text-[2rem] font-bold leading-[1.05] text-foam sm:text-5xl" />
            <Reveal delay={0.1}><p className="mx-auto mt-4 max-w-xl font-sans text-sm text-foam/60">{socialServes.desc}</p></Reveal>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {socialServes.items.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.12}>
                <article className="lift t-olive group relative h-[280px] overflow-hidden rounded-2xl border border-brass/15 sm:h-[320px]">
                  <img src={s.image} {...rs(s.image, '(min-width: 768px) 45vw, 100vw')} alt={s.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                  <div className="photo-fade pointer-events-none absolute inset-0" />
                  <div className="absolute inset-x-0 bottom-0 p-7 sm:p-9">
                    <span className="eyebrow">{s.eyebrow}</span>
                    <h4 className="mt-3 font-display text-3xl font-bold text-foam sm:text-4xl">{s.title}</h4>
                    <p className="mt-3 max-w-md font-sans text-sm leading-relaxed text-foam/70">{s.desc}</p>
                    <button onClick={() => onBook(s.cta)} className="btn-line mt-6">
                      {s.cta} <span className="transition-transform duration-300 group-hover:translate-x-1.5"><Icon.Arrow /></span>
                    </button>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
