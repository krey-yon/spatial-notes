/**
 * =============================================================================
 * NOCTURNE — COMPLETE THEME CONFIGURATION
 * =============================================================================
 * A dark-first, jewel-toned workspace. Deep ink backgrounds, rich saturated
 * note colors, and refined glass materials.
 *
 * @file src/theme.config.ts
 */

// =============================================================================
// SECTION 1: BRAND & IDENTITY
// =============================================================================

export const brand = {
  name: 'inklin',
  phonetic: '/ˈɪŋklɪn/',
  description: 'inklin /ˈɪŋklɪn/ — a spatial canvas for notes, lists, and half-formed ideas.',
  titleSuffix: 'a quiet canvas for thinking',
  author: 'Ayomide Aluko',
  authorUrl: 'https://x.com/ayomicoder',
  favicon: '/favicon.svg',
  themeColor: '#0b0b0f',
  colorScheme: 'dark' as const,
} as const

// =============================================================================
// SECTION 2: COLOR SYSTEM — DARK (primary)
// =============================================================================

export const colors = {
  ink: {
    paper: '#0b0b0f',
    50: '#18181f',
    100: '#22222c',
    200: '#2e2e3a',
    300: '#40404f',
    400: '#5a5a6e',
    500: '#78788c',
    600: '#9a9aad',
    700: '#b8b8c8',
    800: '#d4d4de',
    900: '#e8e8ec',
    950: '#f2f2f5',
  },

  note: {
    onyx:     { bg: '#1a1a24', accent: '#818cf8' },
    ocean:    { bg: '#151a2e', accent: '#60a5fa' },
    forest:   { bg: '#152e1f', accent: '#4ade80' },
    plum:     { bg: '#2e1a2e', accent: '#e879f9' },
    wine:     { bg: '#2e1a1f', accent: '#fb7185' },
    copper:   { bg: '#2e2215', accent: '#fb923c' },
    midnight: { bg: '#12182e', accent: '#38bdf8' },
    emerald:  { bg: '#152e24', accent: '#34d399' },
    gold:     { bg: '#2e2a15', accent: '#facc15' },
    violet:   { bg: '#22152e', accent: '#c084fc' },
    teal:     { bg: '#152a2e', accent: '#2dd4bf' },
    slate:    { bg: '#1e1e28', accent: '#a1a1aa' },
  },

  action: {
    DEFAULT: '#c4b5fd',
    press: '#a78bfa',
  },

  danger: {
    DEFAULT: '#f43f5e',
    activeBg: 'rgba(244, 63, 94, 0.90)',
    activeText: '#ffffff',
    shadow: 'rgba(244,63,94,0.50)',
    ring: 'rgba(244,63,94,0.35)',
  },

  selection: { mixOpacity: 0.20 },
  placeholder: { editing: 0.30, idle: 0.45, dataAttr: 0.30 },
  scrollbar: { thumbOpacity: 0.20 },
  gridDot: { opacity: 0.06 },
  grain: { dotOpacity: 0.03 },
} as const

// =============================================================================
// SECTION 2b: COLOR SYSTEM — LIGHT
// =============================================================================

export const light = {
  ink: {
    paper: '#f5f5f7',
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
    950: '#09090b',
  },

  note: {
    onyx:     { bg: '#e0e0f0', accent: '#6366f1' },
    ocean:    { bg: '#dbe4f0', accent: '#3b82f6' },
    forest:   { bg: '#d4edda', accent: '#22c55e' },
    plum:     { bg: '#f0dbf0', accent: '#d946ef' },
    wine:     { bg: '#f0dbe0', accent: '#f43f5e' },
    copper:   { bg: '#f0e4d4', accent: '#f97316' },
    midnight: { bg: '#d4e4f0', accent: '#0ea5e9' },
    emerald:  { bg: '#d4f0e4', accent: '#10b981' },
    gold:     { bg: '#f0ecd4', accent: '#eab308' },
    violet:   { bg: '#e8d4f0', accent: '#a855f7' },
    teal:     { bg: '#d4f0ec', accent: '#14b8a6' },
    slate:    { bg: '#e4e4e8', accent: '#71717a' },
  },

  action: {
    DEFAULT: '#6366f1',
    press: '#4f46e5',
  },

  danger: {
    DEFAULT: '#f43f5e',
    activeBg: 'rgba(244, 63, 94, 0.92)',
    activeText: '#ffffff',
    shadow: 'rgba(244,63,94,0.55)',
    ring: 'rgba(244,63,94,0.40)',
  },

  selection: { mixOpacity: 0.15 },
  placeholder: { editing: 0.32, idle: 0.50, dataAttr: 0.35 },
  scrollbar: { thumbOpacity: 0.18 },
  gridDot: { opacity: 0.08 },
  grain: { dotOpacity: 0.04 },
} as const

