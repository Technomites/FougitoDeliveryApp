import React, {useState, useRef, useEffect} from 'react';
import {View, Text} from 'react-native';
import Toast from 'react-native-toast-notifications';
import { fontSize, scalableWidth, scalableheight } from '../resposnevaraiable';
import Color from '../../Constants/Color';
import { useSelector,useDispatch } from 'react-redux';
import *  as DataAction from "../../Store/Data/DataAction"
import { FontFamily } from '../../Constants/fonts';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { C, F } from '../../Constants/tokens';
export default function ToastMessage() {
  const toastMessageReciver = useSelector(
    state => state.data.toastMessage,
  );
  const dispatch = useDispatch()
  const toast = useRef();

  useEffect(()=>{
    if (!toastMessageReciver == "") {
      toast.current.hideAll()
      toast.current.show(toastMessageReciver)
    }
    setTimeout(() => {
      dispatch(DataAction.ToastMessageSenderScreenAction(''))
    }, 500);

  },[toastMessageReciver])

  // Ink bar, white text, no radius.
  return (
    <Toast
    ref={toast}
    normalColor={C.ink}
    textStyle={{fontFamily: F.bold, fontSize: 15, color: C.surface}}
    style={{
      position: 'absolute',
      bottom: scalableWidth.three,
      borderRadius: 0,
      paddingHorizontal: 18,
      paddingVertical: 14,
      backgroundColor: C.ink,
    }}

  />

  );
}
