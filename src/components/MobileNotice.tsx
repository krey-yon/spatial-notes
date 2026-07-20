import { motion, type Variants } from 'motion/react'

const EASE_OUT = [0.16, 1, 0.3, 1] as const

const STICKIES = [
  { tint: 'var(--color-note-ocean)',   accent: 'var(--color-accent-ocean)',   rot: -8, x: -24, y: -7 },
  { tint: 'var(--color-note-emerald)', accent: 'var(--color-accent-emerald)', rot:  7, x:  24, y: -14 },
  { tint: 'var(--color-note-violet)',  accent: 'var(--color-accent-violet)',  rot: -2, x:  -5, y:  20 },
]

const wrap: Variants = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const stickyVariants: Variants = {
  initial: { opacity: 0, y: -60, rotate: 0, scale: 0.6 },
  animate: (i: number) => ({
    opacity: 1,
    y: STICKIES[i]!.y,
    x: STICKIES[i]!.x,
    rotate: STICKIES[i]!.rot,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 280,
      damping: 16,
      mass: 0.9,
      delay: 0.08 * i,
    },
  }),
}

const floatVariants: Variants = {
  initial: {},
  animate: (i: number) => ({
    y: [STICKIES[i]!.y, STICKIES[i]!.y - 4, STICKIES[i]!.y],
    transition: {
      duration: 3 + i * 0.4,
      ease: 'easeInOut',
      delay: 1.2 + i * 0.15,
    },
  }),
}

const textVariants: Variants = {
  initial: { opacity: 0, y: 14 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 340, damping: 30 },
  },
}

export default function MobileNotice() {
  return (
    <main className="canvas-aurora fixed inset-0 grid place-items-center overflow-hidden bg-paper text-ink-900">
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ opacity: { duration: 1.2, ease: EASE_OUT } }}
        className="canvas-vignette pointer-events-none absolute inset-0"
      />
      <div aria-hidden className="noise-overlay pointer-events-none absolute inset-0" />

      <motion.div
        variants={wrap}
        initial="initial"
        animate="animate"
        className="relative z-10 flex max-w-[430px] flex-col items-center px-7 text-center"
      >
        {/* Brand */}
        <motion.div
          variants={textVariants}
          className="workspace-pill mb-8 flex items-center gap-2.5 rounded-2xl p-1.5 pr-4"
        >
          <img src="/vellum-mark.svg" alt="" aria-hidden className="h-9 w-9 rounded-[11px]" />
          <span className="text-[15px] font-semibold tracking-[-0.025em] text-ink-900">
            Vellum
          </span>
        </motion.div>

        {/* Sticky-note stack — drops in, then idles with a slow float */}
        <div className="relative mb-10 h-32 w-36">
          {STICKIES.map((s, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={stickyVariants}
              className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 overflow-hidden border border-white/10"
              style={{
                background: s.tint,
                borderRadius: '18px',
                boxShadow:
                  '0 1px 2px rgba(0,0,0,0.05), ' +
                  '0 6px 14px -4px rgba(0,0,0,0.10), ' +
                  `0 20px 40px -12px ${s.accent}55, ` +
                  'inset 0 1px 0 rgba(255,255,255,0.5)',
              }}
            >
              <motion.div
                custom={i}
                variants={floatVariants}
                className="h-full w-full"
              />
              {/* A few "text" hint lines */}
              <div className="absolute inset-0 flex flex-col gap-1.5 p-3">
                <span className="h-1 w-10 rounded-full bg-ink-900/15" />
                <span className="h-1 w-14 rounded-full bg-ink-900/15" />
                <span className="h-1 w-8 rounded-full bg-ink-900/15" />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={textVariants}
          className="workspace-pill mb-4 rounded-full px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-ink-500"
        >
          Designed for visual thinking
        </motion.div>

        <motion.h1
          variants={textVariants}
          className="text-[38px] font-semibold leading-[1.02] tracking-[-0.05em] text-ink-900"
        >
          A larger canvas,<br />by design.
        </motion.h1>

        <motion.p
          variants={textVariants}
          className="mt-5 text-[15px] leading-[1.55] tracking-[-0.01em] text-ink-600"
        >
          Vellum uses space as part of the tool. Open it on an{' '}
          <span className="font-semibold text-ink-800">iPad or desktop</span>{' '}
          to arrange ideas with the room they deserve.
        </motion.p>

        <motion.div variants={textVariants} className="mt-7 flex gap-2">
          <span className="workspace-pill rounded-lg px-3 py-2 font-mono text-[9px] uppercase tracking-[0.08em] text-ink-600">iPad</span>
          <span className="workspace-pill rounded-lg px-3 py-2 font-mono text-[9px] uppercase tracking-[0.08em] text-ink-600">Desktop</span>
        </motion.div>

      </motion.div>
    </main>
  )
}
