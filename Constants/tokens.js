// Fougito Deliver tokens. Flat: one accent, ink rules, no radius, no shadow.
export const C = {
  ink: '#181717',
  ground: '#F4F4F4',
  surface: '#FFFFFF',
  accent: '#F05152',
  accentDeep: '#DF3A3B',
  accentSoft: '#F27274',
  overdueBg: '#FDECEC',
  body: '#474449',
  muted: '#6E6B70',
  placeholder: '#9A979C',
  rule: '#D9D7D7',
  disabled: '#EDECEC',
  green: '#3F7A22',
  amber: '#F9A357',
  amberDeep: '#B85F14',
  scrim: 'rgba(24,23,23,0.6)',
  inkRule: 'rgba(255,255,255,0.16)',
  inkMuted: 'rgba(255,255,255,0.7)',
  accentTint: 'rgba(240,81,82,0.14)',
  transparent: 'transparent',
};

export const F = {
  black: 'Satoshi-Black',
  bold: 'Satoshi-Bold',
  medium: 'Satoshi-Medium',
  regular: 'Satoshi-Regular',
  light: 'Satoshi-Light',
};

// The only spacing values allowed.
export const S = {xxs: 4, xs: 8, sm: 10, md: 12, lg: 14, gutter: 16, xl: 20, xxl: 24, x3: 28, x4: 32};

export const H = {header: 64, iconBtn: 44, field: 52, btnL: 56, btnM: 52, btnS: 48, seg: 38, row: 52, touch: 44, bar: 68};

export const B = {hair: 1, rule: 2, heavy: 4};

export const TABLET_MIN_SIDE = 600;
export const AUTH_MAX_WIDTH = 480;
export const SETTINGS_MAX_WIDTH = 560;
export const DIALOG_MAX_WIDTH = 440;
export const SHEET_DIALOG_MAX_WIDTH = 520;
export const CARD_MIN_WIDTH = 340;
export const GUTTER = 16;

export const centredPadding = (width, maxWidth, min = GUTTER) => Math.max(min, (width - maxWidth) / 2);

export const refreshControlColors = {
  tintColor: C.accent,
  colors: [C.accent],
  progressBackgroundColor: C.surface,
};
