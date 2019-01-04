// 
import React from 'react'
import { Component } from 'react';
import { View, AsyncStorage, ScrollView, Image, Platform } from 'react-native';
import { BlurView } from 'expo';
import { esp, LibComponent } from 'esoftplay';
const Curl = esp.mod('lib/curl')
const { STATUSBAR_HEIGHT } = esp.mod('lib/style');
const Menu = esp.mod('lib/menu');

export interface ContentMenuProps {
  url: string,
  navigation?: any,
  closeDrawer: () => void,
  onItemSelected: (item: any) => void,
  style?: any,
  dispatch: any,
  nav: any
}

export interface ContentMenuState {
  menu: any[],
  selectedId: number
}

export default class emenu extends LibComponent<ContentMenuProps, ContentMenuState> {
  state: ContentMenuState;
  props: ContentMenuProps;
  constructor(props: ContentMenuProps) {
    super(props)
    this.props = props
    this.state = {
      menu: [],
      selectedId: 999999999
    }
  }

  saveMenu(menu: any): void {
    AsyncStorage.setItem('master_menu', JSON.stringify(menu))
  }

  loadMenu(callback: (menu: any) => void): void {
    AsyncStorage.getItem('master_menu').then((res) => {
      if (res) { callback(JSON.parse(res)) } else { callback(null) }
    })
  }

  setSelectedId(id: number): void {
    this.setState({ selectedId: id })
  }

  loadData(): void {
    this.loadMenu((res) => {
      if (res) {
        this.setState({ menu: res })
      }
      this.newData()
    })
  }

  componentDidMount(): void {
    super.componentDidMount()
    this.loadData()
  }

  newData(): void {
    new Curl(this.props.url, null,
      (res: any, msg: string) => {
        var trimMenu = []
        if (res.home) {
          var home = res.home
          home['id'] = 999999999
          home['par_id'] = 0
          trimMenu.push(home)
        }
        if (res.list && res && res.list && res.list[0]) {
          trimMenu.push(...res.list[0])
          this.setState({ menu: trimMenu })
          this.saveMenu(trimMenu)
        }
      },
      (msg: string) => {
        // configConsole(msg)
      }
    )
  }


  render(): any {
    const BGView = Platform.OS == 'ios' ? BlurView : View
    return (
      <BGView tint={'light'} intensity={99} style={[{ flex: 1, backgroundColor: 'rgba(255,255,255,0.99)' }, this.props.style]}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingTop: STATUSBAR_HEIGHT }}>
          <View style={{ backgroundColor: 'transparent', height: 100, padding: 20 }}>
            <Image source={esp.assets('logo.png')} style={{ height: 60, width: '100%', resizeMode: 'contain' }} />
          </View>
          <Menu
            onItemSelected={(e: any) => {
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