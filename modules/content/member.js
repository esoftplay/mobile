import * as React from '../../../react'
import { AsyncStorage } from '../../../react-native/Libraries/react-native/react-native-implementation.js';

class Member {
  static create(member) {
    AsyncStorage.setItem('member', JSON.stringify(member))
  }
  static load(callback) {
    AsyncStorage.getItem('member').then((member) => {      
        callback(JSON.parse(member))
    })
  }
  static delete() {
    AsyncStorage.removeItem('member');
  }

}
module.exports = Member;