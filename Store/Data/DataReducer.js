import {
  GetManuManagementActionConst,
  OnItemToggleActionConst,
  ShowOnMenuToggleActionConst,
  NotificationPoPUpActionConst,
  InternetConnectionActionConst,
  InternetConnectionBackActionConst,
  NotificationDataActionConst,
  ToastMessageSender,
} from '../Data/DataActionConst';

const initialState = {
  GetMenuMangement: [],
  NotificationPopUp: false,
  internetConnectionStatus: true,
  internetPerviousScreen: 'MiddleWareScreen',
  notificationDataObj: null,
  toastMessage: '',
};

export default (state = initialState, action) => {
  switch (action.type) {

    case GetManuManagementActionConst.GET_MENU_MANAGEMENT_SUCCESS:
      state = {
        ...state,
        GetMenuMangement: action.menu,
      };
      break;

    case OnItemToggleActionConst.ON_ITEM_TOGGLE_SWITCH_SUCCESS:
      const MenuId = action.obj.MenuId;
      const catId = action.obj.categoryId;
      const itemId = action.obj.Id;

      const mainArray = state.GetMenuMangement;

      for (let i = 0; i < mainArray.length; i++) {
        if (mainArray[i].MenuId === MenuId) {
          const catArray = mainArray[i].Categories;

          for (let j = 0; j < catArray.length; j++) {
            if (catArray[j].Id === catId) {
              const itemArray = catArray[j].Items;
              for (let k = 0; k < itemArray.length; k++) {
                if (itemArray[k].Id === itemId) {
                  console.log(itemArray[k], '***********Item Arrat');
                  itemArray[k].IsActive = !itemArray[k].IsActive;
                }
              }
            }
          }
        }
      }

      state = {
        ...state,
        GetMenuMangement: state.GetMenuMangement,
      };
      break;

    case ShowOnMenuToggleActionConst.SHOW_ON_MENU_TOGGLE_ACTION:
      const MenuIdSh = action.obj.MenuId;
      const catIdSh = action.obj.Id;

      const mainArraySh = state.GetMenuMangement;
      for (let i = 0; i < mainArraySh.length; i++) {
        if (mainArraySh[i].MenuId == MenuIdSh) {
          const catArray = mainArraySh[i].Categories;
          for (let j = 0; j < catArray.length; j++) {
            if (catArray[j].Id == catIdSh) {
              console.log(catArray[j]);

              catArray[j].IsActive = !catArray[j].IsActive;
            }
          }
        }
      }

      state = {
        ...state,
        GetMenuMangement: state.GetMenuMangement,
      };
      break;

    case NotificationPoPUpActionConst.NOTIFICATION_POP_UP_ACTION:
      state = {
        ...state,
        NotificationPopUp: action.obj,
      };
      break;

    case NotificationDataActionConst.NOTIFICATION_DATA_ACTION_CONST:
      state = {
        ...state,
        notificationDataObj: action.obj,
      };
      break;

    case InternetConnectionActionConst.INTERNETCONNECTION_ACTION:
      state = {
        ...state,
        internetConnectionStatus: action.obj,
      };
      break;

    case InternetConnectionBackActionConst.INTERNETBACKSCREEN_ACTION:
      state = {
        ...state,
        internetPerviousScreen: action.name,
      };
      break;

    case ToastMessageSender.TOASTMESSAGESENDER_ACTION:
    
      state = {
     
        ...state,
        toastMessage: action.toastData,
      };
      break;
  }
  return state;
};
