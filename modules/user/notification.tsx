// 

import React from "react";
import { TouchableOpacity, View, Alert, Linking, StatusBar } from "react-native";
import {
  esp,
  DbNotification,
  LibCrypt,
  LibCurl,
  UserClass,
  LibList,
  LibComponent,
  LibStyle,
  LibNavigation
} from "esoftplay";
import { store } from "../../../../App";
import { connect } from "react-redux"
import moment from "moment/min/moment-with-locales"
import update from "immutability-helper"
import { Text, Button, Icon } from "native-base";

export interface UserNotificationProps {
  navigation: any,
  data: any[]
}

export interface UserNotificationState {

}


class Enotification extends LibComponent<UserNotificationProps, UserNotificationState> {

  props: UserNotificationProps

  static reducer(state: any, action: any): any {
    if (!state) state = { data: [] };
    switch (action.type) {
      case "user_notification_parseData":
        return {
          data: action.payload
        }
      case "user_notification_setRead":
        var data = state.data
        var itemData = data.filter((item: any) => item.id == action.payload)[0]
        var query = {
          [data.indexOf(itemData)]: {
            status: { $set: 2 }
          }
        }
        return {
          data: update(data, query)
        }
      default:
        return state
    }
  }


  static user_notification_loadData(): void {
    const config = esp.config()
    var uri = config.protocol + "://" + config.domain + config.uri + "user/push-notif"
    try { Enotification.user_notification_parseData() } catch (error) { }
    const db = new DbNotification();
    db.execute("SELECT notif_id FROM notification WHERE 1 ORDER BY notif_id DESC LIMIT 1", (res: any) => {
      if (res.rows.length > 0) {
        uri += "?last_id=" + res.rows._array[0].notif_id
      }
      const salt = esp.config("salt");
      var post = {
        user_id: "",
        secretkey: new LibCrypt().encode(salt + "|" + moment().format("YYYY-MM-DD hh:mm:ss"))
      }
      UserClass.load((user: any) => {
        if (user) post["user_id"] = user.id
        Enotification.user_notification_fetchData(uri, post, db);
      })
    })
  }

  static user_notification_fetchData(uri: string, post: any, db: any): void {
    new LibCurl(uri, post,
      (res: any, msg: string) => {
        var list = res.list
        list.map((row: any) => {
          db.insertOrUpdate(row)
        })
        if (res.next != "") {
          Enotification.user_notification_fetchData(res.next, post, db)
        }
        if (list.length > 0) {
          try { Enotification.user_notification_parseData() } catch (error) { }
        }
        // esp.log(res)
      }, (msg: any) => {
        // esp.log(msg)
      }
    )
  }

  static user_notification_parseData(): void {
    const db = new DbNotification();
    db.getAll_().then((res) => {
      store.dispatch({
        type: "user_notification_parseData",
        payload: res
      })
    })
  }

  static user_notification_setRead(id: string | number): void {
    store.dispatch({
      type: "user_notification_setRead",
      payload: id
    })
  }

  static mapStateToProps(state: any): Object {
    return {
      data: state.user_notification.data
    }
  }

  constructor(props: UserNotificationProps) {
    super(props)
    this.props = props
  }

  componentDidMount(): void {
    super.componentDidMount()
    moment.locale(esp.langId());
    Enotification.user_notification_loadData()
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
      notif_id: data.data.id,
      secretkey: crypt.encode(salt + "|" + moment().format("YYYY-MM-DD hh:mm:ss"))
    }, (res, msg) => {
      Enotification.user_notification_loadData();
    }, (msg) => {

    })
    var param = data.data;
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
      Enotification.user_notification_setRead(data.id)
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

  render(): any {
    const { colorPrimary, colorAccent, elevation, width, STATUSBAR_HEIGHT } = LibStyle;
    const { goBack } = this.props.navigation
    const data = this.props.data.reverse()
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <StatusBar barStyle={"light-content"} />
        <View
          style={{ flexDirection: "row", height: (STATUSBAR_HEIGHT) + 50, paddingTop: STATUSBAR_HEIGHT, paddingHorizontal: 0, alignItems: "center", backgroundColor: colorPrimary }}>
          <Button transparent
            style={{ width: 50, height: 50, alignItems: "center", margin: 0 }}
            onPress={() => goBack()}>
            <Icon
              style={{ color: colorAccent }}
              name="md-arrow-back" />
          </Button>
          <Text
            style={{
              marginHorizontal: 10,
              fontSize: 18,
              textAlign: "left",
              flex: 1,
              color: colorAccent
            }}>Notifikasi</Text>
        </View>
        <LibList
          data={data}
          renderItem={(item: any, index: number) => (
            <TouchableOpacity onPress={() => Enotification.openNotif(item)} >
              <View style={[{ padding: 16, flexDirection: "row", backgroundColor: "white", marginBottom: 3, marginHorizontal: 0, width: width }, elevation(1.5)]} >
                <View style={{}} >
                  <Text style={{ color: item.status == 2 ? "#999" : colorPrimary, fontFamily: item.status == 2 ? "Roboto" : "Roboto_medium", marginBottom: 8 }} >{item.title}</Text>
                  <Text note ellipsizeMode="tail" numberOfLines={2} >{item.message}</Text>
                  <Text note style={{ fontSize: 9, marginTop: 5 }} >{moment(item.updated).fromNow()}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
}

export default connect(Enotification.mapStateToProps)(Enotification);