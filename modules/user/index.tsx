// 

import React from "react";
import navs from "../../cache/navigations";
import { AsyncStorage, View } from "react-native";
import { createStackNavigator, createAppContainer, StackNavigatorConfig } from "react-navigation";
import { store } from "../../../../App";
import { Font } from "expo";
import { esp, LibNotification, UserClass, LibComponent, LibWorker, LibNet_status } from "esoftplay";

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
    store.dispatch({
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
    if (esp.config().notification == 1) {
      LibNotification.listen((notifObj: any) => { })
    }
    var push_id = await AsyncStorage.getItem("push_id");
    if (!push_id) {
      UserClass.pushToken();
    }
    var navigations: any = {}
    for (let i = 0; i < navs.length; i++) {
      const nav = navs[i];
      navigations[nav] = esp.mod(nav);
      if (!this.isReactComponent(navigations[nav])) {
        delete navigations[nav]
      }
    }
    UserClass.isLogin(async (isLogin) => {
      var config: StackNavigatorConfig = {
        headerMode: "none",
        initialRouteName: isLogin ? esp.config("home", "member") : esp.config("home", "public")
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
    return new Promise((r, j) => {
      Font.loadAsync({
        "Roboto": require("native-base/Fonts/Roboto.ttf"),
        "Roboto_medium": require("native-base/Fonts/Roboto_medium.ttf")
      }).then(() => r())
    })
  }

  render(): any {
    if (this.state.loading) return null
    return (
      <View style={{ flex: 1 }}>
        <LibWorker />
        <Router onNavigationStateChange={this.onNavigationStateChange} />
        <LibNet_status />
      </View>
    );
  }
}

