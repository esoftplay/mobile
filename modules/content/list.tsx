// 
import React from 'react';
import { Component } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableWithoutFeedback, Image, Linking, BackHandler, Platform } from 'react-native';
import { Container, Button, Text, Icon, Thumbnail } from 'native-base';
import Drawer from 'react-native-drawer';
import moment from 'moment/min/moment-with-locales'
import { RecyclerListView, DataProvider, LayoutProvider } from "recyclerlistview";
import { esp, LibCurl } from 'esoftplay';
import { StatusBar, AsyncStorage, Animated } from 'react-native';
const { defaultStyle, colorPrimary, colorAccent, width, STATUSBAR_HEIGHT } = esp.mod('lib/style');
const config = esp.config();
const utils = esp.mod('lib/utils');
const ContentMenu = esp.mod('content/menu');
const Esearch = esp.mod('content/search');
const Eimage = esp.mod('lib/image');
const Item = esp.mod('content/item');

var menu: any;

const AnimEsearch = Animated.createAnimatedComponent(Esearch)

const ViewTypes = {
  HEADER: 0,
  ITEM: 1,
};


export interface ContentListProps {
  url?: string,
  title?: string,
  dispatch?: any,
  navigation: any
}
export interface ContentListState {
  animSearch: any,
  url: string,
  urlori: string,
  title: string,
  titleori: string,
  data: any[],
  page: number,
  isDrawerOpen: boolean,
  searchView: boolean,
  isRefreshing: boolean,
  isStop: boolean,
}


export default class elist extends Component<ContentListProps, ContentListState>{
  dataProvider: any;
  _layoutProvider: any;
  drawer: any;
  searchQuery: string = '';
  ContentMenu: any;
  state: any;
  props: any;

  constructor(props: ContentListProps) {
    super(props);
    moment.locale('id')
    this.dataProvider = new DataProvider((r1: any, r2: any) => { return r1 !== r2; });
    this._layoutProvider = new LayoutProvider(
      (index: number) => {
        if (index === 0) {
          return ViewTypes.HEADER;
        } else {
          return ViewTypes.ITEM;
        }
      },
      (type: number, dim: any) => {
        switch (type) {
          case ViewTypes.HEADER:
            dim.width = width
            dim.height = width * 9 / 16
            break;
          case ViewTypes.ITEM:
            dim.width = width;
            dim.height = 110;
            break;
          default:
            dim.width = 0;
            dim.height = 0;
        }
      }
    );
    this._rowRenderer = this._rowRenderer.bind(this);
    this.state = {
      animSearch: new Animated.Value(0),
      url: props.url ? props.url : utils.getArgs(props, 'url', config.content),
      urlori: props.url ? props.url : utils.getArgs(props, 'url', config.content),
      title: props.title ? props.title : utils.getArgs(props, 'title', 'Home'),
      titleori: props.title ? props.title : utils.getArgs(props, 'title', 'Home'),
      data: [],
      page: 0,
      searchView: false,
      isRefreshing: false,
      isStop: false,
    }
    this.doFetch = this.doFetch.bind(this)
    this.loadData = this.loadData.bind(this)
    this.loadMore = this.loadMore.bind(this)
    this.openDrawer = this.openDrawer.bind(this)
    this.closeDrawer = this.closeDrawer.bind(this)
    this.onBackPress = this.onBackPress.bind(this)
  }

  loadData() {
    this.doFetch()
  }

  loadMore() {
    this.doFetch(this.state.page + 1)
  }

  doFetch(page: number = 0) {
    new LibCurl(this.state.url + '?page=' + page, null,
      (result: any, msg: string) => {
        this.setState({
          data: [...this.state.data, ...result.list],
          page: page,
          isStop: result.list.length === 0,
          isRefreshing: false
        })
      },
      (msg: string) => {
        console.log('sampe sini')
      }, 1
    )
  }

  onRefresh() {
    this.setState({
      data: [],
      isStop: false,
      page: 0
    }, () => this.doFetch())
  }

  closeDrawer() { this.drawer.close() }

  openDrawer() { this.drawer.open() }


  componentDidMount = async () => {
    this.loadData();
    setTimeout(() => {
      BackHandler.addEventListener('hardwareBackPress', this.onBackPress)
      this.ContentMenu.loadMenu((m: any) => {
        menu = m
      })
    }, 500);
  }

  componentWillUnmount() {
    setTimeout(() => {
      BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    }, 500);
  }

  onBackPress = () => {
    var routers = esp.routes()
    if (!this.state.isDrawerOpen) {
      if (Platform.OS == 'ios') {
        return false;
      } else if (!this.state.searchView && !routers.index || routers.index == 0) {
        esp.log('url', this.state.url, this.state.urlori);
        try {
          if (this.state.url != this.state.urlori) {
            this.setState({ url: this.state.urlori, title: menu[0].title })
            this.ContentMenu.setSelectedId(menu[0].id)
            return true
          } else {
            BackHandler.exitApp()
          }
        } catch (e) {
          BackHandler.exitApp()
        }
      } else if (this.state.searchView) {
        this.setState({ searchView: false })
        return true
      } else {
        this.props.navigation.goBack(null);
        return true
      }
    }
    this.closeDrawer()
    return true;
  };

