import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Color from '../../Constants/Color';
import {Dropdown, MultiSelect} from 'react-native-element-dropdown';
import {fontSize} from '../resposnevaraiable';
import {FontFamily} from '../../Constants/fonts';
import {HardCode} from '../../Constants/texting';

export default function InputDropDown(props) {
  return (
    <View
      style={[
        Styles.view,

        {...props.Containeer},
        //backgroundColor: 'red',
      ]}>
      <Text style={Styles.title}>{props.title}</Text>
      <Dropdown
        style={Styles.dropdown}
        data={props.data}
        maxHeight={300}
        labelField={HardCode.name}
        valueField="id"
        placeholder={HardCode.Select}
        iconStyle={{
          marginRight: 9,
        }}
        placeholderStyle={Styles.placeholder}
        value={props.value}
        selectedTextStyle={{
          marginLeft: 10,
        }}
        onChange={item => {
          //setcardropdownMake(item.id);
          //console.log('selected', item);
          props.onChange(item.id);
        }}
      />
    </View>
  );
}

const Styles = StyleSheet.create({
  view: {width: '100%', paddingTop: 15},
  dropdown: {
    borderColor: Color.inputBgColorOtherPlace,
    height: 52,
    borderRadius: 0,
    borderWidth: 1,
    marginTop: 5,
    backgroundColor: '#8E7C7C14',
  },
  title: {
    fontFamily: FontFamily.Medium,
    fontSize: fontSize.twelve,
  },
  placeholder: {
    color: Color.otptextColor,
    // fontFamily: 'Inter-Medium',
    fontSize: fontSize.fourteen,
    marginLeft: 11,
  },
});
