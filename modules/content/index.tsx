import React from "react";
import { View, StyleSheet, Alert, Linking, AppState } from "react-native";
import {
  ContentList,
  LibComponent,
  LibNotification,
  LibCrypt,
  esp,
  LibCurl,
  UserNotification,
  LibStyle
} from "esoftplay";
import moment from "moment"
const { isIphoneX } = LibStyle



export interface ContentIndexProps {
  navigation: any
}

export interface ContentIndexState {

}

export default class econtent extends LibComponent<ContentIndexProps, ContentIndexState> {
  props: ContentIndexProps

  constructor(props: ContentIndexProps) {
    super(props);
    this.props = props
    this.openPushNotif = this.openPushNotif.bind(this)
    this.handleNotification = this.handleNotification.bind(this)
  }

  componentDidMount(): void {
    super.componentDidMount()
    AppState.addEventListener("change", this.handleNotification);
    LibNotification.get(this.openPushNotif);
  }

  componentWillUnmount(): void {
    super.componentWillUnmount()
    AppState.removeEventListener("change", this.handleNotification);
  }

  handleNotification(nexAppState: string): void {
    if (nexAppState == "active") {
      LibNotification.get(this.openPushNotif);
    }
  }

  openPushNotif(data: any): void {
    if (!data) return
    const crypt = new LibCrypt();
    const salt = esp.config("salt");
    const config = esp.config();
    var uri = config.protocol + "://" + config.domain + config.uri + "user/push-read"
    new LibCurl(uri, {
      notif_id: data.data.id,
      secretkey: crypt.encode(salt + "|" + moment().format("YYYY-MM-DD hh:mm:ss"))
    }, (res, msg) => {
      UserNotification.user_notification_loadData();
    }, (msg) => {

    })
    var param = data.data;
    switch (param.action) {
      case "alert":
        var hasLink = param.arguments.hasOwnProperty("url") && param.arguments.url != ""
        var btns: any = []
        if (hasLink) {
          btns.push({ text: "OK", onPress: () => Linking.openURL(param.arguments.url) })
        } else {
          btns.push({ text: "OK", onPress: () => { }, style: "cancel" })
        }
        Alert.alert(
          data.title,
          data.message,
          btns, { cancelable: false }
        )
        break;
      case "default":
        if (param.module != "") {
          if (!String(param.module).includes("/")) param.module = param.module + "/index"
          this.props.navigation.navigate(param.module, param.arguments)
        }
        break;
      default:
        break;
    }
  }

  render(): any {
    return (
      <View style={{ flex: 1, paddingBottom: isIphoneX ? 30 : 0 }}>
        <ContentList navigation={this.props.navigation} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})