// 
import react from 'react';
import { Notifications, Permissions } from 'expo';
import { AsyncStorage } from 'react-native';
import { esp } from 'esoftplay';
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

export default class enotification {
  static listen(callback?: (obj: any) => void): Promise<any> {
    return new Promise((r, j) => {
      Notifications.addListener(async (obj: any) => {
        if (obj) {
          if (obj.remote == true) {
            AsyncStorage.setItem('enotification', JSON.stringify(obj));
          }
          if (callback) callback(obj);
          r(obj);
        } else {
          j();
        }
      })
    })
  }

  static get(action?: (res: any) => void): Promise<any> {
    return new Promise((r, j) => {
      setTimeout(() => {
        AsyncStorage.getItem('enotification').then((res: any) => {
          if (res) {
            if (action) action(res);
            AsyncStorage.removeItem('enotification');
            r(res)
          } else {
            j();
          }
        })
      }, 1500);
    })
  }
  static async requestPermission(callback?: (token: any) => void): Promise<any> {
    return new Promise(async (r, j) => {
      const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = status;
      if (status !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        j();
        return;
      }
      r(await Notifications.getExpoPushTokenAsync());
      if (callback) callback(await Notifications.getExpoPushTokenAsync());
    })
  }
}