import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import assets from './cache/assets';
import reducers from './cache/reducers';
import navs from './cache/navigations';
import routers from './cache/routers';
var app = require('../../app.json');
import { store } from '../../App';
var notif: any = undefined
var token: any = undefined

export default class esp {

  static assets(path: string) {
    return assets(path)
  }

  static config(param?: string, ...params: string[]): any {
    var out: any = esp._config();
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

  static _config(): string {
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
    if (!config.hasOwnProperty('api') || config.api.length == 0) {
      config.api = "api"
    }
    if (!config.hasOwnProperty('comment_login')) {
      config.comment_login = 1;
    }
    if (!config.hasOwnProperty('notification')) {
      config.notification = 0;
    }
    if (!config.hasOwnProperty("isDebug")) {
      config.isDebug = (process.env.NODE_ENV === 'development') ? 1 : 0;
    }

    config.webviewOpen = '<!DOCTYPE html> <html lang="en"> <head> <meta charset="utf-8" /> <meta name="viewport" content="width=device-width, initial-scale=1" /> <link href="' + config.content + 'user/editor_css" rel="stylesheet" /> <script type="text/javascript">var _ROOT="' + config.uri + '";var _URL="' + config.content + '";function _Bbc(a,b){var c="BS3load_func";if(!window[c+"i"]){window[c+"i"]=0};window[c+"i"]++;if(!b){b=c+"i"+window[c+"i"]};if(!window[c]){window[c]=b}else{window[c]+=","+b}window[b]=a;if(typeof BS3!="undefined"){window[b](BS3)}};</script> <style type="text/css">body {padding: 0 20px;}</style></head> <body>'
    config.webviewClose = '<script src="' + config.content + 'templates/admin/bootstrap/js/bootstrap.min.js"></script> </body> </html>'
    return config;
  }

  static mod(path: string) {
    var modtast = path.split("/");
    if (modtast[1] == "") {
      modtast[1] = "index";
    }
    return routers(modtast.join("/"));
  }

  static reducer(): any {
    return reducers
  }

  static navigations(): [] {
    return navs
  }

  static home() {
    return esp.mod('user/index');
  }

  static log(message?: any, ...optionalParams: any[]) {
    if (esp.config("isDebug") == 1) {
      console.log(message, optionalParams);
    }
  }

  static routes() {
    return store.getState().user_index
  }

  static getTokenAsync(callback: (token: string) => void) {
    if (esp.config('notification') == 1) {
      if (token) {
        callback(token)
      } else {
        AsyncStorage.getItem('token').then((token: any) => {
          if (token)
            callback(token)
        })
      }
    } else {
      return null
    }
  }

  static notif(): any {
    return notif
  }
}

// var a = esp.assets("bacground")     // mengambil file dari folder images
// var b = esp.config("data", "name")  // mengambil value dari config (bisa ditentukan di app.json)
// var c = esp.mod("module/task")      // mengeksekusi module/task
// var d = esp.reducers()              // mengambil semua reducer
// var e = esp.home()                  // mengkesekusi module/task untuk halaman pertama
// var f = esp.log("pesan")            // log yang tampil jika di app.json -> isDebug == 1
// var g = esp.routes()                // mengambil history status navigasi yang sedang berjalan