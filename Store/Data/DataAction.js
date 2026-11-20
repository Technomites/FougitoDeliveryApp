// import {BaseUrl} from '../../Components/BaseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GetManuManagementActionConst,
  OnItemToggleActionConst,
  ShowOnMenuToggleActionConst,
  NotificationPoPUpActionConst,
  InternetConnectionActionConst,
  InternetConnectionBackActionConst,
  NotificationDataActionConst,
  ToastMessageSender
} from '../Data/DataActionConst';
import { AUTHTOKENSTATEDISPATH } from '../Auth/AuthActionConst';

export const GetMenuManagementAction = (token, branchId) => {
  return async dispatch => {
    const BaseUrl = JSON.parse(await AsyncStorage.getItem('serverurl'));
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${token}`);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(`${BaseUrl}Partner/Menu/ByBranch/${branchId}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result) {
          for (let i = 0; i < result.length; i++) {
            const catArray = result[i].Categories;
            for (let j = 0; j < catArray.length; j++) {
              catArray[j]['MenuId'] = result[i].MenuId;
              const itemArray = catArray[j].Items;
              for (let k = 0; k < itemArray.length; k++) {
                itemArray[k]['MenuId'] = result[i].MenuId;
                itemArray[k]['categoryId'] = catArray[j].Id;
              }
            }
          }

          dispatch({
            type: GetManuManagementActionConst.GET_MENU_MANAGEMENT_SUCCESS,
            menu: result,
          });
        }
      })
      .catch(error => {
        dispatch({
          type: AUTHTOKENSTATEDISPATH,
          payload: true,
        });
        console.log('error', error)
      });
  };
};

export const OnItemToggleAction = obj => {
  return async dispatch => {
    dispatch({
      type: OnItemToggleActionConst.ON_ITEM_TOGGLE_SWITCH_SUCCESS,
      obj: obj,
    });
  };
};

export const NotificationPoPUpAction = obj => {
  return async dispatch => {
    dispatch({
      type: NotificationPoPUpActionConst.NOTIFICATION_POP_UP_ACTION,
      obj: obj,
    });
  };
};

export const NotificationDataAction = obj => {
  return async dispatch => {
    dispatch({
      type: NotificationDataActionConst.NOTIFICATION_DATA_ACTION_CONST,
      obj: obj,
    });
  };
};

export const InternetConnectionAction = obj => {
  return async dispatch => {
    dispatch({
      type: InternetConnectionActionConst.INTERNETCONNECTION_ACTION,
      obj: obj,
    });
  };
};

export const InternetConnectionBackScreenAction = name => {
  return async dispatch => {
    dispatch({
      type: InternetConnectionBackActionConst.INTERNETBACKSCREEN_ACTION,
      name: name,
    });
  };
};

export const ShowOnMenuToggleAction = obj => {
  return async dispatch => {
    dispatch({
      type: ShowOnMenuToggleActionConst.SHOW_ON_MENU_TOGGLE_ACTION,
      obj,
    });
    return true;
  };
};

export const ToastMessageSenderScreenAction = name => {
  return async dispatch => {
    dispatch({

      type: ToastMessageSender.TOASTMESSAGESENDER_ACTION,
      toastData: name,
    });
  };
};