// =============================================================================
// SECTION 3: TYPOGRAPHY
// =============================================================================

export const typography = {
  fontFamily: {
    sans: [
      '"Inter"',
      '-apple-system',
      'BlinkMacSystemFont',
      '"SF Pro Display"',
      'system-ui',
      '"Segoe UI"',
      'Roboto',
      'sans-serif',
    ],
    mono: [
      '"JetBrains Mono"',
      '"SF Mono"',
      'ui-monospace',
      'Menlo',
      'Consolas',
      'monospace',
    ],
  },
  fontCdnUrl:
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
  fontFeatures: '"cv11", "ss01"',
  fontSynthesis: { italic: true },
  weight: { normal: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 },
  body: {
    color: '#e8e8ec',
    letterSpacing: '-0.01em',
    smoothing: 'antialiased' as const,
    rendering: 'optimizeLegibility' as const,
  },
  size: {
    brandName: '14px', brandPhonetic: '9.5px', noteCount: '10px',
    toolbarZoom: '11px', toolbarHint: '10.5px', toolbarKbd: '10px',
    noteBody: '15px', noteTimestamp: '10px', notePlaceholder: '15px', noteEmptyPlaceholder: '15px',
    todoText: '15px', todoPlaceholder: '15px', selectionTool: '13px',
    emptyHeadline: '40px', emptySubtitle: '11px',
    modalTitle: '26px', modalBody: '14.5px', modalButton: '14px', modalClose: '13px', modalDate: '10px',
    modalFeatureTitle: '13.5px', modalFeatureDesc: '12.5px', modalHeroTitle: '20px', modalHeroSubtitle: '13px',
    trashLabel: '12.5px',
    mobileBrand: '15px', mobilePhonetic: '10px', mobileHeadline: '34px',
    mobileBody: '15px', mobileAsk: '10.5px', mobileMadeBy: '11px',
    signature: '11px',
  },
  letterSpacing: {
    brandName: '-0.018em', noteBody: '-0.005em', noteTimestamp: '-0.005em',
    toolbarZoom: '-0.005em', emptyHeadline: '-0.035em', emptySubtitle: '0.16em',
    modalTitle: '-0.025em', modalBody: '-0.008em', modalButton: '-0.01em',
    mobileHeadline: '-0.025em', mobileBody: '-0.005em', mobileAsk: '0.12em',
    trashLabel: '-0.01em', signature: '-0.005em', devSignatureName: '-0.012em',
  },
  lineHeight: {
    noteBody: 1.5, modalTitle: 1.05, modalBody: 1.55, modalFeatureDesc: 1.4,
    mobileHeadline: 1.05, mobileBody: 1.5,
  },
  case: {
    noteTimestamp: 'uppercase' as const, emptySubtitle: 'uppercase' as const,
    mobileAsk: 'uppercase' as const,
  },
} as const

// =============================================================================
// SECTION 4: SPACING & LAYOUT
// =============================================================================

