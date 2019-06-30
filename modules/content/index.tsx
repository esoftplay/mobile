import React from "react";
import { View, AppState } from "react-native";
import {
  ContentList,
  LibComponent,
  LibNotification,
  UserNotification,
  LibStyle
} from "esoftplay";
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
    UserNotification.openPushNotif(data, this.props.navigation)
  }

  render(): any {
    return (
      <View style={{ flex: 1, paddingBottom: isIphoneX ? 30 : 0 }}>
        <ContentList navigation={this.props.navigation} />
      </View>
    );
  }
}