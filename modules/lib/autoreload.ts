import React from 'react'
import { InteractionManager } from 'react-native'
import { _global } from 'esoftplay'

export default class m {
  static set(callback: () => void, duration?: number): void {
    if (_global.updater != undefined) {
      clearInterval(_global.updater)
      _global.updater = undefined
    }
    _global.updater = setInterval(() => {
      InteractionManager.runAfterInteractions(() => {
        callback()
      });
    }, duration || 6000)
  }
  static clear(): void {
    if (_global.updater != undefined) {
      clearInterval(_global.updater)
      _global.updater = undefined
    }
  }
}