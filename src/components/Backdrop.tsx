import { useState } from 'react'
import type { BackdropSlot, BackdropTone } from '../data/backdrops'

const wash: Record<BackdropTone, { desk: string; mobile: string }> = {
  ivory: {
    desk: 'linear-gradient(90deg, rgba(233,220,196,.94) 0%, rgba(233,220,196,.86) 46%, rgba(233,220,196,.42) 72%, rgba(233,220,196,.16) 100%)',
    mobile: 'linear-gradient(180deg, rgba(233,220,196,.72) 0%, rgba(233,220,196,.88) 42%, rgba(233,220,196,.94) 100%)',
  },
  red: {
    desk: 'linear-gradient(90deg, rgba(122,36,22,.94) 0%, rgba(122,36,22,.82) 46%, rgba(122,36,22,.4) 72%, rgba(122,36,22,.14) 100%)',
    mobile: 'linear-gradient(180deg, rgba(122,36,22,.62) 0%, rgba(122,36,22,.84) 46%, rgba(122,36,22,.94) 100%)',
  },
  olive: {
    desk: 'linear-gradient(90deg, rgba(28,30,16,.94) 0%, rgba(40,45,20,.84) 46%, rgba(40,45,20,.4) 72%, rgba(40,45,20,.14) 100%)',
    mobile: 'linear-gradient(180deg, rgba(28,30,16,.6) 0%, rgba(40,45,20,.82) 46%, rgba(28,30,16,.94) 100%)',
  },
  dark: {
    desk: 'linear-gradient(90deg, rgba(18,16,12,.94) 0%, rgba(18,16,12,.8) 46%, rgba(18,16,12,.38) 72%, rgba(18,16,12,.14) 100%)',
    mobile: 'linear-gradient(180deg, rgba(18,16,12,.58) 0%, rgba(18,16,12,.82) 46%, rgba(18,16,12,.94) 100%)',
  },
}

/**
 * Legibility wash for a section illustration.
 * Empty slots render nothing (no request, no box). Art, when present, is
 * absolutely positioned so it cannot shift layout.
 */
export default function Backdrop({ slot }: { slot: BackdropSlot }) {
  const [ok, setOk] = useState(true)
  if (!slot.src || !ok) return null
  const tone = wash[slot.tone]
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden" data-backdrop={slot.id}>
      <img
        src={slot.src}
        srcSet={slot.srcSet}
        sizes="100vw"
        alt=""
        loading="lazy"
        decoding="async"
        onError={() => setOk(false)}
        className="absolute inset-0 h-full w-full object-cover object-[70%_center]"
      />
      <div className="absolute inset-0 hidden sm:block" style={{ background: tone.desk }} />
      <div className="absolute inset-0 sm:hidden" style={{ background: tone.mobile }} />
    </div>
  )
}
