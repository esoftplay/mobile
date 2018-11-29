// 

import React from 'react';
import { Component } from 'react'
import moment from 'moment'
import navs from '../../cache/navigations';
import { AsyncStorage, View } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { store } from '../../../../App';
import { Constants } from 'expo';
import { esp } from 'esoftplay';
import _notification from '../lib/notification';
import _class from './class';
import _curl from '../lib/curl';
import crypt from '../lib/crypt';

export interface UserIndexProps {

}

interface UserIndexState {
  loading: boolean
}

var Router: any;

export default class euser extends Component<UserIndexProps, UserIndexState> {
  static initState = {}
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

  onNavigationStateChange = (prevState: any, currentState: any) => {
    euser.action.user_nav_change(currentState)
  }

  componentDidMount = async () => {
    if (esp.config().notification == 1) {
      _notification.listen((notifObj: any) => { })
    }
    var push_id = await AsyncStorage.getItem('push_id');
    if (!push_id) {
      euser.pushToken();
    }
    var navigations: any = {}
    for (let i = 0; i < navs.length; i++) {
      const nav = navs[i];
      navigations[nav] = esp.mod(nav);
      if (!this.isReactComponent(navigations[nav])) {
        delete navigations[nav]
      }
    }
    _class.isLogin(async (isLogin) => {
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


  isClassComponent(component: any) {
    return (typeof component === 'function' && !!component.prototype.isReactComponent) ? true : false
  }

  isFunctionComponent(component: any) {
    return (typeof component === 'function' && String(component).includes('return React.createElement')) ? true : false;
  }

  isReactComponent(component: any) {
    return (this.isClassComponent(component) || this.isFunctionComponent(component)) ? true : false;
  }


  static pushToken = (): Promise<any> => new Promise((resolve, reject) => {
    _notification.requestPermission(async (token) => {
      if (token) {
        const config = esp.config();
        var post: any = {
          user_id: 0,
          username: '',
          token: token,
          push_id: '',
          device: Constants.deviceName,
          secretkey: new crypt().encode(config.salt + "|" + moment().format('YYYY-MM-DD hh:mm:ss'))
        }
        _class.load(async (user) => {
          if (user) {
            user['user_id'] = user.id
            Object.keys(user).forEach((userfield) => {
              Object.keys(post).forEach((postfield) => {
                if (postfield == userfield) {
                  if (postfield != 'token') {
                    if (postfield != 'secretkey') {
                      if (postfield != 'push_id') {
                        if (postfield != 'device') {
                          post[postfield] = user[userfield]
                        }
                      }
                    }
                  }
                }
              })
            })
          }
          var push_id = await AsyncStorage.getItem('push_id');
          post['push_id'] = push_id
          new _curl(config.protocol + "://" + config.domain + config.uri + 'user/push-token', post,
            (res, msg) => {
              AsyncStorage.setItem('push_id', String(Number.isInteger(parseInt(res)) ? res : push_id));
              AsyncStorage.setItem('token', String(token))
              resolve(res)
            }, (msg) => {
              reject(msg)
            })
        })
      }
    })
  })

  render = () => {
    if (this.state.loading) return null
    return (
      <View style={{ flex: 1 }}>
        <Router onNavigationStateChange={this.onNavigationStateChange} />
      </View>
    );
  }
}
