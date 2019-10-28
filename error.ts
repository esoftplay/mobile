import React from 'react';
import { Platform, AsyncStorage, Alert } from 'react-native';
import { LibCurl, LibUtils } from 'esoftplay';
import Constants from 'expo-constants';
let config = require('../../config.json');
let app = require('../../app.json');

const defaultErrorHandler = ErrorUtils.getGlobalHandler()
const myErrorHandler = (e: any, isFatal: any) => {
  setError()
  defaultErrorHandler(e, isFatal)
}

export function setError(error?: any) {
  let routes = LibUtils.getReduxState('user_index')
  let lastIndex = routes.routes.length - 1
  let _e: any = {}
  _e['error'] = error
  _e['routes'] = routes.routes[lastIndex].routeName
  AsyncStorage.setItem(config.config.domain + 'error', JSON.stringify(_e))
}

export function reportApiError(fetch: any, error: any) {
  config.config && config.config.errorReport && config.config.errorReport.telegramIds && config.config.errorReport.telegramIds.forEach((id: string) => {
    let post = {
      text: JSON.stringify({ fetch, error, app: Constants.appOwnership, isDevice: Constants.isDevice }, undefined, 2),
      chat_id: id,
    }
    new LibCurl().custom('https://api.telegram.org/bot923808407:AAEFBlllQNKCEn8E66fwEzCj5vs9qGwVGT4/sendMessage', post)
  })
}

export function getError(adder: any) {
  AsyncStorage.getItem(config.config.domain + 'error').then((e: any) => {
    if (e) {
      let _e = JSON.parse(e)
      let msg = {
        name: app.expo.name + ' - sdk' + app.expo.sdkVersion,
        domain: config.config.domain,
        module: _e.routes,
        package: (Platform.OS == 'ios' ? app.expo.ios.bundleIdentifier : app.expo.android.package) + ' - v' + (Platform.OS == 'ios' ? app.expo.ios.buildNumber : app.expo.android.versionCode),
        device: Platform.OS + ' - ' + Constants.deviceName,
        error: adder && adder.exp && adder.exp.lastErrors || '-',
        errorApi: _e.error
      }
      config.config && config.config.errorReport && config.config.errorReport.telegramIds && config.config.errorReport.telegramIds.forEach((id: string) => {
        let post = {
          text: JSON.stringify(msg, undefined, 2),
          chat_id: id
        }
        if (msg.error == '-') {
          msg.error = 'uncaught fatal error'
        }
        new LibCurl().custom('https://api.telegram.org/bot923808407:AAEFBlllQNKCEn8E66fwEzCj5vs9qGwVGT4/sendMessage', post)
      });
      AsyncStorage.removeItem(config.config.domain + 'error')
    }
  })
}
ErrorUtils.setGlobalHandler(myErrorHandler)