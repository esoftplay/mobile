import React from "react";
import { esp, LibUtils } from 'esoftplay';
import { store } from "../../../../App";
import { Updates } from 'expo';
import { Alert, AsyncStorage } from 'react-native';


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

  static setLocale(localeId: string, navigation: any, isLogin?: boolean): void {
    store.dispatch({
      type: 'lib_locale_set_id',
      payload: localeId
    })
    LibUtils.navReset(navigation, isLogin)
    AsyncStorage.setItem('locale', localeId)
  }

  static getLocale(): void {
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