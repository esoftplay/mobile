import { esp, LibUtils, _global } from 'esoftplay';
import React from "react";
import { NavigationActions } from 'react-navigation';

// var _navigator: any = React.createRef()
// var _navigation: any
// var _backResult: any = {}
// var _task: any = {}

export default class m {
  static setRef(ref: any): void {
    _global._navigator = ref
  }

  static setNavigation(nav: any): void {
    _global._navigation = nav
  }

  static navigation(): any {
    return _global._navigation
  }

  static navigate(route: string, params?: any): void {
    _global._navigator.dispatch(
      NavigationActions.navigate({ routeName: route, params: params })
    )
  }

  static cancelBackResult(key?: number): void {
    if (!key) {
      key = 1000
    }
    _global._backResult[key] = null
  }

  static sendBackResult(result: any, key?: number): void {
    if (!key) {
      key = 1
    }
    if (_global._backResult[key] == undefined) {
      _global._backResult[key] = result
    }
    m.back()
  }

  static navigateForResult(route: string, params?: any, key?: number): Promise<any> {
    if (!key) {
      key = 1
    }
    if (!_global.hasOwnProperty('_backResult')) {
      _global._backResult = {}
    }
    if (!_global.hasOwnProperty('_task')) {
      _global._task = {}
    }
    _global._backResult[key] = undefined
    return new Promise((r) => {
      function checkResult() {
        setTimeout(() => {
          if (_global._backResult[key] == undefined) {
            checkResult()
          } else {
            delete _global._task[key]
            r(_global._backResult[key])
          }
        }, 300);
      }
      if (!params) {
        params = {}
      }
      params['_senderKey'] = key
      m.navigate(route, params)
      if (!_global._task.hasOwnProperty(key)) {
        _global._task[key] = 1;
        checkResult()
      }
    })
  }

  static back(key?: string): void {
    let _key
    if (key) {
      _key = LibUtils.navGetKey(key)
    }
    _global._navigator.dispatch(
      NavigationActions.back({ key: _key })
    )
  }
}