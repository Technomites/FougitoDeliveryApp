import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {C, F, B} from '../../Constants/tokens';
import {useDevice} from '../useLayout';
import IconSquare from './IconSquare';

// White header, 2px ink bottom rule. 44 outline back square, Bold title.
// Existing props: onPress, title, containerStyle, onClick, filter, refresh.
// Optional: subtitle (72 tall), right (node, e.g. count / status chip).
const BackHeader = props => {
  const {isPhone, gutter} = useDevice();
  const hasSub = !!props.subtitle;
  const hasAction = !!(props.filter || props.refresh === true || props.onClick);
  return (
    <View
      style={[
        styles.container,
        {height: hasSub ? 72 : 64, paddingHorizontal: gutter},
        props.containerStyle,
      ]}>
      <IconSquare name="arrow-left" onPress={props.onPress} />
      <View style={styles.titleView}>
        <Text
          numberOfLines={1}
          style={[styles.title, {fontSize: isPhone ? 18 : 20}]}>
          {props.title}
        </Text>
        {hasSub && (
          <Text numberOfLines={1} style={styles.subtitle}>
            {props.subtitle}
          </Text>
        )}
      </View>

      {hasAction ? (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            props.onClick && props.onClick();
          }}
          style={styles.action}>
          {props.right}
          {props.filter && props.filter ? (
            <IconSquare name="sliders" />
          ) : props.refresh === true ? (
            <IconSquare name="refresh-cw" />
          ) : null}
        </TouchableOpacity>
      ) : (
        props.right || null
      )}
    </View>
  );
};
export default BackHeader;

// Pink count chip used on list headers (New Orders, Notifications).
export const CountChip = ({value}) => (
  <View style={styles.chip}>
    <Text style={styles.chipText}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: C.surface,
    borderBottomWidth: B.rule,
    borderBottomColor: C.ink,
  },
  titleView: {flex: 1, minWidth: 0, justifyContent: 'center'},
  title: {
    fontFamily: F.bold,
    color: C.ink,
    includeFontPadding: false,
  },
  subtitle: {
    fontFamily: F.medium,
    fontSize: 14,
    color: C.muted,
    marginTop: 2,
  },
  action: {
    minWidth: 44,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  chip: {
    height: 32,
    paddingHorizontal: 12,
    backgroundColor: C.overdueBg,
    justifyContent: 'center',
  },
  chipText: {
    fontFamily: F.black,
    fontSize: 15,
    color: C.accentDeep,
    fontVariant: ['tabular-nums'],
  },
});
