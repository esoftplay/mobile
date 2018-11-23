// 
import { Image } from 'react-native';
export default Image

// import * as React from 'react'
// import { Image, PixelRatio, ImageEditor, StyleSheet, View } from 'react-native'
// import { connect } from 'react-redux';
// import { store } from '../../../../App';
// import { FileSystem } from 'expo';
// import { esp } from 'esoftplay';
// import shorthash from 'shorthash'
// /*
// USAGE

// var FastImage = esp.mod("lib/image")

// <FastImage
//   source={{uri:blabla}
//   style={style properties for Image}
//   quality={1}
//   resizeMode={'contain'|'cover'}
//   />

// PROPS

// source = same as image source props
// quality = float = 0.1 - 1 ( 1 mean one pixel image === 1 pixel display )
// resizeMode = string = only support for contain/cover mode
// */

// class Eimage extends React.PureComponent {

//   static initState = {
//     images: {}
//   }

//   static reducer = (state = Eimage.initState, action) => {
//     switch (action.type) {
//       case 'lib_image_add':
//         return {
//           images: Object.assign({}, state.images, { [action.payload.key]: action.payload.image })
//         }
//         break;
//       case 'lib_image_add_all':
//         return {
//           images: action.payload
//         }
//       default:
//         return state
//     }
//   }

//   static action = {
//     lib_image_add_all(images) {
//       store.dispatch({
//         type: 'lib_image_add_all',
//         payload: images
//       })
//     },
//     lib_image_add(key, image) {
//       store.dispatch({
//         type: 'lib_image_add',
//         payload: {
//           key: key,
//           image: image
//         }
//       })
//     }
//   }

//   static mapStateToProps = (state) => {
//     return {
//       images: state.lib_image.images
//     }
//   }

//   state = {
//     image: null,
//   }

//   componentDidUpdate = (prevProps, prevState) => {
//     if (prevProps.source.hasOwnProperty('uri') && prevProps.source.uri !== this.props.source.uri) {
//       if (this.mounted) this.setState({ image: null })
//       this.processImage(this.props.source)
//     } else if (!prevProps.source.hasOwnProperty('uri') && prevProps.source !== this.props.source) {
//       if (this.mounted) this.setState({ image: null })
//       this.processImage(this.props.source)
//     }
//   };

//   compress(uri, w, h, dw, dh, callback) {
//     if (uri && w && h && callback) {
//       var quality = this.props.quality || 1
//       var { resizeMode } = StyleSheet.flatten(this.props.style)
//       var destResizeMode = resizeMode
//       var destHeight = dh
//       var destWidth = dw
//       if (!resizeMode) {
//         destResizeMode = this.props.resizeMode
//       }
//       if (destResizeMode == 'contain') {
//         if (destWidth > destHeight) {
//           destHeight = h / w * destWidth
//         } else {
//           destWidth = w / h * destHeight
//         }
//       }
//       ImageEditor.cropImage(uri,
//         {
//           offset: { x: 0, y: 0 },
//           size: {
//             width: w,
//             height: h
//           },
//           displaySize: {
//             width: PixelRatio.getPixelSizeForLayoutSize(destWidth * quality),
//             height: PixelRatio.getPixelSizeForLayoutSize(destHeight * quality)
//           },
//           resizeMode: destResizeMode || 'cover',
//         },
//         (uri) => callback({ uri: uri }), (error) => {
//           console.log(error)
//         }

//       )
//     }
//   }

//   nameKey(uri, w, h) {
//     var extentions = uri.split('.').pop();
//     if (extentions.includes('?')) {
//       extentions = extentions.split('?')[0]
//     }
//     return shorthash.unique(uri + '|' + w + '|' + h) + '.' + extentions
//   }

//   async processImage(source) {
//     var { width, height } = StyleSheet.flatten(this.props.style)
//     var destHeight = height
//     var destWidth = width
//     if (!width) { destWidth = this.props.width }
//     if (!height) { destHeight = this.props.height }

