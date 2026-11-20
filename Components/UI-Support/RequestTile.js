import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import Color from '../../Constants/Color';
import {fontSize} from '../resposnevaraiable';
import SubHeading from './SubHeading';
import {FontFamily} from '../../Constants/fonts';
import {HardCode} from '../../Constants/texting';

export default function RequestTile(props) {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={{
        ...Styles.main,
        ...props.container,
      }}>
      <View style={Styles.textMainView}>
        {props.deatils.count > 0 ? (
          <View style={Styles.textSubView}>
            <Text style={Styles.text}>{HardCode.Twelve}</Text>
          </View>
        ) : null}
      </View>
      <View style={Styles.subHeadingView}>
        <Image
          resizeMode="contain"
          style={Styles.image}
          // style={styles.tinyLogo}
          source={props.deatils.image}
        />
        <SubHeading style={Styles.subHeading} text={props.deatils.title} />
        <SubHeading style={Styles.subHeading2} text={props.deatils.name} />
      </View>
    </TouchableOpacity>
  );
}
const Styles = StyleSheet.create({
  main: {
    width: 130,
    height: 156,
    backgroundColor: '#FFFFFF',
    //alignItems: 'center',
    //justifyContent: 'center',
    borderRadius: 0,
    marginLeft: 9,
  },
  textMainView: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingTop: 6,
    paddingRight: 10,
  },
  textSubView: {
    width: 17,
    height: 17,
    borderRadius: 0,
    backgroundColor: Color.btnBgColor,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 10,
    right: 7,
  },
  text: {
    color: Color.white,
    fontSize: fontSize.nine,
    fontFamily: FontFamily.Bold,
  },
  subHeadingView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subHeading: {
    fontFamily: FontFamily.Medium,
    fontSize: fontSize.twelve,
    color: Color.headingnormaltextColor,
    paddingTop: 7,
  },
  subHeading2: {
    fontFamily: FontFamily.Medium,
    fontSize: fontSize.eleven,
    color: Color.headingotptextColor,
    paddingTop: 7,
    textAlign: 'center',
    maxWidth: 100,
  },
  image: {width: 45, height: 45},
});
