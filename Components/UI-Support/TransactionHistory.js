import React from 'react';
import {View, Text, SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import Color from '../../Constants/Color';
import SubHeading from '../../Components/UI-Support/SubHeading';
import Paragraph from '../../Components/UI-Support/Paragraph';
import {TouchableOpacity} from 'react-native-gesture-handler';
import { fontSize } from '../resposnevaraiable';
import { FontFamily } from '../../Constants/fonts';

const TransactionHistory = props => {
  return (
    <View style={Styles.mainView}>
      <View style={Styles.emptyView}></View>
      <View>
        <View style={Styles.subHeadingView}>
          <SubHeading style={Styles.subHeading} text={props.date} />
          <SubHeading style={Styles.subHeading2} text={props.status} />
          <Paragraph style={Styles.paragraph} text={props.amount} />
        </View>
      </View>
    </View>
  );
};
export default TransactionHistory;
const Styles = StyleSheet.create({
  mainView: {justifyContent: 'center'},
  emptyView: {
    borderBottomWidth: 1,
    borderColor: 'rgba(112, 112, 112, 0.15)',
    marginVertical: 10,
  },
  subHeadingView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paragraph: {
    fontFamily:FontFamily.Bold,

    color: Color.paranormaltextColor,
    width: '25%',
    textAlign: 'center',
  },
  subHeading: {width: '50%', color: '#898989'},
  subHeading2: {
    color: '#8FD16E',
    fontSize: fontSize.thirteen,
    width: '25%',
    textAlign: 'center',
  },
});
