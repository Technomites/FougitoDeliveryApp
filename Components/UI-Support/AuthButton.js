import React from 'react';
import {Pressable, Text, View, StyleSheet} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {C, F, B, H} from '../../Constants/tokens';

// Fougito button: flat, radius 0, label flush left, icon on the right.
// Existing props kept: title, onPress, disabled, container, icon (call icon).
// Optional: variant ('primary' | 'outline' | 'white' | 'whiteOutline' | 'ink'),
// iconName (Feather name, null hides it), rightIcon (node), textStyle, compact (phone side-by-side).
const VARIANTS = {
  primary: {bg: C.accent, pressed: C.accentDeep, fg: C.surface, border: null},
  outline: {bg: C.surface, pressed: C.disabled, fg: C.ink, border: C.ink},
  white: {bg: C.surface, pressed: C.disabled, fg: C.ink, border: null},
  whiteOutline: {bg: C.transparent, pressed: C.inkRule, fg: C.surface, border: C.surface},
  ink: {bg: C.ink, pressed: C.body, fg: C.surface, border: null},
};

const AuthButton = props => {
  const v = VARIANTS[props.variant] || VARIANTS.primary;
  const iconName =
    props.iconName !== undefined
      ? props.iconName
      : props.icon
      ? 'phone'
      : 'arrow-right';
  return (
    <Pressable
      disabled={props.disabled}
      onPress={props.onPress}
      style={({pressed}) => [
        Styles.mainContainer,
        {backgroundColor: pressed ? v.pressed : v.bg},
        v.border ? {borderWidth: B.rule, borderColor: v.border} : null,
        props.compact ? Styles.compact : null,
        props.disabled ? Styles.disabled : null,
        props.container,
      ]}>
      <Text
        numberOfLines={1}
        style={[
          Styles.text,
          {color: v.fg},
          props.compact ? Styles.compactText : null,
          props.textStyle,
        ]}>
        {props.title}
      </Text>
      {props.rightIcon ? (
        <View style={Styles.icon}>{props.rightIcon}</View>
      ) : !!iconName && (
        <Feather
          name={iconName}
          size={props.compact ? 18 : 20}
          color={v.fg}
          style={Styles.icon}
        />
      )}
    </Pressable>
  );
};
const Styles = StyleSheet.create({
  mainContainer: {
    height: H.btnL,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    borderRadius: 0,
  },
  compact: {paddingHorizontal: 14},
  disabled: {opacity: 0.45},
  icon: {marginLeft: 12},
  text: {
    flexShrink: 1,
    fontFamily: F.bold,
    fontSize: 17,
    color: C.surface,
    includeFontPadding: false,
  },
  compactText: {fontSize: 15},
});
export default AuthButton;
