// 

import React from 'react';
import { Component } from 'react'
import { TouchableOpacity, View, Alert, Linking, StatusBar } from 'react-native';
import { esp } from 'esoftplay';
import { store } from '../../../../App';
import { connect } from 'react-redux'
import moment from 'moment/min/moment-with-locales'
import update from 'immutability-helper'
import { Text, Button, Icon } from 'native-base';

export interface UserNotificationProps {
  navigation: any,
  data: any[]
}

export interface UserNotificationState {

}


class Enotification extends Component<UserNotificationProps, UserNotificationState> {

  props: UserNotificationProps

  static reducer = (state = { data: [] }, action: any) => {
    switch (action.type) {
      case 'user_notification_parseData':
        return {
          data: action.payload
        }
      case 'user_notification_setRead':
        var data = state.data
        var itemData = data.filter((item: any) => item.id == action.payload)[0]
        var query = {
          [data.indexOf(itemData)]: {
            status: { $set: 2 }
          }
        }
        return {
          data: update(data, query)
        }
      default:
        return state
    }
  }

  static action = {
    user_notification_loadData() {
      var uri = 'user/push-notif'
      try { Enotification.action.user_notification_parseData() } catch (error) { }
      const EdbNotif = esp.mod('db/notification');
      const db = new EdbNotif();
      db.execute('SELECT notif_id FROM notification WHERE 1 ORDER BY notif_id DESC LIMIT 1', (res: any) => {
        if (res.rows.length > 0) {
          uri += '?last_id=' + res.rows._array[0].notif_id
        }
        // esp.log(res);
        const crypt = esp.mod('lib/crypt');
        const salt = esp.config('salt');
        var post = {
          user_id: '',
          secretkey: crypt.encode(salt + '|' + moment().format('YYYY-MM-DD hh:mm:ss'))
        }
        const User = esp.mod('user/class');
        User.load((user: any) => {
          if (user) post['user_id'] = user.id
          Enotification.action.user_notification_fetchData(uri, post, db);
        })
      })
    },
    user_notification_fetchData(uri: string, post: any, db: any) {
      const Curl = esp.mod('lib/curl');
      new Curl(uri, post,
        (res: any, msg: string) => {
          var list = res.list
          list.map((row: any) => {
            db.insertOrUpdate(row)
          })
          if (res.next != '') {
            Enotification.action.user_notification_fetchData(res.next, post, db)
          }
          if (list.length > 0) {
            try { Enotification.action.user_notification_parseData() } catch (error) { }
          }
          // esp.log(res)
        }, (msg: any) => {
          // esp.log(msg)
        }
      )
    },
    user_notification_parseData() {
      return store.dispatch((dispatch: any) => {
        const EdbNotif = esp.mod('db/notification');
        const db = new EdbNotif();
        db.getAll(undefined, undefined, undefined, undefined, undefined, undefined, (res: any) => {
          dispatch({
            type: 'user_notification_parseData',
            payload: res
          })
        })
      })
    },
    user_notification_setRead(id: string | number) {
      return store.dispatch({
        type: 'user_notification_setRead',
        payload: id
      })
    }

  }

  static mapStateToProps = (state: any) => {
    return {
      data: state.user_notification.data
    }
  }

  constructor(props: UserNotificationProps) {
    super(props)
    this.props = props
  }

  componentDidMount() {
    moment.locale('id')
    Enotification.action.user_notification_loadData()
  }

  openNotif(data: any) {
    const Curl = esp.mod('lib/curl');
    const crypt = esp.mod('lib/crypt');
    const salt = esp.config('salt');
    new Curl('user/push-read', {
      notif_id: data.notif_id,
      secretkey: crypt.encode(salt + '|' + moment().format('YYYY-MM-DD hh:mm:ss'))
    }, (res: any, msg: string) => {
      // esp.log(res)
      const EdbNotif = esp.mod('db/notification');
      const db = new EdbNotif();
      db.setRead(data.id)
      Enotification.action.user_notification_setRead(data.id)
    }, (msg: string) => {
      // esp.log(msg)
    }, 1)
    var param = JSON.parse(data.params)
    switch (param.action) {
      case 'alert':
        var hasLink = param.arguments.hasOwnProperty('url') && param.arguments.url != ''
        var btns = []
        if (hasLink) {
          btns.push({ text: 'OK', onPress: () => Linking.openURL(param.arguments.url) })
        } else {
          btns.push({ text: 'OK', onPress: () => { }, style: 'cancel' })
        }
        Alert.alert(
          data.title,
          data.message,
          btns,
          { cancelable: false }
        )
        break;
      case 'default':
        if (param.module != '') {
          if (!String(param.module).includes('/')) param.module = param.module + "/index"
          this.props.navigation.navigate(param.module, param.arguments)
        }
        break;
      default:
        break;
    }
  }

  // emptyView = ({ image, msg }) => {
  //   const { colorPrimary, colorAccent, elevation, width, STATUSBAR_HEIGHT } = esp.mod('lib/style');
  //   return (
  //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
  //       <Typo colorPrimary />
  //     </View>
  //   )
  // }


  render = () => {
    const { colorPrimary, colorAccent, elevation, width, STATUSBAR_HEIGHT } = esp.mod('lib/style');
    const Elist = esp.mod('lib/list');
    const { goBack } = this.props.navigation
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <StatusBar barStyle={'light-content'} />
        <View
          style={{ flexDirection: 'row', height: 50 + STATUSBAR_HEIGHT, paddingTop: STATUSBAR_HEIGHT, paddingHorizontal: 0, alignItems: 'center', backgroundColor: colorPrimary }}>
          <Button transparent
            style={{ width: 50, height: 50, alignItems: 'center', margin: 0 }}
            onPress={() => goBack()}>
            <Icon
              style={{ color: colorAccent }}
              name='arrow-back' />
          </Button>
          <Text
            style={{
              marginHorizontal: 10,
              fontSize: 18,
              textAlign: 'left',
              flex: 1,
              color: colorAccent
            }}>Notifikasi</Text>
        </View>
        <Elist
          data={this.props.data}
          keyExtractor={(e: any, i: number) => (e.id).toString()}
          renderItem={(item: any, index: number) => (
            <TouchableOpacity onPress={() => this.openNotif(item)} >
              <View style={[{ padding: 16, flexDirection: 'row', backgroundColor: 'white', marginBottom: 3, marginHorizontal: 0, width: width }, elevation(1.5)]} >
                <View style={{}} >
                  <Text style={{ color: item.status == 2 ? '#999' : colorPrimary, fontFamily: item.status == 2 ? 'Roboto' : 'Roboto_medium', marginBottom: 8 }} >{item.title}</Text>
                  <Text note ellipsizeMode="tail" numberOfLines={2} >{item.message}</Text>
                  <Text note style={{ fontSize: 9, marginTop: 5 }} >{moment(item.updated).fromNow()}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
}

export default connect(Enotification.mapStateToProps)(Enotification);