import { useState } from 'react'

/**
 * Section backdrop: tall portrait art sits on the RIGHT on desktop (text left),
 * and becomes a cover background on mobile with a legibility gradient.
 */
export default function Backdrop({
  src, srcSet, alt = '', tone = 'dark', className = '',
}: {
  src: string
  srcSet?: string
  alt?: string
  tone?: 'dark' | 'light' | 'red' | 'olive'
  className?: string
}) {
  const [ok, setOk] = useState(true)
  if (!ok) return null
  const wash = {
    dark: 'linear-gradient(90deg, rgba(10,8,6,.92) 0%, rgba(10,8,6,.78) 42%, rgba(10,8,6,.35) 70%, rgba(10,8,6,.15) 100%)',
    light: 'linear-gradient(90deg, rgba(233,220,196,.97) 0%, rgba(233,220,196,.88) 45%, rgba(233,220,196,.35) 72%, rgba(233,220,196,.12) 100%)',
    red: 'linear-gradient(90deg, rgba(90,24,14,.94) 0%, rgba(90,24,14,.78) 42%, rgba(90,24,14,.3) 70%, rgba(90,24,14,.1) 100%)',
    olive: 'linear-gradient(90deg, rgba(40,45,20,.94) 0%, rgba(40,45,20,.78) 42%, rgba(40,45,20,.3) 70%, rgba(40,45,20,.1) 100%)',
  }[tone]
  const washM = {
    dark: 'linear-gradient(180deg, rgba(10,8,6,.55) 0%, rgba(10,8,6,.78) 55%, rgba(10,8,6,.92) 100%)',
    light: 'linear-gradient(180deg, rgba(233,220,196,.55) 0%, rgba(233,220,196,.82) 55%, rgba(233,220,196,.95) 100%)',
    red: 'linear-gradient(180deg, rgba(90,24,14,.45) 0%, rgba(90,24,14,.75) 55%, rgba(90,24,14,.92) 100%)',
    olive: 'linear-gradient(180deg, rgba(40,45,20,.45) 0%, rgba(40,45,20,.75) 55%, rgba(40,45,20,.92) 100%)',
  }[tone]
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <picture>
        <source type="image/avif" srcSet={src.replace(/\.webp(\s|$)/, '.avif$1').replace(/\.webp$/, '.avif')} />
        <img src={src} srcSet={srcSet} alt={alt} loading="lazy" decoding="async" onError={() => setOk(false)}
          className="absolute inset-0 h-full w-full object-cover object-[72%_center] sm:object-right" />
      </picture>
      <div className="absolute inset-0 hidden sm:block" style={{ background: wash }} />
      <div className="absolute inset-0 sm:hidden" style={{ background: washM }} />
    </div>
  )
}
