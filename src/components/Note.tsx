import { memo, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { Note, NoteTint, TodoItem } from '../types'
import type { SoundName } from '../lib/sounds'
import { isHtmlEmpty, sanitizeHtml } from '../lib/format'
import SelectionToolbar from './SelectionToolbar'
import TodoList from './TodoList'
import ColorPicker from './ColorPicker'

interface TintStyle {
  bg: string
  accent: string
}

const TINT: Record<NoteTint, TintStyle> = {
  onyx:     { bg: 'bg-[var(--color-note-onyx)]',     accent: 'var(--color-accent-onyx)' },
  ocean:    { bg: 'bg-[var(--color-note-ocean)]',    accent: 'var(--color-accent-ocean)' },
  forest:   { bg: 'bg-[var(--color-note-forest)]',   accent: 'var(--color-accent-forest)' },
  plum:     { bg: 'bg-[var(--color-note-plum)]',     accent: 'var(--color-accent-plum)' },
  wine:     { bg: 'bg-[var(--color-note-wine)]',     accent: 'var(--color-accent-wine)' },
  copper:   { bg: 'bg-[var(--color-note-copper)]',   accent: 'var(--color-accent-copper)' },
  midnight: { bg: 'bg-[var(--color-note-midnight)]', accent: 'var(--color-accent-midnight)' },
  emerald:  { bg: 'bg-[var(--color-note-emerald)]',  accent: 'var(--color-accent-emerald)' },
  gold:     { bg: 'bg-[var(--color-note-gold)]',     accent: 'var(--color-accent-gold)' },
  violet:   { bg: 'bg-[var(--color-note-violet)]',   accent: 'var(--color-accent-violet)' },
  teal:     { bg: 'bg-[var(--color-note-teal)]',     accent: 'var(--color-accent-teal)' },
  slate:    { bg: 'bg-[var(--color-note-slate)]',    accent: 'var(--color-accent-slate)' },
}

const MIN_W = 180
const MIN_H = 120
const MAX_W = 600
const MAX_H = 700

function buildShadow(accent: string, mode: 'rest' | 'selected' | 'editing' | 'dragging' | 'resizing') {
  const base =
    '0 1px 2px rgba(0,0,0,0.16), 0 10px 28px -12px rgba(0,0,0,0.42), 0 30px 70px -30px rgba(0,0,0,0.52)'
  if (mode === 'rest') return base
  if (mode === 'dragging' || mode === 'resizing')
    return `0 4px 10px rgba(0,0,0,0.22), 0 26px 58px -15px rgba(0,0,0,0.46), 0 38px 90px -24px color-mix(in oklab, ${accent} 42%, transparent)`
  if (mode === 'selected')
    return `${base}, 0 0 0 2px color-mix(in oklab, ${accent} 72%, transparent), 0 18px 50px -18px color-mix(in oklab, ${accent} 48%, transparent)`
  return `${base}, 0 0 0 2px color-mix(in oklab, ${accent} 80%, transparent), 0 24px 64px -18px color-mix(in oklab, ${accent} 60%, transparent)`
}

const SPRING = { type: 'spring' as const, stiffness: 420, damping: 32, mass: 0.7 }
const EASE_OUT = [0.16, 1, 0.3, 1] as const

interface Props {
  note: Note
  scale: number
  selected: boolean
  selectionMode?: boolean
  autoFocus?: boolean
  onSelect: () => void
  onChange: (patch: Partial<Note>) => void
  onDelete: () => void
  onToggleKind: () => void
  onDragStart: () => void
  onDragEnd: () => void
  /** Read at drop time. If true, the note is deleted instead of placed. */
  shouldDeleteOnDrop?: () => boolean
  onAutoFocused?: () => void
  onEditingChange?: (editing: boolean) => void
  playSound: (s: SoundName) => void
}

function formatStamp(ts: number) {
  const d = new Date(ts)
  return d.toLocaleString(undefined, {
    month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit',
  })
}

function NoteCard({
  note, scale, selected, selectionMode = false, autoFocus,
  onSelect, onChange, onDelete, onToggleKind,
  onDragStart, onDragEnd, shouldDeleteOnDrop,
  onAutoFocused, onEditingChange, playSound,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<HTMLDivElement>(null)
  const paletteBtnRef = useRef<HTMLButtonElement>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickerAnchor, setPickerAnchor] = useState<DOMRect | null>(null)

  const dragState = useRef<{
    sx: number; sy: number
    ox: number; oy: number
    dx: number; dy: number
    moved: boolean
    rafId: number | null
    finalX: number; finalY: number
  } | null>(null)

  const resizeState = useRef<{
    sx: number; sy: number
    ow: number; oh: number
    rafId: number | null
    finalW: number; finalH: number
  } | null>(null)

  const [editing, setEditing] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [resizing, setResizing] = useState(false)
  const [isEmpty, setIsEmpty] = useState(() => isHtmlEmpty(note.body))
  const tint = TINT[note.tint] ?? TINT.onyx
  const isTodo = note.kind === 'todo'

  // Hydrate the editor DOM when the body changes from outside (storage, conversion).
  // Avoid clobbering DOM while the user is actively editing — that would reset the caret.
  useEffect(() => {
    if (isTodo) return
    const el = editorRef.current
    if (el && !editing && el.innerHTML !== note.body) {
      el.innerHTML = note.body
    }
    setIsEmpty(isHtmlEmpty(note.body))
  }, [note.body, editing, isTodo])

  // Reliable focus: useLayoutEffect fires after DOM mutations but before paint.
  useLayoutEffect(() => {
    if (!editing || isTodo) return
    const el = editorRef.current
    if (!el) return
    el.focus({ preventScroll: true })
    const range = document.createRange()
    range.selectNodeContents(el)
    range.collapse(false)
    const sel = window.getSelection()
    sel?.removeAllRanges()
    sel?.addRange(range)
  }, [editing, isTodo])

  // ─── Drag ───────────────────────────────────────────────────────────────
  const handlePointerDown = (e: React.PointerEvent) => {
    if (editing) return
    if ((e.target as HTMLElement).closest('[data-no-drag]')) return
    e.stopPropagation()
    ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
    dragState.current = {
      sx: e.clientX, sy: e.clientY,
      ox: note.x, oy: note.y,
      dx: 0, dy: 0,
      moved: false,
      rafId: null,
      finalX: note.x, finalY: note.y,
    }
  }

  const applyDragTransform = () => {
    const s = dragState.current
    const el = wrapperRef.current
    if (!s || !el) return
    s.rafId = null
    el.style.transform = `translate3d(${s.dx}px, ${s.dy}px, 0)`
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    const s = dragState.current
    if (!s) return
    const screenDx = e.clientX - s.sx
    const screenDy = e.clientY - s.sy

    // Threshold in screen pixels so sensitivity stays constant across zoom levels.
    if (!s.moved && Math.hypot(screenDx, screenDy) > 4) {
      s.moved = true
      setDragging(true)
      onSelect()
      onDragStart()
      playSound('pickup')
    }
    if (s.moved) {
      const dx = screenDx / scale
      const dy = screenDy / scale
      s.dx = dx
      s.dy = dy
      s.finalX = s.ox + dx
      s.finalY = s.oy + dy
      if (s.rafId === null) s.rafId = requestAnimationFrame(applyDragTransform)
    }
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    const s = dragState.current
    dragState.current = null
    ;(e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId)
    if (!s) return
    if (s.rafId !== null) cancelAnimationFrame(s.rafId)

    if (s.moved) {
      const deleting = shouldDeleteOnDrop?.() === true
      if (deleting) {
        playSound('delete')
        onDelete()
      } else {
        if (wrapperRef.current) {
          wrapperRef.current.style.transform = ''
          wrapperRef.current.style.left = `${s.finalX}px`
          wrapperRef.current.style.top = `${s.finalY}px`
        }
        onChange({ x: s.finalX, y: s.finalY })
        playSound('drop')
      }
      onDragEnd()
      setDragging(false)
    } else if (!isTodo) {
      enterEditing()
    } else {
      onSelect()
    }
  }

  // ─── Resize ─────────────────────────────────────────────────────────────
  const handleResizeDown = (e: React.PointerEvent) => {
    e.stopPropagation()
    e.preventDefault()
    ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
    onSelect()
    setResizing(true)
    resizeState.current = {
      sx: e.clientX, sy: e.clientY,
      ow: note.w, oh: note.h,
      rafId: null,
      finalW: note.w, finalH: note.h,
    }
    playSound('pickup')
  }

  const applyResize = () => {
    const s = resizeState.current
    const el = wrapperRef.current
    if (!s || !el) return
    s.rafId = null
    el.style.width = `${s.finalW}px`
    el.style.height = `${s.finalH}px`
  }

  const handleResizeMove = (e: React.PointerEvent) => {
    const s = resizeState.current
    if (!s) return
    const dx = (e.clientX - s.sx) / scale
    const dy = (e.clientY - s.sy) / scale
    s.finalW = Math.max(MIN_W, Math.min(MAX_W, s.ow + dx))
    s.finalH = Math.max(MIN_H, Math.min(MAX_H, s.oh + dy))
    if (s.rafId === null) s.rafId = requestAnimationFrame(applyResize)
  }

  const handleResizeUp = (e: React.PointerEvent) => {
    const s = resizeState.current
    resizeState.current = null
    ;(e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId)
    if (!s) return
    if (s.rafId !== null) cancelAnimationFrame(s.rafId)
    onChange({ w: s.finalW, h: s.finalH })
    setResizing(false)
    playSound('drop')
  }

  // ─── Edit ───────────────────────────────────────────────────────────────
  const enterEditing = () => {
    if (editing) return
    onSelect()
    setEditing(true)
    onEditingChange?.(true)
    playSound('tapSoft')
  }

  useEffect(() => {
    if (!autoFocus) return
    if (!isTodo) enterEditing()
    onAutoFocused?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFocus])

  // Cleanup any in-flight RAF + pointer capture if the note unmounts mid-drag
  useEffect(() => {
    return () => {
      if (dragState.current?.rafId) cancelAnimationFrame(dragState.current.rafId)
      if (resizeState.current?.rafId) cancelAnimationFrame(resizeState.current.rafId)
    }
  }, [])

  const exec = (cmd: 'bold' | 'italic' | 'insertUnorderedList' | 'insertOrderedList') => {
    const el = editorRef.current
    if (!el) return
    el.focus({ preventScroll: true })
    document.execCommand(cmd, false)
    // Sync state — execCommand mutates the DOM directly, no input event guaranteed
    const html = sanitizeHtml(el.innerHTML)
    setIsEmpty(isHtmlEmpty(html))
    onChange({ body: html })
    playSound('tapSoft')
  }

  const onEditorPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const html = e.clipboardData.getData('text/html')
    const text = e.clipboardData.getData('text/plain')
    if (html) {
      const clean = sanitizeHtml(html)
      document.execCommand('insertHTML', false, clean)
    } else if (text) {
      document.execCommand('insertText', false, text)
    }
  }

  const onEditorKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      ;(e.target as HTMLDivElement).blur()
      return
    }

    // Delete empty note on Backspace/Delete
    if ((e.key === 'Backspace' || e.key === 'Delete') && isEmpty && !isTodo) {
      e.preventDefault()
      onDelete()
      playSound('delete')
      return
    }

    if (!(e.metaKey || e.ctrlKey)) return
    if (e.key === 'b' || e.key === 'B') { e.preventDefault(); exec('bold') }
    else if (e.key === 'i' || e.key === 'I') { e.preventDefault(); exec('italic') }
    else if (e.shiftKey && (e.key === '8' || e.key === '*')) { e.preventDefault(); exec('insertUnorderedList') }
    else if (e.shiftKey && (e.key === '9' || e.key === '(')) { e.preventDefault(); exec('insertOrderedList') }
  }

  const onEditorBlur = () => {
    setEditing(false)
    onEditingChange?.(false)
    // Final sanitization pass so any pasted/exec garbage gets cleaned up before persist
    const el = editorRef.current
    if (!el) return
    const clean = sanitizeHtml(el.innerHTML)
    if (clean !== el.innerHTML) el.innerHTML = clean
    if (clean !== note.body) onChange({ body: clean })
  }

  const onItemsChange = (items: TodoItem[]) => {
    onChange({ items })
  }

  const interacting = dragging || resizing
  const mode = resizing ? 'resizing' : dragging ? 'dragging' : editing ? 'editing' : selected ? 'selected' : 'rest'
  const shadow = buildShadow(tint.accent, mode)

  const todoEmpty =
    isTodo && (!note.items || note.items.length === 0 || (note.items.length === 1 && !note.items[0]!.text.trim()))

  return (
    <div
      ref={wrapperRef}
      data-note-id={note.id}
      role="group"
      aria-label={isTodo ? 'Task card' : 'Note card'}
      tabIndex={0}
      className="rounded-[18px] focus-visible:ring-2 focus-visible:ring-action focus-visible:ring-offset-4 focus-visible:ring-offset-paper"
      style={{
        position: 'absolute',
        left: note.x,
        top: note.y,
        width: note.w,
        height: note.h,
        zIndex: interacting ? 50 : editing ? 40 : selected ? 30 : 10,
        willChange: interacting ? 'transform, width, height' : 'auto',
        touchAction: 'none',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget || e.key !== 'Enter' || editing) return
        e.preventDefault()
        if (isTodo) onSelect()
        else enterEditing()
      }}
      onPointerCancel={(e) => {
          const s = dragState.current
          if (s?.rafId) cancelAnimationFrame(s.rafId)
          dragState.current = null
          ;(e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId)
          if (s?.moved) {
            if (wrapperRef.current) wrapperRef.current.style.transform = ''
            onDragEnd()
            setDragging(false)
          }
        }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 8 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: dragging ? 1.035 : 1,
          boxShadow: shadow,
        }}
        exit={{ opacity: 0, scale: 0.9, y: -6, transition: { duration: 0.18 } }}
        transition={interacting ? { duration: 0.18, ease: EASE_OUT } : SPRING}
        whileHover={editing || interacting ? undefined : { y: -1 }}
        style={{ '--note-accent': tint.accent } as React.CSSProperties}
        className={[
          'note-card group relative flex h-full w-full flex-col rounded-[18px]',
          tint.bg,
          'text-ink-900',
          editing
            ? 'cursor-text'
            : dragging
              ? 'cursor-grabbing'
              : selectionMode
                ? 'cursor-crosshair'
                : 'cursor-grab active:cursor-grabbing',
          'no-select overflow-hidden',
        ].join(' ')}
      >
        {/* Top bar — kind toggle + delete X. Visible whenever the note is the
            user's focus (selected or editing), only hidden mid drag/resize. */}
        <div className="relative flex h-9 shrink-0 items-center justify-end gap-1 px-2.5 pt-2.5">
          <span
            aria-hidden
            className="absolute left-3.5 top-4 h-1.5 w-5 rounded-full"
            style={{ background: tint.accent, boxShadow: `0 0 10px color-mix(in oklab, ${tint.accent} 70%, transparent)` }}
          />
          <AnimatePresence>
            {(selected || editing) && !dragging && (
              <>
                <motion.button
                  key="toggle-kind"
                  data-no-drag
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.16, ease: EASE_OUT }}
                  whileTap={{ scale: 0.88 }}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation()
                    playSound('toggle')
                    onToggleKind()
                  }}
                  aria-label={isTodo ? 'Convert to note' : 'Convert to todo'}
                  title={isTodo ? 'Convert to note' : 'Convert to todo'}
                  className="note-icon-button grid h-7 w-7 place-items-center rounded-[9px] text-ink-900/55 transition-colors hover:text-ink-900"
                >
                  {isTodo ? (
                    // Note icon — three lines
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                      <path d="M3 4h8M3 7h8M3 10h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  ) : (
                    // Todo icon — circle-check + line
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                      <circle cx="3.5" cy="4" r="1.7" stroke="currentColor" strokeWidth="1.4" />
                      <circle cx="3.5" cy="10" r="1.7" stroke="currentColor" strokeWidth="1.4" />
                      <path d="M2.6 4.1l.7.7 1.1-1.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M7 4h5M7 10h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  )}
                </motion.button>

                <motion.button
                  key="palette"
                  ref={paletteBtnRef}
                  data-no-drag
                  data-color-trigger
                  data-tour="palette"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.16, ease: EASE_OUT }}
                  whileTap={{ scale: 0.88 }}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation()
                    playSound('tapSoft')
                    if (pickerOpen) {
                      setPickerOpen(false)
                    } else {
                      const rect = paletteBtnRef.current?.getBoundingClientRect() ?? null
                      setPickerAnchor(rect)
                      setPickerOpen(true)
                    }
                  }}
                  aria-label="Change color"
                  title="Change color"
                  aria-expanded={pickerOpen}
                  className="note-icon-button grid h-7 w-7 place-items-center rounded-[9px] text-ink-900/55 transition-colors hover:text-ink-900"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="13.5" cy="6.5" r="1.2" fill="currentColor" />
                    <circle cx="17.5" cy="10.5" r="1.2" fill="currentColor" />
                    <circle cx="6.5" cy="12.5" r="1.2" fill="currentColor" />
                    <circle cx="8.5" cy="7.5" r="1.2" fill="currentColor" />
                  </svg>
                </motion.button>

              </>
            )}
          </AnimatePresence>
        </div>

        {/* Body — fills remaining space and scrolls */}
        <div className="relative flex-1 overflow-auto px-5 pb-3 pt-2">
          {isTodo ? (
            <>
              <TodoList
                items={note.items ?? []}
                accent={tint.accent}
                autoFocus={autoFocus}
                onAutoFocused={onAutoFocused}
                onChange={onItemsChange}
                playSound={playSound}
              />
              <AnimatePresence>
                {todoEmpty && !dragging && (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18, ease: EASE_OUT }}
                    className="pointer-events-none absolute left-[44px] top-2 text-[15px] leading-[1.55] tracking-[-0.012em] text-ink-800"
                  >
                    Add a task…
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <>
              <div
                ref={editorRef}
                data-no-drag={editing ? '' : undefined}
                contentEditable={editing}
                suppressContentEditableWarning
                spellCheck={editing}
                onInput={(e) => {
                  const el = e.currentTarget as HTMLDivElement
                  setIsEmpty(isHtmlEmpty(el.innerHTML))
                  onChange({ body: el.innerHTML })
                }}
                onBlur={onEditorBlur}
                onPaste={onEditorPaste}
                onKeyDown={onEditorKeyDown}
                className={[
                  'rich-body text-[15px] leading-[1.55] tracking-[-0.012em] text-ink-900',
                  'whitespace-pre-wrap break-words text-pretty',
                  'caret-ink-900 outline-none',
                  editing ? 'cursor-text' : '',
                ].join(' ')}
              />

              <AnimatePresence>
                {isEmpty && !dragging && (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: editing ? 0.32 : 0.5 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18, ease: EASE_OUT }}
                    className="pointer-events-none absolute left-5 top-2 text-[15px] leading-[1.55] tracking-[-0.012em] text-ink-800"
                  >
                    {editing ? 'Type a thought…' : 'Empty note'}
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>

        {/* Footer — hides on edit AND on interaction */}
        <motion.div
          animate={{
            opacity: editing || dragging ? 0 : 1,
            y: editing || dragging ? 4 : 0,
          }}
          transition={{ duration: 0.18, ease: EASE_OUT }}
          className="shrink-0 px-5 pb-3 pt-0 font-mono text-[9px] uppercase tracking-[0.06em] text-ink-700/50"
        >
          {formatStamp(note.updatedAt)}
        </motion.div>

        {/* Resize handle — bottom-right grip. Fades in on hover/selection. */}
        <motion.button
          type="button"
          data-no-drag
          data-tour="resize"
          onPointerDown={handleResizeDown}
          onPointerMove={handleResizeMove}
          onPointerUp={handleResizeUp}
          onPointerCancel={handleResizeUp}
          aria-label="Resize note"
          initial={false}
          animate={{ opacity: selected || resizing ? 1 : 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.18, ease: EASE_OUT }}
          className="absolute bottom-0 right-0 z-10 h-7 w-7 cursor-nwse-resize"
          style={{ touchAction: 'none' }}
        >
          <svg
            viewBox="0 0 16 16"
            className="absolute bottom-1.5 right-1.5 h-3.5 w-3.5 text-ink-900/45"
            fill="none"
          >
            <path d="M14 6L6 14M14 11L11 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </motion.button>
      </motion.div>

      {!isTodo && (
        <SelectionToolbar
          hostRef={editorRef}
          active={editing}
          onCommand={exec}
        />
      )}

      <ColorPicker
        open={pickerOpen}
        anchor={pickerAnchor}
        current={note.tint}
        onSelect={(tint) => {
          onChange({ tint })
          playSound('tapFirm')
          setPickerOpen(false)
        }}
        onClose={() => setPickerOpen(false)}
      />
    </div>
  )
}

export default memo(NoteCard)