export const spacing = {
  scale: {
    '0.5': '0.125rem', 1: '0.25rem', 1.5: '0.375rem', 2: '0.5rem',
    2.5: '0.625rem', 3: '0.75rem', 4: '1rem', 5: '1.25rem',
    6: '1.5rem', 7: '1.75rem', 8: '2rem', 9: '2.25rem',
    10: '2.5rem', 12: '3rem', 14: '3.5rem', 16: '4rem',
  },
  note: {
    defaultWidth: 240, defaultHeight: 170,
    minWidth: 180, minHeight: 120,
    maxWidth: 600, maxHeight: 700,
    createOffsetX: 120, createOffsetY: 85,
    topBarHeight: '1.75rem',
    bodyPaddingX: '1rem', bodyPaddingBottom: '0.75rem', bodyPaddingTop: '0.25rem',
    footerPaddingX: '1rem', footerPaddingBottom: '0.625rem',
  },
  toolbar: {
    bottomOffset: '1.5rem',
    pillPaddingX: '0.375rem', pillPaddingY: '0.375rem',
    buttonGap: '0.125rem',
    buttonSize: '2rem', primaryButtonSize: '2rem',
    zoomMinWidth: '3.25rem',
    dividerWidth: '1px', dividerHeight: '1.25rem',
    brandTop: '1.25rem', brandLeft: '1.25rem',
    brandIconSize: '1.75rem', brandIconSvg: 14,
    hintTop: '1.25rem', hintRight: '1.25rem',
  },
  trash: {
    bottomOffset: '1.5rem', height: '2.75rem',
    paddingX: '1.25rem', iconSize: 15,
  },
  selectionToolbar: {
    pillWidth: 168, pillHeight: 36,
    selectionGap: 10, viewportClamp: 8,
    buttonSize: '1.75rem', iconSize: 13,
  },
  colorPicker: {
    pillWidth: 200, pillHeight: 68,
    swatchSize: '1.5rem', gridGap: '0.375rem',
    padding: '0.5rem', anchorGap: 10,
    viewportClamp: 8,
    activeRing: '1.5px', inactiveRing: '0.5px',
    checkmarkSize: 10,
  },
  modal: {
    creditsWidth: 380,
    maxViewportPct: '92vw',
    creditsRadius: '16px',
    popupRadius: '8px', buttonRadius: '999px',
    paddingX: '1.75rem', paddingTop: '2.25rem', paddingBottom: '1.5rem',
    tapeWidth: '5rem', tapeHeight: '1.25rem',
    tapeTop: '-0.5rem', tapeRotate: '-2deg',
  },
  signature: {
    bottom: '1.25rem', right: '1.25rem',
    paddingX: '0.6875rem', paddingY: '0.4375rem', paddingLeft: '0.75rem',
    borderRadius: '6px',
    tapeWidth: '1.75rem', tapeHeight: '0.5rem',
    tapeTop: '-0.25rem', tapeRotate: '-3deg', tapeBlur: '6px',
  },
  emptyState: {
    headlineHeight: '44px', headlineFontSize: '40px', subtitleFontSize: '11px',
    dotSize: '0.25rem', rotateInterval: 3600,
  },
  canvas: { gridSize: 32, gridDotSize: 1 },
  zIndex: {
    canvasGrid: 0, canvasSurface: 10, noteRest: 10,
    noteSelected: 30, noteEditing: 40, noteDragging: 50,
    dragShadow: 20, emptyState: 0,
    toolbar: 50, trashZone: 50,
    devSignature: 40,
    selectionToolbar: 100, colorPicker: 100,
    modalBackdrop: 200, modalCard: 200,
  },
} as const

// =============================================================================
// SECTION 5: BORDER RADIUS
// =============================================================================

export const radius = {
  note: '8px',
  toolbar: '16px',
  toolbarButton: '8px',
  selectionToolbar: '999px',
  colorPicker: '14px',
  swatch: '999px',
  trash: '999px',
  topBarButton: '999px',
  kbd: '5px',
  modalButton: '999px',
  creditsCard: '16px',
  modalCloseButton: '6px',
  featureIcon: '6px',
  brandIcon: '8px',
  signature: '6px',
  signatureTape: '1px',
  focusRing: '8px',
} as const

// =============================================================================
// SECTION 6: SHADOWS
// =============================================================================

