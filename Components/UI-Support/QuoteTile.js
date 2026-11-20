import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import SubHeading from './SubHeading';
import IoIcon from '../Icon/IoIcon';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Color from '../../Constants/Color';
import { fontSize } from '../resposnevaraiable';
import { FontFamily } from '../../Constants/fonts';

export default function QuoteTile(props) {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={{
        ...style.MainContainer,
        ...props.container,
      }}>
      <View>
        <SubHeading
          style={style.subHeading}
          text={props.deatils.title}
        />
      </View>

      <View
        style={{
          flexDirection: 'row',
        }}>
        <View
          style={{
            ...style.quoteContainer,
          }}>
          <SubHeading
            style={{
              ...style.subHeading,
              color: Color.headingotptextColor,
            }}
            text={props.deatils.time}
          />
        </View>
        <View
          style={{
            ...style.priceContainer,
          }}>
          <SubHeading
            style={{
              ...style.subHeading,
              color: Color.headingColor,
              bottom: 10,
            }}
            text={props.deatils.price}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const style = StyleSheet.create({
  MainContainer: {
    width: '90%',
    //height: 70,
    padding: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
    marginTop: 10,
  },
  quoteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
  },
  priceContainer: {
    width: '50%',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  subHeading:{
    fontFamily:FontFamily.Medium,
    fontSize: fontSize.twelve,
    color: Color.headingnormaltextColor,
  }
});
