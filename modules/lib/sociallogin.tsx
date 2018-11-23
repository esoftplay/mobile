// 
import React from 'react'
import { Component } from 'react';
import { View, WebView, AsyncStorage, ActivityIndicator } from 'react-native';
import utils from './utils'
import { esp } from 'esoftplay';
const config = esp.config()
const { colorPrimary } = esp.mod('lib/style')

export interface LibSocialloginProps {
  url?: string,
  onResult: (userData: any) => void
}
export interface LibSocialloginState {

}

export default class esocialLogin extends Component<LibSocialloginProps, LibSocialloginState> {
  props: LibSocialloginProps

  constructor(props: LibSocialloginProps) {
    super(props);
    this.props = props
  }

  setUser(userData: any) {
    AsyncStorage.setItem(config.domain + '_user', userData);
  }

  static delUser() {
    AsyncStorage.removeItem(config.domain + '_user')
  }

  static getUser(callback?: (userData: any) => void): Promise<any> {
    return new Promise((r, j) => {
      AsyncStorage.getItem(config.domain + '_user').then((userData: any) => {
        if (userData) {
          if (callback) callback(JSON.parse(userData));
          r(JSON.parse(userData));
        } else {
          j('User NotFound')
        }
      })
    })
  }
  render() {
    var { url, onResult } = this.props
    if (!url) {
      url = utils.getArgs(this.props, 'url');
    }
    return (
      <View style={{ flex: 1 }} >
        <WebView
          style={{ flex: 1 }}
          startInLoadingState={true}
          useWebKit
          renderLoading={() => <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} ><ActivityIndicator color={colorPrimary} /></View>}
          javaScriptEnabled={true}
          userAgent={"Mozilla/5.0 (X11; Linux i686; rv:10.0.1) Gecko/20100101 Firefox/10.0.1 SeaMonkey/2.7.1"}
          source={{ uri: url }}
          onMessage={(e: any) => {
            var data = e.nativeEvent.data
            if (data) {
              this.setUser(data)
              onResult(JSON.parse(data))
            }
          }}
        />
      </View>
    )
  }
}
