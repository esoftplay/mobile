// 

import React from 'react';
import { Component } from 'react'
import moment from 'moment'
import navs from '../../cache/navigations';
import { AsyncStorage, View } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { store } from '../../../../App';
import { Constants } from 'expo';
import { esp, LibNotification, UserClass, LibCurl, LibCrypt } from 'esoftplay';

export interface UserIndexProps {

}

interface UserIndexState {
  loading: boolean
}

var Router: any;

export default class euser extends Component<UserIndexProps, UserIndexState> {
  static initState = {};

  static reducer = (state: any = euser.initState, action: any) => {
    switch (action.type) {
      case 'user_nav_change':
        return action.payload;
      default:
        return state
    }
  }

  static action = {
    user_nav_change(state: any) {
      store.dispatch({
        type: 'user_nav_change',
        payload: state
      })
    }
  }

  state = {
    loading: true
  }

  onNavigationStateChange(prevState: any, currentState: any): void {
    euser.action.user_nav_change(currentState)
  }

  async componentDidMount(): Promise<void> {
    if (esp.config().notification == 1) {
      LibNotification.listen((notifObj: any) => { })
    }
    var push_id = await AsyncStorage.getItem('push_id');
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
      var config = {
        headerMode: 'none',
        initialRouteName: isLogin ? esp.config("home", "member") : esp.config("home", "public"),
        navigationOptions: {
          header: null
        }
      }
      Router = await createAppContainer(createStackNavigator(navigations, config))
      this.setState({ loading: false })
    })
  }


  isClassComponent(component: any): boolean {
    return (typeof component === 'function' && !!component.prototype.isReactComponent) ? true : false
  }

  isFunctionComponent(component: any): boolean {
    return (typeof component === 'function' && String(component).includes('return React.createElement')) ? true : false;
  }

  isReactComponent(component: any): boolean {
    return (this.isClassComponent(component) || this.isFunctionComponent(component)) ? true : false;
  }

  render() {
    if (this.state.loading) return null
    return (
      <View style={{ flex: 1 }}>
        <Router onNavigationStateChange={this.onNavigationStateChange} />
      </View>
    );
  }
}
