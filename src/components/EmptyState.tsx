import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

const PHRASES = [
  'Give ideas room.',
  'Think out loud.',
  'Map what matters.',
  'Start anywhere.',
  'Make space to think.',
] as const

const ROTATE_MS = 3600
const STAGGER = 0.025
const EASE_OUT = [0.16, 1, 0.3, 1] as const

const containerVariants = {
  enter: { transition: { staggerChildren: STAGGER } },
  exit:  { transition: { staggerChildren: STAGGER * 0.5, staggerDirection: -1 } },
}

const letterVariants = {
  initial: { opacity: 0, y: 14, filter: 'blur(6px)' },
  enter:   { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: EASE_OUT } },
  exit:    { opacity: 0, y: -10, filter: 'blur(6px)', transition: { duration: 0.35, ease: EASE_OUT } },
}

export default function EmptyState() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % PHRASES.length), ROTATE_MS)
    return () => clearInterval(t)
  }, [])

  const phrase = PHRASES[index]

  return (
    <div className="relative flex min-w-[560px] flex-col items-center text-center select-none">
      <div aria-hidden className="absolute left-1/2 top-1/2 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-action)_17%,transparent),transparent_68%)] blur-2xl" />

      <motion.div
        initial={{ opacity: 0, y: 8, scale: .96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: .55, ease: EASE_OUT }}
        className="workspace-pill mb-6 flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-ink-600"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent-emerald)] shadow-[0_0_8px_var(--color-accent-emerald)]" />
        Your private canvas
      </motion.div>

      {/* Animated, rotating headline */}
      <div className="relative h-[52px] overflow-visible">
        <AnimatePresence mode="wait">
          <motion.h2
            key={phrase}
            variants={containerVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            className="text-[48px] font-semibold leading-none tracking-[-0.055em] text-ink-900"
          >
            {phrase.split('').map((ch, i) => (
              <motion.span
                key={`${i}-${ch}`}
                variants={letterVariants}
                style={{ display: 'inline-block', whiteSpace: 'pre' }}
              >
                {ch}
              </motion.span>
            ))}
          </motion.h2>
        </AnimatePresence>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.7, ease: EASE_OUT }}
        className="mt-4 max-w-[410px] text-[14px] leading-relaxed text-ink-500"
      >
        A fluid workspace for notes, checklists, and the half-formed thoughts worth keeping.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: .62, duration: .55, ease: EASE_OUT }}
        className="mt-7 flex items-center gap-2"
      >
        <span className="workspace-pill rounded-lg px-2.5 py-1.5 font-mono text-[9.5px] text-ink-600">Double-click</span>
        <span className="text-[11px] text-ink-400">or</span>
        <span className="workspace-pill rounded-lg px-2.5 py-1.5 font-mono text-[9.5px] text-ink-600">⌘ N</span>
        <span className="ml-1 text-[11px] text-ink-500">to create a memory</span>
      </motion.div>
    </div>
  )
}
