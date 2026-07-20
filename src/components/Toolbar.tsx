import { memo } from 'react'
import { motion } from 'motion/react'
import { useTheme } from '../hooks/useTheme'
import type { SoundName } from '../lib/sounds'
import Tooltip from './Tooltip'

export type CursorMode = 'hand' | 'select'

interface Props {
  scale: number
  count: number
  soundEnabled: boolean
  cursorMode: CursorMode
  dimmed?: boolean
  hasSelection?: boolean
  isEditing?: boolean
  onZoomIn: () => void
  onZoomOut: () => void
  onResetView: () => void
  onAdd: () => void
  onToggleSound: () => void
  onToggleCursorMode: () => void
  onReplayTour: () => void
  playSound: (s: SoundName) => void
}

const EASE_OUT = [0.16, 1, 0.3, 1] as const

const BRAND_INITIAL = { opacity: 0, y: -8 }
const BRAND_ANIMATE = { opacity: 1, y: 0 }
const BRAND_TRANSITION = { delay: 0.1, ease: EASE_OUT, duration: 0.5 }

const Brand = memo(function Brand({ count }: { count: number }) {
  return (
    <motion.div
      initial={BRAND_INITIAL}
      animate={BRAND_ANIMATE}
      transition={BRAND_TRANSITION}
      className="workspace-pill pointer-events-none fixed left-6 top-6 z-50 flex items-center gap-3 rounded-[18px] p-1.5 pr-4"
    >
      <img src="/vellum-mark.svg" alt="" aria-hidden className="h-9 w-9 rounded-[11px]" />
      <div className="leading-none">
        <div className="flex items-baseline gap-1.5">
          <span className="text-[14px] font-semibold tracking-[-0.025em] text-ink-900">
            Vellum
          </span>
          <span className="rounded-full bg-ink-900/[0.07] px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-[0.08em] text-ink-500">Local</span>
        </div>
        <div className="mt-1.5 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.08em] text-ink-500">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent-emerald)] shadow-[0_0_8px_var(--color-accent-emerald)]" />
          {count} {count === 1 ? 'memory' : 'memories'}
        </div>
      </div>
    </motion.div>
  )
})

function IconButton({
  label, onClick, primary, active, disabled, kbd, 'data-tour': dataTour, children,
}: {
  label: string
  onClick: () => void
  primary?: boolean
  active?: boolean
  disabled?: boolean
  /** Optional keyboard shortcut shown in the hover tooltip. */
  kbd?: string
  'data-tour'?: string
  children: React.ReactNode
}) {
  const button = (
    <motion.button
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      whileTap={disabled ? undefined : { scale: 0.9 }}
      whileHover={disabled ? undefined : { y: -0.5 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      disabled={disabled}
      data-tour={dataTour}
      className={[
        'grid h-9 w-9 place-items-center rounded-[11px] border border-transparent transition-colors',
        primary ? 'tool-button-primary' : '',
        active ? 'border-action/25 bg-action/15 text-action shadow-[inset_0_1px_0_rgba(255,255,255,.08)]' : '',
        disabled
          ? 'text-ink-700/30 cursor-not-allowed'
          : primary || active
            ? ''
            : 'text-ink-600 hover:text-ink-900 hover:bg-ink-900/[0.07]',
      ].join(' ')}
    >
      {children}
    </motion.button>
  )
  if (disabled) return button
  return (
    <Tooltip label={label} kbd={kbd}>
      {button}
    </Tooltip>
  )
}

function Hint({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.6 }}
      className="glass pointer-events-none fixed right-6 top-6 z-50 hidden rounded-[14px] p-1 sm:block"
    >
      <div className="flex h-8 items-center gap-1 font-sans text-[10px] tracking-[-0.005em]">
        {children}
      </div>
    </motion.div>
  )
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded-[6px] border border-ink-900/[0.08] bg-ink-900/[0.06] px-1.5 py-0.5 font-mono text-[8.5px] font-medium tracking-tight text-ink-700">
      {children}
    </kbd>
  )
}

