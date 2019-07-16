// 
import react from "react";
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions'
import { AsyncStorage, Platform, Alert } from "react-native";
import { esp, UserNotification, LibDialog } from "esoftplay";
/*
{
  to: // exp token
  data:{
    action: // [route, dialog,  ]
    module: // routeName of ReactNavigation
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
          if (obj.remote == true && obj.origin == 'received') {
            UserNotification.user_notification_loadData()
            if (Platform.OS == 'ios') {
              Alert.alert(obj && obj.data && obj.data.data && obj.data.data.title || 'Notification', obj && obj.data && obj.data.data && obj.data.data.message || 'New notification has been received', [
                {
                  text: 'Open',
                  onPress: () => UserNotification.openPushNotif(obj.data),
                  style: 'default'
                },
                {
                  text: 'Close',
                  onPress: () => { },
                  style: 'cancel'
                }
              ])
            }
            // AsyncStorage.setItem("enotification", JSON.stringify(obj));
          } else if (obj.remote == true && obj.origin == 'selected') {
            UserNotification.openPushNotif(obj.data)
            UserNotification.user_notification_loadData()
          }
          if (callback) callback(obj);
          r(obj);
        } else {
          // j();
        }
      })
    })
  }

  static requestPermission(callback?: (token: any) => void): Promise<any> {
    return new Promise(async (r, j) => {
      const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = status;
      if (status !== "granted") {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        // j();
        return;
      }
      r(await Notifications.getExpoPushTokenAsync());
      if (callback) callback(await Notifications.getExpoPushTokenAsync());
    })
  }
}