// 
import React from 'react'
import { AsyncStorage } from 'react-native';
import { store } from '../../../../App';
import { LibNotification, esp, UserClass, LibCrypt, LibCurl } from 'esoftplay';
import moment from 'moment';
import { Constants } from 'expo';



export default class eclass {

  static reducer(state: any, action: any): any {
    if (!state) state = null
    switch (action.type) {
      case 'user_class_create':
        return action.payload
        break;
      case 'user_class_delete':
        return null
        break;
      default:
        return state
    }
  }

  static create(user: any): Promise<void> {
    return new Promise((r, j) => {
      store.dispatch({ type: 'user_class_create', payload: user });
      AsyncStorage.setItem('user', JSON.stringify(user))
      r();
    })
  }

  static load(callback?: (user?: any | null) => void): Promise<any> {
    return new Promise((r, j) => {
      AsyncStorage.getItem('user').then((user: any) => {
        if (user) {
          r(JSON.parse(user));
          store.dispatch({ type: 'user_class_create', payload: JSON.parse(user) });
          if (callback) callback(JSON.parse(user))
        } else {
          j()
          if (callback) callback(null)
        }
      })
    })
  }

  static isLogin(callback: (user?: any | null) => void): Promise<any> {
    return new Promise((r, j) => {
      eclass.load().then((user) => {
        r(user);
        if (callback) callback(user);
      }).catch((nouser) => {
        r(null);
        if (callback) callback(null);
      })
    })
  }

  static delete(): Promise<any> {
    return new Promise((r) => {
      store.dispatch({ type: 'user_class_delete' });
      AsyncStorage.removeItem('user');
      r()
    })
  }

  static pushToken(): Promise<any> {
    return new Promise((resolve, reject) => {
      LibNotification.requestPermission(async (token) => {
        if (token) {
          const config = esp.config();
          var post: any = {
            user_id: 0,
            username: '',
            token: token,
            push_id: '',
            device: Constants.deviceName,
            secretkey: new LibCrypt().encode(config.salt + "|" + moment().format('YYYY-MM-DD hh:mm:ss'))
          }
          UserClass.load(async (user) => {
            if (user) {
              user['user_id'] = user.id
              Object.keys(user).forEach((userfield) => {
                Object.keys(post).forEach((postfield) => {
                  if (postfield == userfield && postfield != 'token' && postfield != 'secretkey' && postfield != 'push_id' && postfield != 'device') {
                    post[postfield] = user[userfield]
                  }
                })
              })
            }
            var push_id = await AsyncStorage.getItem('push_id');
            post['push_id'] = push_id
            new LibCurl(config.protocol + "://" + config.domain + config.uri + 'user/push-token', post,
              (res, msg) => {
                AsyncStorage.setItem('push_id', String(Number.isInteger(parseInt(res)) ? res : push_id));
                AsyncStorage.setItem('token', String(token))
                resolve(res)
              }, (msg) => {
                reject(msg)
              })
          })
        }
      })
    })
  }

}