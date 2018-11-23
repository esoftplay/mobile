// 
import React from 'react'
import { AsyncStorage } from 'react-native';

export default class eclass {
  static create(user: any): Promise<any> {
    return new Promise((res, rej) => {
      AsyncStorage.setItem('user', JSON.stringify(user))
      res();
    })
  }
  static load(callback?: (user?: any) => void): Promise<any> {
    return new Promise((r, j) => {
      AsyncStorage.getItem('user').then((user: any) => {
        if (user) {
          r(JSON.parse(user))
          if (callback) callback(JSON.parse(user))
        } else {
          j()
          if (callback) callback(null)
        }
      })
    })
  }

  static isLogin(callback: (user?: any) => void): Promise<any> {
    return new Promise((r, j) => {
      eclass.load().then((user) => {
        r(user);
        if (callback) callback(user);
      }).catch((nouser) => {
        r(nouser);
        if (callback) callback(nouser);
      })
    })
  }

  static delete(): Promise<any> {
    return new Promise((res) => {
      AsyncStorage.removeItem('user');
      res()
    })
  }

}