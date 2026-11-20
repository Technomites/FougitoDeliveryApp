import React from 'react';
import {View, Image, TouchableOpacity, StyleSheet} from 'react-native';
import Paragraph from '../../Components/UI-Support/Paragraph';
import Color from '../../Constants/Color';
import Heading from './Heading';
import ToggleSwitch from 'toggle-switch-react-native';
import {fontSize} from '../resposnevaraiable';
import {HardCode} from '../../Constants/texting';

const MenuToggleTile = props => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={props.disabled}
      onPress={props.onPress}
      style={[Styles.main, props.container]}>
      <View style={{justifyContent: 'center'}}>
        <Image style={Styles.img} source={props.deatils.imageUrl} />
      </View>
      <View style={Styles.headingView}>
        <Heading style={{color: Color.black}} text={props.deatils.title} />
        <Heading
          style={{color: Color.btnBgColorOtherPlace, fontSize: fontSize.ten}}
          text={props.deatils.price}
        />
      </View>
      <View style={Styles.paraView}>
        <Paragraph
          style={{textAlign: 'right'}}
          text={
            props.deatils.status ? HardCode.Published : HardCode.Unpublished
          }
        />
        <ToggleSwitch
          isOn={props.deatils.status}
          thumbOnStyle={{backgroundColor: Color.btnBgColorOtherPlace}}
          thumbOffStyle={{backgroundColor: '#C6C4C4'}}
          trackOnStyle={{backgroundColor: '#DFE0E2'}}
          trackOffStyle={{backgroundColor: '#DFE0E2'}}
          // onToggle={() => }
        />
      </View>
    </TouchableOpacity>
  );
};

export default MenuToggleTile;
const Styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    backgroundColor: Color.white,
    marginTop: 10,
    borderRadius: 0,
    paddingRight: 12,
  },
  img: {height: 80, width: 80, resizeMode: 'cover'},
  headingView: {flex: 1, justifyContent: 'center', marginLeft: 4},
  paraView: {justifyContent: 'center', alignItems: 'flex-end'},
});
