import React, {createContext, useContext, useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaInsetsContext,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import {C} from '../Constants/tokens';

// Android 15+ (targetSdk 35/36) draws apps edge-to-edge and ignores
// setNavigationBarColor, so the system navigation bar sat on top of our content.
// NavBarFrame reserves the system-bar area (bottom, plus left/right for 3-button
// navigation in phone landscape) for the whole app and paints a strip behind the
// bar: white normally, ink while the drawer is open. A nested SafeAreaProvider
// then reports 0 for that edge, so screens never pad it twice.

let tone = C.surface;
const listeners = new Set();
export const setNavBarTone = color => {
  tone = color;
  listeners.forEach(l => l(color));
};

// Raw window insets for content that renders in its own window (Modals).
const RootInsetsContext = createContext({top: 0, bottom: 0, left: 0, right: 0});
export const useRootInsets = () => useContext(RootInsetsContext);

const Frame = ({children}) => {
  const insets = useContext(SafeAreaInsetsContext) || {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };
  const [color, setColor] = useState(tone);
  useEffect(() => {
    listeners.add(setColor);
    return () => listeners.delete(setColor);
  }, []);

  return (
    <RootInsetsContext.Provider value={insets}>
      <View
        style={[
          styles.frame,
          {
            backgroundColor: color,
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          },
        ]}>
        <SafeAreaProvider style={styles.inner}>{children}</SafeAreaProvider>
      </View>
    </RootInsetsContext.Provider>
  );
};

const NavBarFrame = ({children}) => (
  <SafeAreaProvider initialMetrics={initialWindowMetrics}>
    <Frame>{children}</Frame>
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  frame: {flex: 1},
  inner: {flex: 1, backgroundColor: C.ground},
});

export default NavBarFrame;
