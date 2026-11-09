import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { brand } from '../data/content'
import { drinkCategories, menuCategories } from '../data/extracted'

type Item = { label: string; note?: string; go: () => void }

function MenuList({ items, onPick, className = '', style, panelRef }: {
  items: Item[]; onPick: (it: Item) => void; className?: string; style?: React.CSSProperties
  panelRef?: React.Ref<HTMLUListElement>
}) {
  return (
    <motion.ul
      ref={panelRef}
      role="menu"
      data-nav-menu
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.22 }}
      style={style}
      className={`max-h-[min(70vh,420px)] overflow-y-auto rounded-2xl border border-[#DEB258]/50 bg-[#E9DCC4] p-1.5 shadow-[0_20px_50px_-16px_rgba(40,20,10,.45)] ${className}`}
    >
      {items.map((it) => (
        <li key={it.label}>
          <button role="menuitem" onClick={() => onPick(it)}
            className="block w-full rounded-xl px-4 py-2.5 text-left transition hover:bg-[#8F2E1C]/10">
            <span className="block font-sans text-[13px] font-semibold text-[#3A120B]">{it.label}</span>
            {it.note && <span className="block font-sans text-[11px] italic text-[#8F2E1C]/85">{it.note}</span>}
          </button>
        </li>
      ))}
    </motion.ul>
  )
}

