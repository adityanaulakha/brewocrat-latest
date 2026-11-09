import { Link, useLocation, useNavigate } from 'react-router-dom'
import { brand, contact, footerImages } from '../data/content'
import { backdropSlots } from '../data/backdrops'
import { Icon, Reveal } from './ui'
import Backdrop from './Backdrop'
import { getLenis, scrollToId } from '../lib/scroll'

const explore = [
  { label: 'About', id: 'about' },
  { label: 'Taps', id: 'taps' },
  { label: 'Kitchen', id: 'plates' },
  { label: 'Moments', id: 'moments' },
  { label: 'Live', id: 'events' },
  { label: 'Gallery', id: 'gallery' },
  { label: 'Visit', id: 'visit' },
]

const social = [
  { h: contact.instagram, i: <Icon.Instagram />, l: 'Instagram' },
  { h: contact.facebook, i: <Icon.Facebook />, l: 'Facebook' },
  { h: contact.zomato, i: <Icon.Fork />, l: 'Zomato' },
]

function Col({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <h3 className="font-sans text-[10.5px] font-extrabold uppercase tracking-[0.26em] text-brass">{title}</h3>
      <div className="mt-5 space-y-2 font-sans text-[14px] leading-relaxed text-foam/80">{children}</div>
    </div>
  )
}

/** Warm-ivory footer: typographic wordmark, four ordered columns, quiet bottom bar. No background artwork. */
export default function Footer() {
  const loc = useLocation()
  const nav = useNavigate()
  const go = (id: string) => (loc.pathname !== '/' ? (nav('/'), setTimeout(() => scrollToId(id), 350)) : scrollToId(id))
  const top = () => { const l = getLenis(); l ? l.scrollTo(0, { duration: 1.6 }) : window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const link = 'transition-colors duration-500 hover:text-brass'

  return (
    <footer className="t-ivory relative overflow-hidden bg-ink">
      <Backdrop slot={backdropSlots.footer} />
      <div className="relative z-10 h-px bg-brass/25" />
      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-12 sm:px-10 lg:pt-20">
        <Reveal className="flex flex-col gap-8 border-b border-foam/10 pb-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-md">
            <img src={brand.logo} alt="Brewocrat Logo" loading="lazy" className="h-14 w-auto sm:h-16" />
            <p className="mt-6 font-display text-[2rem] font-bold leading-[1.1] text-foam sm:text-[2.6rem]">
              Brewery. <span className="text-brass">Skybar.</span> Kitchen.
            </p>
          </div>
          <div className="flex items-end gap-4">
            {footerImages.map((f) => (
              <img key={f.src} src={f.src} alt={f.alt} loading="lazy" className="lift h-36 w-28 rounded-[1.35rem] object-cover sm:h-44 sm:w-32" />
            ))}
          </div>
        </Reveal>

        {/* columns */}
        <Reveal className="grid grid-cols-1 gap-x-10 gap-y-8 py-8 sm:grid-cols-2 lg:grid-cols-4 lg:py-14">
          <Col title="Visit Us">
            <p>{contact.addressFooter}</p>
            <a href={contact.mapLink} target="_blank" rel="noreferrer" className="btn-line mt-3 !text-[10.5px]">Get directions <Icon.Arrow className="h-3 w-3" /></a>
          </Col>
          <Col title="Hours">
            <p className="font-display text-2xl leading-tight text-foam">{contact.hoursDays}</p>
            <p>{contact.hoursFooter}</p>
          </Col>
          <Col title="Reservations">
            <p><a href={contact.phone1Href} className={link}>{contact.phone1}</a></p>
            <p><a href={contact.phone2Href} className={link}>{contact.phone2}</a></p>
            <p><a href={`mailto:${contact.email}`} className={link}>{contact.email}</a></p>
          </Col>
          <Col title="Explore">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
              {explore.map((e) => <li key={e.id}><button onClick={() => go(e.id)} className={link}>{e.label}</button></li>)}
              <li><Link to="/menu" className={link}>Menu</Link></li>
            </ul>
            <div className="flex gap-3 pt-5">
              {social.map((s) => (
                <a key={s.l} href={s.h} target="_blank" rel="noreferrer" aria-label={s.l}
                  className="grid h-10 w-10 place-items-center rounded-full border border-foam/20 text-foam/80 transition-colors duration-500 hover:border-brass hover:text-brass">{s.i}</a>
              ))}
            </div>
          </Col>
        </Reveal>
      </div>

      {/* typographic wordmark — fit exact viewport width on mobile */}
      <div aria-hidden className="select-none overflow-hidden px-3 sm:px-6">
        <svg viewBox="0 0 100 16" className="mx-auto block w-full max-w-7xl text-foam/[.18]" preserveAspectRatio="xMidYMid meet">
          <text x="50" y="13.2" textAnchor="middle" fill="currentColor" fontFamily="Fraunces, Georgia, serif" fontWeight="700" fontSize="14" letterSpacing="0.04em" textLength="96" lengthAdjust="spacingAndGlyphs">BREWOCRAT</text>
        </svg>
      </div>

      <div className="border-t border-foam/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 py-7 text-center sm:px-10 md:flex-row md:justify-between md:text-left">
          <p className="font-sans text-xs text-foam/60">{contact.copyright}</p>
          <div className="flex items-center gap-5">
            <p className="font-sans text-xs text-foam/60">Designed and Developed by <a href={contact.credit.href} target="_blank" rel="noreferrer" className="underline hover:text-brass">{contact.credit.label}</a></p>
            <button aria-label="Scroll to top" onClick={top} className="grid h-10 w-10 place-items-center rounded-full bg-cta text-[#FBF3E6] shadow-[0_10px_22px_-12px_rgba(28,30,16,.7)] transition-[filter] duration-500 hover:brightness-110"><Icon.Arrow className="h-4 w-4 -rotate-90" /></button>
          </div>
        </div>
      </div>
    </footer>
  )
}
