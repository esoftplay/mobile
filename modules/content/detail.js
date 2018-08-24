//import liraries
import * as React from '../../../react';
import { View, StyleSheet, Animated, ScrollView, Image, TouchableWithoutFeedback, Linking } from '../../../react-native/Libraries/react-native/react-native-implementation.js';
import { Left, Button, Icon, Text, ListItem } from 'native-base';
import { LinearGradient } from '../../../expo';
import moment from 'moment/min/moment-with-locales'

import esp from '../../index';
const { colorPrimary, width, colorPrimaryDark } = esp.mod('lib/style');
const { Item } = esp.mod('content/list');
const utils = esp.mod('lib/utils');
const config = esp.config();
const Curl = esp.mod('lib/curl');
const Eaudio = esp.mod('content/audio');
const EwebView = esp.mod('lib/webview');
const Evideo = esp.mod('content/video');

var HEADER_MAX_HEIGHT = width * 8 / 10;
var HEADER_MIN_HEIGHT = 50;
var HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const download = (result) => {
  Linking.openURL(result.link)
}

class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0),
      toolbarHeight: HEADER_MIN_HEIGHT,
      result: '',
      images_page: 1,
      isPlayingAudio: false,
      showModal: false,
      view: undefined,
      isPageReady: false
    };
    this.onScrollEnd = this.onScrollEnd.bind(this)
    moment.locale('id')
  }

  componentDidMount = () => {
    var url = this.props.url ? this.props.url : utils.getArgs(this.props, 'url', config.content)
    Curl(url, null,
      (result, msg) => {
        setTimeout(() => {
          this.setState({ result: result })
        }, 500)
      },
      (msg) => { }
    )
  }


  onScrollEnd(e) {
    let contentOffset = e.nativeEvent.contentOffset;
    let viewSize = e.nativeEvent.layoutMeasurement;
    this.setState({ images_page: Math.floor(contentOffset.x / viewSize.width) + 1 })
  }

  render() {
    var result = this.state.result
    var id = utils.getArgs(this.props, 'id', 0)
    if (result.image == '') {
      HEADER_MAX_HEIGHT = HEADER_MIN_HEIGHT
    }

    if (result.length == 0) {
      return <View style={{ flex: 1, backgroundColor: 'white' }} >
        <View style={{ width: width, height: width * 0.8 }} >
          <Animated.Image
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              width: width,
              height: width * 4 / 5
            }}
            source={{ uri: utils.getArgs(this.props, 'image', '') }}
          />
        </View>
      </View>
    }

    var isDownload = result.link != '' && result.type === 'download'
    var isAudio = result.code != '' && result.type === 'audio'
    var isVideo = result.code != '' && result.type === 'video'

    HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - this.state.toolbarHeight;

    var images = []
    if (result.images.length === 0) { images.push({ image: result.image }) } else { images = result.images }

    const headerTranslate = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, -HEADER_SCROLL_DISTANCE],
      extrapolate: 'clamp',
    });

    const imageOpacity = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 1, 0],
      extrapolate: 'clamp',
    });

    const imageTranslate = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 100],
      extrapolate: 'clamp',
    });

    const titleOpacity = this.state.scrollY.interpolate({
      inputRange: [HEADER_SCROLL_DISTANCE - 1, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    const titleScale = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 1, 1],
      extrapolate: 'clamp',
    });

    return (
      <View
        style={styles.fill}>
        {
          isAudio ?
            <Eaudio
              code={result.code}
              onStatusChange={(isPlaying) => { this.setState({ isPlayingAudio: isPlaying }) }}
              onRef={(ref) => this.audioPlayer = ref} /> : null
        }
        <Animated.ScrollView
          style={styles.fill}
          scrollEventThrottle={1}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
            { useNativeDriver: true },
          )}>

          <View
            style={{ marginTop: HEADER_MAX_HEIGHT - 30 }}>
            <View
              style={
                styles.scrollViewContent}>
              <Text
                style={styles.title}>
                {result.title}
              </Text>
              <Text
                note
                style={styles.created}>
                {moment(result.created).format('dddd, DD MMMM YYYY kk:mm')}
              </Text>
              <EwebView
                source={{ html: config.webviewOpen + result.content + config.webviewClose }}
                style={{ flex: 1, marginVertical: 20 }}
                width={width}
                onFinishLoad={() => { this.setState({ isPageReady: true }) }}
              />
              {
                this.state.isPageReady ?
                  <View>
                    {
                      result.comment == 1 ?
                        <Button
                          small
                          style={{ alignSelf: 'center', backgroundColor: colorPrimary }}
                          onPress={() => this.props.navigation.navigate('content/comment', { id: result.id })} >
                          <Text>Komentar</Text>
                        </Button>
                        : null
                    }
                    <ScrollView bounces={false}
                      showsHorizontalScrollIndicator={false}
                      horizontal
                      contentContainerStyle={styles.isPageReady} >
                      {
                        result.cats.map((cat, i) => {
                          return (
                            <Button
                              key={cat + i}
                              style={{ margin: 5 }} success small bordered
                              onPress={() => this.props.navigation.navigate('content', { url: cat.url, title: cat.title })} >
                              <Text style={{ color: 'lightgreen' }} >{cat.title}</Text>
                            </Button>
                          )
                        })
                      }
                    </ScrollView>
                    <View>
                      {
                        (result.related.length > 0) ?
                          <ListItem itemDivider first>
                            <Text>Related Content</Text>
                          </ListItem>
                          : null
                      }
                      {
                        result.related.map((rel, i) => {
                          return (
                            <Item
                              key={rel + i}
                              {...rel}
                              navigation={this.props.navigation} />
                          )
                        })
                      }
                    </View>
                  </View>
                  : null
              }
            </View>
          </View>
        </Animated.ScrollView>
        <Animated.View
          style={[
            styles.header, isVideo ? null : { transform: [{ translateY: headerTranslate }] },
          ]}>
          {
            (isVideo) ?
              <Evideo code={result.code} style={styles.video} />
              :
              <Animated.ScrollView
                horizontal
                onMomentumScrollEnd={this.onScrollEnd}
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                style={[
                  styles.foregroundHeader,
                  { opacity: imageOpacity, transform: [{ translateY: imageTranslate }], },
                ]}>
                {
                  images.map((image, i) => {
                    return <TouchableWithoutFeedback
                      key={image + i}
                      style={{ flex: 1, width: width, height: HEADER_MAX_HEIGHT }}
                      onPress={() => this.props.navigation.navigate('content/zoom', { images: images, position: this.state.images_page - 1 })} >
                      <View>
                        <Image
                          style={styles.backgroundImage}
                          source={{ uri: image.image }}
                        />
                        <LinearGradient
                          style={{ height: width / 4, position: 'absolute', bottom: 0, left: 0, right: 0 }}
                          locations={[0.01, 0.99]}
                          colors={['rgba(255,255,255,0.0)', 'rgba(255,255,255,1)']} />
                      </View>
                    </TouchableWithoutFeedback>
                  })
                }
              </Animated.ScrollView>
          }
          {
            (images.length > 1) ?
              <Animated.Text
                style={[styles.absIndicator, { opacity: imageOpacity, }]} >{this.state.images_page}/{images.length}</Animated.Text> : null
          }
        </Animated.View>
        <Animated.View
          style={[
            styles.bar,
            { height: this.state.toolbarHeight, opacity: isVideo ? 0 : titleOpacity, },
          ]}>
          <Left>
            <Text
              numberOfLines={1}
              ellipsizeMode={'tail'}
              onLayout={(event) => {
                var { x, y, width, height } = event.nativeEvent.layout;
                this.setState({ toolbarHeight: HEADER_MIN_HEIGHT > height ? HEADER_MIN_HEIGHT : /*height*/ HEADER_MIN_HEIGHT })
              }} style={styles.toolbarTitle} >{result.title}</Text>
          </Left>
        </Animated.View>
        <Button transparent
          style={styles.backButton}
          onPress={() => this.props.navigation.goBack()}>
          <Icon
            style={{ color: 'white' }}
            name='arrow-back' />
        </Button>
        {
          isAudio || isDownload ?
            <Animated.View
              style={[styles.fab, { opacity: imageOpacity, transform: [{ translateY: headerTranslate }] }]}>
              <TouchableWithoutFeedback
                style={styles.fab}
                onPress={isAudio ? () => this.audioPlayer._onPlayPausePressed() : () => download(result)}>
                <Icon
                  name={isAudio ? (this.state.isPlayingAudio ? 'md-pause' : 'md-play') : 'md-download'}
                  style={{ color: 'white', fontSize: 25 }} />
              </TouchableWithoutFeedback>
            </Animated.View>
            : null

        }
      </View>
    );
  }
}



