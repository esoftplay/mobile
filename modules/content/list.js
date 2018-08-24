import * as React from '../../../react';
import { View, StyleSheet, ActivityIndicator, TouchableWithoutFeedback, Image, Linking, BackHandler, Platform } from '../../../react-native/Libraries/react-native/react-native-implementation.js';
import { Container, Button, Text, Icon, Thumbnail, Drawer } from 'native-base';
import moment from 'moment/min/moment-with-locales'
import { RecyclerListView, DataProvider, LayoutProvider } from "recyclerlistview";
import esp from '../../index';
const { defaultStyle, colorPrimary, colorAccent, width } = esp.mod('lib/style');
const config = esp.config();
const utils = esp.mod('lib/utils');
const Curl = esp.mod('mod/curl');
const ContentMenu = esp.mod('content/menu');
const Esearch = esp.mod('content/search');

const ViewTypes = {
  HEADER: 0,
  ITEM: 1,
};

class Elist extends React.Component {
  constructor(props) {
    super(props);
    moment.locale('id')
    this.dataProvider = new DataProvider((r1, r2) => {
      return r1 !== r2;
    });
    this._layoutProvider = new LayoutProvider(
      index => {
        if (index === 0) {
          return ViewTypes.HEADER;
        } else {
          return ViewTypes.ITEM;
        }
      },
      (type, dim) => {
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
      url: props.url ? props.url : utils.getArgs(props, 'url', config.Elist),
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
  }

  componentWillMount = () => {
    this.loadData()
  }

  loadData() {
    this.doFetch()
  }

  loadMore() {
    this.doFetch(this.state.page + 1)
  }

  doFetch(page = 0) {
    Curl(this.state.url + '?page=' + page, null,
      (result, msg) => {
        this.setState({
          data: [...this.state.data, ...result.list],
          page: page,
          isStop: result.list.length === 0,
          isRefreshing: false
        })
      },
      (msg) => { }
    )
  }

  onRefresh() {
    this.setState({
      data: [],
      isStop: false,
      page: 0
    }, () => this.doFetch())
  }

  closeDrawer() { this.drawer._root.close() }

  openDrawer() { this.drawer._root.open() }


  componentDidMount = () => {
    setTimeout(() => {
      this.routeIndex = routeIndex
      if (this.routeIndex == 0)
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress)
    }, 500);
  }

  componentWillUnmount() {
    setTimeout(() => {
      this.routeIndex = routeIndex
      if (this.routeIndex == 0)
        BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    }, 500);
  }

  onBackPress = () => {
    configConsole('sini ', routeIndex)
    if (!this.state.isDrawerOpen) {
      if (Platform.OS == 'ios') {
        configConsole('ios ', routeIndex)
        return false;
      } else if (routeIndex == 0 && !this.state.searchView) {
        configConsole('terahir gan', routeIndex)
        BackHandler.exitApp()
      } else if (this.state.searchView) {
        this.setState({ searchView: false })
        configConsole('search ', routeIndex)
        return true
      } else {
        configConsole('goback ', routeIndex)
        this.props.navigation.goBack()
        return false
      }
    }
    configConsole('drawer ', routeIndex)
    this.closeDrawer()
    return true;
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.url != this.state.url) {
      this.onRefresh()
    }
  }

  openSearch() {
    this.setState({ searchView: true })
  }
  closeSearch() {
    this.setState({ searchView: false })
  }

  render() {
    const { goBack, navigate } = this.props.navigation
    return (
      <Drawer
        ref={(ref) => { this.drawer = ref; }}
        openDrawerOffset={0.2}
        disabled={routeIndex > 0}
        onOpen={() => this.setState({ isDrawerOpen: true })}
        onClose={() => this.setState({ isDrawerOpen: false })}
        content={
          <ContentMenu
            style={{ opacity: routeIndex > 0 ? 0 : 1 }}
            url={this.state.url + 'menu'}
            closeDrawer={() => this.closeDrawer()}
            onItemSelected={(e) => { this.setState({ url: e.url, title: e.title }) }}
            navigation={this.props.navigation}
            dispatch={this.props.dispatch}
            nav={this.props.nav} />
        }>
        <Container
          style={styles.container} >
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
              onPress={() => routeIndex == 0 ? this.openDrawer() : goBack()}>
              <Icon
                name={routeIndex == 0 ? 'md-menu' : 'arrow-back'}
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
              disabled={routeIndex > 0}
              style={{
                opacity: routeIndex == 0 ? 1 : 0,
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
                style={{ flex: 1 }}
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
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0 }} >
                <Esearch
                  close={() => this.closeSearch()}
                  defaultValue={this.searchQuery}
                  onSubmit={(e) => {
                    this.props.navigation.navigate('content', { url: this.state.urlori + 'search.htm?id=' + e, title: decodeURI(e) })
                    this.searchQuery = decodeURI(e)
                  }}
                />
              </View>
              : null
          }
        </Container>
      </Drawer>
    );
  }

  _rowRenderer(type, item) {
    switch (type) {
      case ViewTypes.HEADER:
        return (
          <Item
            {...item}
            index={0}
            open={this.open}
            close={this.close}
            navigation={this.props.navigation} />
        );
      case ViewTypes.ITEM:
        return (
          <Item
            {...item}
            index={1}
            open={this.open}
            close={this.close}
            navigation={this.props.navigation} />
        );
      default:
        return null;
    }
  }
}