export const shadows = {
  note: {
    base: '0 1px 2px rgba(0,0,0,0.20), 0 6px 14px -4px rgba(0,0,0,0.30), 0 16px 36px -12px rgba(0,0,0,0.40)',
    rest: '0 1px 2px rgba(0,0,0,0.20), 0 6px 14px -4px rgba(0,0,0,0.30), 0 16px 36px -12px rgba(0,0,0,0.40)',
    selected: (accent: string) =>
      `0 1px 2px rgba(0,0,0,0.20), 0 6px 14px -4px rgba(0,0,0,0.30), 0 16px 36px -12px rgba(0,0,0,0.40), 0 18px 40px -12px ${hexToRgba(accent, 0.35)}, 0 8px 24px -8px ${hexToRgba(accent, 0.25)}`,
    editing: (accent: string) =>
      `0 1px 2px rgba(0,0,0,0.20), 0 6px 14px -4px rgba(0,0,0,0.30), 0 16px 36px -12px rgba(0,0,0,0.40), 0 24px 60px -16px ${hexToRgba(accent, 0.55)}, 0 12px 36px -10px ${hexToRgba(accent, 0.40)}`,
    dragging: (accent: string) =>
      `0 2px 4px rgba(0,0,0,0.25), 0 22px 50px -10px rgba(0,0,0,0.35), 0 32px 80px -20px ${hexToRgba(accent, 0.40)}`,
  },
  glass: {
    toolbar:
      'inset 0 1px 0 rgba(255,255,255,0.08), ' +
      'inset 0 0 0 0.5px rgba(255,255,255,0.04), ' +
      'inset 0 -1px 1px rgba(0,0,0,0.10), ' +
      '0 0 0 0.5px rgba(255,255,255,0.04), ' +
      '0 6px 14px -4px rgba(0,0,0,0.30), ' +
      '0 22px 48px -12px rgba(0,0,0,0.40)',
    buttonRest:
      'inset 0 1px 0 rgba(255,255,255,0.06), ' +
      'inset 0 0 0 0.5px rgba(255,255,255,0.03), ' +
      'inset 0 -1px 0 rgba(0,0,0,0.08)',
  },
  soft: '0 1px 2px rgba(0,0,0,0.20), 0 6px 14px -4px rgba(0,0,0,0.30), 0 16px 36px -12px rgba(0,0,0,0.40)',
  lift: '0 2px 4px rgba(0,0,0,0.25), 0 12px 28px -8px rgba(0,0,0,0.30), 0 28px 60px -16px rgba(0,0,0,0.45)',
  brandIcon: '0 1px 2px rgba(0,0,0,0.20), 0 6px 14px -4px rgba(0,0,0,0.30), 0 16px 36px -12px rgba(0,0,0,0.40)',
  trash: {
    rest:
      'inset 0 1px 0 rgba(255,255,255,0.08), ' +
      'inset 0 0 0 0.5px rgba(255,255,255,0.04), ' +
      '0 6px 14px -4px rgba(0,0,0,0.25), ' +
      '0 22px 48px -12px rgba(0,0,0,0.35)',
    active:
      '0 12px 36px -6px rgba(244,63,94,0.50), ' +
      '0 0 0 1px rgba(244,63,94,0.35), ' +
      'inset 0 1px 0 rgba(255,255,255,0.04)',
  },
  modal: {
    credits:
      'inset 0 1px 0 rgba(255,255,255,0.06), ' +
      '0 1px 2px rgba(0,0,0,0.15), ' +
      '0 24px 64px -12px rgba(0,0,0,0.50), ' +
      '0 32px 80px -20px rgba(129,140,248,0.35)',
    featureIcon: (accent: string) =>
      '0 0 0 0.5px rgba(255,255,255,0.05), ' +
      'inset 0 1px 0 rgba(255,255,255,0.06), ' +
      `0 4px 10px -4px ${accent}`,
    primaryButton:
      'inset 0 1px 0 rgba(255,255,255,0.10), ' +
      '0 4px 12px -2px rgba(0,0,0,0.35)',
    creditsCta:
      'inset 0 1px 0 rgba(255,255,255,0.10), ' +
      '0 6px 16px -4px rgba(0,0,0,0.40)',
  },
  signature:
    '0 1px 2px rgba(0,0,0,0.20), ' +
    '0 6px 14px -4px rgba(0,0,0,0.30), ' +
    '0 12px 28px -10px rgba(192,132,252,0.25), ' +
    'inset 0 1px 0 rgba(255,255,255,0.04)',
  mobileSticky: (accent: string) =>
    '0 1px 2px rgba(0,0,0,0.20), ' +
    '0 6px 14px -4px rgba(0,0,0,0.30), ' +
    `0 20px 40px -12px ${accent}55, ` +
    'inset 0 1px 0 rgba(255,255,255,0.04)',
  swatch: {
    active:
      '0 0 0 1.5px var(--color-ink-900), ' +
      'inset 0 1px 0 rgba(255,255,255,0.04)',
    inactive:
      '0 0 0 0.5px rgba(255,255,255,0.08), ' +
      'inset 0 1px 0 rgba(255,255,255,0.03)',
  },
  heroDot:
    '0 0 0 0.5px rgba(255,255,255,0.06), ' +
    'inset 0 0.5px 0 rgba(255,255,255,0.10)',
  dragOverlay: 'rgba(232, 232, 236, 0.015)',
  selectionActiveButton:
    'inset 0 1px 0 rgba(255,255,255,0.10)',
} as const

