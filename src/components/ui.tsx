import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

export const ease = [0.22, 1, 0.36, 1] as const

export function Reveal({ children, delay = 0, y = 14, className = '', once = true }: { children: ReactNode; delay?: number; y?: number; className?: string; once?: boolean }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-80px' }} transition={{ duration: 1.4, delay, ease: [0.25, 0.1, 0.25, 1] }}>
      {children}
    </motion.div>
  )
}

// headings settle in with a slow, quiet fade (no slide-up per word)
const wordV: Variants = { hidden: { opacity: 0, y: 8 }, show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 1.4, delay: i * 0.05, ease: [0.25, 0.1, 0.25, 1] } }) }

export function SplitHeading({ text, className = '', accent, as: Tag = 'h2' }: { text: string; className?: string; accent?: string; as?: 'h1' | 'h2' | 'h3' }) {
  const words = text.split(' ')
  const accWords = accent ? accent.split(' ') : []
  const all = [...words.map((w) => ({ w, a: false })), ...accWords.map((w) => ({ w, a: true }))]
  return (
    <Tag className={className}>
      <motion.span className="inline" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>
        {all.map(({ w, a }, i) => (
          <span key={i} className="inline-block pb-[0.08em] align-bottom">
            <motion.span custom={i} variants={wordV} className={`inline-block ${a ? 'gold-text italic' : ''}`}>{w}&nbsp;</motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  )
}

export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="h-px w-10 bg-brass/40" />
      <span className="eyebrow">{children}</span>
      <span className="h-px w-10 bg-brass/40" />
    </div>
  )
}

type P = { className?: string }
export const Icon = {
  Arrow: ({ className = 'h-4 w-4' }: P) => (<svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>),
  Left: ({ className = 'h-4 w-4' }: P) => (<svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>),
  Right: ({ className = 'h-4 w-4' }: P) => (<svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>),
  Phone: ({ className = 'h-4 w-4' }: P) => (<svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></svg>),
  Pin: ({ className = 'h-4 w-4' }: P) => (<svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></svg>),
  Clock: ({ className = 'h-4 w-4' }: P) => (<svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>),
  Mail: ({ className = 'h-4 w-4' }: P) => (<svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>),
  Calendar: ({ className = 'h-4 w-4' }: P) => (<svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></svg>),
  Star: ({ className = 'h-4 w-4' }: P) => (<svg viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M12 2l3 6.9 7.5.7-5.7 5 1.7 7.4L12 18.3 5.5 22l1.7-7.4-5.7-5 7.5-.7z" /></svg>),
  Check: ({ className = 'h-3.5 w-3.5' }: P) => (<svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg>),
  Close: ({ className = 'h-5 w-5' }: P) => (<svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>),
  Menu: ({ className = 'h-5 w-5' }: P) => (<svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 7h16M8 12h12M4 17h16" /></svg>),
  Quote: ({ className = 'h-10 w-10' }: P) => (<svg viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M9.5 6C6.5 7.2 4.5 9.9 4.5 13.2V18h5.6v-5.6H7.4c.1-2 1.3-3.6 3.1-4.4L9.5 6zm9 0c-3 1.2-5 3.9-5 7.2V18h5.6v-5.6h-2.7c.1-2 1.3-3.6 3.1-4.4L18.5 6z" /></svg>),
  Facebook: ({ className = 'h-4 w-4' }: P) => (<svg viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M14 9h3V5.5h-3c-2.5 0-4 1.7-4 4.1V12H7.5v3.5H10V22h3.6v-6.5h3l.5-3.5h-3.5V9.9c0-.6.3-.9.9-.9z" /></svg>),
  Instagram: ({ className = 'h-4 w-4' }: P) => (<svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>),
  Fork: ({ className = 'h-4 w-4' }: P) => (<svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M7 2v8a2 2 0 0 0 2 2v10M11 2v8a2 2 0 0 1-2 2M7 2v6M17 2c-1.7 1-3 3.5-3 7 0 1.7 1 3 3 3v10" /></svg>),
  WhatsApp: ({ className = 'h-4 w-4' }: P) => (<svg viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.3-.4.8-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1 0-.2-.1-.5-.2z" /></svg>),
}
