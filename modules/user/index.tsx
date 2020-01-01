//

import React from "react";
import navs from "../../cache/navigations";
import { View, Platform } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from 'react-navigation-stack';
import App from "../../../../App";
import * as Font from "expo-font";
const appjson = require('../../../../app.json')
import { AsyncStorage } from 'react-native';
import {
  esp,
  LibNotification,
  UserClass,
  LibComponent,
  LibWorker,
  LibNet_status,
  LibTheme,
  LibLocale,
  LibDialog,
  LibStyle,
  LibImage,
  LibProgress,
  LibNavigation,
  UserMain,
  LibToast
} from 'esoftplay';
import firebase from 'firebase'
import { Notifications } from "expo";

export interface UserIndexProps {

}

export interface UserIndexState {
  loading: boolean
}

var Router: any;

export default class euser extends LibComponent<UserIndexProps, UserIndexState> {
  static initState = {};

  static reducer(state: any, action: any): any {
    if (!state) state = euser.initState
    switch (action.type) {
      case "user_nav_change":
        return action.payload;
      default:
        return state
    }
  }

  static user_nav_change(state: any): void {
    App.getStore().dispatch({
      type: "user_nav_change",
      payload: state
    })
  }

  constructor(props: UserIndexProps) {
    super(props)
    this.state = {
      loading: true
    }
    this.onNavigationStateChange = this.onNavigationStateChange.bind(this)
    this.isClassComponent = this.isClassComponent.bind(this)
    this.isFunctionComponent = this.isFunctionComponent.bind(this)
    this.isReactComponent = this.isReactComponent.bind(this)
    this.setFonts = this.setFonts.bind(this)
  }

  onNavigationStateChange(prevState: any, currentState: any): void {
    euser.user_nav_change(currentState)
  }

  async componentDidMount(): Promise<void> {
    super.componentDidMount()
    LibTheme.getTheme()
    LibLocale.getLanguage()
    if (esp.config().notification == 1) {
      if (Platform.OS == 'android')
        Notifications.createChannelAndroidAsync('android', { sound: true, name: appjson.expo.name, badge: true, priority: 'max', vibrate: true })
      LibNotification.listen((notifObj: any) => {
        esp.log(notifObj);
      })
    }
    if (esp.config().hasOwnProperty('firebase')) {
      try {
        firebase.initializeApp(esp.config('firebase'));
        firebase.auth().signInAnonymously();
      } catch (error) {

      }
    }
    var push_id = await AsyncStorage.getItem("push_id");
    if (!push_id) {
      UserClass.pushToken();
    }
    var navigations: any = {}
    for (let i = 0; i < navs.length; i++) {
      const nav = navs[i];
      navigations[nav] = esp.mod(nav);
      // if (!this.isReactComponent(navigations[nav])) {
      //   delete navigations[nav]
      // }
    }
    UserClass.isLogin(async (isLogin) => {
      let econf = esp.config()
      const initRoute = isLogin ? econf.home.member : econf.home.public
      esp.log(initRoute);
      var config: any = {
        headerMode: "none",
        initialRouteName: String(initRoute)
      }
      Router = await createAppContainer(createStackNavigator(navigations, config))
      await this.setFonts()
      this.setState({ loading: false })
    })
  }


  isClassComponent(component: any): boolean {
    return (typeof component === "function" && !!component.prototype.isReactComponent) ? true : false
  }

  isFunctionComponent(component: any): boolean {
    return (typeof component === "function" && String(component).includes("return React.createElement")) ? true : false;
  }

  isReactComponent(component: any): boolean {
    return (this.isClassComponent(component) || this.isFunctionComponent(component)) ? true : false;
  }


  setFonts(): Promise<void> {
    let fonts: any = {
      "Roboto": require("../../assets/Roboto.ttf"),
      "Roboto_medium": require("../../assets/Roboto_medium.ttf"),
      "digital": require("../../assets/digital.ttf")
    }
    let fontsConfig = esp.config("fonts")
    if (fontsConfig) {
      Object.keys(esp.config("fonts")).forEach((key) => {
        fonts[key] = esp.assets('fonts/' + fontsConfig[key])
      })
    }
    return new Promise((r, j) => {
      Font.loadAsync(fonts).then(() => r())
    })
  }

  render(): any {
    if (this.state.loading) return null
    return (
      <View style={{ flex: 1, paddingBottom: LibStyle.isIphoneX ? 30 : 0 }}>
        <LibWorker />
        <Router ref={(r) => LibNavigation.setRef(r)} onNavigationStateChange={this.onNavigationStateChange} />
        <LibNet_status />
        <LibDialog style={'default'} />
        <LibImage />
        <LibProgress />
        <UserMain />
        <LibToast />
      </View>
    );
  }
}


