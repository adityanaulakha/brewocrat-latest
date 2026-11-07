import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { drinkCategories, drinkItems, menuCategories, menuItems } from '../data/extracted'
import { Eyebrow, Icon, ease } from '../components/ui'

type Item = { name: string; type: string; price: number; category: string; desc: string; badge?: string }

export default function MenuPage({ onBook }: { onBook: () => void }) {
  const [sp] = useSearchParams()
  const [tab, setTab] = useState<'food' | 'drinks'>(sp.get('tab') === 'drinks' ? 'drinks' : 'food')
  const [cat, setCat] = useState(() => sp.get('cat') || 'all')
  const [q, setQ] = useState('')
  useEffect(() => { document.title = 'Menu — Brewocrat Brewery · Skybar · Kitchen'; window.scrollTo(0, 0) }, [])
  useEffect(() => {
    setTab(sp.get('tab') === 'drinks' ? 'drinks' : 'food')
    setCat(sp.get('cat') || 'all')
  }, [sp])
  const cats = tab === 'food' ? menuCategories : drinkCategories
  const items = (tab === 'food' ? menuItems : drinkItems) as readonly Item[]
  const list = useMemo(() => items.filter((x) => (cat === 'all' || x.category === cat) && `${x.name} ${x.desc}`.toLowerCase().includes(q.toLowerCase())), [items, cat, q])
  const grouped = useMemo(() => {
    const g: Record<string, Item[]> = {}
    list.forEach((x) => (g[x.category] ??= []).push(x))
    return cats.filter((c) => c.id !== 'all' && g[c.id]).map((c) => ({ ...c, items: g[c.id] }))
  }, [list, cats])

  return (
    <main className="t-ivory min-h-screen bg-ink pb-24">
      <section className="relative overflow-hidden pb-8 pt-28">
        <img src="/images/venue/9193297f7201519323440fd58138cda7.webp" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/80 to-ink" />
        <div className="relative mx-auto max-w-5xl px-5 text-center">
          <Eyebrow className="justify-center">Brewery · Skybar · Kitchen</Eyebrow>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }} className="mt-5 font-display text-6xl font-bold uppercase text-foam sm:text-8xl">
            The <span className="gold-text italic">Menu</span>
          </motion.h1>
          <div className="mx-auto mt-8 inline-flex rounded-full border border-brass/30 bg-cask p-1">
            {(['food', 'drinks'] as const).map((t) => (
              <button key={t} onClick={() => { setTab(t); setCat('all') }} className={`relative rounded-full px-8 py-3 font-sans text-[11px] font-bold uppercase tracking-[0.25em] transition ${tab === t ? 'text-oak' : 'text-foam/70'}`}>
                {tab === t && <motion.span layoutId="tabpill" className="absolute inset-0 rounded-full bg-brass" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
                <span className="relative">{t === 'food' ? 'Food' : 'Drinks'}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="sticky top-[64px] z-30 border-y border-brass/15 bg-ink/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-3 sm:px-8 lg:flex-row lg:items-center">
          <div className="flex flex-1 gap-2 overflow-x-auto no-scrollbar">
            {cats.map((c) => (
              <button key={c.id} onClick={() => setCat(c.id)} className={`shrink-0 rounded-full border px-4 py-2 font-sans text-[11px] font-semibold transition ${cat === c.id ? 'border-brass bg-brass/15 text-brass' : 'border-foam/10 text-foam/65 hover:text-foam'}`}>{c.name}</button>
            ))}
          </div>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" className="w-full rounded-full border border-foam/12 bg-foam/[.04] px-5 py-2.5 font-sans text-sm text-foam outline-none placeholder:text-foam/35 focus:border-brass/60 lg:w-64" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Legend tab={tab} />
        <AnimatePresence mode="wait">
          <motion.div key={tab + cat} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease }}>
            {grouped.map((g) => (
              <section key={g.id} className="pt-8">
                <div className="flex items-end justify-between gap-4 border-b border-brass/20 pb-4">
                  <h2 className="font-display text-3xl font-bold text-foam sm:text-4xl">{g.name}</h2>
                  <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-foam/40">{g.items.length} items</span>
                </div>
                <div className="grid gap-x-12 md:grid-cols-2">
                  {g.items.map((x) => (
                    <div key={x.name} className="group flex gap-4 border-b border-foam/[.06] py-3.5">
                      <TypeIcon type={x.type} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-3">
                          <h3 className="font-display text-xl text-foam transition group-hover:text-brass">{x.name}</h3>
                          {x.badge && <BadgeIcon badge={x.badge} />}
                          <span className="mx-1 hidden flex-1 border-b border-dotted border-foam/15 sm:block" />
                          <span className="ml-auto shrink-0 font-display text-xl text-honey">₹{x.price.toLocaleString('en-IN')}</span>
                        </div>
                        <p className="mt-1 font-sans text-[13px] text-foam/55">{x.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
            {grouped.length === 0 && <p className="py-24 text-center font-sans text-foam/50">No items match your search.</p>}
          </motion.div>
        </AnimatePresence>
        <div className="mt-8 text-center">
          <button onClick={onBook} className="btn-gold">Book a table <Icon.Arrow /></button>
        </div>
      </div>
    </main>
  )
}

/* Icons instead of words (meeting 1): FSSAI-style veg / non-veg marks, a glass for mocktails, a hop for alcohol, a star for specials */
export function TypeIcon({ type }: { type: string }) {
  const t = type === 'veg' ? 'Vegetarian' : type === 'non-veg' ? 'Non-vegetarian' : type === 'mocktail' ? 'Mocktail (alcohol-free)' : 'Contains alcohol'
  return (
    <span title={t} aria-label={t} role="img" className="mt-1 shrink-0">
      {type === 'veg' && <svg viewBox="0 0 16 16" className="h-4 w-4"><rect x="1" y="1" width="14" height="14" rx="3" fill="none" stroke="#2f8a3a" strokeWidth="1.6" /><circle cx="8" cy="8" r="3.4" fill="#2f8a3a" /></svg>}
      {type === 'non-veg' && <svg viewBox="0 0 16 16" className="h-4 w-4"><rect x="1" y="1" width="14" height="14" rx="3" fill="none" stroke="#8a2a18" strokeWidth="1.6" /><path d="M8 4.2l3.8 6.8H4.2z" fill="#8a2a18" /></svg>}
      {type === 'mocktail' && <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="#4F5528" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2.5h10L8 9v4.5M5 14h6" /><path d="M4.6 4.5h6.8" /></svg>}
      {type === 'alcohol' && <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="#8F2E1C" strokeWidth="1.4" strokeLinejoin="round"><path d="M4 4h7v9.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" /><path d="M11 6.2h1.4a1.3 1.3 0 0 1 1.3 1.3v2.3a1.3 1.3 0 0 1-1.3 1.3H11" /><path d="M3.6 4c0-1.6 1.2-2.4 2.4-2 .6-.9 2.6-.9 3.2.2 1.2-.3 2.1.6 2 1.8" /></svg>}
    </span>
  )
}
export function BadgeIcon({ badge }: { badge: string }) {
  const special = /chef|must|luxury/i.test(badge)
  return (
    <span title={badge} aria-label={badge} role="img" className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#D4A64A]/20 text-[#8F2E1C]">
      {special
        ? <svg viewBox="0 0 16 16" className="h-3 w-3" fill="currentColor"><path d="M8 1.2l2 4.3 4.7.5-3.5 3.2 1 4.6L8 11.5 3.8 13.8l1-4.6L1.3 6l4.7-.5z" /></svg>
        : <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M8 14s-5.5-3.3-5.5-7.2A3 3 0 0 1 8 5a3 3 0 0 1 5.5 1.8C13.5 10.7 8 14 8 14z" /></svg>}
    </span>
  )
}
function Legend({ tab }: { tab: 'food' | 'drinks' }) {
  const items = tab === 'food' ? [['veg', 'Veg'], ['non-veg', 'Non-veg']] : [['alcohol', 'Alcoholic'], ['mocktail', 'Alcohol-free']]
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-5 font-sans text-[11px] text-foam/70">
      {items.map(([t, l]) => <span key={t} className="flex items-center gap-1.5"><TypeIcon type={t} /><span className="mt-1">{l}</span></span>)}
      <span className="flex items-center gap-1.5"><BadgeIcon badge="Chef Special" /> Chef special / must try</span>
      <span className="flex items-center gap-1.5"><BadgeIcon badge="Bestseller" /> Bestseller / popular</span>
    </div>
  )
}
