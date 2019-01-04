import * as React from 'react';
import { Dimensions, StatusBar, Platform } from 'react-native';
const { height, width } = Dimensions.get('window');
const isIphoneX = Platform.OS === "ios" && height === 812 && width === 375;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? isIphoneX ? 44 : 20 : StatusBar.currentHeight;
const colorPrimary = '#3E50B4'
const colorPrimaryDark = '#3E50B4'
const colorAccent = '#FFF'
const colorGrey = '#F1F1F3'
const colorTextPrimary = "#353535"
const colorTextBody = '#353535'
const colorTextCaption = '#686868'
const colorLightGrey = '#fbfbfb'
function elevation(value: any) {
  if (Platform.OS === 'ios') {
    if (value == 0) return {}
    return { shadowColor: 'black', shadowOffset: { width: 0, height: value / 2 }, shadowRadius: value, shadowOpacity: 0.24 }
  }
  return { elevation: value }
}

// Add your default style here
/* 
Sample :

###################
le
const styles = StyleSheet.create({
  container: {
    ...defaultStyle.container
  },
});

##################

*/

const defaultStyle = {
  container: {
    flex: 1,
  },
  imageSliderSize: {
    width: width,
    height: width * 0.8 // make image ratio square
  },
  statusBar: {
    height: STATUSBAR_HEIGHT,
    backgroundColor: colorPrimaryDark
  },
  overflowHidden: {
    overflow: 'hidden'
  },
  textPrimary13: {
    fontSize: 13,
    color: colorPrimary
  },
  textPrimaryDark13: {
    fontSize: 13,
    color: colorPrimaryDark
  },
}

export default {
  isIphoneX,
  STATUSBAR_HEIGHT,
  colorPrimary,
  colorPrimaryDark,
  colorAccent,
  colorGrey,
  colorTextPrimary,
  colorTextBody,
  colorTextCaption,
  colorLightGrey,
  elevation,
  width,
  height,
  defaultStyle,
}