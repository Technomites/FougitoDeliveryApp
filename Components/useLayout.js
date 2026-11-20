import {useContext} from 'react';
import {useWindowDimensions} from 'react-native';
import {SafeAreaInsetsContext} from 'react-native-safe-area-context';
import {TABLET_MIN_SIDE} from '../Constants/tokens';

// 'phone' | 'tabletPortrait' | 'tabletLandscape'
// Tablet = shortest window side >= 600dp. Re-evaluates on rotation.
export const getLayout = (width, height) => {
  if (Math.min(width, height) < TABLET_MIN_SIDE) {
    return 'phone';
  }
  return width > height ? 'tabletLandscape' : 'tabletPortrait';
};

// Fixed dp per layout (README: spacing / header / grid). Tablets never use
// the height-scaled helpers in resposnevaraiable.js.
export const LAYOUT_METRICS = {
  phone: {gutter: 16, header: 64, homeHeader: 64, columns: 1},
  tabletPortrait: {gutter: 40, header: 64, homeHeader: 72, columns: 2},
  tabletLandscape: {gutter: 32, header: 64, homeHeader: 72, columns: 3},
};

export default function useLayout() {
  const {width, height} = useWindowDimensions();
  return getLayout(width, height);
}

// Convenience: layout plus its metrics and flags.
export function useDevice() {
  const {width, height} = useWindowDimensions();
  const layout = getLayout(width, height);
  return {
    layout,
    width,
    height,
    isPhone: layout === 'phone',
    isTablet: layout !== 'phone',
    isLandscape: layout === 'tabletLandscape',
    isTabletPortrait: layout === 'tabletPortrait',
    ...LAYOUT_METRICS[layout],
  };
}

// Pick a value by layout: pick(layout, phone, tabletPortrait, tabletLandscape)
export const pick = (layout, phone, portrait, landscape) =>
  layout === 'tabletLandscape'
    ? landscape
    : layout === 'tabletPortrait'
    ? portrait
    : phone;

// Tile grid metrics: columns 3 (L) / 2 (P) / 1 (M), gap 12, list padding 24 (16 phone).
export function useGrid(gap = 12) {
  const d = useDevice();
  const tileW = (d.width - d.gutter * 2 - gap * (d.columns - 1)) / d.columns;
  return {...d, gap, tileW, padTop: d.isPhone ? 16 : 24};
}

// Bottom safe-area inset (edge-to-edge nav bar). Context read so it never throws
// outside a SafeAreaProvider; 0 when unavailable.
export function useBottomInset() {
  const insets = useContext(SafeAreaInsetsContext);
  return insets?.bottom || 0;
}