// =============================================================================
// SECTION 7: EFFECTS & MATERIALS
// =============================================================================

export const effects = {
  glass: {
    background: {
      top: 'rgba(24, 24, 31, 0.65)',
      mid: 'rgba(24, 24, 31, 0.45)',
      bottom: 'rgba(24, 24, 31, 0.50)',
    },
    saturate: '200%',
    blur: '28px',
    buttonBackground: 'rgba(255, 255, 255, 0.04)',
    buttonHover: 'rgba(255, 255, 255, 0.10)',
    buttonActive: 'rgba(255, 255, 255, 0.02)',
    triggerBackground: 'rgba(24, 24, 31, 0.60)',
    triggerBlur: '24px',
    triggerSaturate: '200%',
  },
  grain: { dotOpacity: 0.03, size: '24px', dotRadius: '1px' },
  modalBackdrop: {
    color: 'rgba(11, 11, 15, 0.55)',
    blur: '14px',
    saturate: '140%',
  },
  tape: {
    background: 'rgba(24, 24, 31, 0.55)',
    shadow: '0 1px 2px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.06)',
    blur: '8px',
    signatureBackground: 'rgba(24, 24, 31, 0.60)',
    signatureShadow: '0 0.5px 1px rgba(0,0,0,0.10), inset 0 0.5px 0 rgba(255,255,255,0.06)',
    signatureBlur: '6px',
  },
  focus: {
    outlineWidth: '2px',
    outlineOpacity: 0.30,
    outlineOffset: '2px',
    outlineRadius: '8px',
    contentEditable: 'none',
  },
  selection: { mixOpacity: 0.20 },
  scrollbar: { width: '6px', height: '6px', thumbOpacity: 0.20, thumbRadius: '999px', trackColor: 'transparent' },
  tapHighlight: 'transparent',
} as const

// =============================================================================
// SECTION 8: ANIMATION & MOTION
// =============================================================================

export const motion = {
  ease: {
    out: [0.16, 1, 0.3, 1] as [number, number, number, number],
    outQuart: [0.25, 1, 0.5, 1] as [number, number, number, number],
    outExpo: [0.16, 1, 0.3, 1] as [number, number, number, number],
    spring: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
  },
  spring: {
    note: { type: 'spring' as const, stiffness: 420, damping: 32, mass: 0.7 },
    button: { type: 'spring' as const, stiffness: 500, damping: 30 },
    colorPicker: { type: 'spring' as const, stiffness: 460, damping: 30, mass: 0.7 },
    swatch: { type: 'spring' as const, stiffness: 520, damping: 22 },
    sticky: { type: 'spring' as const, stiffness: 280, damping: 16, mass: 0.9 },
    credits: { type: 'spring' as const, stiffness: 320, damping: 26, mass: 0.8 },
    item: { type: 'spring' as const, stiffness: 360, damping: 30 },
    heroDot: { type: 'spring' as const, stiffness: 480, damping: 18 },
    trashIcon: { type: 'spring' as const, stiffness: 500, damping: 18 },
    signature: { type: 'spring' as const, stiffness: 360, damping: 26 },
    trigger: { type: 'spring' as const, stiffness: 380, damping: 26 },
  },
  duration: {
    instant: 0.10, fast: 0.14, normal: 0.16, medium: 0.18, slow: 0.22,
    panel: 0.24, noteEnter: 0.55, noteExit: 0.18,
    emptyEnter: 0.55, emptyExit: 0.35, brand: 0.50,
    toolbarEnter: 0.55, toolbarExit: 0.18, auroraFade: 1.4,
    glassButton: 0.18, strikethrough: 0.22,
    topBarTransition: 0.16, hoverLift: 0.18, selectionToolbar: 0.16,
  },
  stagger: {
    emptyLetter: 0.025, colorSwatch: 0.022,
    heroDot: 0.05,
    creditsItem: 0.08, mobileSticky: 0.08,
  },
  delay: {
    brand: 0.1, toolbar: 0.18, hint: 0.6,
    emptySubtitle: 0.45, creditsChildren: 0.14,
    creditsWave: 0.25, mobileText: 0.1,
    signature: 1.1,
    newBadge: 0.8, mobileStickyBase: 0.1,
  },
  ambient: {
    breatheDuration: 2.4,
    mobileFloatBase: 3, mobileFloatIncrement: 0.4,
    mobileFloatDelay: 1.2, mobileFloatDelayIncrement: 0.15,
  },
  scale: {
    noteHover: 1.0, noteHoverY: -1,
    noteDrag: 1.035, buttonTap: 0.88, primaryTap: 0.9,
    toolbarButtonHover: 1.0, toolbarButtonHoverY: -0.5,
    swatchHover: 1.14, swatchHoverY: -1, swatchTap: 0.84,
    trashActive: 1.08, trashIconRotate: -8,
    signatureHover: 1.05, signatureHoverY: -3,
    signatureHoverRotate: 0, signatureTap: 0.97,
    modalButtonHoverY: -0.5, modalButtonTap: 0.97,
    modalCloseTap: 0.96, triggerHoverY: -1,
    triggerTap: 0.94, selectionToolbar: 0.96,
    colorPickerEnter: 0.6, colorPickerExit: 0.85,
    creditsEnterScale: 0.92, creditsEnterRotate: -1.5,
    creditsExitScale: 0.96,
  },
  opacity: {
    noteEnter: 0, noteRest: 1, noteExit: 0,
    toolbarDimmed: 0, toolbarRest: 1,
    trashEnter: 0, trashRest: 1, trashExit: 0,
    dragOverlay: 0.015,
    emptyBlurEnter: '6px', emptyBlurRest: '0px', emptyBlurExit: '6px',
    todoPlaceholder: 0.4, todoDoneText: 0.55, strikethrough: 0.45,
    topBarHoverBg: 0.08, toolbarHoverBg: 0.05,
    signatureArrowRest: 0.55, signatureArrowHover: 0.90,
    kbdOpacity: { dot: 0.30, text: 0.60 },
    modalBackdrop: 1,
  },
  offset: {
    noteEnterY: 8, noteExitY: -6,
    toolbarEnterY: 16, toolbarDimmedY: 14,
    trashEnterY: 28, brandEnterY: -8,
    emptySubtitleY: 4, selectionToolbarY: 4,
    creditsEnterY: 14, creditsExitY: 10,
    mobileTextY: 14, mobileStickyY: -60,
    signatureEnterY: 18, signatureEnterRotate: -3.5,
    triggerEnterY: 14, triggerExitY: 10,
  },
} as const

