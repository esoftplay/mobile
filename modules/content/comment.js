//import liraries
import * as React from '../../../react'
import { View, StyleSheet, ActivityIndicator, TouchableWithoutFeedback, KeyboardAvoidingView, Platform } from '../../../react-native/Libraries/react-native/react-native-implementation.js';
import { Text, Button, Container, Icon, Item, Input, Thumbnail } from 'native-base';
import moment from 'moment/min/moment-with-locales'
const { colorPrimary, colorAccent, width, STATUSBAR_HEIGHT } = esp.mod('lib/style');
import Modal from 'react-native-modal';
import { RecyclerListView, LayoutProvider, DataProvider, ContextProvider } from 'recyclerlistview';
import esp from '../../index';
const config = esp.config();
const Curl = esp.mod('lib/curl');

class ContextHelper extends ContextProvider {
  constructor(uniqueKey) {
    super();
    this._contextStore = {};
    this._uniqueKey = uniqueKey;
  }

  getUniqueKey() {
    return this._uniqueKey;
  };

  save(key, value) {
    this._contextStore[key] = value;
  }

  get(key) {
    return this._contextStore[key];
  }

  remove(key) {
    delete this._contextStore[key];
  }
}

class Ecomment extends React.Component {
  constructor(props) {
    super(props)
    props = props.hasOwnProperty('id') || props.hasOwnProperty('url') ? props : props.navigation.state.params
    moment.locale('id')
    this.state = { url: props.hasOwnProperty('url') ? props.url : config.content + 'user/commentlist/' + props.id, url_post: props.hasOwnProperty('url_post') ? props.url_post : config.content + 'user/commentpost/' + props.id, user: props.user }
  }

  componentWillMount = async () => {
    if (!this.state.user) {
      var gsUser = { name: 'Munawar Kholil', email: 'pusakabangsa@mail.com', website: 'http://tm.me/mas_mun', image: 'https://lh3.googleusercontent.com/-0L93XMKTuJk/AAAAAAAAAAI/AAAAAAAAADc/KcgYPzATlTc/photo.jpg' }
      this.setState({ user: gsUser })
    }
  }

  render() {
    const { goBack } = this.props.navigation
    return (
      <KeyboardAvoidingView
        behavior='padding'
        keyboardVerticalOffset={20}
        style={styles.container} >
        <Container
          style={styles.container}>
          <View
            style={{ flexDirection: 'row', height: 50, paddingHorizontal: 5, alignItems: 'center', backgroundColor: colorPrimary }}>
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
              }}>
              Komentar
            </Text>
          </View>
          <CommentList
            style={{ flex: 1 }}
            url={this.state.url} url_post={this.state.url_post}
            user={this.state.user} par_id={0} />
        </Container>
      </KeyboardAvoidingView>
    )
  }
}

class CommentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      total: 0,
      isLoading: true,
      page: 0,
      isStop: false,
      isSend: false,
      url: props.url,
      url_post: props.url_post,
      user: props.user || 0,
      data: [],
      comment: ''
    };
    this.layoutProvider = new LayoutProvider(
      index => 0,
      (type, dim) => {
        switch (type) {
          default:
            dim.width = width;
            dim.height = 100;
        }
      }
    )
    this.contextProvider = new ContextHelper('parent')
    this.dataProvider = new DataProvider((a, b) => a !== b)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      user: nextProps.user,
      url_post: nextProps.url_post,
      url: nextProps.url
    })
  }


  postComment = () => {
    if (this.state.user !== 0) {
      if (this.state.comment != '') {
        this.setState({ isSend: true })
        var post = { ...this.state.user, content: this.state.comment }
        Curl(this.state.url_post, post,
          (res, msg) => {
            this.setState({
              page: 0,
              isSend: false,
              isStop: false,
              comment: ''
            }, () => {
              this.loadData()
              if (this.input1) this.input1._root.setNativeProps({ text: '' })
              if (this.input2) this.input2._root.setNativeProps({ text: '' })
            })
          },
          (msg) => {
            this.setState({
              page: 0,
              isSend: false,
              isStop: false,
              comment: ''
            }, () => {
              this.loadData()
              if (this.input1) this.input1._root.setNativeProps({ text: '' })
              if (this.input2) this.input2._root.setNativeProps({ text: '' })
            })
          }
        )
      }
    }
  }

  loadData = () => {
    this.setState({ isLoading: true })
    Curl(this.state.url + ((/\?/g).test(this.state.url) ? '&page=' : '?page=') + this.state.page, null,
      (res, msg) => {
        this.setState({
          total: res.total,
          isLoading: false,
          isStop: res.list.length == 0,
          data: this.state.page == 0 ? res.list : [...this.state.data, ...res.list]
        })
      },
      (msg) => { }
    )
  }

  componentDidMount = () => {
    this.loadData()
  }

  render() {
    var replyText = ''
    var replySend = 'Kirim'
    if (this.props.par_id != 0) {
      replyText = ' Balasan'
      replySend = 'Balas'
    }
    return (
      <View
        style={{ flex: 1, backgroundColor: 'white' }} >
        {
          (this.state.total == 0 && !this.state.isLoading && this.state.data.length == 0) ?
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} ><Text note >Belum ada{replyText} Komentar</Text></View>
            :
            <RecyclerListView
              style={{ flex: 1, width: width }}
              layoutProvider={this.layoutProvider}
              dataProvider={this.dataProvider.cloneWithRows(this.state.data)}
              forceNonDeterministicRendering={true}
              onEndReached={() => this.state.isStop ? {} : this.setState({ page: this.state.page + 1 }, () => this.loadData())}
              contextProvider={this.contextProvider}
              ListFooterComponent={this.state.isLoading ? <ActivityIndicator /> : null}
              keyExtractor={item => item.id}
              rowRenderer={(type, item) => {
                return <CommentItem {...item}
                  user={this.state.user}
                  url={this.state.url} url_post={this.state.url_post} />
              }}
            />
        }
        <View
          style={{
            borderRadius: 2,
            borderWidth: 0.5,
            borderColor: '#f9f9f9',
            backgroundColor: 'white',
            flexDirection: 'row',
            alignItems: 'center'
          }}>
          <Item
            style={{
              borderBottomColor: 'white',
              flex: 1,
              alignItems: 'center'
            }}>
            <Icon name={'md-chatbubbles'} style={{ color: '#999', marginLeft: 10 }} />
            <View style={{ borderRadius: 5, backgroundColor: '#f5f5f5', flex: 1, height: 40, marginVertical: 5, marginLeft: 5 }} >
              <Input
                ref={(e) => this.input2 = e}
                onSubmitEditing={() => this.postComment()}
                style={{ flex: 1 }}
                placeholder='Tulis komentar'
                returnKeyType={'send'}
                placeholderTextColor={'#999'}
                style={{ color: '#444', fontSize: 15, lineHeight: 20 }}
                onChangeText={(text) => this.setState({ comment: text })} />
            </View>
          </Item>
          <Button primary transparent small
            style={{ alignSelf: 'center' }}
            onPress={() => this.state.isSend ? {} : this.postComment()} >
            {
              this.state.isSend ?
                <View>
                  <Text style={{ color: colorPrimary, opacity: 0 }} >{replySend}</Text>
                  <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                    <ActivityIndicator color={colorPrimary} />
                  </View>
                </View>
                :
                <Text style={{ color: colorPrimary }} >{replySend}</Text>
            }
          </Button>
        </View>
      </View>
    )
  }
}

class CommentItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOpenChild: false };
  }

  render() {
    var { id, par_id, name, image, email, website, content, date, reply, url, url_post, user } = this.props
    url = url + ((/\?/g).test(url) ? '&par_id=' + id : '?par_id=' + id)
    url_post = url_post + ((/\?/g).test(url_post) ? '&par_id=' + id : '?par_id=' + id)

    return (
      <View
        style={[styles.bgComment, { paddingHorizontal: 17 }]}>
        <View
          style={{ flexDirection: 'row' }} >
          <Thumbnail small
            source={image != '' ? { uri: image } : null}
            style={{ marginRight: 10, marginTop: 5 }} />
          <View>
            <Text style={{ fontSize: 14 }} >{name}</Text>
            <Text style={{ fontSize: 11 }} note>{moment(date).format('LLLL')}</Text>
            <Text style={{ fontSize: 13, color: '#444' }} note
              style={styles.content}>{content}</Text>
            <View
              style={{ flexDirection: 'row', marginTop: 5 }} >
              <TouchableWithoutFeedback
                onPress={() => this.setState({ isOpenChild: true })} >
                <View
                  style={styles.rowCenter} >
                  <Icon
                    style={[styles.textPrimary13, { marginRight: 10 }]}
                    name='ios-chatbubbles-outline' />
                  <Text
                    style={styles.textPrimary13}>{reply} balasan</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
            <Modal
              visible={this.state.isOpenChild}
              animationType='slide'
              onBackButtonPress={() => this.setState({ isOpenChild: false })}
              onBackdropPress={() => this.setState({ isOpenChild: false })}
              style={{ justifyContent: 'flex-end', margin: 0 }}>
              <View style={{ marginTop: (Platform.OS == 'ios' ? STATUSBAR_HEIGHT : 0) + 50, backgroundColor: 'white', flex: 1 }} >
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', borderBottomWidth: 0.5, borderBottomColor: '#e1e1e1' }} >
                  <Text note style={{ flex: 1, padding: 10 }} >Balasan Komentar</Text>
                  <Button primary transparent small
                    style={{ alignSelf: 'center' }}
                    onPress={() => this.setState({ isOpenChild: false })} >
                    <Text style={{ color: colorPrimary }} >Tutup</Text>
                  </Button>
                </View>
                <View
                  style={{ flexDirection: 'row', backgroundColor: '#f5f5f5', padding: 17 }} >
                  <Thumbnail small
                    source={image != '' ? { uri: image } : null}
                    style={{ marginRight: 10, marginTop: 5 }} />
                  <View
                    style={{ flex: 1 }} >
                    <Text style={{ fontSize: 14 }} >{name}</Text>
                    <Text style={{ fontSize: 11 }} note>{moment(date).format('LLLL')}</Text>
                    <Text style={{ fontSize: 13, color: '#444' }} note style={styles.content}>{content}</Text>
                  </View>
                </View>
                <CommentList
                  url={url}
                  url_post={url_post}
                  user={user}
                  par_id={id} />
              </View>
            </Modal>
          </View>
        </View>
      </View>
    )
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  content: {
    marginTop: 10,
    color: '#333'
  },
  fullCenter: {
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  bgComment: {
    paddingVertical: 10,
    borderBottomColor: '#f5f5f5',
    borderBottomWidth: 0.5
  },
  textPrimary13: {
    fontSize: 13,
    color: colorPrimary
  },
  rowCenter: {
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center'
  }
})

//make this component available to the app
module.exports = Ecomment;