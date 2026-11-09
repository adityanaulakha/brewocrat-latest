import Taps from './Taps'
import ExperienceCards from './ExperienceCards'
import Plates from './Plates'
import Moments from './Moments'
import Dossier from './Dossier'
import Events from './Events'
import Universes from './Universes'
import Gallery from './Gallery'
import Intro from './Intro'
import Testimonials from './Testimonials'
import Reserve from './Reserve'

/** After the hero: beers, then food and experience, with About and reviews near the end. */
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
      <Intro />
      <Testimonials />
      <Reserve onBook={() => onBook()} />
    </>
  )
}
