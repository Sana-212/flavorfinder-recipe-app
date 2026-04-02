// src/styles/globalStyles.js

export const colors = {
  primary: '#FF6B6B',     // coral red - hearts, buttons
  secondary: '#4ECDC4',   // mint - accents
  background: '#FFFFFF',  // white - main background
  surface: '#F8F9FA',     // off-white - cards
  text: '#2D3436',        // dark gray - headings
  textLight: '#636E72',   // medium gray - subtext
  success: '#2ECC71',     // green - success states
  warning: '#F39C12',     // orange - timers
  error: '#E74C3C',       // red - errors
  border: '#DFE6E9',      // light border
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export const typography = {
  title: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'System', // iOS default
    color: colors.text,
  },
  headline: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'System',
    color: colors.text,
  },
  body: {
    fontSize: 14,
    color: colors.text,
  },
  caption: {
    fontSize: 12,
    color: colors.textLight,
  },
};