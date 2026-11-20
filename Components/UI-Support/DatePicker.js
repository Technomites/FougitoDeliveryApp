import React from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import IoIcon from '../Icon/IoIcon';
import Color from '../../Constants/Color';
import { fontSize } from '../resposnevaraiable';

const DatePicker = props => {
  return (
    <View
      style={{
        ...props.container,
      }}>
      {/* <Text
        style={{
          color: '#191919',
          fontWeight: '600',
          fontFamily: 'Inter-SemiBold',
          textAlign: 'left',
        }}>
         {props.title} 
      </Text> */}
      <TouchableOpacity onPress={props.onPicker} style={[Styles.container]}>
        <View
          style={Styles.textView}>
          <Text
            style={Styles.text}>
            {props.pickValue}
          </Text>
        </View>

        <View
          style={Styles.iconView}>
          <IoIcon
            name="calendar"
            size={19}
            color={Color.iconGrayColor}
            // style={{marginLeft: 6}}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};
const Styles = StyleSheet.create({
  container: {
    height: 54,
    width: '100%',
    borderRadius: 0,
    //borderWidth: 2,
    borderColor: '#8E7C7C14',
    flexDirection: 'row',
    marginTop: 5,
  },
  textInput: {
    marginLeft: 10,
    height: 50,
    width: '95%',
    marginRight: 20,
    color: 'black',
  },
  clickStyle: {
    height: 50,
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerDescription: {
    height: 80,
    width: '100%',
    borderRadius: 0,
    borderWidth: 2,
    borderColor: Color.lightGray,
    flexDirection: 'row',
    marginTop: 5,
  },
  textView:{
    height: '100%',
    width: '80%',
    justifyContent: 'center',
    //alignItems: 'center',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    backgroundColor: '#8E7C7C14',
  },
  text:{
    fontSize:fontSize.twelve,
    color: Color.gray,
    marginLeft: 10,
    //width: '100%',
    //height: '100%',
    //paddingTop: 18,
    //textAlign: 'center',
    textAlignVertical: 'center',

    // textAlignVertical: 'center',
  },
  iconView:{
    height: '100%',
    width: '20%',
    justifyContent: 'center',
    //alignItems: 'center',
    // marginLeft: 10,
    //backgroundColor: 'red',
    backgroundColor: '#8E7C7C14',
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    paddingRight: 10,
  }
});
export default DatePicker;
