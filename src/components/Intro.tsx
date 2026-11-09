import { useLayoutEffect, useRef } from 'react'
import { brand, contact } from '../data/content'
import { backdropSlots } from '../data/backdrops'
import { Reveal, SplitHeading } from './ui'
import Backdrop from './Backdrop'
import { rs } from '../lib/img'

/** Full brand name exactly as the original site presents it (footer + logo title on brewocrat2-iota.vercel.app). */
const FULL_NAME = 'Brewocrat Brewery Skybar & Kitchen'
const REPEAT = 3 // name repeats per half of the loop (keeps ultra-wide screens filled)

/**
 * Skybar marquee: the full name drifts slowly while every letter rides a travelling sine wave, like
 * cloth fluttering in a light breeze. Pure CSS transforms/opacity (compositor-only); the travel speed
 * is set from the measured strip width so it stays ~half the previous pace on every screen size.
 */
function FlagMarquee() {
  const track = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const el = track.current
    if (!el) return
    const fit = () => {
      const half = (el.children[0] as HTMLElement).getBoundingClientRect().width
      const fs = parseFloat(getComputedStyle(el.children[0] as HTMLElement).fontSize) || 30
      el.style.setProperty('--dur', `${(half / (1.3 * fs)).toFixed(1)}s`) // ≈1.3 font-sizes per second
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  let i = 0
  const word = (text: string) =>
    Array.from(text).map((ch) => (
      <span key={i} className="flag-ch" style={{ ['--i' as string]: i++ }}>{ch === ' ' ? '\u00a0' : ch}</span>
    ))
  return (
    <div ref={track} className="flex w-max flag-track" aria-label={FULL_NAME} role="marquee">
      {[0, 1].map((k) => (
        <div key={k} aria-hidden className="flex shrink-0 items-center font-display text-lg uppercase tracking-[0.12em] text-foam/85 sm:text-2xl">
          {Array.from({ length: REPEAT }, (_, r) => (
            <span key={r} className="flex items-center whitespace-nowrap">
              <span className="px-8">{word(FULL_NAME)}</span>
              <span className="flag-ch text-brass" style={{ ['--i' as string]: i++ }}>✦</span>
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}

export default function Intro() {
  return (
    <section id="about" className="t-ivory relative overflow-hidden bg-ink">
      <Backdrop slot={backdropSlots.about} />
      <div className="relative z-10 border-y border-brass/20 bg-black/5 py-3">
        <FlagMarquee />
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-6 px-5 py-8 sm:px-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:py-14">
        <div className="lift relative order-2 aspect-[4/3] overflow-hidden rounded-[24px] lg:order-1 lg:aspect-[4/5] lg:max-h-[70svh]">
          <img src={brand.introImage.src} {...rs(brand.introImage.src, '(min-width: 1024px) 45vw, 100vw')} alt={brand.introImage.alt} className="h-full w-full object-cover" loading="lazy" />
          <div className="photo-fade pointer-events-none absolute inset-0" />
          <span className="absolute bottom-5 left-5 max-w-[80%] font-sans text-[10px] uppercase tracking-[0.18em] text-[#F8ECD6]/90">{brand.introImage.alt}</span>
        </div>
        <div className="order-1 lg:order-2">
          <Reveal><span className="eyebrow">About Brewocrat</span></Reveal>
          <SplitHeading text="Come for the taps," accent="stay for the live music." className="mt-3 font-display text-[2rem] font-bold leading-[1.08] text-foam sm:text-5xl" />
          <Reveal delay={0.15}><p className="mt-5 max-w-lg font-sans text-[15px] leading-[1.8] text-foam/80">{brand.intro}</p></Reveal>
          <Reveal delay={0.25}>
            <div className="lift mt-7 grid grid-cols-3 rounded-2xl border border-brass/25 bg-cask/70">
              {[
                { k: '4', v: 'House taps' },
                { k: '12-1', v: 'PM to AM, daily' },
                { k: '4.8', v: 'Google reviews' },
              ].map((s) => (
                <div key={s.v} className="px-2 py-4 sm:px-4 [&:not(:first-child)]:border-l [&:not(:first-child)]:border-brass/25">
                  <div className="text-brass font-display text-3xl font-bold sm:text-4xl">{s.k}</div>
                  <div className="mt-1 font-sans text-[10px] leading-tight text-foam/90">{s.v}</div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.3}><p className="mt-5 font-sans text-xs tracking-wide text-foam/65">{contact.addressShort}</p></Reveal>
        </div>
      </div>
    </section>
  )
}
