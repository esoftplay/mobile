import React, { Component } from '../react';
import { AsyncStorage, View } from '../react-native/Libraries/react-native/react-native-implementation.js';
import { createStackNavigator } from '../react-navigation';
import assets from './cache/assets';
import navs from './cache/navigations';
import reducers from './cache/reducers';
import routers from './cache/routers';
import app from '../../app.json'
var routes = {}

class Container extends Component {
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
    routes = currentState
  }

  componentDidMount = async () => {
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

class esp {

  static assets(path) {
    return assets(path)
  }

  static config() {
    var out = esp._config();
    for (let i = 0; i < arguments.length; i++) {
      const key = arguments[i];
      if (out.hasOwnProperty(key)) {
        out = out[key];
      } else {
        out = {};
      }
    }
    return out;
  }

  static _config() {
    var msg = ''
    if (!app.hasOwnProperty('config')) {
      msg = "app.json tidak ada config"
    } else if (!app.config.hasOwnProperty('domain') || app.config.domain.length == 0) {
      msg = "app.json di config tidak ada domain"
    } else if (!app.config.hasOwnProperty('salt') || app.config.salt.length == 0) {
      msg = "app.json di config tidak ada salt"
    }
    if (msg != '') {
      let error = new Error(msg);
      throw error;
    }

    var config = app.config
    if (!config.hasOwnProperty('timezone') || config.timezone.length == 0) {
      config.timezone = 'Asia/Jakarta'
    }
    if (!config.hasOwnProperty('protocol') || config.protocol.length == 0) {
      config.protocol = 'http'
    }
    if (!config.hasOwnProperty('uri') || config.uri.length == 0) {
      config.uri = "/"
    }
    if (!config.hasOwnProperty('api') || config.api.length == 0) {
      config.api = "api"
    }
    if (!config.hasOwnProperty('data') || config.data.length == 0) {
      config.data = "data"
    }
    if (!config.hasOwnProperty('url') || config.url.length == 0) {
      config.url = config.protocol + "://" + config.api + "." + config.domain + config.uri
    }
    if (!config.hasOwnProperty('content') || config.content.length == 0) {
      config.content = config.protocol + "://" + config.data + "." + config.domain + config.uri
    }
    if (config.hasOwnProperty('home') && config.home.length != 0) {
      if (!config.home.hasOwnProperty('member') || config.home.member.length == 0) {
        config.home.member = "content/member"
      }
      if (!config.home.hasOwnProperty('public') || config.home.public.length == 0) {
        config.home.public = "content"
      }
    } else {
      config.home = {}
      config.home.member = "content/member"
      config.home.public = "content"
    }
    if (!config.hasOwnProperty('content')) {
      config.isLogin = 0;
    } else {
      config.isLogin = config.isLogin ? 1 : 0;
    }
    if (!config.hasOwnProperty("isDebug")) {
      config.isDebug = (process.env.NODE_ENV === 'development') ? 1 : 0;
    }

    config.webviewOpen = '<!DOCTYPE html> <html lang="en"> <head> <meta charset="utf-8" /> <meta name="viewport" content="width=device-width, initial-scale=1" /> <link href="' + config.content + 'user/editor_css" rel="stylesheet" /> <script type="text/javascript">var _ROOT="' + config.uri + '";var _URL="' + config.content + '";function _Bbc(a,b){var c="BS3load_func";if(!window[c+"i"]){window[c+"i"]=0};window[c+"i"]++;if(!b){b=c+"i"+window[c+"i"]};if(!window[c]){window[c]=b}else{window[c]+=","+b}window[b]=a;if(typeof BS3!="undefined"){window[b](BS3)}};</script> <style type="text/css">body {padding: 0 20px;}</style></head> <body>'
    config.webviewClose = '<script src="' + config.content + 'templates/admin/bootstrap/js/bootstrap.min.js"></script> </body> </html>'
    return config;
  }

  static mod(path) {
    var modtast = path.split("/");
    if (modtast[1] == "") {
      modtast[1] = "index";
    }
    return routers(modtast.join("/"));
  }

  static reducer() {
    return reducers
  }

  static navigations() {
    return navs
  }

  static home() {
    return Container
  }

  static log() {
    if (esp.config("isDebug") == 1) {
      console.log(JSON.stringify(arguments, null, 2));
    }
  }
  static routes() {
    return routes
  }
}
module.exports = esp

// var a = esp.assets("bacground")     // mengambil file dari folder images
// var b = esp.config("data", "name")  // mengambil value dari config (bisa ditentukan di app.json)
// var c = esp.mod("module/task")      // mengeksekusi module/task
// var d = esp.reducers()              // mengambil semua reducer
// var e = esp.home()                  // mengkesekusi module/task untuk halaman pertama
// var f = esp.log("pesan")            // log yang tampil jika di app.json -> isDebug == 1
// var g = esp.routes()                // mengambil history status navigasi yang sedang berjalan