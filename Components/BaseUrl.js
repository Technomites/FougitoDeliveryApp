// export const BaseUrl = 'https://api.fougito.com/api/';
//export const BaseUrl = 'https://api.fougitodemo.com/api/';
// export const BaseUrl = 'https://motors.fougitodemo.com/api/';


export var SetUrlConst =
    'https://api.fougito.com/api/';
    export var SetUrlConstuk =
    'https://api.fougito.uk/api/';
export var BaseUrl = SetUrlConst


export function _setBaseUrlToggle(url) {
    SetUrlConst = url;
    BaseUrl = url;
}
