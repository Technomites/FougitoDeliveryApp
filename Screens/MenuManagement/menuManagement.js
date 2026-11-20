import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  SafeAreaView,

  Button,
  StyleSheet,
} from 'react-native';
import BackHeader from '../../Components/UI-Support/BackHeader';
import MenuTiles from '../../Components/UI-Support/MenuTiles';
import * as DataAction from '../../Store/Data/DataAction';
import {useDispatch, useSelector} from 'react-redux';
import FocusAwareStatusBar from '../../Components/UI-Support/customStatusBar';
import {HardCode} from '../../Constants/texting';

export default function MenuManagement(props) {
  const dispatch = useDispatch();
  const userSuccessData = useSelector(state => state.auth.userSuccessData);
  const MenuData = useSelector(state => state.data.GetMenuMangement);

  const branchId =
    userSuccessData?.Result?.RestaurantServiceStaff?.RestaurantBranchId;

  const userToken = userSuccessData?.Result?.AuthData?.TokenInfo?.Token;

  useEffect(() => {
    dispatch(DataAction.GetMenuManagementAction(userToken, branchId));
  }, []);
  //
  return (
    <View style={[{flex: 1}, props.drawerAnimationStyle]}>
      <SafeAreaView style={style.mainView}>

        <FocusAwareStatusBar
          barStyle={'dark-content'}
          backgroundColor="transparent"
        />
        <BackHeader
          onPress={() => props.navigation.goBack()}
          title={HardCode.MenuManagement}
          filter={false}
        />
        <ScrollView style={style.scrollView}>
          {MenuData?.map((item, index) => {
            return (
              <MenuTiles
                onPress={() =>
                  props.navigation.navigate('MenuDetail', {
                    categories: item.Categories,
                    menuId: item.MenuId,
                  })
                }
                container={{width: '100%'}}
                key={index.toString()}
                deatils={item}
              />
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
const style = StyleSheet.create({
  mainView: {flex: 1, backgroundColor: '#EFF1F3'},
  scrollView: {paddingHorizontal: 22},
});
