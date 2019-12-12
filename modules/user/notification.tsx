//

import React from "react";
import { TouchableOpacity, View, StatusBar } from "react-native";
import {
  esp,
  LibCrypt,
  LibCurl,
  LibList,
  LibComponent,
  LibNotification,
  LibStyle,
  LibUtils,
  UserNotification_item,
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

  static persist = true
  static reducer(state: any, action: any): any {
    if (!state) state = { data: [] };
    switch (action.type) {
      case "user_notification_parseData":
        return {
          data: action.payload
        }
      case "user_notification_setRead":
        var data: any[] = state.data
        var index = data.findIndex((item: any) => item.id == action.payload)
        var query = {
          [index]: {
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


  static drop(): void {
    store.dispatch({
      type: "user_notification_parseData",
      payload: []
    })
  }

  static user_notification_loadData(): void {
    const { protocol, domain, uri, salt } = esp.config()
    var _uri = protocol + "://" + domain + uri + "user/push-notif"
    const data = LibUtils.getReduxState('user_notification', 'data')
    const user = LibUtils.getReduxState('user_class')
    if (data && data.length > 0) {
      const lastData = data[data.length - 1]
      _uri += "?last_id=" + lastData.id
    }
    let post: any = {
      user_id: "",
      secretkey: new LibCrypt().encode(salt + "|" + moment().format("YYYY-MM-DD hh:mm:ss"))
    }
    if (user) {
      post["user_id"] = user.id
      post["group_id"] = esp.config('group_id')
    }
    Enotification.user_notification_fetchData(_uri, post);
  }

  static user_notification_fetchData(uri: string, post: any): void {
    new LibCurl(uri, post,
      (res: any) => {
        Enotification.user_notification_parseData(res.list)
        if (res.next != "") {
          Enotification.user_notification_fetchData(res.next, post)
        }
      }, () => {

      }
    )
  }

  static user_notification_parseData(res: any): void {
    if (res.length > 0) {
      const data = LibUtils.getReduxState('user_notification', 'data')
      store.dispatch({
        type: "user_notification_parseData",
        payload: data && data.length > 0 ? LibUtils.uniqueArray([...data, ...res]) : res
      })
    }
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

  render(): any {
    const { colorPrimary, colorAccent, STATUSBAR_HEIGHT } = LibStyle;
    const { goBack } = this.props.navigation
    const data = [...this.props.data].reverse()
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
          onRefresh={() => Enotification.user_notification_loadData()}
          renderItem={(item: any) => (
            <TouchableOpacity onPress={() => LibNotification.openNotif(item)} >
              <UserNotification_item {...item} />
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
}

export default connect(Enotification.mapStateToProps)(Enotification);