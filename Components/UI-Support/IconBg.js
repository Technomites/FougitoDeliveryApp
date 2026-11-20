import React from 'react';
import {View, Text, SafeAreaView, StatusBar,StyleSheet} from 'react-native';
import {scalableheight, fontSize} from '../resposnevaraiable';
import Color from '../../Constants/Color';

const IconBg = props => {
  return (
    <View>
      <View
        style={styles.view}></View>
    </View>
  );
};
export default IconBg;

const styles = StyleSheet.create({
  view:{
    backgroundColor: Color.bgColor,
    height: scalableheight.four,
    width: scalableheight.four,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0,
  }
});