function HintAction({ control, action, gesture }: {
  control: string
  action: string
  gesture?: 'click' | 'drag'
}) {
  return (
    <span className="flex items-center gap-1.5 rounded-[9px] px-2">
      {gesture ? (
        <span className="grid h-5 w-5 place-items-center rounded-[6px] bg-action/10 text-action">
          {gesture === 'click' ? (
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
              <circle cx="6" cy="6" r="2" fill="currentColor" />
              <circle cx="6" cy="6" r="4.25" stroke="currentColor" strokeWidth="1" opacity=".45" />
            </svg>
          ) : (
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path d="M6 1.5v9M1.5 6h9M6 1.5 4.5 3M6 1.5 7.5 3M10.5 6 9 4.5M10.5 6 9 7.5M6 10.5 4.5 9M6 10.5 7.5 9M1.5 6 3 4.5M1.5 6 3 7.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
      ) : (
        <Kbd>{control}</Kbd>
      )}
      <span className="font-medium text-ink-700">{gesture ? control : action}</span>
      {gesture && <span className="text-ink-500">{action}</span>}
    </span>
  )
}

function HintDivider() {
  return <span className="h-4 w-px bg-ink-900/[0.09]" aria-hidden />
}

export default function Toolbar({
  scale, count, soundEnabled, cursorMode,
  dimmed,
  hasSelection = false, isEditing = false,
  onZoomIn, onZoomOut, onResetView,
  onAdd, onToggleSound,
  onToggleCursorMode, onReplayTour,
  playSound,
}: Props) {
  const { theme, toggleTheme } = useTheme()

  const wrap = (fn: () => void, sound: SoundName = 'tapFirm') => () => {
    playSound(sound)
    fn()
  }

  // Dynamic hint based on app state
  const hint = isEditing ? (
    <>
      <HintAction control="Esc" action="Finish" />
      <HintDivider />
      <HintAction control="⌘ B" action="Bold" />
    </>
  ) : hasSelection ? (
    <>
      <HintAction control="Delete" action="Remove" />
      <HintDivider />
      <HintAction control="Drag" action="move" gesture="drag" />
    </>
  ) : (
    <>
      <HintAction control="Double-click" action="add" gesture="click" />
      <HintDivider />
      <HintAction control="Drag" action="pan" gesture="drag" />
    </>
  )

  return (
    <>
      <Brand count={count} />

      {/* Bottom-center toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{
          opacity: dimmed ? 0 : 1,
          y: dimmed ? 14 : 0,
          scale: dimmed ? 0.95 : 1,
        }}
        transition={{
          delay: dimmed ? 0 : 0.18,
          ease: EASE_OUT,
          duration: dimmed ? 0.18 : 0.55,
        }}
        style={{ pointerEvents: dimmed ? 'none' : undefined }}
        data-bottom-toolbar
        className="fixed bottom-7 left-1/2 z-50 -translate-x-1/2"
      >
        <div className="glass toolbar-shell flex items-center gap-1 p-1.5">
          <IconButton label="Add memory" kbd="⌘N" primary data-tour="add-button" onClick={wrap(onAdd, 'create')}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 2.5v9M2.5 7h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </IconButton>

          <span className="mx-1 h-5 w-px bg-ink-900/[0.10]" />

          <IconButton label="Zoom out" kbd="⌘-" onClick={wrap(onZoomOut)}>
            <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
              <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.7" />
              <path d="M9 9l3.2 3.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              <path d="M4 6h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </IconButton>

          <Tooltip label="Reset zoom" kbd="⌘0">
            <button
              onClick={wrap(onResetView)}
              className="min-w-[3.5rem] rounded-[9px] px-1.5 py-1.5 font-mono text-[10px] font-medium tabular-nums tracking-tight text-ink-600 transition-colors hover:bg-ink-900/[0.07] hover:text-ink-900"
            >
              {Math.round(scale * 100)}%
            </button>
          </Tooltip>

          <IconButton label="Zoom in" kbd="⌘=" onClick={wrap(onZoomIn)}>
            <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
              <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.7" />
              <path d="M9 9l3.2 3.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              <path d="M6 4v4M4 6h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </IconButton>

          <span className="mx-1 h-5 w-px bg-ink-900/[0.10]" />

          <span data-feature-anchor="select" className="inline-flex">
            <IconButton
              label={cursorMode === 'hand' ? 'Box-select notes' : 'Pan canvas'}
              active={cursorMode === 'select'}
              onClick={wrap(onToggleCursorMode, 'tapSoft')}
            >
              {cursorMode === 'hand' ? (
                // Arrow-pointer — clicking enters select mode.
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M3 2.2l7.2 4.2-3 .5L8.7 11l-1.6.7-1.6-3.8L3 9.7V2.2z"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              ) : (
                // Hand — clicking returns to hand/pan mode.
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M4 7.5V3.7a1 1 0 011-1 1 1 0 011 1V7.5M6 7.5V2.5a1 1 0 011-1 1 1 0 011 1V7.5M8 7.5V3.2a1 1 0 011-1 1 1 0 011 1V7.5"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M10 7.5V5a1 1 0 011-1 1 1 0 011 1v4.2c0 2-1.4 3.3-3.5 3.3h-1c-1.2 0-2.3-.6-3-1.6L1.7 8.4a1 1 0 011.5-1.4L4.2 8"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </IconButton>
          </span>

          <IconButton label={soundEnabled ? 'Mute sound' : 'Unmute sound'} onClick={onToggleSound}>
            {soundEnabled ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 5.5h2L8 3v8L5 8.5H3v-3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                <path d="M10 5.2c.6.5 1 1.1 1 1.8s-.4 1.3-1 1.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 5.5h2L8 3v8L5 8.5H3v-3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                <path d="M10 5l3 3M13 5l-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            )}
          </IconButton>

          <IconButton label="Replay tour" onClick={wrap(onReplayTour, 'tapSoft')}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="5.4" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M5.3 5.4c.1-1 .9-1.7 1.85-1.7 1.05 0 1.85.75 1.85 1.7 0 .8-.5 1.2-1.05 1.55-.55.35-.85.65-.85 1.25v.15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle cx="7.15" cy="10.2" r="0.7" fill="currentColor" />
            </svg>
          </IconButton>

          <IconButton
            label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            kbd="⌘⇧L"
            onClick={wrap(toggleTheme, 'tapSoft')}
          >
            {theme === 'dark' ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="2.6" stroke="currentColor" strokeWidth="1.5" />
                <path
                  d="M7 1.5v1.6M7 10.9v1.6M2.6 7H1M13 7h-1.6M3.9 3.9L2.8 2.8M11.2 11.2l-1.1-1.1M3.9 10.1l-1.1 1.1M11.2 2.8l-1.1 1.1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M11.6 8.5A4.7 4.7 0 015.5 2.4 5.2 5.2 0 1011.6 8.5z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </IconButton>
        </div>
      </motion.div>

      {/* Top-right dynamic hint */}
      <Hint>{hint}</Hint>
    </>
  )
}
