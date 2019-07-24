// 
import react from "react";
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions'
import { AsyncStorage, Platform, Alert, Linking } from "react-native";
import { esp, UserNotification, LibDialog, LibCurl, LibCrypt, DbNotification, LibNavigation } from "esoftplay";
import moment from 'moment';
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
              Alert.alert(obj && obj.data && obj.data.title || 'Notification', obj && obj.data && obj.data.message || 'New notification has been received', [
                {
                  text: 'Open',
                  onPress: () => enotification.openPushNotif(obj.data),
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
            enotification.openPushNotif(obj.data)
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


  static openPushNotif(data: any): void {
    if (!data) return
    if (typeof data == 'string')
      data = JSON.parse(data)
    const crypt = new LibCrypt();
    const salt = esp.config("salt");
    const config = esp.config();
    var uri = config.protocol + "://" + config.domain + config.uri + "user/push-read"
    new LibCurl(uri, {
      notif_id: data.id,
      secretkey: crypt.encode(salt + "|" + moment().format("YYYY-MM-DD hh:mm:ss"))
    }, (res, msg) => {
      UserNotification.user_notification_loadData();
    }, (msg) => {

    })
    var param = data;
    if (param.action)
      switch (param.action) {
        case "alert":
          var hasLink = param.params && param.params.hasOwnProperty("url") && param.params.url != ""
          var btns: any = []
          if (hasLink) {
            btns.push({ text: "OK", onPress: () => Linking.openURL(param.params.url) })
          } else {
            btns.push({ text: "OK", onPress: () => { }, style: "cancel" })
          }
          Alert.alert(
            param.title,
            param.message,
            btns, { cancelable: false }
          )
          break;
        case "default":
          if (param.module && param.module != "") {
            if (!String(param.module).includes("/")) param.module = param.module + "/index"
            LibNavigation.navigate(param.module, param.params)
          }
          break;
        default:
          break;
      }
  }

  static openNotif(data: any): void {
    const salt = esp.config("salt");
    const config = esp.config();
    var uri = config.protocol + "://" + config.domain + config.uri + "user/push-read"
    new LibCurl(uri, {
      notif_id: data.notif_id,
      secretkey: new LibCrypt().encode(salt + "|" + moment().format("YYYY-MM-DD hh:mm:ss"))
    }, (res: any, msg: string) => {
      const db = new DbNotification();
      db.setRead(data.id)
      UserNotification.user_notification_setRead(data.id)
    }, (msg: string) => {
      // esp.log(msg)
    }, 1)
    var param = JSON.parse(data.params)
    switch (param.action) {
      case "alert":
        var hasLink = param.arguments.hasOwnProperty("url") && param.arguments.url != ""
        var btns = []
        if (hasLink) {
          btns.push({ text: "OK", onPress: () => Linking.openURL(param.arguments.url) })
        } else {
          btns.push({ text: "OK", onPress: () => { }, style: "cancel" })
        }
        Alert.alert(
          data.title,
          data.message,
          btns,
          { cancelable: false }
        )
        break;
      case "default":
        if (param.module != "") {
          if (!String(param.module).includes("/")) param.module = param.module + "/index"
          LibNavigation.navigate(param.module, param.arguments)
        }
        break;
      default:
        break;
    }
  }


}