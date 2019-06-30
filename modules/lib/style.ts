import * as React from "react";
import { Dimensions, StatusBar, Platform } from "react-native";

const { height, width } = Dimensions.get("window");
const isIphoneX = Platform.OS === "ios" && ((height === 812 || width === 812) || (height === 896 || width === 896))
const STATUSBAR_HEIGHT = Platform.OS === "ios" ? isIphoneX ? 44 : 20 : StatusBar.currentHeight;
const STATUSBAR_HEIGHT_MASTER = Platform.OS === "ios" ? isIphoneX ? 44 : 20 : StatusBar.currentHeight;
const colorPrimary = "#3E50B4"
const colorPrimaryDark = "#3E50B4"
const colorAccent = "#FFF"
const colorGrey = "#F1F1F3"
const colorTextPrimary = "#353535"
const colorTextBody = "#353535"
const colorTextCaption = "#686868"
const colorLightGrey = "#fbfbfb"

function elevation(value: any): any {
  if (Platform.OS === "ios") {
    if (value == 0) return {}
    return { shadowColor: "black", shadowOffset: { width: 0, height: value / 2 }, shadowRadius: value, shadowOpacity: 0.24 }
  }
  return { elevation: value }
}
const _barStyle = ['dark', 'light']
const _colorPrimary = [colorPrimary, colorPrimary]
const _colorAccent = [colorAccent, colorAccent]
const _colorHeader = ['#3E50B4', '#292B37']
const _colorHeaderText = ['white', 'white']
const _colorButtonPrimary = ['#3E50B4', '#3E50B4']
const _colorButtonTextPrimary = ['white', 'white']
const _colorButtonSecondary = ['#3E50B4', '#3E50B4']
const _colorButtonTextSecondary = ['white', 'white']
const _colorButtonTertiary = ['#3E50B4', '#3E50B4']
const _colorButtonTextTertiary = ['white', 'white']
const _colorBackgroundPrimary = ['white', '#202529']
const _colorBackgroundSecondary = ['white', '#202529']
const _colorBackgroundTertiary = ['white', '#202529']
const _colorBackgroundCardPrimary = ['white', '#2B2F38']
const _colorBackgroundCardSecondary = ['white', '#2B2F38']
const _colorBackgroundCardTertiary = ['white', '#2B2F38']
const _colorTextPrimary = ['#353535', 'white']
const _colorTextSecondary = ['#666666', 'white']
const _colorTextTertiary = ['#999999', 'white']


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
    height: STATUSBAR_HEIGHT_MASTER,
    backgroundColor: colorPrimaryDark
  },
  overflowHidden: {
    overflow: "hidden"
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

export default class Style {
  static isIphoneX: boolean = isIphoneX;
  static STATUSBAR_HEIGHT: number = STATUSBAR_HEIGHT;
  static STATUSBAR_HEIGHT_MASTER: number = STATUSBAR_HEIGHT_MASTER;
  static colorPrimary: string = colorPrimary;
  static colorPrimaryDark: string = colorPrimaryDark;
  static colorAccent: string = colorAccent;
  static colorGrey: string = colorGrey;
  static colorTextPrimary: string = colorTextPrimary;
  static colorTextBody: string = colorTextBody;
  static colorTextCaption: string = colorTextCaption;
  static colorLightGrey: string = colorLightGrey;
  static elevation(val: number): any { return elevation(val) };
  static width: number = width;
  static height: number = height;
  static defaultStyle: any = defaultStyle;
  static _barStyle: string[] = _barStyle;
  static _colorPrimary: string[] = _colorPrimary;
  static _colorAccent: string[] = _colorAccent;
  static _colorHeader: string[] = _colorHeader;
  static _colorHeaderText: string[] = _colorHeaderText;
  static _colorButtonPrimary: string[] = _colorButtonPrimary;
  static _colorButtonTextPrimary: string[] = _colorButtonTextPrimary;
  static _colorButtonSecondary: string[] = _colorButtonSecondary;
  static _colorButtonTextSecondary: string[] = _colorButtonTextSecondary;
  static _colorButtonTertiary: string[] = _colorButtonTertiary;
  static _colorButtonTextTertiary: string[] = _colorButtonTextTertiary;
  static _colorBackgroundPrimary: string[] = _colorBackgroundPrimary;
  static _colorBackgroundSecondary: string[] = _colorBackgroundSecondary;
  static _colorBackgroundTertiary: string[] = _colorBackgroundTertiary;
  static _colorBackgroundCardPrimary: string[] = _colorBackgroundCardPrimary;
  static _colorBackgroundCardSecondary: string[] = _colorBackgroundCardSecondary;
  static _colorBackgroundCardTertiary: string[] = _colorBackgroundCardTertiary;
  static _colorTextPrimary: string[] = _colorTextPrimary;
  static _colorTextSecondary: string[] = _colorTextSecondary;
  static _colorTextTertiary: string[] = _colorTextTertiary;
}