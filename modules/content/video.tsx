//

import React from "react"
import { Component } from "react";
import {  StyleSheet, View, ActivityIndicator } from "react-native";
import { WebView } from 'react-native-webview'
import { esp, LibComponent, LibStyle } from "esoftplay";
const { colorPrimary } = LibStyle;

export interface ContentVideoProps {
  code: string,
  style?: any
}

export interface ContentVideoState {

}

export default class evideo extends LibComponent<ContentVideoProps, ContentVideoState> {

  props: ContentVideoProps;

  constructor(props: ContentVideoProps) {
    super(props)
    this.props = props
  }

  render() : any {
    const code = this.props.code
    if (!code) {
      return new Error("Missing Youtube Code in Props");
    }
    return (
      <WebView
        style={[{ position: "absolute", top: 0, left: 0, right: 0, flex: 1 }, StyleSheet.flatten(this.props.style || {})]}
        startInLoadingState
        useWebKit={true}
        renderLoading={() => <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }} ><ActivityIndicator color={colorPrimary} /></View>}
        javaScriptEnabled={true}
        source={{ uri: "https://www.youtube.com/embed/" + this.props.code + "?rel=0&autoplay=0&showinfo=0&controls=1&modestbranding=1" }}
      />
    )
  }
}
