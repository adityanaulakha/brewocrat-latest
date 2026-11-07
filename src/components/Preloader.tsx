import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

/**
 * Opening: just the Brewocrat wordmark — the gold logo resolves out of a soft blur, the tagline rises
 * letter by letter, a slow hold, then the curtain lifts straight onto the 3D landing page.
 * Click / any key / Skip ends it early; prefers-reduced-motion shows the logo still for 0.9 s.
 * Timeline tightened (~1.6s hold then 0.85s exit; ~2.3s shorter than the prior 3.9s reveal).
 */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const [brand, setBrand] = useState(false)
  const doneRef = useRef(false)
  const finish = () => { if (!doneRef.current) { doneRef.current = true; onDone() } }

  useEffect(() => {
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const key = () => finish()
    window.addEventListener('keydown', key)
    const timers = [window.setTimeout(() => setBrand(true), reduce ? 0 : 180), window.setTimeout(finish, reduce ? 900 : 1600)]
    ;(window as unknown as { __pourReady?: boolean }).__pourReady = true
    return () => { timers.forEach(clearTimeout); window.removeEventListener('keydown', key); html.style.overflow = prev }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const tagline = 'BREWERY · SKYBAR · KITCHEN'
  return (
    <motion.div
      key="preloader"
      className="fixed inset-0 z-[100] cursor-pointer select-none overflow-hidden"
      style={{ background: 'radial-gradient(90% 80% at 50% 50%, #5C6330 0%, #3A3E22 55%, #1C1E10 100%)' }}
      onClick={finish}
      role="dialog"
      aria-label="Loading Brewocrat"
      exit={{ opacity: 0, scale: 1.06, filter: 'blur(10px)' }}
      transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6">
        <motion.img
          src="/images/logo-720.webp" alt="Brewocrat" className="h-14 w-auto drop-shadow-[0_4px_32px_rgba(222,178,88,.45)] sm:h-20"
          initial={{ opacity: 0, scale: 0.92, filter: 'blur(10px)' }}
          animate={brand ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="mt-5 flex overflow-hidden font-sans text-[10px] font-semibold tracking-[0.42em] text-[#ECCC8A]/90 sm:text-[12px]">
          {tagline.split('').map((c, i) => (
            <motion.span key={i} initial={{ y: '110%', opacity: 0 }} animate={brand ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: 0.12 + i * 0.016, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
              {c === ' ' ? '\u00a0' : c}
            </motion.span>
          ))}
        </div>
      </div>
      <button onClick={(e) => { e.stopPropagation(); finish() }} className="absolute right-5 top-5 rounded-full border border-foam/15 bg-black/30 px-4 py-2 font-sans text-[10px] uppercase tracking-[0.3em] text-foam/70 backdrop-blur transition hover:border-brass hover:text-brass sm:right-8 sm:top-8">
        Skip
      </button>
    </motion.div>
  )
}
