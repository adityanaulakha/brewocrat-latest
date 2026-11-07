import Taps from './Taps'
import ExperienceCards from './ExperienceCards'
import Plates from './Plates'
import Moments from './Moments'
import Dossier from './Dossier'
import Events from './Events'
import Universes from './Universes'
import Gallery from './Gallery'
import Reserve from './Reserve'
import Testimonials from './Testimonials'

/** Everything below About; loaded as its own chunk after the preloader hands off. */
export default function BelowFold({ onBook }: { onBook: (n?: string) => void }) {
  return (
    <>
      <Taps onBook={() => onBook()} />
      <ExperienceCards />
      <Plates onBook={onBook} />
      <Moments onBook={onBook} />
      <Dossier onBook={onBook} />
      <Events onBook={onBook} />
      <Universes onBook={onBook} />
      <Gallery />
      <Reserve onBook={() => onBook()} />
      <Testimonials />
    </>
  )
}
