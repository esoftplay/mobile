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
    var push_id = await AsyncStorage.getItem('push_id');
    if (!push_id) {
      Euser.pushToken();
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
  
  static pushToken() {
    const notif = esp.mod('lib/notification');
    notif.requestPermission(async (token) => {
      if (token) {
        const crypt = esp.mod('lib/crypt');
        const config = esp.config();
        var post = {
          user_id: 0,
          username: '',
          token: token,
          push_id: '',
          device: Constants.deviceName,
          secretkey: crypt.encode(config.salt + "|" + moment().format('YYYY-MM-DD hh:mm:ss'))
        }
        post['push_id'] = await AsyncStorage.getItem('push_id');
        const User = esp.mod('user/class');
        await User.load((user) => {
          if (user) {
            Object.keys(user).forEach((userfield) => {
              Object.keys(post).forEach((postfield) => {
                if (userfield == "id") {
                  userfield = "user_id"
                }
                if ((postfield != 'token' || postfield != 'secretkey' || postfield != device) && postfield == userfield) {
                  post[postfield] = user[userfield]
                }
              })
            })
          }
          const Curl = esp.mod('lib/curl');
          new Curl(config.protocol + "://" + config.domain + config.uri + 'user/push-token', post,
            (res, msg) => {
              AsyncStorage.setItem('push_id', String(res))
              AsyncStorage.setItem('token', token)
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