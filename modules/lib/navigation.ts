import React from "react";
import { NavigationActions } from 'react-navigation';

var _navigator: any = React.createRef()
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

  static back(key?: string): void {
    _navigator.dispatch(
      NavigationActions.back(key)
    )
  }
}