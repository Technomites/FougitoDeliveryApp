import {
  AuthRoleActionConst,
  UserLoginActionConst,
  GetUserInformationActionConst,
  SaveLocalDataIntoReduxActionConst,
  LogoutActionConst,
  SaveServerURL,
  Loader,
  QRcode,
  AUTHTOKENSTATEDISPATH,
  SetRegion,
  LocationConnection

} from './AuthActionConst';

const initialState = {
  role: 'ServiceStaff',
  alertNotification: false,
  loader: false,
  userSuccessData: null,
  userErrorData: null,
  userInfo: null,
  BaseUrl: 'https://api.fougito.com/api/',
  qrcode: '',
  loading: false,
  AuthTokenStateDispath:false,
   region: {
    country: 'AE',
    countryCode: '971',
    // currency: 'AED',
  },
  locationConnectionScreen: {
    msg: '',
    bol: true
  },

};

export default (state = initialState, action) => {
  switch (action.type) {
    case SaveServerURL.Save_Server_URL:
      state = {
        ...state,
        BaseUrl: action.succData,
      };
      break;
 case SetRegion.SET_REGION:
      return {
        ...state,
        region: {
          ...state.region,
          country: action.data.country,
          countryCode: action.data.countryCode,
          // currency: action.payload.currency,
        },
      };
      break;
    case AuthRoleActionConst.AUTH_ROLE_ACTION_CONST:
      state = {
        ...state,
        role: action.role,
      };
      break;

    case LogoutActionConst.LOGOUT_ACTION:
      state = {
        ...state,
        role: 'ServiceStaff',
        alertNotification: false,
        loader: false,
        userSuccessData: null,
        userErrorData: null,
        userInfo: null,
         locationConnectionScreen: {
          msg: '',
          bol: true
        },
      };
      break;
case LocationConnection.LOCATION_CONNECTION:
      state = {
        ...state,
        locationConnectionScreen: {
          ...state.locationConnectionScreen,
          msg: action.obj.msg,
          bol: action.obj.bol
        },
      };
      break;
    case UserLoginActionConst.USER_LOGIN_REQ:
      state = {
        ...state,
        loader: true,
      };
      break;
    case UserLoginActionConst.USER_LOGIN_SUCC:
      state = {
        ...state,
        loader: false,
        userSuccessData: action.succData,
        userErrorData: null,
      };
      break;
    case UserLoginActionConst.USER_LOGIN_FAIL:
      state = {
        ...state,

        loader: false,
        userErrorData: action.errData,
        userSuccessData: null,
      };
      break;

    case GetUserInformationActionConst.GET_USER_INFORMATION:
      // console.log(action.userInfo + ' deatils');
      state = {
        ...state,

        userInfo: action.userInfo,
      };
      break;

    case SaveLocalDataIntoReduxActionConst.LOCAL_DATA_TO_REDUX:
      state = {
        ...state,
        userSuccessData: action.data,
      };
      break;
    case QRcode.QRCODE:
      state = {
        ...state,
        qrcode: action.qrcode,
      };
      break;
    case Loader.LOADER:
      state = {
        ...state,
        loading: action.data,
      };
      case AUTHTOKENSTATEDISPATH:
        return {
          ...state,
          AuthTokenStateDispath: action.payload,
        };
      break;
  }
  return state;
};
