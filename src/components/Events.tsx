import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { events } from '../data/extracted'
import { contact, eventsCopy } from '../data/content'
import { backdropSlots } from '../data/backdrops'
import { Icon, Reveal, SplitHeading, ease } from './ui'
import { rs } from '../lib/img'
import Backdrop from './Backdrop'

export default function Events({ onBook }: { onBook: (n?: string) => void }) {
  const [sel, setSel] = useState(2)
  const e = events[sel]
  return (
    <section id="events" className="t-red wood grain relative overflow-x-hidden py-8 sm:py-12 lg:py-20">
      <Backdrop slot={backdropSlots.events} />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-10">
        <div className="grid gap-4 lg:grid-cols-2 lg:items-end lg:gap-8">
          <div>
            <Reveal><span className="eyebrow">{eventsCopy.eyebrow}</span></Reveal>
            <SplitHeading text={eventsCopy.title[0].trim()} accent={eventsCopy.title[1]} className="mt-3 font-display text-[2rem] font-bold leading-[1.05] text-foam sm:text-5xl" />
          </div>
          <Reveal delay={0.1}><p className="font-sans text-sm leading-relaxed text-foam/80 lg:pb-2">{eventsCopy.desc}</p></Reveal>
        </div>

        {/* Phone: one short card per night. Wed / Thu / Fri sit in the first screen. */}
        <div className="mt-5 space-y-2.5 lg:hidden">
          {events.map((x) => (
            <article key={x.id} className="lift grid grid-cols-[88px_minmax(0,1fr)] items-center gap-3 rounded-2xl border border-brass/20 bg-ink/40 p-2">
              <img src={x.image} {...rs(x.image, '88px')} alt="" className="h-[88px] w-[88px] rounded-xl object-cover" />
              <div className="min-w-0 py-1 pr-1">
                <div className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-brass">{x.shortDay} · {x.time}</div>
                <h3 className="mt-0.5 font-display text-[1.05rem] font-bold leading-tight text-foam">{x.title}</h3>
                <p className="mt-0.5 truncate font-sans text-[12px] text-foam/70">{x.artist}</p>
                <button type="button" onClick={() => onBook(`Reserve for ${x.title} (${x.day})`)} className="mt-1.5 font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-honey">
                  Reserve
                </button>
              </div>
            </article>
          ))}
          <a href={contact.whatsapp} target="_blank" rel="noreferrer" className="btn-ghost mt-2 w-full"><Icon.WhatsApp /> Lineup on WhatsApp</a>
        </div>

        <div className="mt-10 hidden lg:block">
          <div className="grid grid-cols-6 gap-2">
            {events.map((x, i) => (
              <button key={x.id} type="button" onClick={() => setSel(i)} className={`relative rounded-2xl border px-3 py-4 text-center transition-colors duration-300 ${i === sel ? 'border-brass/70 bg-brass/[.08] shadow-[0_12px_28px_-18px_rgba(28,30,16,.7)]' : 'border-foam/10 hover:border-brass/35'}`}>
                <div className={`font-display text-2xl ${i === sel ? 'text-brass' : 'text-foam'}`}>{x.shortDay}</div>
                <div className="mt-1 font-sans text-[10px] uppercase tracking-[0.15em] text-foam/70">{x.time.split(' ').slice(0, 2).join(' ')}</div>
                {'featured' in x && x.featured && <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-brass px-2 py-0.5 font-sans text-[8px] font-bold uppercase tracking-wider text-oak">Headliner</span>}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={e.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease }}
              className="lift mt-6 grid w-full max-w-full overflow-hidden rounded-2xl border border-brass/20 bg-cask lg:grid-cols-[1.1fr_1fr]">
              <div className="relative min-h-[280px] overflow-hidden">
                <motion.img src={e.image} {...rs(e.image, '50vw')} loading="lazy" alt={e.title} className="absolute inset-0 h-full w-full object-cover" initial={{ scale: 1.04 }} animate={{ scale: 1 }} transition={{ duration: 1.6, ease }} />
                <div className="photo-fade pointer-events-none absolute inset-0" />
                <span className="absolute left-5 top-5 border border-honey/40 bg-[#1C1E10]/55 px-3 py-1.5 font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-honey">{e.badge}</span>
              </div>
              <div className="min-w-0 p-8 xl:p-10">
                <div className="font-sans text-[11px] uppercase tracking-[0.3em] text-brass">{e.day} · {e.time}</div>
                <h3 className="mt-3 break-words font-display text-4xl font-bold leading-tight text-foam">{e.title}</h3>
                <p className="mt-1 font-display text-lg text-honey/90">{e.artist}</p>
                <p className="mt-4 font-sans text-sm leading-relaxed text-foam/80">{e.desc}</p>
                <dl className="mt-5 space-y-2 border-t border-brass/15 pt-4 font-sans text-sm">
                  <div className="flex gap-3"><dt className="w-16 shrink-0 text-foam/55">Genre</dt><dd className="min-w-0 break-words text-foam/90">{e.genre}</dd></div>
                  <div className="flex gap-3"><dt className="w-16 shrink-0 text-foam/55">Zone</dt><dd className="min-w-0 break-words text-foam/90">{e.zone}</dd></div>
                </dl>
                <div className="mt-6 flex flex-col gap-3">
                  <button type="button" onClick={() => onBook(`Reserve for ${e.title} (${e.day})`)} className="btn-gold w-full">Reserve for {e.shortDay} <Icon.Arrow /></button>
                  <a href={contact.whatsapp} target="_blank" rel="noreferrer" className="btn-ghost w-full"><Icon.WhatsApp /> {eventsCopy.whatsappCta}</a>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <p className="mt-4 text-center font-sans text-xs text-foam/60">{eventsCopy.rules}</p>
      </div>
    </section>
  )
}
