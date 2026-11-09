import { useLayoutEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { brand } from '../data/content'
import { backdropSlots } from '../data/backdrops'
import { gsap, ScrollTrigger } from '../lib/motion'
import { scrollToId } from '../lib/scroll'
import Backdrop from './Backdrop'
import { Icon, Reveal, SplitHeading } from './ui'

/* Scroll-entry 3D turn, matched to the Alchemist LinksSection:
   desktop plays rotationY -180 → 0 over 2s (back.out, stagger .5) and reverses on the way up;
   mobile scrubs the same turn per card. The face you read is the front; the back is only the turn. */
const cards = [
  { key: 'experience', eyebrow: 'Venue & parties', title: 'Explore the', accent: 'experience', line: 'Courtyard, skybar, and private tables.', cta: 'Plan an evening', video: '/video/cards/experience.mp4', poster: '/video/cards/experience.webp', to: 'moments' },
  { key: 'food', eyebrow: 'The kitchen', title: 'Explore our', accent: 'food', line: 'Wood-fired, sigri, and claypot plates.', cta: 'See the food menu', video: '/video/cards/food.mp4', poster: '/video/cards/food.webp', to: '/menu' },
  { key: 'drinks', eyebrow: 'The bar', title: 'Explore our', accent: 'drinks', line: 'House taps, towers, and cocktails.', cta: 'See the drinks menu', video: '/video/cards/drinks.mp4', poster: '/video/cards/drinks.webp', to: '/menu?tab=drinks' },
]

function LoopVideo({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [reduce] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  useLayoutEffect(() => {
    const v = ref.current
    if (!v || reduce) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { if (!v.getAttribute('src')) v.src = src; v.play().catch(() => {}) } else v.pause()
    }, { rootMargin: '200px' })
    io.observe(v)
    return () => io.disconnect()
  }, [src, reduce])
  return (
    <>
      <img src={poster} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
      {!reduce && <video ref={ref} poster={poster} muted loop playsInline preload="none" className="absolute inset-0 h-full w-full object-cover" />}
    </>
  )
}

function CardFace({ c }: { c: (typeof cards)[number] }) {
  const nav = useNavigate()
  const go = () => (c.to.startsWith('/') ? nav(c.to) : scrollToId(c.to))
  return (
    <div className="h-[min(68svh,540px)] w-full [perspective:2000px] lg:h-[min(70svh,560px)]">
      <div className="ls-link relative h-full w-full">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-[28px] border border-[#DEB258]/25 bg-[#2A3018] [backface-visibility:hidden] [transform:rotateY(180deg)_translateZ(45px)]"
        >
          <img src={brand.navEmblem} alt="" className="h-16 w-16 object-contain opacity-90 drop-shadow-[0_6px_16px_rgba(58,18,11,.25)]" />
        </div>
        <article className="absolute inset-0 overflow-hidden rounded-[28px] shadow-[0_22px_44px_-24px_rgba(28,30,16,.6)] [backface-visibility:hidden] [transform:translateZ(1px)] [transform-style:preserve-3d]">
          <div className="absolute inset-[-8%] [transform:translateZ(-40px)]">
            <LoopVideo src={c.video} poster={c.poster} />
          </div>
          <div className="photo-fade pointer-events-none absolute inset-0" />
          <div className="relative z-10 flex h-full flex-col justify-between p-6 [transform:translateZ(40px)] sm:p-7">
            <div className="font-sans text-[10px] font-extrabold uppercase tracking-[0.26em] text-[#DEB258]">{c.eyebrow}</div>
            <div>
              <h3 className="font-display text-[1.7rem] font-bold leading-[1.05] text-[#F8ECD6] sm:text-[2rem]">
                {c.title} <span className="text-[#DEB258]">{c.accent}</span>
              </h3>
              <p className="mt-2 max-w-[16rem] font-sans text-[13px] leading-snug text-[#F8ECD6]/85">{c.line}</p>
              <button type="button" onClick={go} className="btn-gold mt-4">{c.cta} <Icon.Arrow className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}

export default function ExperienceCards() {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const links = Array.from(el.querySelectorAll<HTMLElement>('.ls-link'))
    if (!links.length) return

    const mm = gsap.matchMedia()
    const motion = '(prefers-reduced-motion: no-preference)'

    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(links, { clearProps: 'transform' })
    })

    mm.add(`${motion} and (min-width: 1024px)`, () => {
      const tl = gsap.timeline({
        paused: true,
        scrollTrigger: {
          trigger: links[0].parentElement,
          start: 'top 70%',
          end: 'top 10%',
          toggleActions: 'play none none reverse',
        },
      })
      tl.fromTo(links, { rotationY: -180 }, {
        rotationY: 0,
        duration: 2,
        ease: 'back.out',
        stagger: { amount: 0.5, from: 'start' },
      })
    })

    mm.add(`${motion} and (max-width: 1023px)`, () => {
      links.forEach((link) => {
        gsap.fromTo(link, { rotationY: -180 }, {
          rotationY: 0,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: link,
            start: 'center bottom',
            end: 'bottom bottom',
            scrub: 1,
          },
        })
      })
    })

    const refresh = () => ScrollTrigger.refresh()
    document.fonts.ready.then(refresh)
    window.addEventListener('load', refresh)
    return () => {
      window.removeEventListener('load', refresh)
      mm.revert()
    }
  }, [])

  return (
    <section id="experience" className="t-ivory relative overflow-x-clip bg-ink py-8 sm:py-12 lg:py-20">
      <Backdrop slot={backdropSlots.experience} />
      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-10">
        <div className="text-center">
          <Reveal><span className="eyebrow">Experience · Food · Drinks</span></Reveal>
          <SplitHeading text="One address," accent="three ways in." className="mt-3 font-display text-[2rem] font-bold leading-[1.05] text-foam sm:text-5xl" />
        </div>
        <div ref={root} className="mt-6 grid gap-4 lg:mt-8 lg:grid-cols-3 lg:gap-6">
          {cards.map((c) => <CardFace key={c.key} c={c} />)}
        </div>
      </div>
    </section>
  )
}
