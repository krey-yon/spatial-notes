import { cloneElement, isValidElement, useEffect, useRef, useState, type ReactElement } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'

interface TooltipProps {
  /** The single element the tooltip describes. Must accept a ref. */
  children: ReactElement<Record<string, unknown>>
  /** Short description shown to the user. */
  label: string
  /** Optional keyboard shortcut shown next to the label, mono-styled. */
  kbd?: string
  /** Tooltip side relative to the target. Defaults to "top". */
  side?: 'top' | 'bottom'
  /** Delay (ms) before the tooltip appears. Defaults to 320ms. */
  delay?: number
}

const EASE_OUT = [0.16, 1, 0.3, 1] as const

/**
 * Lightweight hover tooltip that portals to <body> so it never gets clipped
 * by parent overflow. The wrapped child must be a single element that
 * forwards a ref (e.g. a <button>). Hover & focus open it; leaving either
 * closes it.
 */
export default function Tooltip({
  children, label, kbd, side = 'top', delay = 320,
}: TooltipProps) {
  const triggerRef = useRef<HTMLElement | null>(null)
  const openTimer = useRef<number | null>(null)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null)

  const isActive = hovered || focused

  useEffect(() => {
    if (!isActive) {
      if (openTimer.current !== null) {
        window.clearTimeout(openTimer.current)
        openTimer.current = null
      }
      setOpen(false)
      return
    }
    openTimer.current = window.setTimeout(() => {
      const el = triggerRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const tooltipW = Math.ceil(label.length * 6.2 + (kbd ? kbd.length * 7.2 + 12 : 0) + 20)
      const tooltipH = 28
      const margin = 8
      const left = Math.max(
        margin,
        Math.min(window.innerWidth - tooltipW - margin, r.left + r.width / 2 - tooltipW / 2),
      )
      const top = side === 'top' ? r.top - tooltipH - 8 : r.bottom + 8
      setPos({ left, top })
      setOpen(true)
    }, delay)
    return () => {
      if (openTimer.current !== null) {
        window.clearTimeout(openTimer.current)
        openTimer.current = null
      }
    }
  }, [isActive, delay, label, kbd, side])

  if (typeof document === 'undefined') return children
  if (!isValidElement(children)) return children

  const childProps = children.props as Record<string, unknown>
  const trigger = cloneElement(children, {
    ref: mergeRefs(
      (childProps.ref as React.Ref<HTMLElement> | undefined) ?? null,
      (node) => { triggerRef.current = node },
    ),
    onMouseEnter: chainHandler(childProps.onMouseEnter, () => setHovered(true)),
    onMouseLeave: chainHandler(childProps.onMouseLeave, () => setHovered(false)),
    onFocus: chainHandler(childProps.onFocus, () => setFocused(true)),
    onBlur: chainHandler(childProps.onBlur, () => setFocused(false)),
  })

  return (
    <>
      {trigger}
      {createPortal(
        <AnimatePresence>
          {open && pos && (
            <motion.div
              key="tooltip"
              role="tooltip"
              initial={{ opacity: 0, y: side === 'top' ? 4 : -4, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: side === 'top' ? 4 : -4, scale: 0.96 }}
              transition={{ duration: 0.14, ease: EASE_OUT }}
              style={{
                position: 'fixed',
                left: pos.left,
                top: pos.top,
                zIndex: 300,
                pointerEvents: 'none',
              }}
              className="glass flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[10.5px] tracking-tight text-ink-900"
            >
              <span>{label}</span>
              {kbd && (
                <kbd className="rounded bg-ink-900/10 px-1 py-px text-[9.5px] text-ink-700 dark:bg-paper/40 dark:text-ink-300">
                  {kbd}
                </kbd>
              )}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  )
}

function mergeRefs(...refs: (React.Ref<HTMLElement> | null)[]) {
  return (node: HTMLElement | null) => {
    for (const r of refs) {
      if (!r) continue
      if (typeof r === 'function') r(node)
      else (r as React.MutableRefObject<HTMLElement | null>).current = node
    }
  }
}

function chainHandler(existing: unknown, next: () => void) {
  if (typeof existing !== 'function') return next
  return (e: unknown) => {
    ;(existing as (e: unknown) => void)(e)
    next()
  }
}
