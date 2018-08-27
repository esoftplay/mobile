import * as React from '../../../react'
import { Image, PixelRatio, ImageEditor, StyleSheet, View } from '../../../react-native/Libraries/react-native/react-native-implementation.js';
import esp from '../../index';
import { connect } from '../../../react-redux';

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

  static initState = {
    images: {}
  }

  static reducer = (state = Eimage.initState, action) => {
    switch (action.type) {
      case 'lib_image_add':
        return {
          images: Object.assign({}, state.images, { [action.payload.key]: action.payload.image })
        }
        break;
      default:
        return state
    }
  }

  static mapStateToProps = (state) => {
    return {
      images: state.lib_image.images
    }
  }

  state = {
    image: null,
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.source.hasOwnProperty('uri') && prevProps.source.uri !== this.props.source.uri) {
      this.setState({ image: null })
      this.processImage(this.props.source)
    } else if (!prevProps.source.hasOwnProperty('uri') && prevProps.source !== this.props.source) {
      this.setState({ image: null })
      this.processImage(this.props.source)
    }
  };

  compress(uri, w, h, destWidth, destHeight, callback) {
    if (uri && w && h && callback) {
      var quality = this.props.quality || 1
      var { resizeMode } = StyleSheet.flatten(this.props.style)
      var destResizeMode = resizeMode
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
      
      )
    }
  }

  nameKey(uri, w, h) {
    return uri + '|' + w + '|' + h
  }

  processImage(source) {
    var { width, height } = StyleSheet.flatten(this.props.style)
    var destHeight = height
    var destWidth = width
    if (!width) { destWidth = this.props.width }
    if (!height) { destHeight = this.props.height }
    if (source.hasOwnProperty('uri')) {
      if (this.props.images.hasOwnProperty(this.nameKey(source.uri, destWidth, destHeight))) {
        this.setState({ image: this.props.images[this.nameKey(source.uri, destWidth, destHeight)] })
        return
      }
      Image.getSize(source.uri, (w, h) => {
        this.compress(source.uri, w, h, destWidth, destHeight, (res) => {
          this.setState({ image: res })
          this.props.dispatch({
            type: 'lib_image_add',
            payload: {
              key: this.nameKey(source.uri, destWidth, destHeight),
              image: res
            }
          })
        })
      }, (error) => {

      })
    } else {
      var image = Image.resolveAssetSource(source)
      if (image) {
        if (this.props.images.hasOwnProperty(this.nameKey(image.uri, destWidth, destHeight))) {
          this.setState({ image: this.props.images[this.nameKey(image.uri, destWidth, destHeight)] })
          return
        }
        this.compress(image.uri, image.width, image.height, destWidth, destHeight, (res) => {
          this.setState({ image: res })
          this.props.dispatch({
            type: 'lib_image_add',
            payload: {
              key: this.nameKey(image.uri, destWidth, destHeight),
              image: res
            }
          })
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


module.exports = connect(Eimage.mapStateToProps)(Eimage);