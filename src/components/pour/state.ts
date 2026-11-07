/** Shared, mutable animation state. The GSAP master timeline (in Preloader) tweens these numbers;
 *  the lazily loaded 3D scene reads them every frame. Kept tiny so it stays in the main bundle. */
export const pour = {
  handle: 0, // 0 rest → 1 pulled forward
  flow: 0, // stream thickness 0..1
  head: 0, // stream front: 0 at nozzle → 1 reached the liquid
  tail: 0, // stream tail after shut-off: 0 attached → 1 fully fallen
  fill: 0, // liquid level 0..1 of the final level
  foam: 0, // foam head 0..1 of its final height
  churn: 0, // aeration/cloudiness while pouring
  cam: 0, // slow dolly 0..1
  dive: 0, // final push into the liquid 0..1
  drips: 0, // incremented to release a drip from the nozzle
  time: 0, // master timeline time (s)
}
export type PourState = typeof pour
