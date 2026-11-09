import { motion } from 'framer-motion'
import { spaces, universes } from '../data/content'
import { backdropSlots } from '../data/backdrops'
import { Icon, Reveal, SplitHeading, ease } from './ui'
import Backdrop from './Backdrop'
import { rs, small } from '../lib/img'

function Card({ u, i, onBook }: { u: (typeof universes)[number]; i: number; onBook: () => void }) {
  return (
    <motion.button onClick={onBook} aria-label={`Reserve - ${u.name}`}
      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 1.1, delay: i * 0.12, ease }}
      className="lift t-olive group relative h-[300px] overflow-hidden rounded-2xl border border-brass/20 text-left sm:h-[400px]">
      <img src={u.img} {...rs(u.img, '(min-width: 768px) 34vw, 100vw')} alt={u.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      <div className="photo-fade pointer-events-none absolute inset-0" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-7">
        <div>
          <span className="font-sans text-[10px] uppercase tracking-[0.42em] text-honey/80">{u.zone}</span>
          <h3 className="mt-1 font-display text-4xl font-bold text-foam">{u.name}</h3>
          <p className="mt-1 font-display text-lg italic text-foam/70">{u.line}</p>
        </div>
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-brass/50 text-honey transition-colors duration-500 group-hover:border-honey group-hover:text-foam"><Icon.Arrow className="h-3.5 w-3.5" /></span>
      </div>
    </motion.button>
  )
}

export default function Universes({ onBook }: { onBook: (n?: string) => void }) {
  return (
    <section id="universes" className="t-olive relative overflow-hidden bg-gradient-to-b from-ink to-cask py-8 sm:py-12 lg:py-20">
      <Backdrop slot={backdropSlots.skybar} />
      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10">
        <div className="text-center">
          <Reveal><span className="eyebrow">The Salon · The Courtyard · The Terrace</span></Reveal>
          <SplitHeading text="Choose the evening" accent="you want." className="mt-3 font-display text-[2rem] font-bold leading-[1.05] text-foam sm:text-5xl" />
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {universes.map((u, i) => <Card key={u.name} u={u} i={i} onBook={() => onBook(`Reserve - ${u.name}`)} />)}
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-5">
          {spaces.map((s, i) => (
            <Reveal key={s.name} delay={i * 0.08}>
              <div className="lift flex min-w-0 items-center gap-3 rounded-2xl border border-foam/10 bg-cask/80 p-3 sm:p-4">
                <img src={small(s.img)} alt={s.name} loading="lazy" className="h-12 w-12 shrink-0 rounded-2xl object-cover shadow-[0_8px_18px_-12px_rgba(28,30,16,.6)] sm:h-14 sm:w-14 max-sm:hidden" />
                <div className="min-w-0">
                  <div className="font-display text-base text-foam sm:text-xl">{s.name}</div>
                  <div className="font-sans text-[10px] uppercase tracking-[0.18em] text-foam/50">{s.note}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