// =============================================================================
// SECTION 9: SOUND DESIGN
// =============================================================================

export const sound = {
  global: {
    masterGain: 0.85,
    defaultType: 'sine' as OscillatorType,
    defaultGain: 0.05,
    defaultAttackMs: 2,
    defaultReleaseMs: 90,
    lowpassQ: 0.4,
    lowpassFreqMultiplier: 4,
    lowpassFreqMax: 8000,
    overtoneStagger: 0.008,
  },
  presets: {
    tapSoft: [
      { freq: 2000, durationMs: 26, type: 'sine' as OscillatorType, gain: 0.04, releaseMs: 65 },
    ],
    tapFirm: [
      { freq: 1300, durationMs: 20, type: 'triangle' as OscillatorType, gain: 0.08, releaseMs: 55 },
    ],
    toggle: [
      { freq: 1700, durationMs: 22, type: 'sine' as OscillatorType, gain: 0.06, releaseMs: 60 },
    ],
    pickup: [
      { freq: 480, durationMs: 16, type: 'sine' as OscillatorType, gain: 0.05, releaseMs: 85 },
      { freq: 820, durationMs: 20, type: 'sine' as OscillatorType, gain: 0.04, releaseMs: 95 },
    ],
    drop: [
      { freq: 300, durationMs: 20, type: 'sine' as OscillatorType, gain: 0.07, releaseMs: 95 },
      { freq: 200, durationMs: 28, type: 'sine' as OscillatorType, gain: 0.05, releaseMs: 130 },
    ],
    create: [
      { freq: 620, durationMs: 18, type: 'sine' as OscillatorType, gain: 0.04, releaseMs: 75 },
      { freq: 930, durationMs: 24, type: 'sine' as OscillatorType, gain: 0.04, releaseMs: 95 },
      { freq: 1240, durationMs: 28, type: 'sine' as OscillatorType, gain: 0.03, releaseMs: 105 },
    ],
    delete: [
      { freq: 820, durationMs: 16, type: 'triangle' as OscillatorType, gain: 0.04, releaseMs: 65 },
      { freq: 410, durationMs: 22, type: 'triangle' as OscillatorType, gain: 0.04, releaseMs: 95 },
    ],
  } as const,
  storageKey: 'spatial-notes:sound',
} as const

