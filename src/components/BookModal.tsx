import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Icon, ease } from './ui'
import { bookingCopy, contact } from '../data/content'
import { getLenis } from '../lib/scroll'

export default function BookModal({ open, onClose, preset }: { open: boolean; onClose: () => void; preset?: string }) {
  const [f, setF] = useState({ name: '', phone: '', date: '', time: '', guests: '2', zone: bookingCopy.zones[0], notes: '' })
  useEffect(() => {
    const l = getLenis()
    if (open) { l?.stop(); document.body.style.overflow = 'hidden' } else { l?.start(); document.body.style.overflow = '' }
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [open, onClose])
  useEffect(() => {
    if (!preset) return
    setF((s) => {
      const next = { ...s, notes: preset }
      const m = /Preferred zone:\s*(.+)$/i.exec(preset)
      if (m) {
        const want = m[1].trim()
        const hit = bookingCopy.zones.find((z) => z.toLowerCase() === want.toLowerCase() || want.toLowerCase().includes(z.toLowerCase()) || z.toLowerCase().includes(want.toLowerCase()))
        if (hit) next.zone = hit
      }
      return next
    })
  }, [preset])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const msg = `Hi Brewocrat, I'd like to reserve a table.%0AName: ${f.name}%0APhone: ${f.phone}%0ADate: ${f.date}%0ATime: ${f.time}%0AGuests: ${f.guests}%0APreferred zone: ${f.zone}${f.notes ? `%0ANotes: ${f.notes}` : ''}`
    window.open(`${contact.whatsapp}?text=${msg.replace(/ /g, '%20')}`, '_blank', 'noopener')
  }
  const field = 'w-full rounded-xl border border-foam/12 bg-foam/[.04] px-4 py-3 font-sans text-sm text-foam placeholder:text-foam/35 outline-none transition focus:border-brass/70 focus:bg-foam/[.07]'
  const label = 'mb-1.5 block font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-honey/70'

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div role="dialog" aria-modal="true" aria-label="Book a table"
            className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-brass/20 bg-gradient-to-b from-malt to-cask p-6 shadow-2xl sm:rounded-3xl sm:p-10"
            initial={{ y: 60, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ duration: 0.5, ease }}
            data-lenis-prevent>
            <button onClick={onClose} aria-label="Close modal" className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-foam/15 text-foam/70 hover:text-brass"><Icon.Close /></button>
            <span className="eyebrow">{bookingCopy.eyebrow}</span>
            <h3 className="mt-3 font-display text-3xl font-bold text-foam sm:text-4xl">{bookingCopy.title}</h3>
            <p className="mt-2 font-sans text-sm text-foam/60">{bookingCopy.desc}</p>

            <form onSubmit={submit} className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div><label className={label}>Your name</label><input required className={field} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
              <div><label className={label}>Phone number</label><input required type="tel" className={field} value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></div>
              <div><label className={label}>Date</label><input required type="date" className={field} value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} /></div>
              <div><label className={label}>Time</label><input required type="time" className={field} value={f.time} onChange={(e) => setF({ ...f, time: e.target.value })} /></div>
              <div><label className={label}>Guests</label><input required type="number" min={1} className={field} value={f.guests} onChange={(e) => setF({ ...f, guests: e.target.value })} /></div>
              <div><label className={label}>Preferred zone</label>
                <select className={field} value={f.zone} onChange={(e) => setF({ ...f, zone: e.target.value })}>
                  {bookingCopy.zones.map((z) => <option key={z} className="bg-cask">{z}</option>)}
                </select></div>
              <div className="sm:col-span-2"><label className={label}>Special notes</label><textarea rows={3} className={field} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} /></div>
              <button type="submit" className="btn-gold sm:col-span-2"><Icon.WhatsApp /> Request a reservation</button>
            </form>
            <p className="mt-5 text-center font-sans text-xs text-foam/50">
              {bookingCopy.special} <a className="text-brass hover:underline" href={contact.phone1Href}>{contact.phone1}</a> / <a className="text-brass hover:underline" href={contact.phone2Href}>{contact.phone2}</a> · <a className="text-brass hover:underline" href={`mailto:${contact.email}`}>{contact.email}</a>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