//     if (source.hasOwnProperty('uri')) {
//       // load from reducer
//       if (this.props.images.hasOwnProperty(this.nameKey(source.uri, destWidth, destHeight))) {
//         if (this.mounted) this.setState({ image: this.props.images[this.nameKey(source.uri, destWidth, destHeight)] })
//         return
//       } else {
//         // load from disk
//         const path = FileSystem.documentDirectory + this.nameKey(source.uri, destWidth, destHeight);
//         const image = await FileSystem.getInfoAsync(path);
//         if (image.exists) {
//           if (this.props.original) {
//             if (this.mounted) this.setState({ image: { uri: image.uri } })
//             Eimage.action.lib_image_add(this.nameKey(image.uri, destWidth, destHeight), { uri: image.uri })
//           } else {
//             Image.getSize(image.uri, (w, h) => {
//               this.compress(image.uri, w, h, destWidth, destHeight, (res) => {
//                 if (this.mounted) this.setState({ image: res })
//                 Eimage.action.lib_image_add(this.nameKey(image.uri, destWidth, destHeight), res)
//               })
//             }, (error) => {
//             })
//           }
//         }
//         FileSystem.downloadAsync(source.uri, FileSystem.documentDirectory + this.nameKey(source.uri, destWidth, destHeight));
//       }
//       if (this.props.original) {
//         if (this.mounted) this.setState({ image: { uri: source.uri } })
//         Eimage.action.lib_image_add(this.nameKey(source.uri, destWidth, destHeight), { uri: source.uri })
//       } else {
//         Image.getSize(source.uri, (w, h) => {
//           this.compress(source.uri, w, h, destWidth, destHeight, (res) => {
//             if (this.mounted) this.setState({ image: res })
//             Eimage.action.lib_image_add(this.nameKey(source.uri, destWidth, destHeight), res)
//           })
//         }, (error) => {
//         })
//       }

//     } else {
//       var image = Image.resolveAssetSource(source)
//       if (image) {
//         if (this.props.images.hasOwnProperty(this.nameKey(image.uri, destWidth, destHeight))) {
//           if (this.mounted) this.setState({ image: this.props.images[this.nameKey(image.uri, destWidth, destHeight)] })
//           return
//         } else {
//           const path = FileSystem.documentDirectory + this.nameKey(image.uri, destWidth, destHeight);
//           const limage = await FileSystem.getInfoAsync(path);
//           if (limage.exists) {
//             if (this.props.original) {
//               if (this.mounted) this.setState({ image: { uri: limage.uri } })
//               Eimage.action.lib_image_add(this.nameKey(limage.uri, destWidth, destHeight), { uri: limage.uri })
//             } else {
//               this.compress(limage.uri, image.width, image.height, destWidth, destHeight, (res) => {
//                 if (this.mounted) this.setState({ image: res })
//                 Eimage.action.lib_image_add(this.nameKey(limage.uri, destWidth, destHeight), res)
//               })
//             }
//           }
//           FileSystem.downloadAsync(image.uri, FileSystem.documentDirectory + this.nameKey(image.uri, destWidth, destHeight));
//         }
//         if (this.props.original) {
//           if (this.mounted) this.setState({ image: { uri: image.uri } })
//           Eimage.action.lib_image_add(this.nameKey(image.uri, destWidth, destHeight), { uri: image.uri })
//         } else {
//           this.compress(image.uri, image.width, image.height, destWidth, destHeight, (res) => {
//             if (this.mounted) this.setState({ image: res })
//             Eimage.action.lib_image_add(this.nameKey(image.uri, destWidth, destHeight), res)
//           })
//         }
//       }
//     }
//   }

//   mounted = false
//   componentDidMount = () => {
//     this.mounted = true
//     this.processImage(this.props.source)
//   };

//   componentWillUnmount() {
//     this.mounted = false
//   }


//   render() {
//     var style = StyleSheet.flatten(this.props.style)
//     if (!this.state.image) {
//       var s = Object.assign({}, style)
//       delete s['resizeMode']
//       return <View style={[{ backgroundColor: 'transparent' }, { ...s }]} />
//     }
//     return <Image style={[{ resizeMode: 'contain' }, { ...style }]} source={this.state.image} />
//   }
// }


// module.exports = connect(Eimage.mapStateToProps)(Eimage) 
//  export default  connect(Eimage.mapStateToProps)(Eimage);