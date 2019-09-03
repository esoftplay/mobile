import { esp, LibUtils } from 'esoftplay';
import React from "react";
import { NavigationActions } from 'react-navigation';

var _navigator: any = React.createRef()
var _backResult: any = undefined
export default class m {
  static setRef(ref: any): void {
    _navigator = ref
  }

  static navigation(): any {
    return _navigator
  }

  static navigate(route: string, params?: any): void {
    _navigator.dispatch(
      NavigationActions.navigate({ routeName: route, params: params })
    )
  }

  static sendBackResult(result: any): void {
    if (_backResult == undefined) {
      _backResult = result
    }
    m.back()
  }

  static navigateForResult(route: string, params?: any): Promise<any> {
    _backResult = undefined
    return new Promise((r) => {
      function checkResult() {
        setTimeout(() => {
          if (_backResult == undefined) {
            checkResult()
          } else {
            r(_backResult)
          }
        }, 300);
      }
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