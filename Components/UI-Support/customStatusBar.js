import * as React from 'react';
import { StatusBar, View, Platform } from 'react-native';
import { fontSize, scalableheight } from '../../Components/resposnevaraiable';
import { commonStylying } from '../../Constants/AddWrapper';
import { getStatusBarHeight } from 'react-native-status-bar-height';
const STATUSBAR_HEIGHT = StatusBar.currentHeight;

// Optional `style` lets a screen paint the status-bar strip (e.g. white above a white header).
function FocusAwareStatusBar(props) {
  const StatusBarHeight = getStatusBarHeight()
  return (
    <View
      style={[
        {
          paddingTop: Platform.OS == "ios" ? null : (StatusBarHeight === 0 ? scalableheight.three : StatusBarHeight)
        },
        props.style,
      ]}>
      <StatusBar
        barStyle={props?.barStyle}
        backgroundColor={props.backgroundColor}
        translucent
      />
    </View>
  )
}

export default FocusAwareStatusBar;
