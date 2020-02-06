// useLibs

import React, { useContext } from 'react';
import { NavigationContext, StackActions, NavigationActions } from 'react-navigation';
import { esp, useSafeState, _global } from 'esoftplay';

export interface UseNavigationReturn {
  back: (deep?: number) => void,
  isFocused: boolean,
  isFirstRouteInParent: boolean,
  navigate: (routeName: string, params?: any) => void,
  navigateForResult: (routeName: string, params?: any, key?: number) => Promise<any>,
  sendBackResult: (result: string, key?: number) => void,
  reset: (routeName?: string, ...routeNames: string[]) => void,
  backToRoot: () => void,
  replace: (routeName: string, params?: any) => void,
  push: (routeName: string, params?: any) => void,
}

export default function m(): UseNavigationReturn {
  const { navigate, dispatch, isFirstRouteInParent, isFocused, goBack } = useContext(NavigationContext)

  function navigateForResult(routeName: string, params: any, key?: number): Promise<any> {
    const _key = key || 1
    if (!_global.hasOwnProperty('_backResult')) {
      _global._backResult = {}
    }
    if (!_global.hasOwnProperty('_task')) {
      _global._task = {}
    }
    _global._task = {}
    _global._backResult[_key] = undefined
    return new Promise((r) => {
      navigate(routeName, params)
      function check() {
        setTimeout(() => {
          if (_global._backResult[_key] != undefined) {
            delete _global._task[key]
            r(_global._backResult[_key])
          } else {
            check()
          }
        }, 300);
      }
      if (!_global._task.hasOwnProperty(key)) {
        _global._task[key] = 1
        check()
      }
    })
  }

  function backToRoot(): void {
    dispatch(StackActions.popToTop());
  }

  function replace(routeName: string, params?: any) {
    const replaceAction = StackActions.replace({
      routeName: routeName,
      params: params
    });
    dispatch(replaceAction)
  }
  function push(routeName: string, params?: any) {
    const pushAction = StackActions.push({
      routeName: routeName,
      params: params
    });
    dispatch(pushAction)
  }
  function back(deep?: number) {
    let _deep = deep || 1
    const popAction = StackActions.pop({
      n: _deep
    });
    dispatch(popAction)
  }

  function reset(routeName?: string, ...routeNames: string[]): void {
    let _routeName = [routeName || esp.config('home', 'member')]
    if (routeNames && routeNames.length > 0) {
      _routeName = [..._routeName, ...routeNames]
    }

    const resetAction = StackActions.reset({
      index: _routeName.length - 1,
      actions: _routeName.map((rn) => NavigationActions.navigate({ routeName: rn }))
    });
    dispatch(resetAction);
  }

  function sendBackResult(result: any, key?: number): void {
    const _key = key || 1
    goBack()
    _global._backResult[_key] = result
  }

  return {
    back: back,
    isFocused: isFocused(),
    isFirstRouteInParent: isFirstRouteInParent(),
    navigate: navigate,
    navigateForResult,
    sendBackResult,
    backToRoot,
    reset,
    replace,
    push,
  }
}