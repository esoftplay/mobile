import * as React from '../../../react'
import { AsyncStorage } from '../../../react-native/Libraries/react-native/react-native-implementation.js';

class Euser {
  static create(user) {
    AsyncStorage.setItem('user', JSON.stringify(user))
  }
  static load(callback) {
    AsyncStorage.getItem('user').then((user) => {      
        callback(JSON.parse(user))
    })
  }
  static delete() {
    AsyncStorage.removeItem('user');
  }

}
module.exports = Euser;