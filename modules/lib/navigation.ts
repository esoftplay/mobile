import { esp, LibUtils } from 'esoftplay';
import React from "react";
import { NavigationActions } from 'react-navigation';

var _navigator: any = React.createRef()
var _navigation: any
var _backResult: any = {}
export default class m {
  static setRef(ref: any): void {
    _navigator = ref
  }

  static setNavigation(nav: any): void {
    _navigation = nav
  }

  static navigation(): any {
    return _navigation
  }

  static navigate(route: string, params?: any): void {
    _navigator.dispatch(
      NavigationActions.navigate({ routeName: route, params: params })
    )
  }

  static cancelBackResult(key?: number): void {
    if (!key) {
      key = 1000
    }
    _backResult[key] = null
  }

  static sendBackResult(result: any, key?: number): void {
    if (!key) {
      key = 1000
    }
    if (_backResult[key] == undefined) {
      _backResult[key] = result
    }
    m.back()
  }

  static navigateForResult(route: string, params?: any, key?: number): Promise<any> {
    if (!key) {
      key = 1000
    }
    _backResult[key] = undefined
    return new Promise((r) => {
      function checkResult() {
        setTimeout(() => {
          if (_backResult[key] == undefined) {
            checkResult()
          } else {
            r(_backResult[key])
          }
        }, 300);
      }
      if (!params) {
        params = {}
      }
      params['_senderKey'] = key
      m.navigate(route, params)
      checkResult()
    })
  }

  static back(key?: string): void {
    let _key
    if (key) {
      _key = LibUtils.navGetKey(key)
    }
    _navigator.dispatch(
      NavigationActions.back({ key: _key })
    )
  }
}