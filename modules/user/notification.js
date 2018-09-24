import React, { Component } from '../../../react';
import { TouchableOpacity, View, Alert, Linking, StatusBar } from '../../../react-native/Libraries/react-native/react-native-implementation.js';
import esp from '../../../esoftplay';
import { store } from '../../../../App';
import { connect } from '../../../react-redux'
import moment from '../../../moment/min/moment-with-locales'
import update from 'immutability-helper'
import { Text, Button, Icon } from 'native-base';


class Enotification extends Component {

  static reducer = (state = { data: [] }, action) => {
    switch (action.type) {
      case 'user_notification_parseData':
        return {
          data: action.payload
        }
        break
      case 'user_notification_setRead':
        var data = state.data
        var itemData = data.filter((item) => item.id == action.payload)[0]
        var query = {
          [data.indexOf(itemData)]: {
            status: { $set: 2 }
          }
        }
        esp.log(itemData, data.indexOf(itemData), query);
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
      db.execute('SELECT notif_id FROM notification WHERE 1 ORDER BY notif_id DESC LIMIT 1', (res) => {
        if (res.rows.length > 0) {
          uri += '?last_id=' + res.rows._array[0].notif_id
        }
        esp.log(res);
        const crypt = esp.mod('lib/crypt');
        const salt = esp.config('salt');
        var post = {
          user_id: '',
          secretkey: crypt.encode(salt + '|' + moment().format('YYYY-MM-DD hh:mm:ss'))
        }
        const User = esp.mod('user/class');
        User.load((user) => {
          if (user) post['user_id'] = user.user_id
          Enotification.action.user_notification_fetchData(uri, post, db);
        })
      }, 1)
    },
    user_notification_fetchData(uri, post, db) {
      const Curl = esp.mod('lib/curl');
      new Curl(uri, post,
        (res, msg) => {
          var list = res.list
          list.map((row) => {
            db.insertOrUpdate(row)
          })
          if (res.next != '') {
            Enotification.action.user_notification_fetchData(res.next, post, db)
          }
          if (list.length > 0) {
            try { Enotification.action.user_notification_parseData() } catch (error) { }
          }
          esp.log(res)
        }, (msg) => {
          esp.log(msg)
        }, 1
      )
    },
    user_notification_parseData() {
      return store.dispatch((dispatch) => {
        const EdbNotif = esp.mod('db/notification');
        const db = new EdbNotif();
        db.getAll((res) => {
          dispatch({
            type: 'user_notification_parseData',
            payload: res
          })
        })
      })
    },
    user_notification_setRead(id) {
      return store.dispatch({
        type: 'user_notification_setRead',
        payload: id
      })
    }

  }

  static mapStateToProps = (state) => {
    return {
      data: state.user_notification.data
    }
  }

  componentDidMount() {
    moment.locale('id')
    Enotification.action.user_notification_loadData()
  }

  openNotif(data) {
    const Curl = esp.mod('lib/curl');
    const crypt = esp.mod('lib/crypt');
    const salt = esp.config('salt');
    new Curl('user/push-read', {
      notif_id: data.notif_id,
      secretkey: crypt.encode(salt + '|' + moment().format('YYYY-MM-DD hh:mm:ss'))
    }, (res, msg) => {
      esp.log(res)
      const EdbNotif = esp.mod('db/notification');
      const db = new EdbNotif();
      db.setRead(data.id)
      Enotification.action.user_notification_setRead(data.id)
    }, (msg) => {
      esp.log(msg)
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

  emptyView = ({ image, msg }) => {
    const { colorPrimary, colorAccent, elevation, width, STATUSBAR_HEIGHT } = esp.mod('lib/style');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
        <Typo colorPrimary />
      </View>
      )
    }
  
  
  render = () => {
    const {colorPrimary, colorAccent, elevation, width, STATUSBAR_HEIGHT } = esp.mod('lib/style');
        const Elist = esp.mod('lib/list');
    const {goBack} = this.props.navigation
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
            keyExtractor={(e, i) => (e.id).toString()}
            renderItem={(item, index) => (
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
    module.exports = connect(Enotification.mapStateToProps)(Enotification);
    