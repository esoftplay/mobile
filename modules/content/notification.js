import React, { Component } from '../../../react';
import { View, Alert, Linking, StatusBar } from '../../../react-native/Libraries/react-native/react-native-implementation.js';
const Elist = esp.mod('lib/list');
const { colorPrimary, colorAccent, elevation, STATUSBAR_HEIGHT } = esp.mod('lib/style');
const Curl = esp.mod('lib/curl');
import { Text, Button, Icon } from 'native-base';
const Member = esp.mod('content/member');
import moment from '../../../moment/min/moment-with-locales'
const utils = esp.mod('lib/utils');
import update from 'immutability-helper'
const crypt = esp.mod('lib/crypt');
const EdbNotif = esp.mod('db/notification');
const db = new EdbNotif();
const salt = esp.config('salt');
import esp from 'esoftplay';
import { TouchableOpacity } from 'react-native';

class Enotification extends Component {

  state = {
    data: []
  }

  fetchData(uri, post, db) {
    new Curl(uri, post,
      (res, msg) => {
        var list = res.list
        list.map((row) => {
          db.insertOrUpdate(row)
        })
        if (res.next != '') {
          this.fetchData(res.next, post, db)
        }
        if (list.length > 0) {
          this.loadData()
        }
        esp.log(res)
      }, (msg) => {
        esp.log(msg)
      }, 1
    )
  }

  loadData() {
    db.getAll((res) => {
      this.setState({ data: res });
    })
  }

  setRead(id) {
    var data = this.state.data
    var itemData = data.filter((item) => item.id == id)[0]
    var query = {
      [data.indexOf(itemData)]: {
        status: { $set: 2 }
      }
    }
    this.setState({ data: update(data, query) })
  }

  componentDidMount() {
    moment.locale('id')
    var uri = 'user/push-notif'
    this.loadData()
    db.execute('SELECT notif_id FROM notification WHERE 1 ORDER BY notif_id DESC LIMIT 1', (res) => {
      if (res.rows.length > 0) {
        uri += '?last_id=' + res.rows._array[0].notif_id
      }
      esp.log(res);
      var post = {
        user_id: '',
        secretkey: crypt.encode(salt + '|' + moment().format('YYYY-MM-DD hh:mm:ss'))
      }
      Member.load((member) => {
        if (member) post['user_id'] = member.user_id
        this.fetchData(uri, post, db);
      })
    }, 1)
  }

  openNotif(data) {
    new Curl('user/push-read', {
      notif_id: data.notif_id,
      secretkey: crypt.encode(salt + '|' + moment().format('YYYY-MM-DD hh:mm:ss'))
    }, (res, msg) => {
      esp.log(res)
      db.setRead(data.id)
      this.setRead(data.id)
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


  render = () => {
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
          data={this.state.data}
          keyExtractor={(e, i) => (e.id).toString()}
          renderItem={(item, index) => (
            <TouchableOpacity onPress={() => this.openNotif(item)} >
              <View style={[{ padding: 16, flexDirection: 'row', backgroundColor: 'white', marginBottom: 3, marginHorizontal: 0 }, elevation(1.5)]} >
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
module.exports = Enotification;