// =============================================================================
// SECTION 10: CANVAS & VIEWPORT
// =============================================================================

export const canvas = {
  grid: { size: 32, dotSize: 1, dotOpacity: 0.06 },
  viewport: {
    minScale: 0.4, maxScale: 2.5, defaultScale: 1,
    zoomStep: 1.2, keyboardZoomStep: 1.15, wheelSensitivity: 0.01,
  },
  drag: {
    threshold: 4,
    cursorRest: 'grab', cursorGrabbing: 'grabbing',
    cursorText: 'text', cursorResize: 'nwse-resize',
  },
  background: {
    color: '#0b0b0f',
    dragOverlay: 'rgba(232, 232, 236, 0.015)',
  },
} as const

// =============================================================================
// SECTION 11: RESPONSIVE & BREAKPOINTS
// =============================================================================

export const responsive = {
  mobileBreakpoint: 768,
  showHintsBreakpoint: 'sm',
} as const

// =============================================================================
// SECTION 12: COMPONENT-SPECIFIC TOKENS
// =============================================================================

export const components = {
  note: {
    tintCycle: [
      'onyx', 'ocean', 'forest', 'plum',
      'wine', 'copper', 'midnight', 'emerald',
      'gold', 'violet', 'teal', 'slate',
    ] as const,
    tints: [
      'onyx', 'ocean', 'forest', 'plum',
      'wine', 'copper', 'midnight', 'emerald',
      'gold', 'violet', 'teal', 'slate',
    ] as const,
    actions: { iconSize: 12, paletteIconSize: 13, buttonSize: '1.5rem' },
    resizeHandle: { size: '1.25rem', iconSize: 12 },
    timestampFormat: {
      month: 'short' as const, day: 'numeric' as const,
      hour: 'numeric' as const, minute: '2-digit' as const,
    },
    placeholder: {
      editing: 'Type a thought…',
      idle: 'Empty note',
      todo: 'Add a task…',
    },
    listIndent: '1.25em',
    listItemPadding: '0.15em',
    markerOpacity: 0.55,
  },
  toolbar: {
    iconSize: { add: 14, zoom: 15, sound: 14 },
    zoomFormat: (scale: number) => `${Math.round(scale * 100)}%`,
    divider: { width: '1px', height: '1.25rem', color: 'rgba(255,255,255,0.06)' },
    hints: [
      { key: 'Double-click', action: 'to add' },
      { key: 'Drag', action: 'to pan' },
    ],
  },
  selectionToolbar: {
    tools: [
      { id: 'bold', label: 'Bold', command: 'bold' as const },
      { id: 'italic', label: 'Italic', command: 'italic' as const },
      { id: 'unordered', label: 'Bulleted list', command: 'insertUnorderedList' as const },
      { id: 'ordered', label: 'Numbered list', command: 'insertOrderedList' as const },
    ],
    activeButton: { background: '#e8e8ec', text: '#0b0b0f' },
  },
  todo: {
    checkboxSize: '1em', checkboxMarginTop: '0.32em',
    checkmarkScale: 0.72, checkmarkStrokeWidth: 2,
    uncheckedBorder: '1.25px solid color-mix(in oklab, currentColor 35%, transparent)',
    strikethroughHeight: '1.5px', strikethroughOpacity: 0.45,
    doneTextOpacity: 0.55,
  },
  emptyState: {
    phrases: [
      'Welcome to inklin.',
      'A quiet canvas.',
      'Room for your thoughts.',
      'Drop your ideas.',
      'Make something.',
      'inklin awaits.',
    ],
    subtitle: 'Double-click anywhere',
    letterStagger: 0.025,
  },
  mobileNotice: {
    stickies: [
      { tint: 'var(--color-note-gold)',    accent: '#facc15', rot: -10, x: -18, y: -6 },
      { tint: 'var(--color-note-emerald)', accent: '#34d399', rot: 6,  x: 20, y: -16 },
      { tint: 'var(--color-note-violet)',  accent: '#c084fc', rot: -3, x: -8, y: 18 },
      { tint: 'var(--color-note-wine)',    accent: '#fb7185', rot: 9,  x: 26, y: 14 },
    ],
    headline: 'Made for room to think',
    bodyTemplate: {
      before: "This canvas spreads itself across your screen. Pop it open on an ",
      highlight1: 'iPad', mid: ' or ', highlight2: 'desktop',
      after: " and it'll be right here — full size, full breath.",
    },
    label: 'A small ask', madeBy: 'made by',
  },
  credits: {
    storageKey: 'spatial-notes:credits:v1',
    appearDelayMs: 1_800,
    wavePattern: [0, 14, -8, 14, -4, 10, 0] as const,
    waveDuration: 1.4,
    title: 'Hey there',
    emoji: '👋',
    body: {
      p1: "I'm ", p1Highlight: 'Ayomide Aluko',
      p1Mid: " — the human behind the pixels. I built ",
      p1App: 'inklin', p1After: " for my own scattered brain, and quietly hoped it might help someone else's too.",
      p2: 'If it brings you a small bit of calm today, say hi.',
    },
    cta: 'Find me on X', close: 'Close',
    linkDecoration: 'var(--color-accent-onyx)',
  },
  signature: { prefix: 'by', name: 'Ayomide Aluko', arrowSize: 10 },
  trash: {
    labels: { rest: 'Drop here to delete', active: 'Release to delete' },
  },
} as const

