import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import CountryFlag from 'react-native-country-flag';
import Feather from 'react-native-vector-icons/Feather';
import Color from '../../Constants/Color';
import Paragraph from './Paragraph';
import {HardCode} from '../../Constants/texting';
import PhoneNumberLenght from '../../Constants/phoneNumberLenght.json';
import {C, F, B} from '../../Constants/tokens';

// 56dp white field, 1px rule. Country cell (flag · +code · chevron) opens the
// existing picker via onChangeCountry. editable={false} gets the disabled fill.
const CountryInput = props => {
  const disabled = props.editable === false;
  const hasCell = !!props?.countryFlag || !!props?.countryCode;
  return (
    <View
      style={[
        styles.maincontainer,
        disabled && styles.disabledFill,
        props.style,
      ]}>
      {hasCell && (
        <TouchableOpacity
          disabled={!props?.countryFlag}
          style={styles.main}
          onPress={props?.onChangeCountry}>
          {!!props?.countryFlag && (
            <CountryFlag
              style={styles.flag}
              isoCode={props?.countryFlag}
              size={18}
            />
          )}
          {!!props?.countryCode && (
            <View style={styles.codeview}>
              <Paragraph style={styles.colorcode} text={`+${props?.countryCode}`} />
            </View>
          )}
          {!!props?.countryFlag && (
            <Feather name="chevron-down" size={18} color={C.muted} />
          )}
        </TouchableOpacity>
      )}
      <View style={styles.view3}>
        <TextInput
          editable={props.editable}
          keyboardType="number-pad"
          value={props.value}
          onChangeText={props.onChangeText}
          maxLength={PhoneNumberLenght[props?.countryCode] || 13}
          placeholderTextColor={Color.placeholderTextColor}
          secureTextEntry={props.secure}
          placeholder={HardCode.EnterNumberhere}
          style={[styles.textinput, props.fontStyle, disabled && styles.disabledText]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textinput: {
    width: '100%',
    height: '100%',
    fontSize: 16,
    fontFamily: F.medium,
    color: C.ink,
    paddingHorizontal: 14,
    paddingVertical: 0,
  },
  codeview: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorcode: {
    color: C.ink,
    fontSize: 16,
    fontFamily: F.bold,
  },
  main: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    borderRightWidth: B.hair,
    borderRightColor: C.rule,
  },
  flag: {borderRadius: 0},
  maincontainer: {
    width: '100%',
    height: 56,
    backgroundColor: C.surface,
    borderWidth: B.hair,
    borderColor: C.rule,
    flexDirection: 'row',
    alignItems: 'center',
  },
  disabledFill: {backgroundColor: C.disabled},
  disabledText: {color: C.muted},
  view3: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
  },
});

export default CountryInput;
