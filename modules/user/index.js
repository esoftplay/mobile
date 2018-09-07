import React, { Component } from '../../../react';
import moment from '../../../moment'
import navs from '../../cache/navigations';
import { AsyncStorage, View } from '../../../react-native/Libraries/react-native/react-native-implementation.js';
import { createStackNavigator } from '../../../react-navigation';
import { store } from '../../../../App';
import esp from 'esoftplay';

class Econtainer extends Component {
  static initState = {}

  static reducer = (state = Econtainer.initState, action) => {
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
    Econtainer.action.user_nav_change(currentState)
  }

  componentDidMount = async () => {
    if (esp.config().notification == 1) {
      const Enotification = esp.mod('lib/notification');
      Enotification.listen((notifObj) => {
        notif = notifObj;
      })
      Enotification.requestPermission(async (tkn) => {
        if (tkn) {
          AsyncStorage.setItem('token', tkn)
          const crypt = esp.mod('lib/crypt');
          const config = esp.config();
          var post = {
            user_id: '',
            username: '',
            token: tkn,
            old_id: '',
            secretkey: crypt.encode(config.salt + "|" + moment().format('YYYY-MM-DD hh:mm:ss'))
          }
          const token_id = await AsyncStorage.getItem('token_id');
          if (token_id) {
            post.old_id = token_id
          }
          const memberClass = esp.mod('content/member');
          await memberClass.load((member) => {
            if (member) {
              Object.keys(member).forEach((rw) => {
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

  render = () => {
    if (this.state.loading) return null
    return (
      <View style={{ flex: 1 }}>
        <this.Router onNavigationStateChange={this.onNavigationStateChange} />
      </View>
    );
  }
}
module.exports = Econtainer