function DropTrigger({ label, shortLabel, id, open, setOpen, light, align, items, onPick, desktop }: {
  label: string; shortLabel?: string; id: string; open: string | null
  setOpen: (s: string | null) => void; light: boolean; align: 'left' | 'right'
  items: Item[]; onPick: (it: Item) => void; desktop: boolean
}) {
  const on = open === id
  return (
    <div className="relative flex h-full min-w-0 flex-1 items-center justify-center">
      <button onClick={() => setOpen(on ? null : id)} aria-expanded={on} aria-haspopup="menu"
        className={`relative max-w-full truncate px-2 font-sans text-[9px] font-bold uppercase tracking-[0.14em] transition sm:px-4 sm:text-[11px] sm:tracking-[0.22em] ${light ? 'text-[#3A120B] hover:text-[#8F2E1C]' : 'text-[#F8ECD6] hover:text-[#DEB258]'}`}>
        <span className="sm:hidden">{shortLabel || label}</span>
        <span className="hidden sm:inline">{label}</span>
        <span className={`absolute -bottom-0.5 left-0 h-px w-full origin-left transition-transform duration-200 ${on ? 'scale-x-100' : 'scale-x-0'} ${light ? 'bg-[#8F2E1C]' : 'bg-[#DEB258]'}`} />
      </button>
      <AnimatePresence>
        {on && desktop && (
          <MenuList
            items={items}
            onPick={onPick}
            className={`pointer-events-auto absolute top-[calc(100%+12px)] z-30 w-72 ${align === 'left' ? 'left-0' : 'right-0'}`}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * Alchemist-style topbar: Book Now | gold crest | Explore the Menu.
 * Mobile menus are fixed left-4/right-4 under the pill with a scrim.
 */
export default function Nav({ onBook }: { onBook: (n?: string) => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState<string | null>(null)
  const [menuTop, setMenuTop] = useState(72)
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' && matchMedia('(min-width: 640px)').matches)
  const topbarRef = useRef<HTMLDivElement>(null)
  const mobilePanelRef = useRef<HTMLUListElement>(null)
  const loc = useLocation()
  const nav = useNavigate()

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 48)
    f(); window.addEventListener('scroll', f, { passive: true })
    return () => removeEventListener('scroll', f)
  }, [])
  useEffect(() => {
    const mq = matchMedia('(min-width: 640px)')
    const f = () => setIsDesktop(mq.matches)
    f(); mq.addEventListener('change', f)
    return () => mq.removeEventListener('change', f)
  }, [])

  useLayoutEffect(() => {
    const place = () => {
      const el = topbarRef.current
      if (!el) return
      setMenuTop(Math.round(el.getBoundingClientRect().bottom + 12))
    }
    place()
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, { passive: true })
    return () => { removeEventListener('resize', place); removeEventListener('scroll', place) }
  }, [open])

  useEffect(() => {
    if (!open) return
    const f = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      if (!t.closest('[data-topbar], [data-nav-menu]')) setOpen(null)
    }
    addEventListener('click', f)
    return () => removeEventListener('click', f)
  }, [open])
  useEffect(() => { setOpen(null) }, [loc.pathname, loc.search])

  const menuTo = (tab: 'food' | 'drinks', cat?: string) => {
    const q = new URLSearchParams({ tab })
    if (cat) q.set('cat', cat)
    nav(`/menu?${q.toString()}`)
  }

  const book: Item[] = [
    { label: 'Indoor Salon', note: 'Climate-controlled dining · ~100', go: () => onBook('Preferred zone: Indoor Salon') },
    { label: 'Courtyard', note: 'Open-air · fairy-lit · live energy · ~90', go: () => onBook('Preferred zone: Courtyard') },
    { label: 'Skybar Terrace', note: 'Rooftop sundowners above the skyline · ~60', go: () => onBook('Preferred zone: Skybar Terrace') },
    { label: 'Private & corporate', note: 'Birthdays, mixers, celebrations', go: () => onBook('Private event enquiry') },
  ]

  const drinkItems: Item[] = drinkCategories
    .filter((c) => c.id !== 'all')
    .map((c) => ({ label: c.name, note: 'Drinks menu', go: () => menuTo('drinks', c.id) }))
  const foodItems: Item[] = menuCategories
    .filter((c) => c.id !== 'all')
    .slice(0, 6)
    .map((c) => ({ label: c.name, note: 'Food menu', go: () => menuTo('food', c.id) }))
  const explore: Item[] = [
    { label: 'All drinks', note: 'Taps, cocktails, spirits & more', go: () => menuTo('drinks') },
    ...drinkItems,
    { label: 'All food', note: 'Kitchen · wood-fired · tandoor', go: () => menuTo('food') },
    ...foodItems,
  ]

  const solid = scrolled || loc.pathname !== '/'
  const activeItems = open === 'book' ? book : open === 'menu' ? explore : []
  const pick = (it: Item) => { setOpen(null); it.go() }

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="flex justify-center px-4 pt-3 sm:px-4 sm:pt-6">
        <div ref={topbarRef} data-topbar
          className={`pointer-events-auto relative flex h-14 w-full max-w-[560px] items-stretch overflow-visible rounded-full border transition-colors duration-500 sm:h-16 ${
            solid
              ? 'border-[#DEB258]/40 bg-[#5C6330] shadow-[0_12px_32px_-16px_rgba(20,24,8,.65)]'
              : 'border-[#F8ECD6]/35 bg-[#1C1E10]/45 shadow-[0_12px_32px_-18px_rgba(0,0,0,.45)]'
          }`}>
          <DropTrigger id="book" label="Book Now" shortLabel="Book Now" items={book} align="left" open={open} setOpen={setOpen} light={false} onPick={pick} desktop={isDesktop} />

          <Link to="/" onClick={() => window.scrollTo({ top: 0 })} aria-label="Brewocrat home"
            className="absolute left-1/2 top-1/2 z-20 grid h-[58px] w-[58px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[#DEB258]/70 bg-[#1C1E10] shadow-[0_0_22px_-6px_rgba(212,166,74,.55),0_8px_24px_rgba(20,4,2,.4)] transition sm:h-[72px] sm:w-[72px]">
            <img src={brand.navEmblem} srcSet={`${brand.navEmblem} 1x, ${brand.navEmblem2x} 2x`} alt="" aria-hidden
              className="h-10 w-10 object-contain sm:h-12 sm:w-12" />
          </Link>

          <DropTrigger id="menu" label="Explore the Menu" shortLabel="Menu" items={explore} align="right" open={open} setOpen={setOpen} light={false} onPick={pick} desktop={isDesktop} />
        </div>
      </div>

      {/* Mobile: scrim + full-bleed panel under pill (16px side margins) */}
      <AnimatePresence>
        {open && !isDesktop && activeItems.length > 0 && (
          <>
            <motion.button
              key="scrim"
              type="button"
              aria-label="Close menu"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="pointer-events-auto fixed inset-0 z-40 bg-[#1C1E10]/55"
              onClick={() => setOpen(null)}
            />
            <MenuList
              key="mobile-panel"
              panelRef={mobilePanelRef}
              items={activeItems}
              onPick={pick}
              className="pointer-events-auto fixed z-50"
              style={{ top: menuTop, left: 16, right: 16, width: 'auto' }}
            />
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
