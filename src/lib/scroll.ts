import type Lenis from 'lenis'
let lenis: Lenis | null = null
export const setLenis = (l: Lenis | null) => { lenis = l }
export const getLenis = () => lenis

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - ((-2 * t + 2) ** 3) / 2)

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Quick ease that still stretches a little on a long page. Stays inside 0.9–1.6s. */
function durationFor(distancePx: number) {
  const screens = Math.abs(distancePx) / Math.max(1, window.innerHeight)
  return Math.min(1.6, Math.max(0.9, 0.82 + screens * 0.18))
}

function clearTopHash() {
  const hash = window.location.hash.toLowerCase()
  if (hash === '#' || hash === '#top' || hash === '#hero') {
    history.replaceState(null, '', window.location.pathname + window.location.search)
  }
}

function tweenScrollTo(to: number, duration: number) {
  const start = window.scrollY || document.documentElement.scrollTop || 0
  const dist = to - start
  if (Math.abs(dist) < 1) return
  const t0 = performance.now()
  const step = (now: number) => {
    const p = Math.min(1, (now - t0) / (duration * 1000))
    window.scrollTo(0, start + dist * easeInOutCubic(p))
    if (p < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

/** Animate back to the hero. Immediate when reduced motion is on, or when `immediate` is set (route changes). */
export function scrollToTop(opts?: { immediate?: boolean }) {
  clearTopHash()
  const y = window.scrollY || document.documentElement.scrollTop || 0
  const immediate = Boolean(opts?.immediate) || prefersReducedMotion() || y < 4
  if (lenis) {
    lenis.scrollTo(0, immediate ? { immediate: true } : { duration: durationFor(y), easing: easeInOutCubic })
    return
  }
  if (immediate) window.scrollTo(0, 0)
  else tweenScrollTo(0, durationFor(y))
}

/** True for href="#", "#top", "#hero" and the same hashes on "/". */
export function isHeroTopHref(href: string | null) {
  if (!href) return false
  const raw = href.trim()
  if (raw === '#' || raw === '#top' || raw === '#hero' || raw === '/#' || raw === '/#top' || raw === '/#hero') return true
  try {
    const url = new URL(raw, window.location.href)
    if (url.origin !== window.location.origin) return false
    const hash = url.hash.toLowerCase()
    if (hash !== '#' && hash !== '#top' && hash !== '#hero') return false
    return url.pathname === '/' || url.pathname === window.location.pathname
  } catch {
    return false
  }
}

export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset: -70, duration: 1.4 })
  else el.scrollIntoView({ behavior: 'smooth' })
}
