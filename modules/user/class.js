import * as React from '../../../react'
import { AsyncStorage } from '../../../react-native/Libraries/react-native/react-native-implementation.js';

class Eclass {
  static create(user) {
    AsyncStorage.setItem('user', JSON.stringify(user))
  }
  static load(callback) {
    AsyncStorage.getItem('user').then((user) => {
      if (user)
        callback(JSON.parse(user))
      else
        callback(null)
    })
  }
  static isLogin(callback) {
    Eclass.load((user) => {
      return callback(user != null)
    })
  }

  static delete() {
    AsyncStorage.removeItem('user');
  }

}
module.exports = Eclass;