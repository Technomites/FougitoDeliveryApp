import React from 'react';
import {View, TextInput, TouchableOpacity, StyleSheet} from 'react-native';

import IoIcon from '../Icon/IoIcon';
import Color from '../../Constants/Color';
import Feather from 'react-native-vector-icons/Feather';
import {C, F, B} from '../../Constants/tokens';

// 56dp white field with a 1px rule; optional 56-wide icon cell on the right (eye etc.).
const MyFormInputTile = props => {
  const hasIcon = !!(props.iconName || props.percentage);
  return (
    <View style={{...Styles.container, ...props.containerStyle}}>
      <View style={Styles.main}>
        <TextInput
          returnKeyType="next"
          numberOfLines={props.inputLine}
          keyboardType={props.keyboardType}
          value={props.value}
          onChangeText={props.onChangeText}
          placeholderTextColor={Color.placeholderTextColor}
          secureTextEntry={props.secure}
          placeholder={props.placeHolder}
          style={Styles.textInput}
        />
      </View>

      <TouchableOpacity
        onPress={props.onIconPress}
        style={[Styles.clickStyle, hasIcon && Styles.iconCell]}>
        {props.percentage && props.percentage ? (
          <Feather name={'percent'} color={C.muted} size={20}></Feather>
        ) : (
          <IoIcon
            name={props.iconName}
            color={props.color ? props.color : C.muted}
            size={props.size || 20}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};
const Styles = StyleSheet.create({
  container: {
    height: 56,
    backgroundColor: C.surface,
    borderWidth: B.hair,
    borderColor: C.rule,
    width: '100%',
    flexDirection: 'row',
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 0,
    color: C.ink,
    fontSize: 16,
    fontFamily: F.medium,
  },
  clickStyle: {
    height: '100%',
    width: 0,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  iconCell: {
    width: 56,
    borderLeftWidth: B.hair,
    borderLeftColor: C.rule,
  },
  main: {flex: 1, height: '100%'},
});
export default MyFormInputTile;
