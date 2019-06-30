import React from 'react';
import { AsyncStorage } from 'react-native';
import { esp, LibUtils, LibStyle } from 'esoftplay';
import { store } from '../../../../App';

export default class m {

  static initState = {
    theme: 'light'
  }

  static reducer(state: any, action: any): any {
    if (state == undefined) state = m.initState
    switch (action.type) {
      case 'lib_theme_switch':
        return {
          ...state,
          theme: action.payload
        }
        break;
      default:
        return state
    }
  }

  static setTheme(themeName: string, navigation: any, isLogin?: any): void {
    store.dispatch({
      type: 'lib_theme_switch',
      payload: themeName
    })
    LibUtils.navReset(navigation, isLogin)
    AsyncStorage.setItem('theme', themeName)
  }

  static getTheme(): void {
    AsyncStorage.getItem('theme').then((theme) => {
      if (theme) {
        store.dispatch({
          type: 'lib_theme_switch',
          payload: theme
        })
      }
    })
  }
  static _barStyle(): string {
    return m.colors(...LibStyle._barStyle)
  }

  static _colorPrimary(): string {
    return m.colors(...LibStyle._colorPrimary)
  }
  
  static _colorAccent(): string {
    return m.colors(...LibStyle._colorAccent)
  }
  static _colorHeader(): string {
    return m.colors(...LibStyle._colorHeader)
  }
  static _colorHeaderText(): string {
    return m.colors(...LibStyle._colorHeaderText)
  }
  static _colorButtonPrimary(): string {
    return m.colors(...LibStyle._colorButtonPrimary)
  }
  static _colorButtonTextPrimary(): string {
    return m.colors(...LibStyle._colorButtonTextPrimary)
  }
  static _colorButtonSecondary(): string {
    return m.colors(...LibStyle._colorButtonSecondary)
  }
  static _colorButtonTextSecondary(): string {
    return m.colors(...LibStyle._colorButtonTextSecondary)
  }
  static _colorButtonTertiary(): string {
    return m.colors(...LibStyle._colorButtonTertiary)
  }
  static _colorButtonTextTertiary(): string {
    return m.colors(...LibStyle._colorButtonTextTertiary)
  }
  static _colorBackgroundPrimary(): string {
    return m.colors(...LibStyle._colorBackgroundPrimary)
  }
  static _colorBackgroundSecondary(): string {
    return m.colors(...LibStyle._colorBackgroundSecondary)
  }
  static _colorBackgroundTertiary(): string {
    return m.colors(...LibStyle._colorBackgroundTertiary)
  }
  static _colorBackgroundCardPrimary(): string {
    return m.colors(...LibStyle._colorBackgroundCardPrimary)
  }
  static _colorBackgroundCardSecondary(): string {
    return m.colors(...LibStyle._colorBackgroundCardSecondary)
  }
  static _colorBackgroundCardTertiary(): string {
    return m.colors(...LibStyle._colorBackgroundCardTertiary)
  }
  static _colorTextPrimary(): string {
    return m.colors(...LibStyle._colorTextPrimary)
  }
  static _colorTextSecondary(): string {
    return m.colors(...LibStyle._colorTextSecondary)
  }
  static _colorTextTertiary(): string {
    return m.colors(...LibStyle._colorTextTertiary)
  }

  static colors(...colors: string[]): string {
    const _store: any = store.getState();
    const _themeName = _store.lib_theme.theme;
    const _themes: string[] = esp.config('theme');
    const _themeIndex = _themes.indexOf(_themeName);
    if (_themeIndex <= _themes.length - 1 && _themeIndex <= colors.length - 1)
      return colors[_themeIndex];
    else
      return colors[0];
  }

}