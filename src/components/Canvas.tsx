import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import NoteCard from './Note'
import Toolbar, { type CursorMode } from './Toolbar'
import EmptyState from './EmptyState'
import TrashZone from './TrashZone'
import Tour from './Tour'
import { useNotes } from '../hooks/useNotes'
import { useSound } from '../hooks/useSound'
import { useTour } from '../hooks/useTour'
import { screenToWorld, usePanZoom } from '../hooks/usePanZoom'

const GRID_SIZE = 32

interface CanvasProps {}

export default function Canvas({}: CanvasProps = {}) {
  const surfaceRef = useRef<HTMLDivElement>(null)
  const {
    notes, create, update, remove, bringToFront, toggleKind,
    undo, redo,
  } = useNotes()
  const { enabled: soundEnabled, trigger, toggle: toggleSound } = useSound()
  const { viewport, beginPan, updatePan, endPan, zoomBy, resetView } = usePanZoom({ targetRef: surfaceRef })
  const { active: tourActive, step: tourStep, start: startTour, next: nextTourStep, finish: finishTour } = useTour({ canStart: true })

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [autoFocusId, setAutoFocusId] = useState<string | null>(null)
  const [overTrash, setOverTrash] = useState(false)
  const [cursorMode, setCursorMode] = useState<CursorMode>('hand')
  const [marquee, setMarquee] = useState<{
    sx: number; sy: number
    ex: number; ey: number
    additive: boolean
  } | null>(null)
  const overTrashRef = useRef(false)
  const trashRef = useRef<HTMLDivElement>(null)
  const panActive = useRef(false)
  // Refs that the marquee pointerup handler reads so it can stay in sync
  // without re-binding on every selection/viewport change.
  const notesRef = useRef(notes)
  notesRef.current = notes
  const viewportRef = useRef(viewport)
  viewportRef.current = viewport
  const selectedIdsRef = useRef(selectedIds)
  selectedIdsRef.current = selectedIds

  // While a note is being dragged, track pointer against the trash zone.
  useEffect(() => {
    if (!draggingId) {
      overTrashRef.current = false
      setOverTrash(false)
      return
    }
    const onMove = (e: PointerEvent) => {
      const r = trashRef.current?.getBoundingClientRect()
      if (!r) {
        overTrashRef.current = false
        setOverTrash(false)
        return
      }
      const inside =
        e.clientX >= r.left && e.clientX <= r.right &&
        e.clientY >= r.top && e.clientY <= r.bottom
      if (inside !== overTrashRef.current) {
        overTrashRef.current = inside
        setOverTrash(inside)
        if (inside) trigger('pickup')
      }
    }
    window.addEventListener('pointermove', onMove)
    return () => {
      window.removeEventListener('pointermove', onMove)
      overTrashRef.current = false
      setOverTrash(false)
    }
  }, [draggingId, trigger])

  const shouldDeleteOnDrop = useCallback(() => overTrashRef.current, [])

  // Background pan with pointer
  const onSurfacePointerDown = useCallback((e: React.PointerEvent) => {
    if (e.target !== surfaceRef.current && !(e.target as HTMLElement).hasAttribute('data-surface')) return
    if (cursorMode === 'select') {
      // Marquee: in select mode, click+drag the empty surface to box-select.
      // Shift = additive (extend existing selection), no shift = replace.
      const additive = e.shiftKey || e.metaKey || e.ctrlKey
      if (!additive) {
        setSelectedId(null)
        setSelectedIds(new Set())
      }
      setMarquee({ sx: e.clientX, sy: e.clientY, ex: e.clientX, ey: e.clientY, additive })
      surfaceRef.current?.setPointerCapture(e.pointerId)
      return
    }
    panActive.current = true
    setSelectedId(null)
    beginPan(e.clientX, e.clientY)
    surfaceRef.current?.setPointerCapture(e.pointerId)
  }, [beginPan, cursorMode])

  const onSurfacePointerMove = useCallback((e: React.PointerEvent) => {
    if (marquee) {
      setMarquee((m) => (m ? { ...m, ex: e.clientX, ey: e.clientY } : m))
      return
    }
    if (!panActive.current) return
    updatePan(e.clientX, e.clientY)
  }, [marquee, updatePan])

  const onSurfacePointerUp = useCallback((e: React.PointerEvent) => {
    if (marquee) {
      // Compute final selection from the marquee rect, in world space.
      const surface = surfaceRef.current
      if (surface) {
        const rect = surface.getBoundingClientRect()
        const v = viewportRef.current
        const x1 = marquee.sx - rect.left
        const y1 = marquee.sy - rect.top
        const x2 = marquee.ex - rect.left
        const y2 = marquee.ey - rect.top
        const a = screenToWorld(v, Math.min(x1, x2), Math.min(y1, y2))
        const b = screenToWorld(v, Math.max(x1, x2), Math.max(y1, y2))
        const minX = a.x, minY = a.y, maxX = b.x, maxY = b.y
        // A "real" marquee needs some travel. Sub-4px is a stray click — treat
        // as a deselect for non-additive, no-op for additive.
        const traveled = Math.hypot(marquee.ex - marquee.sx, marquee.ey - marquee.sy)
        if (traveled >= 4) {
          const hit = new Set(marquee.additive ? selectedIdsRef.current : [])
          for (const n of notesRef.current) {
            const nx2 = n.x + n.w
            const ny2 = n.y + n.h
            if (n.x < maxX && nx2 > minX && n.y < maxY && ny2 > minY) {
              hit.add(n.id)
            }
          }
          setSelectedIds(hit)
          if (hit.size === 1) setSelectedId([...hit][0]!)
        } else if (!marquee.additive) {
          setSelectedIds(new Set())
        }
      }
      setMarquee(null)
      surfaceRef.current?.releasePointerCapture?.(e.pointerId)
      return
    }
    if (panActive.current) {
      panActive.current = false
      endPan()
      surfaceRef.current?.releasePointerCapture?.(e.pointerId)
    }
  }, [marquee, endPan])

  const toggleCursorMode = useCallback(() => {
    setCursorMode((m) => (m === 'hand' ? 'select' : 'hand'))
    setMarquee(null)
  }, [])

  const onSurfaceDoubleClick = useCallback((e: React.MouseEvent) => {
    if (e.target !== surfaceRef.current && !(e.target as HTMLElement).hasAttribute('data-surface')) return
    const rect = surfaceRef.current!.getBoundingClientRect()
    const world = screenToWorld(viewport, e.clientX - rect.left, e.clientY - rect.top)
    const note = create(world.x, world.y)
    setSelectedId(note.id)
    setAutoFocusId(note.id)
    trigger('create')
  }, [viewport, create, trigger])

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      const isEditing = tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable
      if (isEditing) return

      const hasSelection = selectedId !== null || selectedIds.size > 0
      if ((e.key === 'Backspace' || e.key === 'Delete') && hasSelection) {
        e.preventDefault()
        trigger('delete')
        // Delete multi-selected first, then any primary selected that wasn't
        // already in the multi set.
        const ids = new Set(selectedIds)
        if (selectedId) ids.add(selectedId)
        for (const id of ids) remove(id)
        setSelectedIds(new Set())
        setSelectedId(null)
      } else if ((e.key === 'Escape') && (selectedId || selectedIds.size > 0 || marquee)) {
        e.preventDefault()
        setSelectedIds(new Set())
        setSelectedId(null)
        setMarquee(null)
      } else if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key === 'a') {
        e.preventDefault()
        setSelectedIds(new Set(notes.map((n) => n.id)))
        setSelectedId(null)
      } else if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key === 'z') {
        e.preventDefault()
        if (undo()) trigger('tapSoft')
      } else if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'z') {
        e.preventDefault()
        if (redo()) trigger('tapSoft')
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        e.preventDefault()
        if (redo()) trigger('tapSoft')
      } else if ((e.metaKey || e.ctrlKey) && e.key === '0') {
        e.preventDefault()
        trigger('tapFirm')
        resetView()
      } else if ((e.metaKey || e.ctrlKey) && (e.key === '=' || e.key === '+')) {
        e.preventDefault()
        trigger('tapFirm')
        zoomBy(1.15)
      } else if ((e.metaKey || e.ctrlKey) && e.key === '-') {
        e.preventDefault()
        trigger('tapFirm')
        zoomBy(1 / 1.15)
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault()
        const el = surfaceRef.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const world = screenToWorld(viewport, rect.width / 2, rect.height / 2)
        const note = create(world.x, world.y)
        setSelectedId(note.id)
        setAutoFocusId(note.id)
        trigger('create')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedId, selectedIds, notes, remove, undo, redo, resetView, zoomBy, create, viewport, trigger, marquee])

  const addCentered = useCallback(() => {
    const el = surfaceRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const world = screenToWorld(viewport, rect.width / 2, rect.height / 2)
    const note = create(world.x, world.y)
    setSelectedId(note.id)
    setAutoFocusId(note.id)
  }, [viewport, create])

  const gridStyle = useMemo<React.CSSProperties>(() => {
    const size = GRID_SIZE * viewport.scale
    return {
      backgroundImage:
        'radial-gradient(circle, color-mix(in oklab, currentColor 7%, transparent) 1px, transparent 1.15px)',
      backgroundSize: `${size}px ${size}px`,
      backgroundPosition: `${viewport.x}px ${viewport.y}px`,
    }
  }, [viewport])

  const transform = `translate3d(${viewport.x}px, ${viewport.y}px, 0) scale(${viewport.scale})`

  return (
    <main className="canvas-aurora relative h-full w-full overflow-hidden bg-paper">
      <h1 className="sr-only">Vellum freeform notes and visual thinking canvas</h1>

      {/* Prismatic ambient light, vignette, and tactile grain. */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="canvas-vignette pointer-events-none absolute inset-0 z-0"
      />
      <div aria-hidden className="noise-overlay pointer-events-none absolute inset-0 z-[1]" />

      <div
        ref={surfaceRef}
        data-surface
        role="application"
        aria-label="Vellum freeform canvas. Double-click to create a memory, drag to pan."
        onPointerDown={onSurfacePointerDown}
        onPointerMove={onSurfacePointerMove}
        onPointerUp={onSurfacePointerUp}
        onPointerCancel={onSurfacePointerUp}
        onDoubleClick={onSurfaceDoubleClick}
        className={[
          'absolute inset-0 z-10 text-ink-900',
          cursorMode === 'select'
            ? 'cursor-crosshair'
            : panActive.current
              ? 'cursor-grabbing'
              : 'cursor-grab',
        ].join(' ')}
        style={gridStyle}
      >
        <div
          className="absolute left-0 top-0"
          style={{
            transform,
            transformOrigin: '0 0',
            willChange: 'transform',
          }}
        >
          <AnimatePresence>
            {notes.map((n) => (
              <NoteCard
                key={n.id}
                note={n}
                scale={viewport.scale}
                selected={selectedId === n.id || selectedIds.has(n.id)}
                selectionMode={cursorMode === 'select'}
                autoFocus={autoFocusId === n.id}
                onAutoFocused={() => setAutoFocusId(null)}
                onSelect={() => {
                  setSelectedId(n.id)
                  setSelectedIds(new Set())
                  bringToFront(n.id)
                }}
                onChange={(patch) => update(n.id, patch)}
                onDelete={() => {
                  remove(n.id)
                  setSelectedId(null)
                  setEditingNoteId(null)
                }}
                onToggleKind={() => {
                  toggleKind(n.id)
                  setAutoFocusId(n.id)
                }}
                onDragStart={() => setDraggingId(n.id)}
                onDragEnd={() => setDraggingId(null)}
                onEditingChange={(editing) => setEditingNoteId(editing ? n.id : null)}
                shouldDeleteOnDrop={shouldDeleteOnDrop}
                playSound={trigger}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Marquee rectangle, in screen space so it tracks the cursor
            without panning with the canvas. */}
        {marquee && (
          <div
            aria-hidden
            className="pointer-events-none absolute z-20"
            style={{
              left: Math.min(marquee.sx, marquee.ex) - surfaceRef.current!.getBoundingClientRect().left,
              top: Math.min(marquee.sy, marquee.ey) - surfaceRef.current!.getBoundingClientRect().top,
              width: Math.abs(marquee.ex - marquee.sx),
              height: Math.abs(marquee.ey - marquee.sy),
              background: 'color-mix(in oklab, var(--color-action) 8%, transparent)',
              border: '1px solid color-mix(in oklab, var(--color-action) 60%, transparent)',
              borderRadius: '10px',
              boxShadow: '0 0 0 3px color-mix(in oklab, var(--color-action) 10%, transparent)',
            }}
          />
        )}

        <AnimatePresence>
          {notes.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-none absolute inset-0 z-0 grid place-items-center"
            >
              <EmptyState />
            </motion.div>
          )}
        </AnimatePresence>

        {draggingId && (
          <div className="pointer-events-none absolute inset-0 z-20 bg-ink-950/[0.015]" />
        )}
      </div>

      <Toolbar
        scale={viewport.scale}
        count={notes.length}
        soundEnabled={soundEnabled}
        cursorMode={cursorMode}
        dimmed={draggingId !== null}
        hasSelection={selectedId !== null || selectedIds.size > 0}
        isEditing={editingNoteId !== null}
        onZoomIn={() => zoomBy(1.2)}
        onZoomOut={() => zoomBy(1 / 1.2)}
        onResetView={resetView}
        onAdd={addCentered}
        onToggleSound={toggleSound}
        onToggleCursorMode={toggleCursorMode}
        onReplayTour={startTour}
        playSound={trigger}
      />

      <TrashZone ref={trashRef} visible={draggingId !== null} active={overTrash} />

      <Tour
        active={tourActive}
        step={tourStep}
        notes={notes}
        onNext={nextTourStep}
        onFinish={finishTour}
        onSelectNote={(id) => {
          setSelectedId(id)
          bringToFront(id)
        }}
      />
    </main>
  )
}
