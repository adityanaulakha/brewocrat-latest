import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Icon, Reveal, SplitHeading } from './ui'
import { scrollToId } from '../lib/scroll'

/* Alchemist LinksSection pattern: 3-up grid of ~70svh cards with a 3D flip (twister) to a CTA backside. */
const cards = [
  { key: 'experience', eyebrow: 'Venue & parties', title: 'Explore the', accent: 'experience', line: 'Courtyard toasts, skybar sundowners, DJ nights and private celebrations.', cta: 'Plan an evening', video: '/video/cards/experience.mp4', poster: '/video/cards/experience.webp', to: 'moments' },
  { key: 'food', eyebrow: 'The kitchen', title: 'Explore our', accent: 'food', line: 'Wood-fired pizzas, sigri grills, claypot curries and Mediterranean sharing platters.', cta: 'See the food menu', video: '/video/cards/food.mp4', poster: '/video/cards/food.webp', to: '/menu' },
  { key: 'drinks', eyebrow: 'The bar', title: 'Explore our', accent: 'drinks', line: 'Four house-brewed taps, 3-litre towers, craft cocktails and a deep spirits list.', cta: 'See the drinks menu', video: '/video/cards/drinks.mp4', poster: '/video/cards/drinks.webp', to: '/menu?tab=drinks' },
]

function LoopVideo({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [reduce] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const v = ref.current
    if (!v || reduce) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { if (!v.getAttribute('src')) v.src = src; v.play().catch(() => {}) } else v.pause()
    }, { rootMargin: '200px' })
    io.observe(v); return () => io.disconnect()
  }, [src, reduce])
  return (
    <>
      <img src={poster} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
      {!reduce && <video ref={ref} poster={poster} muted loop playsInline preload="none" className="absolute inset-0 h-full w-full object-cover" />}
    </>
  )
}

function FlipCard({ c }: { c: (typeof cards)[number] }) {
  const [flipped, setFlipped] = useState(false)
  const nav = useNavigate()
  const go = () => (c.to.startsWith('/') ? nav(c.to) : scrollToId(c.to))
  return (
    <div className="ls-twister group relative h-[min(70svh,560px)] w-full [perspective:2000px]"
      onMouseEnter={() => setFlipped(true)} onMouseLeave={() => setFlipped(false)}>
      <motion.div className="relative h-full w-full [transform-style:preserve-3d]"
        animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}>
        {/* front */}
        <article className="absolute inset-0 overflow-hidden rounded-[28px] border-2 border-[#3A120B]/15 [backface-visibility:hidden]">
          <div className="absolute inset-0 scale-[1.02]"><LoopVideo src={c.video} poster={c.poster} /></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#2a0c06]/85 via-[#2a0c06]/15 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8">
            <div className="eyebrow !text-[#DEB258]">{c.eyebrow}</div>
            <div>
              <h3 className="font-display text-[1.85rem] font-bold leading-[1.05] text-[#F8ECD6] sm:text-[2.1rem]">
                {c.title} <span className="accent text-[#DEB258]">{c.accent}</span>
              </h3>
              <button onClick={() => setFlipped(true)} className="mt-4 inline-flex items-center gap-2 font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-[#F8ECD6]/90 sm:hidden">
                Flip for more <Icon.Arrow className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </article>
        {/* back — Alchemist-style solid face with CTA */}
        <article className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-[28px] border-2 border-[#8F2E1C]/40 bg-[#E9DCC4] px-7 text-center [backface-visibility:hidden] [transform:rotateY(180deg)_translateZ(1px)]">
          <div className="eyebrow !text-[#8F2E1C]">{c.eyebrow}</div>
          <h3 className="mt-3 font-display text-[1.85rem] font-bold leading-[1.05] text-[#3A120B]">
            {c.title} <span className="accent text-[#8F2E1C]">{c.accent}</span>
          </h3>
          <p className="mt-4 max-w-xs font-sans text-[14px] leading-relaxed text-[#3A120B]/75">{c.line}</p>
          <button onClick={go} className="btn-gold mt-7 !bg-[#8F2E1C] !text-[#F8ECD6]">{c.cta} <Icon.Arrow className="h-3.5 w-3.5" /></button>
          <button onClick={() => setFlipped(false)} className="mt-4 font-sans text-[10px] uppercase tracking-[0.25em] text-[#8F2E1C]/70 sm:hidden">Flip back</button>
        </article>
      </motion.div>
    </div>
  )
}

export default function ExperienceCards() {
  return (
    <section id="experience" className="t-red relative overflow-hidden bg-ink py-14 lg:py-20">
      <div className="relative mx-auto max-w-6xl px-5 sm:px-10">
        <div className="text-center">
          <Reveal><span className="eyebrow">Experience · Food · Drinks</span></Reveal>
          <SplitHeading text="One address," accent="three ways in." className="mt-3 font-display text-3xl font-bold text-foam sm:text-5xl" />
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3 md:gap-6">
          {cards.map((c) => <FlipCard key={c.key} c={c} />)}
        </div>
      </div>
    </section>
  )
}
