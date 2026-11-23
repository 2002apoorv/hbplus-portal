/**
 * Design System and Theme for HBPLUS Employee Portal
 * Minimalist Enterprise SaaS Aesthetic
 * Palette: Navy blue, crisp white, slate/subtle grey, corporate blue accents.
 */

export const colors = {
  // Brand & Primaries
  primaryDark: '#0A192F',    // Deep Enterprise Navy
  primary: '#0F2744',        // Navy Brand Main
  primaryLight: '#1E3A8A',   // Accent Blue
  primaryMuted: '#1E293B',   // Dark Slate Navy
  primaryHover: '#162D4A',

  // Secondary & Accents
  accent: '#2563EB',         // Professional Royal Blue
  accentLight: '#EFF6FF',    // Subtle blue background tint
  accentHover: '#1D4ED8',

  // Neutral & Greys
  background: '#F8FAFC',     // Clean slate 50 background
  backgroundAlt: '#F1F5F9',  // Slate 100
  surface: '#FFFFFF',        // Pure white card surfaces
  surfaceSubtle: '#F8FAFC',
  
  // Borders
  border: '#E2E8F0',         // Subtle card and input border
  borderLight: '#F1F5F9',
  borderDark: '#CBD5E1',

  // Typography
  textPrimary: '#0F172A',    // Dark Slate 900
  textSecondary: '#475569',  // Muted Slate 600
  textMuted: '#94A3B8',      // Slate 400
  textInverse: '#FFFFFF',

  // Status & Feedback
  success: '#059669',        // Enterprise Emerald Green
  successBg: '#ECFDF5',
  successBorder: '#A7F3D0',
  successText: '#065F46',

  danger: '#DC2626',         // Enterprise Warning Red
  dangerBg: '#FEF2F2',
  dangerBorder: '#FECACA',
  dangerText: '#991B1B',

  warning: '#D97706',        // Enterprise Amber
  warningBg: '#FFFBEB',
  warningBorder: '#FDE68A',
  warningText: '#92400E',

  info: '#0284C7',           // Enterprise Cyan
  infoBg: '#F0F9FF',
  infoBorder: '#BAE6FD',
  infoText: '#075985',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    display: 32,
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 30,
    xxl: 34,
    display: 40,
  },
};

export const shadows = {
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  lg: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
  },
};

export default {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
};
