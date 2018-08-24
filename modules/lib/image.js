import * as React from '../../../react'
import { Image, PixelRatio, ImageEditor, StyleSheet, View } from '../../../react-native/Libraries/react-native/react-native-implementation.js';
import esp from '../../index';

/*
USAGE

var FastImage = esp.mod("lib/image")

<FastImage
  source={{uri:blabla}
  style={style properties for Image}
  quality={1}
  resizeMode={'contain'|'cover'}
  />
PROPS

source = same as image source props
quality = float = 0.1 - 1 ( 1 mean one pixel image === 1 pixel display )
resizeMode = string = only support for contain/cover mode
*/

class Eimage extends React.PureComponent {

  state = {
    image: null,
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.source.hasOwnProperty('uri') && prevProps.source.uri !== this.props.source.uri) {
      esp.log('1st')
      this.setState({ image: null })
      this.processImage(this.props.source)
    } else if (!prevProps.source.hasOwnProperty('uri') && prevProps.source !== this.props.source) {
      esp.log('2st')
      this.setState({ image: null })
      this.processImage(this.props.source)
    }
  };

  compress(uri, w, h, callback) {
    if (uri && w && h && callback) {
      var quality = this.props.quality || 1
      var { width, height, resizeMode } = StyleSheet.flatten(this.props.style)
      var destHeight = height
      var destWidth = width
      var destResizeMode = resizeMode
      if (!width) {
        destWidth = this.props.width
      }
      if (!height) {
        destHeight = this.props.height
      }
      if (!resizeMode) {
        destResizeMode = this.props.resizeMode
      }
      if (destResizeMode == 'contain') {
        if (destWidth > destHeight) {
          destHeight = h / w * destWidth
        } else {
          destWidth = w / h * destHeight
        }
      }
      ImageEditor.cropImage(uri,
        {
          offset: { x: 0, y: 0 },
          size: {
            width: w,
            height: h
          },
          displaySize: {
            width: PixelRatio.getPixelSizeForLayoutSize(destWidth * quality),
            height: PixelRatio.getPixelSizeForLayoutSize(destHeight * quality)
          },
          resizeMode: 'contain',
        },
        (uri) => callback({ uri: uri }),
        (msg) => esp.log(msg)
      )
    }
  }

  processImage(source) {
    if (source.hasOwnProperty('uri')) {
      Image.getSize(source.uri, (w, h) => {
        this.compress(source.uri, w, h, (res) => {
          this.setState({ image: res })
        })
      }, (error) => {

      })
    } else {
      var image = Image.resolveAssetSource(source)
      if (image) {
        this.compress(image.uri, image.width, image.height, (res) => {
          this.setState({ image: res })
        })
      }
    }
  }

  componentDidMount = () => {
    this.processImage(this.props.source)
  };

  render() {
    var style = StyleSheet.flatten(this.props.style)
    if (!this.state.image) {
      var s = Object.assign({}, style)
      delete s['resizeMode']
      return <View style={[{ backgroundColor: 'transparent' }, { ...s }]} />
    }
    return <Image style={[{ resizeMode: 'contain' }, { ...style }]} source={this.state.image} />
  }
}

module.exports = Eimage;