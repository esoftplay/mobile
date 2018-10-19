import react from 'react';
import { Notifications, Permissions } from 'expo';
import { AsyncStorage } from 'react-native';
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

class Enotification {
  static listen = (callback) => {
    Notifications.addListener(async (obj) => {
      if (obj) {
        if (obj.remote == true) {
          AsyncStorage.setItem('enotification', JSON.stringify(obj));
        }
        if (callback) callback(obj);
      }
    })
  }
  static get = (action) => {
    setTimeout(async () => {
      var res = JSON.parse(await AsyncStorage.getItem('enotification'))
      action(res)
      AsyncStorage.removeItem('enotification')
    }, 1500);
  }

  static async requestPermission(token) {
    const { existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== 'granted') return
    // esp.log(finalStatus)
    token(await Notifications.getExpoPushTokenAsync())
  }
}

module.exports = Enotification