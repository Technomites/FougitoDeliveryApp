import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {C, F, B} from '../../Constants/tokens';
import {useDevice} from '../useLayout';
import IconSquare from './IconSquare';

// Header over the camera: white 2px outline back square, white title, 2px white rule.
export default function TransparentHeader(props) {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {isPhone, gutter} = useDevice();

  return (
    <View
      style={[
        styleSheet.header,
        {
          paddingHorizontal: gutter,
          top: props.top !== undefined ? props.top : getStatusBarHeight(),
        },
      ]}>
      <IconSquare
        name="arrow-left"
        variant="whiteOutline"
        onPress={props.onpressback}
        style={styleSheet.back}
      />
      <Text
        numberOfLines={1}
        style={[styleSheet.titletext, {fontSize: isPhone ? 18 : 20}]}>
        {props.title}
      </Text>
    </View>
  );
}

const styleSheet = StyleSheet.create({
  header: {
    width: '100%',
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: C.transparent,
    borderBottomWidth: B.rule,
    borderBottomColor: C.surface,
    zIndex: 1000000,
    position: 'absolute',
    left: 0,
    right: 0,
  },
  back: {borderWidth: B.rule},
  titletext: {
    flex: 1,
    color: C.surface,
    fontFamily: F.bold,
  },
});
