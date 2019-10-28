import React from "react";
import { LibUtils } from 'esoftplay';
import { store } from "../../../../App";
import { AsyncStorage } from 'react-native';



export default class local {

  static initState = {
    lang_id: "id"
  }

  static reducer(state: any, action: any): any {
    if (state == undefined) state = local.initState
    switch (action.type) {
      case "lib_locale_set_id":
        return { ...state, lang_id: action.payload }
      default:
        return state
    }
  }

  static setLanguage(langId: string, navigation: any, isLogin?: boolean): void {
    store.dispatch({
      type: 'lib_locale_set_id',
      payload: langId
    })
    LibUtils.navReset(navigation, isLogin)
    AsyncStorage.setItem('locale', langId)
  }

  static getLanguage(): void {
    AsyncStorage.getItem('locale').then((locale) => {
      if (locale) {
        store.dispatch({
          type: 'lib_locale_set_id',
          payload: locale
        })
      }
    })
  }
}