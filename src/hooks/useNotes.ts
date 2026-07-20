import { useCallback, useEffect, useRef, useState } from 'react'
import { nanoid } from 'nanoid'
import type { Note, NoteKind, NoteTint, TodoItem } from '../types'
import {
  htmlToLines,
  itemsToHtml,
  linesToItems,
  plainTextToHtml,
} from '../lib/format'

const STORAGE_KEY = 'spatial-notes:notes:v1'
const TINTS: NoteTint[] = [
  'onyx', 'ocean', 'forest', 'plum', 'wine', 'copper',
  'midnight', 'emerald', 'gold', 'violet', 'teal', 'slate',
]

const MAX_HISTORY = 50

type StoredNote = Partial<Note> & { id: string; body?: string }

/** Map legacy tint names to the current Prism material palette. */
function migrateTint(tint: string | undefined): NoteTint {
  const legacyMap: Record<string, NoteTint> = {
    cream: 'gold', banana: 'gold', sand: 'copper', coral: 'wine',
    rose: 'wine', blush: 'plum', lilac: 'violet', sky: 'midnight',
    aqua: 'teal', mint: 'emerald', sage: 'forest', slate: 'slate',
  }
  const mapped = legacyMap[tint ?? '']
  if (mapped) return mapped
  const valid = TINTS.includes(tint as NoteTint)
  if (valid) return tint as NoteTint
  return 'onyx'
}

function migrate(raw: StoredNote): Note {
  const looksLikeHtml = typeof raw.body === 'string' && /<\/?[a-z][^>]*>/i.test(raw.body)
  const body =
    raw.body == null
      ? ''
      : looksLikeHtml
        ? raw.body
        : plainTextToHtml(raw.body)
  return {
    id: raw.id,
    x: raw.x ?? 0,
    y: raw.y ?? 0,
    w: raw.w ?? 240,
    h: raw.h ?? 170,
    kind: (raw.kind as NoteKind) ?? 'note',
    body,
    items: Array.isArray(raw.items) ? (raw.items as TodoItem[]) : undefined,
    tint: migrateTint(raw.tint),
    createdAt: raw.createdAt ?? Date.now(),
    updatedAt: raw.updatedAt ?? Date.now(),
  }
}

function load(): Note[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as StoredNote[]
    return Array.isArray(parsed) ? parsed.map(migrate) : []
  } catch {
    return []
  }
}

function persist(notes: Note[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  } catch {
    // quota — ignore silently for now
  }
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>(() => load())
  const tintCursor = useRef(0)

  // Undo/redo history
  const historyRef = useRef<Note[][]>([load()])
  const historyIndexRef = useRef(0)
  const isUndoingRef = useRef(false)
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)

  const updateHistoryFlags = useCallback(() => {
    setCanUndo(historyIndexRef.current > 0)
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1)
  }, [])

  const pushHistory = useCallback((nextNotes: Note[]) => {
    if (isUndoingRef.current) return
    const history = historyRef.current
    const idx = historyIndexRef.current
    // Truncate redo stack
    history.length = idx + 1
    history.push(nextNotes.map(n => ({ ...n })))
    if (history.length > MAX_HISTORY) {
      history.shift()
    } else {
      historyIndexRef.current++
    }
    updateHistoryFlags()
  }, [updateHistoryFlags])

  useEffect(() => { persist(notes) }, [notes])

  const create = useCallback((x: number, y: number, tint?: NoteTint): Note => {
    const now = Date.now()
    const note: Note = {
      id: nanoid(8),
      x: Math.round(x - 110),
      y: Math.round(y - 70),
      w: 220,
      h: 160,
      kind: 'note',
      body: '',
      tint: tint ?? TINTS[tintCursor.current++ % TINTS.length]!,
      createdAt: now,
      updatedAt: now,
    }
    setNotes((prev) => {
      const next = [...prev, note]
      pushHistory(next)
      return next
    })
    return note
  }, [pushHistory])

  const update = useCallback((id: string, patch: Partial<Note>) => {
    setNotes((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, ...patch, updatedAt: Date.now() } : n))
      pushHistory(next)
      return next
    })
  }, [pushHistory])

  const remove = useCallback((id: string) => {
    setNotes((prev) => {
      const next = prev.filter((n) => n.id !== id)
      pushHistory(next)
      return next
    })
  }, [pushHistory])

  const bringToFront = useCallback((id: string) => {
    setNotes((prev) => {
      const idx = prev.findIndex((n) => n.id === id)
      if (idx === -1 || idx === prev.length - 1) return prev
      const next = prev.slice()
      const [n] = next.splice(idx, 1)
      next.push(n!)
      return next
    })
  }, [])

  const toggleKind = useCallback((id: string) => {
    setNotes((prev) => {
      const next = prev.map((n) => {
        if (n.id !== id) return n
        if (n.kind === 'note') {
          const lines = htmlToLines(n.body)
          const seed = lines.length ? lines : ['']
          return { ...n, kind: 'todo' as const, items: linesToItems(seed), updatedAt: Date.now() }
        }
        const items = n.items ?? []
        const trimmed = items.filter((it, i) => it.text.trim().length || i < items.length - 1)
        return { ...n, kind: 'note' as const, body: itemsToHtml(trimmed.filter((it) => it.text.trim().length)), items: undefined, updatedAt: Date.now() }
      })
      pushHistory(next)
      return next
    })
  }, [pushHistory])

  const undo = useCallback(() => {
    const history = historyRef.current
    const idx = historyIndexRef.current
    if (idx <= 0) return false
    isUndoingRef.current = true
    historyIndexRef.current = idx - 1
    setNotes(history[idx - 1]!.map(n => ({ ...n })))
    isUndoingRef.current = false
    updateHistoryFlags()
    return true
  }, [updateHistoryFlags])

  const redo = useCallback(() => {
    const history = historyRef.current
    const idx = historyIndexRef.current
    if (idx >= history.length - 1) return false
    isUndoingRef.current = true
    historyIndexRef.current = idx + 1
    setNotes(history[idx + 1]!.map(n => ({ ...n })))
    isUndoingRef.current = false
    updateHistoryFlags()
    return true
  }, [updateHistoryFlags])

  const clear = useCallback(() => {
    setNotes([])
    historyRef.current = [[]]
    historyIndexRef.current = 0
    updateHistoryFlags()
  }, [updateHistoryFlags])

  return { notes, create, update, remove, bringToFront, toggleKind, undo, redo, canUndo, canRedo, clear }
}
