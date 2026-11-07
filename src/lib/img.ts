import map from '../data/responsive.json'

const R = map as Record<string, { w: number; s: string }>

/** Responsive props for a site image: an 800w WebP alongside the original, so phones fetch the small one. */
export function rs(src: string, sizes = '100vw') {
  const r = R[src]
  return r ? { srcSet: `${r.s} 800w, ${src} ${r.w}w`, sizes } : {}
}

/** The 800w variant if one exists (for small thumbnails). */
export const small = (src: string) => R[src]?.s ?? src
