import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {fontSize, scalableheight} from '../resposnevaraiable';
import {FontFamily} from '../../Constants/fonts';
const Paragraph = props => {
  return (
    <Text
      numberOfLines={props.numberOfLines}
      style={{
        fontSize: scalableheight.onepointfive,
        fontFamily: FontFamily.Medium,

        ...props.style,
      }}>
      {props.text}
    </Text>
  );
};
export default Paragraph;
const Styles = StyleSheet.create({
  text: {
    fontSize: scalableheight.onepointfive,
    fontFamily: FontFamily.Medium,
  },
});
