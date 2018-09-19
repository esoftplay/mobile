import React, { Component } from '../../../react';
import moment from '../../../moment'
import navs from '../../cache/navigations';
import { AsyncStorage, View } from '../../../react-native/Libraries/react-native/react-native-implementation.js';
import { createStackNavigator } from '../../../react-navigation';
import { store } from '../../../../App';
import esp from 'esoftplay';
import { Constants } from '../../../expo';

class Euser extends Component {
  static initState = {}

  static reducer = (state = Euser.initState, action) => {
    switch (action.type) {
      case 'user_nav_change':
        return action.payload
        break;
      default:
        return state
    }
  }
  static action = {
    user_nav_change(state) {
      store.dispatch({
        type: 'user_nav_change',
        payload: state
      })
    }
  }

  state = {
    loading: true
  }

  Router = undefined

  isClassComponent(component) {
    return (typeof component === 'function' && !!component.prototype.isReactComponent) ? true : false
  }

  isFunctionComponent(component) {
    return (typeof component === 'function' && String(component).includes('return React.createElement')) ? true : false;
  }

  isReactComponent(component) {
    return (this.isClassComponent(component) || this.isFunctionComponent(component)) ? true : false;
  }

  onNavigationStateChange = (prevState, currentState) => {
    Euser.action.user_nav_change(currentState)
  }

  componentDidMount = async () => {
    if (esp.config().notification == 1) {
      const Enotification = esp.mod('lib/notification');
      Enotification.listen((notifObj) => {
        notif = notifObj;
      })
    }
    var token_id = await AsyncStorage.getItem('token_id');
    if (!token_id) {
      pushToken();
    }
    var navigations = {}
    for (let i = 0; i < navs.length; i++) {
      const nav = navs[i];
      navigations[nav] = esp.mod(nav);
      if (!this.isReactComponent(navigations[nav])) {
        delete navigations[nav]
      }
    }
    var config = {
      initialRouteName: esp.config("isLogin") ? esp.config("home", "member") : esp.config("home", "public"),
      navigationOptions: {
        header: null
      }
    }
    this.Router = await createStackNavigator(navigations, config)
    this.setState({ loading: false })
  }
  pushToken() {
    const notif = esp.mod('lib/notification');
    notif.requestPermission(async (tkn) => {
      if (tkn) {
        const crypt = esp.mod('lib/crypt');
        const config = esp.config();
        const user_id = await AsyncStorage.getItem('user_id');
        const username = await AsyncStorage.getItem('username');
        if (!user_id) {
          user_id = 0;
        }
        var post = {
          user_id: user_id,
          username: username,
          token: tkn,
          old_id: '',
          push_id: '',
          device: Constants.deviceName,
          secretkey: crypt.encode(config.salt + "|" + moment().format('YYYY-MM-DD hh:mm:ss'))
        }
        const token_id = await AsyncStorage.getItem('token_id');
        const token = await AsyncStorage.getItem('token');
        if (token_id) {
          if (token == tkn) {
            post.push_id = token_id
          } else {
            post.old_id = token_id
          }
        }
        AsyncStorage.setItem('token', tkn)
        const User = esp.mod('user/class');
        await User.load((user) => {
          if (user) {
            Object.keys(user).forEach((rw) => {
              Object.keys(post).forEach((ps) => {
                if (ps != 'token' || ps != 'secretkey' && ps == rw) {
                  post[ps] = member[rw]
                }
              })
            })
          }
          const Curl = esp.mod('lib/curl');
          new Curl(config.protocol + "://" + config.domain + config.uri + 'user/push-token', post,
            (res, msg) => {
              AsyncStorage.setItem('token_id', String(res))
            }, (msg) => {
              esp.log('error', msg);
            }, 1)
        })
      }
    })
  }

  render = () => {
    if (this.state.loading) return null
    return (
      <View style={{ flex: 1 }}>
        <this.Router onNavigationStateChange={this.onNavigationStateChange} />
      </View>
    );
  }
}
module.exports = Euser