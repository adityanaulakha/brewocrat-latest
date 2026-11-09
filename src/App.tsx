import { Suspense, lazy, useCallback, useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import Preloader from './components/Preloader'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Footer from './components/Footer'
import BookModal from './components/BookModal'
import { setLenis } from './lib/scroll'
import { ScrollTrigger } from './lib/motion'

// the menu route is its own chunk (it isn't needed for the landing page)
const MenuPage = lazy(() => import('./pages/MenuPage'))
// the code is fetched straight away, but the sections (and their photos) only mount once the intro hands off,
// so on a phone the pour gets the whole connection to itself
const belowFold = import('./components/BelowFold')
const BelowFold = lazy(() => belowFold)

function Home({ ready, onBook }: { ready: boolean; onBook: (n?: string) => void }) {
  return (
    <main>
      <Hero ready={ready} onBook={() => onBook()} />
      <Suspense fallback={<div className="min-h-[100svh] bg-[#E9DCC4]" />}>
        {ready ? <BelowFold onBook={onBook} /> : <div className="min-h-[100svh] bg-[#E9DCC4]" />}
      </Suspense>
    </main>
  )
}

export default function App() {
  const loc = useLocation()
  const [loading, setLoading] = useState(loc.pathname === '/')
  const [ready, setReady] = useState(loc.pathname !== '/')
  const [book, setBook] = useState(false)
  const [note, setNote] = useState<string | undefined>()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const l = new Lenis({ lerp: 0.16, smoothWheel: true, syncTouch: false, wheelMultiplier: 1 })
    setLenis(l)
    let raf = 0
    const loop = (t: number) => { l.raf(t); ScrollTrigger.update(); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); l.destroy(); setLenis(null) }
  }, [])

  useEffect(() => {
    document.title = loc.pathname.startsWith('/menu')
      ? 'Menu - Brewocrat Brewery · Skybar · Kitchen'
      : 'Brewocrat - Brewery · Skybar · Kitchen | Element One, Gurugram'
  }, [loc.pathname])

  const openBook = useCallback((n?: string) => { setNote(n); setBook(true) }, [])
  const done = useCallback(() => { setLoading(false); setTimeout(() => setReady(true), 250) }, [])

  return (
    <>
      <AnimatePresence>{loading && <Preloader onDone={done} />}</AnimatePresence>
      <Nav onBook={openBook} />
      <Routes>
        <Route path="/" element={<Home ready={ready} onBook={openBook} />} />
        <Route path="/menu" element={<Suspense fallback={<div className="min-h-screen bg-ink" />}><MenuPage onBook={() => openBook()} /></Suspense>} />
        <Route path="*" element={<Home ready={ready} onBook={openBook} />} />
      </Routes>
      <Footer />
      <BookModal open={book} onClose={() => setBook(false)} preset={note} />
    </>
  )
}
