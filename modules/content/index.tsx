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
  }

  render(): any {
    return (
      <View style={{ flex: 1 }}>
        <ContentList navigation={this.props.navigation} />
      </View>
    );
  }
}