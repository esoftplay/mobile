import * as React from '../../../react'
import { View, WebView, AsyncStorage, ActivityIndicator } from '../../../react-native/Libraries/react-native/react-native-implementation.js';
import utils from './utils'
import esp from 'esoftplay';
const config = esp.config()
const { colorPrimary } = esp.mod('lib/style')

class EsocialLogin extends React.Component {


  setUser(params) {
    AsyncStorage.setItem(config.domain + '_user', params)
  }

  static async getUser(callback) {
    var user = await AsyncStorage.getItem(config.domain + '_user')
    if (user) {
      callback(JSON.parse(user))
    } else {
      callback(null)
    }
  }
  static delUser() {
    AsyncStorage.removeItem(config.domain + '_user')
  }

  render() {
    var { url, onResult } = this.props
    if (!url) {
      url = utils.getArgs(this.props, 'url')
    }
    return (
      <View style={{ flex: 1 }} >
        <WebView
          style={{ flex: 1 }}
          startInLoadingState={true}
          renderLoading={() => <View style={{flex:1, alignItems:'center', justifyContent:'center'}} ><ActivityIndicator color={colorPrimary} /></View>}
          thirdPartyCookiesEnabled={false}
          scalesPageToFit={true}
          startInLoadingState
          javaScriptEnabled={true}
          userAgent={"Mozilla/5.0 (X11; Linux i686; rv:10.0.1) Gecko/20100101 Firefox/10.0.1 SeaMonkey/2.7.1"}
          source={{ uri: url }}
          onMessage={(e) => {
            var data = e.nativeEvent.data
            this.setUser(data)
            if (onResult) onResult(JSON.parse(data))
          }}
        />
      </View>
    )
  }
}

module.exports = EsocialLogin;