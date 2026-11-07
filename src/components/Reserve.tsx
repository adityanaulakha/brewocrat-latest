import { contact } from '../data/content'
import { Icon, Reveal, SplitHeading } from './ui'

export default function Reserve({ onBook }: { onBook: () => void }) {
  return (
    <section id="visit" className="t-olive relative overflow-hidden bg-cask py-14 lg:py-20">
      <div className="pointer-events-none absolute -left-40 top-0 h-[600px] w-[600px] rounded-full opacity-40 blur-3xl" style={{ background: 'radial-gradient(circle, rgba(92,99,48,.18), transparent 65%)' }} />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 sm:px-10 lg:grid-cols-2 lg:items-center">
        <div>
          <Reveal><span className="eyebrow">Instant table booking</span></Reveal>
          <SplitHeading text="Reserve your table" accent="beneath the stars" className="mt-3 font-display text-5xl font-bold uppercase leading-[0.95] text-foam sm:text-7xl" />
          <Reveal delay={0.15}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button onClick={onBook} className="btn-gold"><Icon.Calendar /> Instant table booking <Icon.Arrow /></button>
              <a href={contact.phone1Href} className="btn-ghost"><Icon.Phone /> Call: {contact.phone1}</a>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-10 overflow-hidden rounded-2xl border border-brass/20">
              <iframe title="Brewocrat on Google Maps" src={contact.mapEmbed} className="h-[260px] w-full grayscale-[60%] invert-[90%] hue-rotate-180 contrast-[.9]" loading="lazy" />
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <div className="card-glass divide-y divide-brass/15 rounded-2xl p-7 text-center sm:p-10">
            <div className="pb-7">
              <div className="eyebrow flex items-center justify-center gap-2"><Icon.Pin className="h-3.5 w-3.5" /> Location & Valet</div>
              <p className="mt-3 font-display text-2xl text-foam">{contact.fullName}</p>
              <p className="mt-2 font-sans text-sm text-foam/65">{contact.addressShort}</p>
              <a href={contact.mapLink} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-brass hover:underline">Get directions <Icon.Arrow className="h-3.5 w-3.5" /></a>
            </div>
            <div className="py-7">
              <div className="eyebrow flex items-center justify-center gap-2"><Icon.Clock className="h-3.5 w-3.5" /> Operating Hours</div>
              <p className="mt-3 font-display text-2xl text-foam">{contact.hoursDays}</p>
              <p className="mt-1 font-sans text-sm text-foam/65">{contact.hours}</p>
            </div>
            <div className="pt-7">
              <div className="eyebrow flex items-center justify-center gap-2"><Icon.Phone className="h-3.5 w-3.5" /> Direct Contact</div>
              <p className="mt-3 font-sans text-sm text-foam/75">Phone: <a className="text-brass hover:underline" href={contact.phone1Href}>{contact.phone1}</a> / <a className="text-brass hover:underline" href={contact.phone2Href}>{contact.phone2}</a></p>
              <p className="mt-1 font-sans text-sm text-foam/75"><a className="hover:text-brass" href={`mailto:${contact.email}`}>{contact.email}</a></p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
