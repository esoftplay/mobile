import React from "react";
import { esp } from "esoftplay";
import { store } from "../../../../App";


export default class local {

  static initState = {
    lang_id: "id"
  }

  static reducer(state: any, action: any): any {
    if (state == undefined) state = local.initState
    switch (action.type) {
      case "lib_local_set_id":
        return { ...state, id: action.payload }
      default:
        return state
    }
  }

  static setLanguage(lang_id: string): void {
    let _lang: string[] = esp.config("langIds")
    if (_lang.indexOf(lang_id) != -1) {
      store.dispatch({
        type: "lib_local_set_id",
        payload: lang_id
      })
    } else {
      throw Error("lang id yang anda masukkan tidak terdaftar di app.json")
    }
  }
}