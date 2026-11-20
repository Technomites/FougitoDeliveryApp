import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {fontSize} from '../resposnevaraiable';
import { FontFamily } from '../../Constants/fonts';
const Heading = props => {
  return <Text style={[styles.text, {...props.style}]}>{props.text}</Text>;
};
export default Heading;
const styles = StyleSheet.create({
  text: {
    fontSize: fontSize.twelve,
    fontFamily: FontFamily.Bold,
  },
});
