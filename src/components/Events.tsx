import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { events } from '../data/extracted'
import { contact, eventsCopy } from '../data/content'
import { Icon, Reveal, SplitHeading, ease } from './ui'
import { rs } from '../lib/img'
import Backdrop from './Backdrop'

export default function Events({ onBook }: { onBook: (n?: string) => void }) {
  const [sel, setSel] = useState(2)
  const e = events[sel]
  return (
    <section id="events" className="t-red wood grain relative overflow-x-hidden overflow-y-hidden py-14 lg:py-20">
      <Backdrop src="/images/backdrops/events.webp" srcSet="/images/backdrops/events-800w.webp 800w, /images/backdrops/events.webp 1200w" tone="red" />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-10">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
          <div>
            <Reveal><span className="eyebrow">{eventsCopy.eyebrow}</span></Reveal>
            <SplitHeading text={eventsCopy.title[0].trim()} accent={eventsCopy.title[1]} className="mt-3 font-display text-4xl font-bold text-foam sm:text-6xl" />
          </div>
          <Reveal delay={0.1}><p className="font-sans text-sm leading-relaxed text-foam/65 lg:pb-2">{eventsCopy.desc}</p></Reveal>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {events.map((x, i) => (
            <button key={x.id} onClick={() => setSel(i)} className={`relative rounded-2xl border px-2 py-3 text-center transition-all duration-300 sm:px-3 sm:py-4 ${i === sel ? 'border-brass/70 bg-brass/[.06]' : 'border-foam/10 hover:border-brass/35'}`}>
              <div className={`font-display text-xl sm:text-2xl ${i === sel ? 'text-brass' : 'text-foam'}`}>{x.shortDay}</div>
              <div className="mt-1 hidden font-sans text-[10px] uppercase tracking-[0.15em] text-foam/50 sm:block">{x.time.split(' ')[0]} {x.time.split(' ')[1]}</div>
              {'featured' in x && x.featured && <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-brass px-2 py-0.5 font-sans text-[8px] font-bold uppercase tracking-wider text-oak">Headliner</span>}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={e.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease }}
            className="mt-6 grid w-full max-w-full overflow-hidden rounded-2xl border border-brass/20 bg-ink/50 lg:grid-cols-[1.1fr_1fr]">
            <div className="relative min-h-[240px] overflow-hidden sm:min-h-[300px]">
              <motion.img src={e.image} {...rs(e.image, '(min-width: 1024px) 50vw, 100vw')} loading="lazy" alt={e.title} className="absolute inset-0 h-full w-full object-cover" initial={{ scale: 1.04 }} animate={{ scale: 1 }} transition={{ duration: 2.4, ease }} />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
              <span className="absolute left-4 top-4 border border-honey/40 bg-ink/50 px-3 py-1.5 font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-honey sm:left-5 sm:top-5">{e.badge}</span>
            </div>
            <div className="min-w-0 p-5 sm:p-10">
              <div className="font-sans text-[11px] uppercase tracking-[0.3em] text-brass">{e.day} · {e.time}</div>
              <h3 className="mt-3 break-words font-display text-[1.75rem] font-bold leading-tight text-foam sm:text-4xl">{e.title}</h3>
              <p className="mt-1 font-display text-base italic text-honey/85 sm:text-lg">{e.artist}</p>
              <p className="mt-5 font-sans text-sm leading-relaxed text-foam/70">{e.desc}</p>
              <dl className="mt-6 space-y-2 border-t border-brass/15 pt-5 font-sans text-sm">
                <div className="flex gap-3"><dt className="w-14 shrink-0 text-foam/45 sm:w-16">Genre</dt><dd className="min-w-0 break-words text-foam/85">{e.genre}</dd></div>
                <div className="flex gap-3"><dt className="w-14 shrink-0 text-foam/45 sm:w-16">Zone</dt><dd className="min-w-0 break-words text-foam/85">{e.zone}</dd></div>
              </dl>
              <div className="mt-7 flex w-full flex-col gap-3">
                <button onClick={() => onBook(`Reserve for ${e.title} (${e.day})`)} className="btn-gold w-full !whitespace-normal text-center">Reserve for {e.shortDay} <Icon.Arrow /></button>
                <a href={contact.whatsapp} target="_blank" rel="noreferrer" className="btn-ghost w-full !whitespace-normal text-center"><Icon.WhatsApp /> <span className="text-pretty">{eventsCopy.whatsappCta}</span></a>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        <p className="mt-5 text-center font-sans text-xs text-foam/45">{eventsCopy.rules}</p>
      </div>
    </section>
  )
}
