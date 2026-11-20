import React from 'react';
import {View, Text, StyleSheet, useWindowDimensions} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {C, F, B, DIALOG_MAX_WIDTH} from '../../Constants/tokens';
import {getLayout} from '../useLayout';
import IconSquare from './IconSquare';
import {useRootInsets} from '../NavBarFrame';

// Fougito dialog kit: 60% ink scrim, flat card with a 2px ink border,
// white header (Black title + 44 ink close square), white footer over a 2px ink rule.

export const useDialogMetrics = (max = DIALOG_MAX_WIDTH) => {
  const {width, height} = useWindowDimensions();
  const layout = getLayout(width, height);
  const phone = layout === 'phone';
  return {
    layout,
    phone,
    width: Math.min(max, width - 32),
    maxHeight: height - (phone ? 96 : 80),
    padX: phone ? 16 : 28,
  };
};

// Fills its parent (use inside a transparent Modal) and centres the card.
// sheet: on phone the card docks to the bottom edge.
// Modals draw under the nav bar (navigationBarTranslucent); pad content above it.
export const DialogScrim = ({children, sheet, style}) => {
  const insets = useRootInsets();
  return (
    <View
      style={[
        styles.scrim,
        sheet && styles.sheetScrim,
        {
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
        style,
      ]}>
      {children}
    </View>
  );
};

export const DialogCard = ({children, max = DIALOG_MAX_WIDTH, sheet, style}) => {
  const m = useDialogMetrics(max);
  const asSheet = sheet && m.phone;
  return (
    <View
      style={[
        styles.card,
        asSheet
          ? styles.sheet
          : {width: m.width, maxHeight: m.maxHeight},
        style,
      ]}>
      {children}
    </View>
  );
};

export const DialogHeader = ({title, onClose, right}) => {
  const m = useDialogMetrics();
  return (
    <View
      style={[
        styles.header,
        {paddingHorizontal: m.padX, paddingVertical: m.phone ? 16 : 20},
      ]}>
      <Text
        numberOfLines={2}
        style={[styles.headerTitle, {fontSize: m.phone ? 22 : 26}]}>
        {title}
      </Text>
      {right}
      {onClose ? (
        <IconSquare name="x" variant="ink" onPress={onClose} />
      ) : null}
    </View>
  );
};

export const DialogFooter = ({children, style}) => {
  const m = useDialogMetrics();
  return (
    <View
      style={[
        styles.footer,
        {paddingHorizontal: m.phone ? 16 : 24, paddingVertical: m.phone ? 12 : 16},
        style,
      ]}>
      {children}
    </View>
  );
};

// Caps label + value row (Customer Info, item modals).
export const DialogRow = ({label, value, children, style}) => (
  <View style={[styles.row, style]}>
    <Text style={styles.rowLabel}>{label}</Text>
    {children ? children : <Text style={styles.rowValue}>{value}</Text>}
  </View>
);

// Square icon tile. tone: pink | ink | accent | disabled | white
export const IconTile = ({name, icon, size = 56, iconSize = 26, tone = 'pink', style}) => {
  const t = TONES[tone] || TONES.pink;
  return (
    <View
      style={[
        styles.tile,
        {width: size, height: size, backgroundColor: t.bg},
        tone === 'white' && styles.tileWhite,
        style,
      ]}>
      {icon || <Feather name={name} size={iconSize} color={t.fg} />}
    </View>
  );
};

const TONES = {
  pink: {bg: C.overdueBg, fg: C.accentDeep},
  ink: {bg: C.ink, fg: C.surface},
  accent: {bg: C.accent, fg: C.surface},
  disabled: {bg: C.disabled, fg: C.muted},
  white: {bg: C.surface, fg: C.accent},
};

export const dialogStyles = StyleSheet.create({
  body: {padding: 24, gap: 16, backgroundColor: C.surface},
  message: {
    fontFamily: F.bold,
    fontSize: 18,
    lineHeight: 25,
    color: C.ink,
  },
  // Outline (2px ink) action used for "No" / "Cancel" touchables.
  outlineBtn: {
    flex: 1,
    height: 56,
    borderWidth: B.rule,
    borderColor: C.ink,
    backgroundColor: C.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
  outlineText: {
    fontFamily: F.bold,
    fontSize: 17,
    color: C.ink,
    letterSpacing: 0,
  },
  flexBtn: {flex: 1, width: undefined},
  loaderBox: {flex: 1, height: 56, justifyContent: 'center', alignItems: 'center'},
});

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: C.scrim,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetScrim: {justifyContent: 'flex-end', alignItems: 'stretch'},
  card: {
    backgroundColor: C.ground,
    borderWidth: B.rule,
    borderColor: C.ink,
    overflow: 'hidden',
  },
  sheet: {
    width: '100%',
    maxHeight: '88%',
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  header: {
    backgroundColor: C.surface,
    borderBottomWidth: B.rule,
    borderBottomColor: C.ink,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  headerTitle: {flex: 1, fontFamily: F.black, color: C.ink},
  footer: {
    backgroundColor: C.surface,
    borderTopWidth: B.rule,
    borderTopColor: C.ink,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  row: {
    paddingVertical: 14,
    borderBottomWidth: B.hair,
    borderBottomColor: C.rule,
    gap: 4,
  },
  rowLabel: {
    fontFamily: F.bold,
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: C.muted,
  },
  rowValue: {fontFamily: F.medium, fontSize: 17, color: C.ink},
  tile: {alignItems: 'center', justifyContent: 'center'},
  tileWhite: {borderWidth: B.hair, borderColor: C.rule},
});
