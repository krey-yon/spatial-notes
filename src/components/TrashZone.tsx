import { forwardRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'

const EASE_OUT = [0.16, 1, 0.3, 1] as const

interface Props {
  visible: boolean
  active: boolean
}

/**
 * Drop target shown while a note is being dragged. The Canvas tracks pointer
 * position via a window-level listener (because pointer capture pins all
 * events to the dragged Note) and flips `active` when the cursor enters our
 * rect. On drop the Note checks the same flag and routes to `onDelete`.
 */
const TrashZone = forwardRef<HTMLDivElement, Props>(function TrashZone(
  { visible, active }, ref,
) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 28, scale: 0.92 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: active ? 1.08 : 1,
          }}
          exit={{ opacity: 0, y: 28, scale: 0.92 }}
          transition={{ duration: 0.24, ease: EASE_OUT }}
          className="fixed bottom-7 left-1/2 z-50 -translate-x-1/2"
          style={{ pointerEvents: 'none' }}
        >
          <motion.div
            animate={{
              backgroundColor: active
                ? 'rgba(235, 68, 90, 0.94)'
                : 'color-mix(in oklab, var(--color-ink-50) 76%, transparent)',
              color: active ? '#ffffff' : 'var(--color-ink-700)',
            }}
            transition={{ duration: 0.18, ease: EASE_OUT }}
            style={{
              boxShadow: active
                ? '0 18px 44px -12px rgba(235,68,90,0.70), 0 0 0 1px rgba(255,117,143,0.48), inset 0 1px 0 rgba(255,255,255,0.22)'
                : 'inset 0 1px 0 color-mix(in oklab, var(--color-ink-900) 8%, transparent), ' +
                  'inset 0 0 0 0.5px color-mix(in oklab, var(--color-ink-900) 6%, transparent), ' +
                  '0 6px 14px -4px rgba(0,0,0,0.20), ' +
                  '0 22px 48px -12px rgba(0,0,0,0.30)',
              backdropFilter: 'saturate(220%) blur(32px)',
              WebkitBackdropFilter: 'saturate(220%) blur(32px)',
            }}
            className="flex h-12 items-center gap-3 rounded-[16px] border border-ink-900/[0.09] px-4 pr-5"
          >
            <motion.div
              animate={{ rotate: active ? -8 : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 18 }}
              className="grid h-7 w-7 place-items-center rounded-[9px] bg-ink-900/[0.09]"
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <path d="M3.5 4h9M6 4V2.75A.75.75 0 016.75 2h2.5a.75.75 0 01.75.75V4M5 4l.55 9.25A.75.75 0 006.3 14h3.4a.75.75 0 00.75-.75L11 4M6.75 6.5v5M9.25 6.5v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
            <span className="font-medium text-[12px] tracking-[-0.01em]">
              {active ? 'Release to remove' : 'Move to trash'}
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
})

export default TrashZone