const styles = StyleSheet.create({
  fill: {
    flex: 1,
    backgroundColor: 'white'
  },
  imageSquare: {
    margin: 3,
    borderRadius: 5,
    width: (width / 3) - 2,
    height: (width / 3) - 2,
    resizeMode: 'cover',
  },
  content: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignSelf: 'center',
    justifyContent: 'center',
    height: HEADER_MIN_HEIGHT
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colorPrimaryDark,

    // opacity: 0.5,
    overflow: 'hidden',
    height: HEADER_MAX_HEIGHT,

  },
  toolbarTitle: {
    color: 'white',
    fontSize: 17.5,
    fontWeight: 'bold'
  },
  fab: {
    flex: 1,
    paddingVertical: 2,
    paddingHorizontal: 10,
  },
  foregroundHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: null,
    height: HEADER_MAX_HEIGHT,
  },
  isPageReady: {
    padding: 10,
    alignItems: 'center'
  },
  backgroundImage: {
    width: width,
    flex: 1,
    height: HEADER_MAX_HEIGHT,
    resizeMode: 'cover',
  },
  bar: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    flexDirection: 'row',
    top: 0,
    padding: 10,
    paddingRight: HEADER_MIN_HEIGHT + 10,
    marginLeft: HEADER_MIN_HEIGHT,
    left: 0,
    right: 0,
  },
  title: {
    marginTop: 25,
    fontSize: 23,
    marginLeft: 17,
    marginRight: 17,
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#353535'
  },
  created: {
    marginHorizontal: 17,
    marginBottom: 10
  },
  subtitle: {
    color: 'white',
    fontSize: 14,
  },
  scrollViewContent: {
    backgroundColor: 'white',
    marginTop: 30,
  },
  row: {
    height: 40,
    margin: 16,
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    elevation: 3, shadowColor: 'black', shadowOffset: { width: 0, height: 3 / 2 }, shadowRadius: 3, shadowOpacity: 0.24,
    position: 'absolute',
    marginVertical: 3,
    marginHorizontal: 3,
    height: 50,
    width: 50,
    top: HEADER_MAX_HEIGHT - 30 + 2,
    right: 12,
    backgroundColor: '#4cd964',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: width,
    flex: 1,
    height: HEADER_MAX_HEIGHT,
  },
  absIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    color: 'white',
    backgroundColor: 'rgba(5, 5, 5, 0.6)',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 3,
  }
});

//make this component available to the app
module.exports = Detail;