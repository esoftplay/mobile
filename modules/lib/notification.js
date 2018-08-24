import * as Permissions  from '../../../expo/src/Permissions.js';
import Notifications from '../../../expo/src/Notifications.js';
import { AsyncStorage } from '../../../react-native/Libraries/react-native/react-native-implementation.js';
import esp from 'esoftplay';
/*
// https://github.com/dev-esoftplay/react-native-esoftplay-notification
{
  to: // exp token
  data:{
    action: // [route, dialog,  ]
    route_name: // routeName of ReactNavigation
    params:
    title:
    message:
  }
  title:
  body:
  sound:
  param:
  ttl:
  expiration:
  priority:
  badge:
} */

const Enotification = {
  listen(callback) {
    Notifications.addListener((obj) => {
      if (obj) {
        if (callback) callback(obj)
        if (obj.remote) {
          AsyncStorage.setItem('enotification', JSON.stringify(obj))
        }
      }
    })
  },
  get(action) {
    setTimeout(() => {
      AsyncStorage.getItem('enotification').then((res) => {
        res = JSON.parse(res)
        action(res)
        AsyncStorage.removeItem('enotification')
      }, 1500);
    })
  },
  async requestPermission(token) {
    const { existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== 'granted') return
    esp.log(finalStatus)
    token(await Notifications.getExpoPushTokenAsync())
  }
}

module.exports = Enotification