import React, {useEffect} from 'react';

import {View, Text, FlatList, StyleSheet} from 'react-native';
import {fontSize} from '../resposnevaraiable';
import Color from '../../Constants/Color';
import {FontFamily} from '../../Constants/fonts';
import {HardCode} from '../../Constants/texting';
const StepsRoute = () => {
  const List = [
    {
      id: Math.random(),
      name: HardCode.OfferAccepted,
      active: true,
      date: '10/03/2012',
    },

    {id: Math.random(), name: HardCode.PreparingForDelivery, active: false},
    {id: Math.random(), name: HardCode.PickedUpByTheRider, active: false},
    {id: Math.random(), name: HardCode.OnItsWay, active: false},
    {id: Math.random(), name: HardCode.Delivered, active: false},
  ];

  return (
    <View style={Styles.main}>
      <FlatList
        showsHorizontalScrollIndicator={false}
        style={Styles.flatList}
        horizontal
        renderItem={itemData => {
          return (
            <View style={Styles.flatListmainView}>
              <View
                style={{
                  ...Styles.emptyMainView,
                  backgroundColor: itemData.item.active
                    ? '#db18184a'
                    : Color.lightGray,

                }}>
                <View
                  style={{
                    ...Styles.emptyView,
                    backgroundColor: itemData.item.active
                      ? Color.btnBgColor
                      : Color.gray,
                  }}></View>
              </View>
              <View style={Styles.textView}>
                <Text
                  numberOfLines={2}
                  style={{
                    ...Styles.text,
                    color: itemData.item.active ? '#29262A' : '#29262A40',
                  }}>
                  {itemData.item.name}
                </Text>
                {itemData.item.date && (
                  <Text numberOfLines={2} style={{fontSize: fontSize.eight}}>
                    {itemData.item.date}
                  </Text>
                )}
              </View>
            </View>
          );
        }}
        data={List}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default StepsRoute;
const Styles = StyleSheet.create({
  text: {fontSize: fontSize.eleven, fontFamily: FontFamily.Medium},
  textView: {
    height: '90%',
    width: '100%',
    paddingRight: 10,
    paddingTop: 10,
  },
  emptyView: {
    height: 14,
    width: 14,
    borderRadius: 0,
    right: 3,
  },
  emptyMainView: {
    height: '13%',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    left: 3,
    paddingTop: 3,
  },
  flatListmainView: {
    height: 120,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',

    //backgroundColor: 'red',
  },
  flatList: {marginTop: 9},
  main: {flex: 1, paddingHorizontal: 0},
});
