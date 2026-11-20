import React from 'react';
import {View, Text, SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import Color from '../../Constants/Color';
import SubHeading from '../../Components/UI-Support/SubHeading';
import Paragraph from '../../Components/UI-Support/Paragraph';
import {TouchableOpacity} from 'react-native-gesture-handler';
import BackHeader from '../UI-Support/BackHeader';

const Invoicecard = props => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={Styles.mainView}>
        <View>
          <View style={Styles.subView}>
            <View>
              <Paragraph
                style={{color: Color.paraColor}}
                text={props.amount}
              />
              <View style={Styles.SubHeadingView}>
                <SubHeading
                  style={{
                    color: Color.headingBlackColor,
                  }}
                  text={props.name}
                />
                <SubHeading style={{color: '#4EE167'}} text={props.status} />
              </View>
              <Paragraph style={{color: '#898989'}} text={props.date} />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default Invoicecard;
const Styles = StyleSheet.create({
  mainView: {
    justifyContent: 'center',
    marginTop: 10,
    backgroundColor: Color.white,
  },
  subView: {
    backgroundColor: Color.inputBgColorOtherPlace,
    justifyContent: 'space-around',
    padding: 10,
    borderRadius: 0,
  },
  SubHeadingView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
