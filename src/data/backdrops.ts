/**
 * Illustrated backdrop slots from the Meeting 2 review.
 * The client files are not in the repo yet. `src` stays null so the page
 * requests nothing, paints nothing, and does not shift when the slot is empty.
 * When a real WebP arrives, set `src` (and optional `srcSet`) only — no stand-in art.
 *
 * Planned files, once supplied:
 * - ivory facade / ivory art → experience, about
 * - red music stage → events
 * - red brewery tanks → taps (microbrewery)
 * - olive cocktail with palace arch → skybar
 * - dark candlelit dining table → moments
 * - dark night facade → visit, footer
 * Not assigned yet (do not invent a section for them): olive facade, red facade,
 * ivory beer tap pour, ivory orange spritz.
 */
export type BackdropTone = 'ivory' | 'red' | 'olive' | 'dark'

export type BackdropSlot = {
  id: string
  src: string | null
  srcSet?: string
  tone: BackdropTone
}

export const backdropSlots = {
  experience: { id: 'experience', src: null, tone: 'ivory' },
  about: { id: 'about', src: null, tone: 'ivory' },
  events: { id: 'events', src: null, tone: 'red' },
  taps: { id: 'taps', src: null, tone: 'ivory' },
  skybar: { id: 'skybar', src: null, tone: 'olive' },
  moments: { id: 'moments', src: null, tone: 'ivory' },
  visit: { id: 'visit', src: null, tone: 'olive' },
  footer: { id: 'footer', src: null, tone: 'ivory' },
} satisfies Record<string, BackdropSlot>
