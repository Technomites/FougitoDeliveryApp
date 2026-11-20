import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import SubHeading from './SubHeading';
import IoIcon from '../Icon/IoIcon';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Color from '../../Constants/Color';
import { fontSize } from '../resposnevaraiable';
import { FontFamily } from '../../Constants/fonts';

export default function QuoteRequestTile(props) {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={{
        ...style.MainContainer,
        ...props.container,
      }}>
      <View
        style={{
          ...style.topViewContainer,
        }}>
        <View style={{width: '50%'}}>
          <Text>
            <SubHeading
              style={style.subHeading}
              text={props.deatils.id}
            />
          </Text>
        </View>
        <View
          style={style.iconView}>
          <IoIcon name="arrow-forward" size={15} color={Color.iconColor} />
        </View>
      </View>

      <View style={{marginHorizontal: 12}}>
        <SubHeading
          style={{
            ...style.subHeading,
            fontSize: fontSize.twelve,
            color: Color.headingnormaltextColor,
          }}
          text={props.deatils.title}
        />
      </View>

      <View
        style={style.subHeadingMainView}>
        <View
          style={subHeadingSubView}>
          <SubHeading
            style={{
              ...style.subHeading,
              fontSize: fontSize.ten,
              color:
                props.deatils.offer === 'Paid' ? '#4EE167' : Color.headingotptextColor,
            }}
            text={props.deatils.offer}
          />
        </View>
        <View
          style={style.subHeadingView}>
          <SubHeading
            style={{
              ...style.subHeading,
              color: Color.headingotptextColor,
              paddingLeft: 5,
            }}
            text={props.deatils.date}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const style = StyleSheet.create({
  MainContainer: {
    width: '90%',
    //height: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
    paddingVertical: 12,
    marginTop: 9,
    //backgroundColor: 'red',
  },
  topViewContainer: {
    //marginTop: 5,
    marginHorizontal: 12,
    flexDirection: 'row',
    //paddingTop: 3,
    alignItems: 'center',
    //backgroundColor: 'red',
  },
  deatilsContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 0,
    marginTop: 8,
    padding: 10,
  },
  deatilView: {
    width: '73%',
    flexDirection: 'row',
  },
  imageContainer: {
    width: '100%',
    flexDirection: 'row',
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
  subHeading:{
    fontFamily:FontFamily.Medium,
    fontSize: fontSize.eleven,
    color: Color.headingColor,
  },
  iconView:{
    width: '50%',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    //height: '4%',
    //backgroundColor: 'green',
  },
  subHeadingMainView:{
    //marginVertical: 5,
    marginHorizontal: 12,
    flexDirection: 'row',
    //backgroundColor: 'yellow',
  },
  subHeadingSubView:{
    //marginHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
  },
  subHeadingView:{
    width: '50%',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  }
});
