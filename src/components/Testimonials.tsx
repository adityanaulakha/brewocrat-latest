import { useRef, useState } from 'react'
import { contact, rating, testimonials } from '../data/content'
import { Icon } from './ui'

/** Left-to-right row of the real reviews. One card on a phone, two with a peek on a wide screen. */
export default function Testimonials() {
  const scroller = useRef<HTMLDivElement>(null)
  const [reduce] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  const by = (dir: number) => {
    const el = scroller.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('figure')
    const w = (card?.offsetWidth ?? el.clientWidth) + 16
    el.scrollBy({ left: dir * w, behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <section id="reviews" className="t-red relative overflow-hidden py-8 sm:py-14 lg:py-20">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-10">
        <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
          <span className="eyebrow">Patron voices</span>
          <a href={contact.reviewsLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 border-b border-brass/30 pb-1 font-sans text-[11px] tracking-[0.12em] text-foam/90 transition-colors duration-500 hover:border-brass">
            <span className="flex text-brass">{[0, 1, 2, 3, 4].map((k) => <Icon.Star key={k} className="h-3 w-3" />)}</span>{rating}
          </a>
        </div>

        <div ref={scroller} className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 no-scrollbar" tabIndex={0} aria-label="Guest reviews">
          {testimonials.map((t) => (
            <figure key={t.author} className="lift w-[84vw] max-w-[460px] shrink-0 snap-start rounded-3xl border border-brass/20 bg-cask p-5 sm:w-[calc(50%-8px)] sm:max-w-none sm:p-7 xl:w-[calc(33.333%-11px)]">
              <Icon.Quote className="h-8 w-8 text-brass/50" />
              <blockquote className="mt-3 font-display text-lg leading-snug text-foam sm:text-xl">“{t.text}”</blockquote>
              <figcaption className="mt-5">
                <cite className="block font-display text-lg not-italic text-brass">{t.author}</cite>
                <span className="mt-1 block font-sans text-xs text-foam/65">{t.role} · {t.date}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-center gap-3">
          <button type="button" onClick={() => by(-1)} aria-label="Previous reviews" className="grid h-11 w-11 place-items-center rounded-full border border-foam/25 text-foam hover:border-brass hover:text-brass"><Icon.Left /></button>
          <button type="button" onClick={() => by(1)} aria-label="Next reviews" className="grid h-11 w-11 place-items-center rounded-full border border-foam/25 text-foam hover:border-brass hover:text-brass"><Icon.Right /></button>
        </div>
      </div>
    </section>
  )
}
