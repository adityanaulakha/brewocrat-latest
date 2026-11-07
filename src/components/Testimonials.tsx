import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { contact, rating, testimonials } from '../data/content'
import { Icon, ease } from './ui'
import { rs } from '../lib/img'

export default function Testimonials() {
  const [i, setI] = useState(0)
  const n = testimonials.length
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-15%', '15%'])
  useEffect(() => { const t = setInterval(() => setI((x) => (x + 1) % n), 9000); return () => clearInterval(t) }, [n, i])
  const t = testimonials[i]
  return (
    <section ref={ref} id="reviews" className="t-red relative overflow-hidden py-14 sm:py-20">
      <motion.div style={{ y, scale: 1.3 }} className="absolute inset-0">
        <img src="/interior/exterior2.webp" {...rs('/interior/exterior2.webp')} alt="" aria-hidden className="h-full w-full object-cover" loading="lazy" />
      </motion.div>
      <div className="absolute inset-0 bg-ink/75" />
      <div className="absolute inset-0 bg-gradient-to-b from-cask via-transparent to-ink" />
      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <span className="eyebrow">06 / Patron Voices</span>
          <a href={contact.reviewsLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 border-b border-brass/30 pb-1 font-sans text-[11px] tracking-[0.12em] text-foam/85 transition-colors duration-500 hover:border-brass">
            <span className="flex text-brass">{[0, 1, 2, 3, 4].map((k) => <Icon.Star key={k} className="h-3 w-3" />)}</span>{rating}
          </a>
        </div>
        <Icon.Quote className="mx-auto mt-10 h-12 w-12 text-brass/40" />
        <div className="relative mt-4 min-h-[260px] sm:min-h-[220px]">
          <AnimatePresence mode="wait">
            <motion.figure key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.1, ease }}>
              <blockquote className="font-display text-2xl italic leading-snug text-foam sm:text-[2.1rem]">“{t.text}”</blockquote>
              <figcaption className="mt-8">
                <cite className="block font-display text-xl not-italic uppercase tracking-[0.2em] text-brass">{t.author}</cite>
                <span className="mt-1 block font-sans text-xs text-foam/55">{t.role} • {t.date}</span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
        <div className="mt-10 flex items-center justify-center gap-5">
          <button onClick={() => setI((i - 1 + n) % n)} aria-label="Previous review" className="grid h-11 w-11 place-items-center rounded-full border border-foam/25 text-foam hover:border-brass hover:text-brass"><Icon.Left /></button>
          <div className="flex gap-2">{testimonials.map((_, k) => <button key={k} onClick={() => setI(k)} aria-label={`Go to slide ${k + 1}`} className={`h-px transition-all duration-700 ${k === i ? 'w-10 bg-brass' : 'w-5 bg-brass/25'}`} />)}</div>
          <button onClick={() => setI((i + 1) % n)} aria-label="Next review" className="grid h-11 w-11 place-items-center rounded-full border border-foam/25 text-foam hover:border-brass hover:text-brass"><Icon.Right /></button>
        </div>
      </div>
    </section>
  )
}
