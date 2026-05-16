/**
 * =============================================================================
 * THEME RUNTIME INJECTOR
 * =============================================================================
 * Injects CSS custom properties via a <style> tag so that [data-theme="light"]
 * overrides in index.css can properly cascade over them.
 */

import theme from '../theme.config'

let styleEl: HTMLStyleElement | null = null

function getOrCreateStyleEl(): HTMLStyleElement {
  if (styleEl) return styleEl
  const el = document.createElement('style')
  el.id = 'theme-injected-vars'
  document.head.appendChild(el)
  styleEl = el
  return el
}

function buildVarBlock(): string {
  const lines: string[] = [':root {']

  // Ink scale
  for (const [key, val] of Object.entries(theme.colors.ink)) {
    if (key === 'paper') lines.push(`  --color-paper: ${val};`)
    else if (typeof val === 'string') lines.push(`  --color-ink-${key}: ${val};`)
  }

  // Note tints
  for (const [name, { bg, accent }] of Object.entries(theme.colors.note)) {
    lines.push(`  --color-note-${name}: ${bg};`)
    lines.push(`  --color-accent-${name}: ${accent};`)
  }

  // Action
  lines.push(`  --color-action: ${theme.colors.action.DEFAULT};`)
  lines.push(`  --color-action-press: ${theme.colors.action.press};`)

  // Font families
  lines.push(`  --font-sans: ${theme.typography.fontFamily.sans.join(', ')};`)
  lines.push(`  --font-mono: ${theme.typography.fontFamily.mono.join(', ')};`)

  // Easings
  lines.push(`  --ease-out-quart: cubic-bezier(${theme.motion.ease.outQuart.join(', ')});`)
  lines.push(`  --ease-out-expo: cubic-bezier(${theme.motion.ease.outExpo.join(', ')});`)
  lines.push(`  --ease-spring: cubic-bezier(${theme.motion.ease.spring.join(', ')});`)

  // Spacing
  const s = theme.spacing.note
  lines.push(`  --note-default-w: ${s.defaultWidth}px;`)
  lines.push(`  --note-default-h: ${s.defaultHeight}px;`)
  lines.push(`  --note-min-w: ${s.minWidth}px;`)
  lines.push(`  --note-min-h: ${s.minHeight}px;`)
  lines.push(`  --note-max-w: ${s.maxWidth}px;`)
  lines.push(`  --note-max-h: ${s.maxHeight}px;`)
  lines.push(`  --canvas-grid-size: ${theme.canvas.grid.size}px;`)

  lines.push('}')
  return lines.join('\n')
}

/** Detect system preference */
function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/** Read saved preference or fall back to system */
function getInitialTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  try {
    const saved = localStorage.getItem(theme.storage.theme)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {}
  return getSystemTheme()
}

/** Apply theme to document */
export function setTheme(mode: 'light' | 'dark') {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute('data-theme', mode)
  try {
    localStorage.setItem(theme.storage.theme, mode)
  } catch {}
}

/** Toggle between light and dark */
export function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
  setTheme(current === 'dark' ? 'light' : 'dark')
}

/** Get current theme */
export function getTheme(): 'light' | 'dark' {
  if (typeof document === 'undefined') return 'light'
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
}

/** Inject CSS custom properties from the theme config into a <style> tag */
export function injectThemeVariables() {
  if (typeof document === 'undefined') return

  const el = getOrCreateStyleEl()
  el.textContent = buildVarBlock()

  // Apply saved/system theme immediately — but ONLY if not already set
  // (another script or SSR may have set it)
  if (!document.documentElement.hasAttribute('data-theme')) {
    const initial = getInitialTheme()
    document.documentElement.setAttribute('data-theme', initial)
  }
}