// =============================================================================
// SECTION 13: STORAGE KEYS
// =============================================================================

export const storage = {
  notes: 'spatial-notes:notes:v1',
  sound: 'spatial-notes:sound',
  theme: 'spatial-notes:theme',
  credits: 'spatial-notes:credits:v1',
} as const

// =============================================================================
// SECTION 14: UTILITY FUNCTIONS
// =============================================================================

export function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function getNoteTint(tintName: keyof typeof colors.note) {
  return colors.note[tintName]
}

export function getNoteShadow(accent: string, mode: 'rest' | 'selected' | 'editing' | 'dragging' | 'resizing'): string {
  if (mode === 'rest') return shadows.note.rest
  if (mode === 'dragging' || mode === 'resizing')
    return shadows.note.dragging(accent)
  if (mode === 'selected')
    return shadows.note.selected(accent)
  return shadows.note.editing(accent)
}

export function getAuroraBackground(): string {
  return [
    'radial-gradient(60% 35% at 50% 100%, color-mix(in oklab, #60a5fa 12%, transparent), transparent 70%)',
    'radial-gradient(45% 30% at 25% 95%, color-mix(in oklab, #c084fc 10%, transparent), transparent 70%)',
    'radial-gradient(40% 25% at 75% 95%, color-mix(in oklab, #fb7185 8%, transparent), transparent 70%)',
    'radial-gradient(50% 30% at 50% 0%, color-mix(in oklab, #facc15 6%, transparent), transparent 75%)',
  ].join(', ')
}

export function getFontFamily(type: 'sans' | 'mono'): string {
  return typography.fontFamily[type].join(', ')
}

export function generateCSSVariables(): string {
  const vars: string[] = []
  for (const [key, val] of Object.entries(colors.ink)) {
    if (key === 'paper') vars.push(`  --color-paper: ${val};`)
    else if (typeof val === 'string') vars.push(`  --color-ink-${key}: ${val};`)
  }
  for (const [name, { bg, accent }] of Object.entries(colors.note)) {
    vars.push(`  --color-note-${name}: ${bg};`)
    vars.push(`  --color-accent-${name}: ${accent};`)
  }
  vars.push(`  --color-action: ${colors.action.DEFAULT};`)
  vars.push(`  --color-action-press: ${colors.action.press};`)
  vars.push(`  --font-sans: ${getFontFamily('sans')};`)
  vars.push(`  --font-mono: ${getFontFamily('mono')};`)
  vars.push(`  --ease-out-quart: cubic-bezier(${motion.ease.outQuart.join(', ')});`)
  vars.push(`  --ease-out-expo: cubic-bezier(${motion.ease.outExpo.join(', ')});`)
  vars.push(`  --ease-spring: cubic-bezier(${motion.ease.spring.join(', ')});`)
  return vars.join('\n')
}

// =============================================================================
// DEFAULT EXPORT
// =============================================================================

const theme = {
  brand, colors, light, typography, spacing, radius,
  shadows, effects, motion, sound, canvas, responsive,
  components, storage,
  hexToRgba, getNoteTint, getNoteShadow, getAuroraBackground,
  getFontFamily, generateCSSVariables,
} as const

export default theme
