import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { fontSize, scalableheight } from '../resposnevaraiable';
import Color from '../../Constants/Color';
import { FontFamily } from '../../Constants/fonts';
const SubHeading = props => {
  return <Text numberOfLines={props?.numberOfLines} style={[styles.text, props.style ?? []]}>{props.text}</Text>;
};
const styles = StyleSheet.create({
  text: {
    fontSize: fontSize.sixteen,
    letterSpacing: 0.5,
    fontFamily: FontFamily.Medium,
    color: Color.gray,
  },
});
export default SubHeading;
