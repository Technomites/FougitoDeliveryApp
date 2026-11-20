import React from 'react';
import {Pressable, View, StyleSheet} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {C, B, H} from '../../Constants/tokens';

// 44dp square icon button. variant: 'outline' (white, 1px rule) | 'ink' | 'whiteOutline' | 'accent'
const VARIANTS = {
  outline: {bg: C.surface, pressed: C.disabled, fg: C.ink, border: C.rule, bw: B.hair},
  ink: {bg: C.ink, pressed: C.body, fg: C.surface, border: C.ink, bw: 0},
  whiteOutline: {
    bg: C.transparent,
    pressed: C.inkRule,
    fg: C.surface,
    border: C.surface,
    bw: B.hair,
  },
  accent: {bg: C.accent, pressed: C.accentDeep, fg: C.surface, border: C.accent, bw: 0},
};

const IconSquare = ({
  name,
  icon,
  onPress,
  variant = 'outline',
  size = H.iconBtn,
  iconSize = 22,
  disabled,
  hitSlop,
  style,
  children,
}) => {
  const v = VARIANTS[variant] || VARIANTS.outline;
  const content = (
    <>
      {icon || (name ? <Feather name={name} size={iconSize} color={v.fg} /> : null)}
      {children}
    </>
  );
  if (!onPress) {
    return (
      <View
        style={[
          styles.box,
          {width: size, height: size, backgroundColor: v.bg, borderColor: v.border, borderWidth: v.bw},
          style,
        ]}>
        {content}
      </View>
    );
  }
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={hitSlop}
      style={({pressed}) => [
        styles.box,
        {
          width: size,
          height: size,
          backgroundColor: pressed ? v.pressed : v.bg,
          borderColor: v.border,
          borderWidth: v.bw,
        },
        disabled && styles.disabled,
        style,
      ]}>
      {content}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  box: {alignItems: 'center', justifyContent: 'center'},
  disabled: {opacity: 0.45},
});

export default IconSquare;
