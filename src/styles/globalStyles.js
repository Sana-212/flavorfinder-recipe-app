// styles/globalStyles.js
// ─────────────────────────────────────────────────────────────────────────────
// All theme tokens live here. Two palettes: light + dark.
// Inspired by the dark reference: #131313 bg, #282828 surface, #FF6A00 accent
// Your existing accent is #FF5252 — keeping it, it works perfectly on dark too.
// ─────────────────────────────────────────────────────────────────────────────

export const lightColors = {
  // Backgrounds
  background: '#F8F6F3',      // warm off-white — feels like parchment
  surface: '#FFFFFF',          // cards, inputs
  surfaceAlt: '#F0EDE8',       // slightly darker surface for nested cards

  // Text
  text: '#1A1714',             // near-black with warmth
  textSecondary: '#4A4540',    // secondary body text
  textLight: '#9A948E',        // captions, hints

  // Accent
  primary: '#FF5252',          // your red — unchanged
  primaryLight: 'rgba(255,82,82,0.12)',

  // UI
  border: '#E8E4DF',
  borderStrong: '#C8C3BC',
  icon: '#4A4540',
  tabBar: '#FFFFFF',
  tabBarBorder: '#E8E4DF',
  statusBar: 'dark-content',

  // Semantic
  success: '#2D9E6B',
  warning: '#E8A020',
};

export const darkColors = {
  // Backgrounds — from reference: #131313 base, #282828 surface
  background: '#131313',
  surface: '#2b2a2a',
  surfaceAlt: '#282828',

  // Text
  text: '#F2EFE9',             // warm white — not pure white, easier on eyes
  textSecondary: '#B8B2AA',
  textLight: '#6E6860',

  // Accent — same red works great on dark
  primary: '#FF5252',
  primaryLight: 'rgba(255,82,82,0.15)',

  // UI
  border: '#2E2E2E',
  borderStrong: '#3E3E3E',
  icon: '#B8B2AA',
  tabBar: '#1A1A1A',
  tabBarBorder: '#2A2A2A',
  statusBar: 'light-content',

  // Semantic
  success: '#3DBF82',
  warning: '#F0B040',
};

// ─── Fallback static export (used only if a screen hasn't migrated yet) ───────
// After full migration, every screen uses useTheme() instead of this.
export const colors = lightColors;

// ─── Spacing scale ────────────────────────────────────────────────────────────
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

// ─── Border radius scale ─────────────────────────────────────────────────────
export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 22,
  xxl: 32,
};

// ─── Typography scale ─────────────────────────────────────────────────────────
// Note: color is intentionally omitted here — screens apply theme color at runtime
export const typography = {
  h1: { fontSize: 28, fontWeight: '700', letterSpacing: -0.5, lineHeight: 34 },
  h2: { fontSize: 22, fontWeight: '700', letterSpacing: -0.3, lineHeight: 28 },
  h3: { fontSize: 18, fontWeight: '600', lineHeight: 24 },
  body: { fontSize: 15, fontWeight: '400', lineHeight: 22 },
  bodyMedium: { fontSize: 15, fontWeight: '500', lineHeight: 22 },
  caption: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, lineHeight: 14 },
};