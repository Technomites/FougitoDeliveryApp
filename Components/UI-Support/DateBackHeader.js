import React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {C, F, B} from '../../Constants/tokens';
import {useDevice} from '../useLayout';
import IconSquare from './IconSquare';

// Back header with an outline date chip (opens the existing picker via onDate).
// Existing props: onPress, title, containerStyle, onDate. Optional: dateText.
const DateBackHeader = props => {
  const {isPhone, gutter} = useDevice();
  return (
    <View
      style={[
        style.mainView,
        {paddingHorizontal: gutter},
        {...props.containerStyle},
      ]}>
      <IconSquare
        name="arrow-left"
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        onPress={props.onPress}
      />
      <View style={style.textView}>
        <Text numberOfLines={1} style={[style.text, {fontSize: isPhone ? 18 : 20}]}>
          {props.title}
        </Text>
      </View>
      {props.onDate && (
        <Pressable
          onPress={props.onDate}
          style={({pressed}) => [
            style.dateChip,
            {paddingHorizontal: isPhone ? 10 : 14},
            pressed && {backgroundColor: C.disabled},
          ]}>
          <Feather name="calendar" size={18} color={C.ink} />
          {!!props.dateText && (
            <Text numberOfLines={1} style={style.dateText}>
              {props.dateText}
            </Text>
          )}
        </Pressable>
      )}
    </View>
  );
};
export default DateBackHeader;
const style = StyleSheet.create({
  mainView: {
    height: 64,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: C.surface,
    borderBottomWidth: B.rule,
    borderBottomColor: C.ink,
  },
  textView: {flex: 1, minWidth: 0, justifyContent: 'center'},
  text: {
    fontFamily: F.bold,
    color: C.ink,
  },
  dateChip: {
    height: 44,
    minWidth: 44,
    borderWidth: B.hair,
    borderColor: C.rule,
    backgroundColor: C.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dateText: {
    fontFamily: F.bold,
    fontSize: 15,
    color: C.ink,
  },
});