  componentDidUpdate(prevProps: ContentListProps, prevState: ContentListState) {
    if (prevState.url != this.state.url) {
      this.onRefresh()
    }
  }

  openSearch() {
    this.setState({ searchView: true }, () => {
      Animated.timing(this.state.animSearch, {
        toValue: 1,
        duration: 300
      }).start()
    })
  }

  closeSearch() {
    Animated.timing(this.state.animSearch, {
      toValue: 0,
      duration: 300
    }).start(() => {
      this.setState({ searchView: false })
    })
  }

  render() {
    const { goBack, navigate } = this.props.navigation
    var indexRoutes = esp.routes().index
    var isRoot = indexRoutes == 0 || !indexRoutes
    var searchOpacity = this.state.animSearch.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: 'clamp'
    })
    return (
      <Drawer
        ref={(ref: any) => { this.drawer = ref; }}
        openDrawerOffset={0.2}
        onOpen={() => this.setState({ isDrawerOpen: true })}
        onClose={() => this.setState({ isDrawerOpen: false })}
        tapToClose={true}
        disabled={!isRoot}
        type={'overlay'}
        tweenHandler={(ratio: number) => ({
          main: {
            opacity: 1,
          },
          mainOverlay: {
            opacity: ratio / 2,
            backgroundColor: 'black',
          },
        })}
        content={
          <ContentMenu
            ref={(e: any) => this.ContentMenu = e}
            url={this.state.url + 'menu'}
            closeDrawer={() => this.closeDrawer()}
            onItemSelected={(e: any) => { this.setState({ url: e.url, title: e.title }) }}
            navigation={this.props.navigation}
            dispatch={this.props.dispatch}
            nav={esp.routes()} />
        }>
        <Container>
          <View
            style={styles.statusBar}>
            <StatusBar translucent
              barStyle='light-content' />
          </View>
          <View style={{
            backgroundColor: colorPrimary,
            height: 50,
            alignItems: 'center',
            flexDirection: 'row'
          }} >
            <Button
              transparent={true}
              style={{
                height: 50,
                width: 50,
              }}
              onPress={() => isRoot ? this.openDrawer() : goBack()}>
              <Icon
                name={isRoot ? 'md-menu' : 'md-arrow-back'}
                style={{
                  fontSize: 24,
                  color: colorAccent
                }} />
            </Button>
            <Text
              style={{
                marginHorizontal: 10,
                fontSize: 18,
                flex: 1,
                color: colorAccent
              }}>
              {this.state.title}
            </Text>
            <Button
              transparent={true}
              style={{
                height: 50,
                width: 50,
              }}
              onPress={() => { this.openSearch() }}>
              <Icon
                name='search'
                style={{
                  fontSize: 24,
                  color: colorAccent
                }} />
            </Button>
          </View>
          {
            this.state.data.length > 0 ?
              <RecyclerListView
                layoutProvider={this._layoutProvider}
                onEndReached={() => this.loadMore()}
                renderFooter={() => {
                  return this.state.isStop ? null :
                    <ActivityIndicator
                      color={colorPrimary}
                      style={{ padding: 20, alignSelf: 'center' }} />
                }}
                dataProvider={this.dataProvider.cloneWithRows(this.state.data)}
                rowRenderer={this._rowRenderer} />
              : this.state.data.length == 0 && this.state.isStop ?
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} ><Text note >Berita masih kosong</Text></View>
                :
                <ActivityIndicator
                  color={colorPrimary}
                  style={{ padding: 20, alignSelf: 'center' }} />
          }
          {
            this.state.searchView ?
              <Animated.View style={{ position: 'absolute', top: STATUSBAR_HEIGHT, left: 0, right: 0, opacity: searchOpacity }} >
                <AnimEsearch
                  close={() => this.closeSearch()}
                  defaultValue={this.searchQuery}
                  onSubmit={(e: any) => {
                    this.props.navigation.push('content/list', { url: this.state.urlori + 'search.htm?id=' + e, title: decodeURI(e) })
                    this.searchQuery = decodeURI(e)
                  }}
                />
              </Animated.View>
              : null
          }
        </Container>
      </Drawer>
    );
  }

  _rowRenderer(type: number, item: any) {
    switch (type) {
      case ViewTypes.HEADER:
        return (
          <Item
            {...item}
            index={0}
            navigation={this.props.navigation} />
        );
      case ViewTypes.ITEM:
        return (
          <Item
            {...item}
            index={1}
            navigation={this.props.navigation} />
        );
      default:
        return null;
    }
  }
}


const styles = StyleSheet.create({
  ...defaultStyle,
  overflow: {
    margin: 5,
    overflow: 'hidden',
  },
  containerRow: {
    marginBottom: 0.5,
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'row'
  },
  text11: {
    fontSize: 11
  },
  image: {
    width: 110,
    height: 110,
    resizeMode: 'cover'
  },
  wrapper: {
    flex: 1,
    padding: 10,
    margin: 10
  }
});
