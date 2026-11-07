import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { brand } from '../data/content'

const calm = [0.25, 0.1, 0.25, 1] as const

/** Prime muted + playsinline before any load — required for iOS Safari autoplay. */
function primeVideo(v: HTMLVideoElement) {
  v.muted = true
  v.defaultMuted = true
  v.playsInline = true
  v.setAttribute('muted', '')
  v.setAttribute('playsinline', '')
  v.setAttribute('webkit-playsinline', '')
  v.setAttribute('autoplay', '')
}

/** Alchemist-style hero: full-bleed cover film; iOS-safe muted autoplay after preloader. */
export default function Hero({ ready }: { ready: boolean; onBook?: (n?: string) => void }) {
  const ref = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [portrait] = useState(() => typeof window !== 'undefined' && matchMedia('(max-aspect-ratio: 7/10)').matches)
  const src = portrait ? '/video/hero-portrait.mp4' : brand.heroVideo

  // Mount: prime attributes and start loading immediately (buffers during preloader)
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    primeVideo(v)
    if (!v.getAttribute('src')) {
      v.src = src
      v.load()
    }
  }, [src])

  // After preloader: play; retry on media events + first gesture if blocked (Low Power Mode)
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    primeVideo(v)

    if (!ready) {
      v.pause()
      return
    }

    let cancelled = false
    const tryPlay = () => {
      if (cancelled || !v) return
      primeVideo(v)
      const p = v.play()
      if (p && typeof p.then === 'function') p.catch(() => { /* Low Power / policy — poster stays */ })
    }

    try { v.currentTime = 0 } catch { /* */ }
    tryPlay()

    const onReady = () => tryPlay()
    v.addEventListener('loadeddata', onReady)
    v.addEventListener('canplay', onReady)
    v.addEventListener('canplaythrough', onReady)

    const onGesture = () => {
      tryPlay()
      window.removeEventListener('touchstart', onGesture)
      window.removeEventListener('scroll', onGesture, true)
    }
    window.addEventListener('touchstart', onGesture, { once: true, passive: true })
    window.addEventListener('scroll', onGesture, { once: true, passive: true, capture: true })

    return () => {
      cancelled = true
      v.removeEventListener('loadeddata', onReady)
      v.removeEventListener('canplay', onReady)
      v.removeEventListener('canplaythrough', onReady)
      window.removeEventListener('touchstart', onGesture)
      window.removeEventListener('scroll', onGesture, true)
    }
  }, [ready, src])

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12])
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section ref={ref} id="top" className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-[#1C1E10]">
      <motion.div style={{ scale }} className="absolute inset-0">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover object-center"
          poster={portrait ? '/video/hero-poster-portrait.webp' : brand.heroPoster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-[#5C6330]/40" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(28,30,16,.58) 0%, rgba(28,30,16,.18) 24%, rgba(28,30,16,.10) 50%, rgba(28,30,16,.22) 72%, rgba(28,30,16,.80) 100%)',
        }}
      />

      <motion.div style={{ opacity: fade }} className="relative z-10 flex h-full flex-col items-center justify-center px-5">
        <motion.img src={brand.emblem} alt="Brewocrat" className="h-32 w-auto drop-shadow-[0_10px_40px_rgba(0,0,0,.55)] sm:h-44 lg:h-56"
          initial={{ opacity: 0, scale: 0.94 }} animate={ready ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 1.6, ease: calm, delay: 0.15 }} />
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}} transition={{ delay: 1.2, duration: 1.4 }}
        className="absolute inset-x-0 bottom-5 z-10 text-center font-sans text-[10px] uppercase tracking-[0.34em] text-[#F8ECD6]/75 sm:text-[11px]">
        Brewery · Skybar · Kitchen
      </motion.div>
    </section>
  )
}