class Item extends React.Component {

  constructor(props) {
    super(props);
    this.goToDetail = this.goToDetail.bind(this)
  }

  goToDetail() {
    this.props.navigation.navigate('content/detail', { url: this.props.url, image: this.props.image, id: this.props.id })
  }

  render = () => {
    const props = this.props
    const { id, title, intro, description, image, created, updated, url, publish, navigate } = props
    if (created == 'sponsor') {
      const goToSponsor = (url) => {
        Linking.openURL(url)
      }
      /* FULL BANNER */
      if (title === '') {
        return (
          <TouchableWithoutFeedback
            style={styles.overflow}
            onPress={() => goToSponsor(url)}>
            <View
              style={styles.containerRow}>
              <Thumbnail
                square
                style={{ width: width, height: 110 }}
                style={[styles.image, { width: width }]}
                source={{ uri: image }} />
            </View>
          </TouchableWithoutFeedback>
        )
      } else if (image === '') /* NO IMAGE */ {
        return (
          <TouchableWithoutFeedback
            style={styles.overflow}
            onPress={() => this.goToSponsor(url)}>
            <View
              style={styles.containerRow}>
              <View
                style={styles.wrapper}
                style={{ width: width, height: 110 }}>
                <Text
                  style={{ color: '#353535' }}
                  numberOfLines={2}
                  ellipsizeMode={'tail'}
                  bold>{title}</Text>
                <View
                  style={defaultStyle.container} >
                </View>
                <Text
                  style={styles.text11} note>{created}</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        )
      } else /* THUMBNAIL */ {
        return (
          <TouchableWithoutFeedback
            style={styles.overflow}
            onPress={() => this.goToSponsor(url)}>
            <View
              style={styles.containerRow}>
              <View
                style={styles.wrapper} >
                <Text
                  style={{ color: '#353535' }}
                  numberOfLines={2}
                  ellipsizeMode={'tail'}
                  bold>{title}</Text>
                <View
                  style={defaultStyle.container} >
                </View>
                <Text
                  style={styles.text11} note>{created}</Text>
              </View>
              <Thumbnail
                square
                style={styles.image}
                source={{ uri: image }} />
            </View>
          </TouchableWithoutFeedback>
        )
      }
    } else if (props.index === 0) {
      return (
        <TouchableWithoutFeedback
          style={styles.overflow}
          onPress={() => this.goToDetail()}>
          <View>
            <View>
              {
                image == '' ?
                  <View
                    style={{ height: width * 9 / 16, width: width }}>
                    <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 10, backgroundColor: 'rgba(3,3,3,0.4)', }} >
                      <Text
                        numberOfLines={2}
                        style={{ color: 'white' }} >{title}</Text>
                      <Text
                        style={[styles.text11, { color: 'white' }]} note>{moment(created).format('dddd, DD MMMM YYYY kk:mm')}</Text>
                    </View>
                  </View>
                  :
                  <Image
                    style={{ height: width * 9 / 16, width: width }}
                    source={{ uri: image }}>
                  </Image>
              }
            </View>
            <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 10, backgroundColor: 'rgba(3,3,3,0.4)', }} >
              <Text
                numberOfLines={2}
                style={{ color: 'white' }} >{title}</Text>
              <Text
                style={[styles.text11, { color: 'white' }]} note>{moment(created).format('dddd, DD MMMM YYYY kk:mm')}</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )
    }

    if (image == '') {
      return (
        <TouchableWithoutFeedback
          style={styles.overflow}
          onPress={() => this.goToDetail()}>
          <View
            style={styles.containerRow}>
            <View
              style={styles.wrapper} >
              <Text
                style={{ color: '#353535' }}
                numberOfLines={2}
                ellipsizeMode={'tail'}
                bold>{title}</Text>
              <View
                style={defaultStyle.container} >
              </View>
              <Text
                style={styles.text11} note>{created}</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )
    }

    return (
      <TouchableWithoutFeedback
        style={styles.overflow}
        onPress={() => this.goToDetail()}>
        <View
          style={styles.containerRow}>
          <View
            style={styles.wrapper} >
            <Text
              style={{ color: '#353535' }}
              numberOfLines={2}
              ellipsizeMode={'tail'}
              bold>{title}</Text>
            <View
              style={defaultStyle.container} >
            </View>
            <Text
              style={styles.text11} note>{moment(created).format('dddd, DD MMMM YYYY kk:mm')}</Text>
          </View>
          <View>
            <Thumbnail
              square
              style={styles.image}
              source={{ uri: image }} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
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

module.exports = Elist;
exports.Item = Item;