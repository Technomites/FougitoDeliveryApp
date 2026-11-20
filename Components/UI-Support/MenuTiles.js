import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import SubHeading from './SubHeading';
import IoIcon from '../Icon/IoIcon';
import Color from '../../Constants/Color';
import { fontSize } from '../resposnevaraiable';
import { FontFamily } from '../../Constants/fonts';

export default function MenuTiles(props) {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={props.onPress}
      style={{
        ...style.MainContainer,
        ...props.container,
      }}>
      <View style={style.topViewContainer}>
        <View style={{justifyContent: 'flex-start'}}>
          <View style={style.IconBox}>
            <Image
              source={require('../../assets/Images/crockery-icon.png')}
              style={style.img}
            />
          </View>
        </View>
        <View style={style.SubHeadingView}>
          <View style={{opacity: props.deatils.Status === 'Active' ? 1 : 0.4}}>
            <SubHeading
              text={props.deatils.Status}
              style={{
                fontFamily:FontFamily.Medium,
                color:
                  props.deatils.Status === 'Active' ? Color.headingColor : Color.headingBlackColor,
                fontSize:fontSize.twelve,
              }}
            />
          </View>
          <SubHeading text={props.deatils.MenuName} style={style.SubHeading} />
          <SubHeading
            text={props?.deatils?.Categories?.length}
            style={style.SubHeading2}
          />
        </View>
        <View style={{justifyContent: 'center'}}>
          <IoIcon name="arrow-forward" color={Color.iconColor} size={16} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const style = StyleSheet.create({
  MainContainer: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
    marginTop: 10,
    paddingVertical: 10,
  },
  topViewContainer: {
    flexDirection: 'row',
    marginHorizontal: 14,
  },
  IconBox: {
    backgroundColor: '#FCEDED',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    width: 60,
    borderRadius: 0,
  },
  deatilsContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
    marginTop: 8,
    padding: 10,
  },
  deatilView: {
    flexDirection: 'row',
    width: '73%',
  },
  imageContainer: {
    flexDirection: 'row',
    width: '100%',
    paddingTop: 10,
  },
  imageStyle: {
    width: '90%',
    height: 120,
  },
  btnContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
  },
  img: {height: 30, width: 30, resizeMode: 'cover'},
  SubHeadingView: {flex: 1, justifyContent: 'flex-start', marginHorizontal: 12},
  SubHeading: {
    fontFamily:FontFamily.Medium,
    color: Color.headingnormaltextColor,
    fontSize:fontSize.fourteen,
  },
  SubHeading2: {
    fontFamily:FontFamily.Medium,
    color: Color.headingotptextColor,
    fontSize: fontSize.twelve,
    marginTop: 4,
  },
});
