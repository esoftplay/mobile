import React, { Component } from '../../../../react'
import { View, AsyncStorage, ScrollView, Image, Platform } from '../../../../react-native/Libraries/react-native/react-native-implementation.js';
import { configConsole } from '../../config';
import { BlurView } from '../../../../expo';
import esp from '../../index';
const Curl = esp.mod('lib/curl')
const NestedMenu = esp.mod('lib/nestedmenu');

export default class ContentMenu extends Component {

  constructor(props) {
    super(props)
    this.state = {
      menu: [],
      selectedId: 999999999
    }
  }

  saveMenu = (menu) => {
    AsyncStorage.setItem('master_menu', JSON.stringify(menu))
  }

  loadMenu = (callback) => {
    AsyncStorage.getItem('master_menu').then((res) => {
      if (res) { callback(JSON.parse(res)) } else { callback(null) }
    })
  }

  loadData() {
    this.loadMenu((res) => {
      if (res) {
        this.setState({ menu: res })
      }
      this.newData()
    })
  }

  componentWillMount() {
    this.loadData()
  }

  newData() {
    Curl(this.props.url, null,
      (res, msg) => {
        var trimMenu = []
        if (res.home) {
          var home = res.home
          home['id'] = 999999999
          home['par_id'] = 0
          trimMenu.push(home)
        }
        if (res.list) {
          trimMenu.push(...res.list[0])
          this.setState({ menu: trimMenu })
          this.saveMenu(trimMenu)
        }
      },
      (msg) => {
        configConsole(msg)
      }
    )
  }


  render() {
    const BGView = Platform.OS == 'ios' ? BlurView : View
    return (
      <BGView tint={'light'} intensity={90} style={[{ flex: 1, backgroundColor: 'rgba(255,255,255,0.9)' }, this.props.style]}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ backgroundColor: 'transparent', height: 100, padding: 20 }}>
            <Image source={require('../../images/logo.png')} style={{ height: 60, width: '100%', resizeMode: 'contain' }} />
          </View>
          <NestedMenu
            onItemSelected={(e) => {
              this.setState({ selectedId: e.id })
              if (this.props.onItemSelected) {
                this.props.onItemSelected(e)
                this.props.closeDrawer()
              }
            }}
            data={this.state.menu}
            selectedId={this.state.selectedId}
          />
        </ScrollView>
      </BGView>
    )
  }
}
