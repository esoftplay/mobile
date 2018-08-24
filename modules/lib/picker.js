import React from '../../../react';
import { StyleSheet, Text, View, CameraRoll, Dimensions, TouchableHighlight, Image, Modal, ActivityIndicator } from '../../../react-native/Libraries/react-native/react-native-implementation.js';
import * as Permissions from '../../../expo/src/Permissions.js';
import { RecyclerListView, LayoutProvider, DataProvider } from 'recyclerlistview';
import update from 'immutability-helper';
import { Ionicons } from '@expo/vector-icons';
const { width } = Dimensions.get('window')
/*
USAGE

var ImagesPicker = esp.mod("lib/picker")

...
<ImagesPicker
  images={(images)=>console.log(images)}
  max={3}
  color={colorPrimary}
  show={this.state.showImagesPicker}
  dismiss={()=>this.setState({showImagesPicker:false})}
PROPS

  images  = funtion   = A callback to receive images selection
  max     = number    = maximum count images selection
  color   = string    = color code for ImagesPicker
  show    = boolean   = determine ImagesPicker show or not
  dismiss = function  = function to make props.show = false
*/
class Epicker extends React.Component {
  constructor(props) {
    super(props);
    this.layoutProvider = new LayoutProvider(index => index,
      (type, dim) => {
        dim.width = width / 3;
        dim.height = width / 3
      })
    this.dataProvider = new DataProvider((a, b) => a !== b)
    this.rowRenderer = this.rowRenderer.bind(this);
    this.selectImage = this.selectImage.bind(this);
    this.ImageTile = this.ImageTile.bind(this);
    this.state = {
      photos: [],
      selected: {},
      after: null,
      has_next_page: true
    }
  }

  async componentDidMount() {
    const { existingStatus } = await Permissions.getAsync(Permissions.CAMERA_ROLL);
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      finalStatus = status;
    }
    if (finalStatus !== 'granted') return
    this.getPhotos()
  }


  getPhotos = () => {
    let params = { first: 50, mimeTypes: ['image/jpeg'] };
    if (this.state.after) params.after = this.state.after
    if (!this.state.has_next_page) return
    CameraRoll.getPhotos(params).then(this.processPhotos)
  }

  processPhotos = (r) => {
    if (this.state.after === r.page_info.end_cursor) return;
    let uris = r.edges.map(i => i.node).map(i => i.image).map(i => ({ image: i.uri, selected: false }))
    this.setState({
      photos: [...this.state.photos, ...uris],
      after: r.page_info.end_cursor,
      has_next_page: r.page_info.has_next_page
    });
  }

  selectImage = (index) => {
    var photos = this.state.photos
    var selectedCount = photos.filter((item) => item.selected === true).length
    var isSelect = photos[index].selected
    var { max } = this.props
    var isBelowLimit = true
    if (max) isBelowLimit = selectedCount < max
    if (isBelowLimit || isSelect) {
      var query = {
        [index]: {
          selected: {
            $set: !isSelect
          }
        }
      }
      this.setState({ photos: update(photos, query) })
    }
  }

  styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      height: 50,
      width: width,
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
    },
  })

  ImageTile(props) {
    let { item, index, selectImage } = props;
    var color = this.props.color || 'blue'
    if (!item) return null;
    return (
      <TouchableHighlight
        underlayColor='transparent'
        onPress={() => selectImage(index)}>
        <View style={{ width: width / 3, height: width / 3 }} >
          <Image
            style={{ width: width / 3, height: width / 3 }}
            source={{ uri: item.image }}
          />
          <Ionicons name={item.selected ? 'ios-checkmark-circle' : 'ios-radio-button-off-outline'} style={{ color: color, position: 'absolute', bottom: 5, right: 5, fontSize: 34, fontWeight: 'bold' }} />
        </View>
      </TouchableHighlight>
    )
  }

  rowRenderer = (index, item) => {
    return (
      <this.ImageTile
        item={item}
        index={index}
        selectImage={this.selectImage}
      />
    )
  }
}

module.exports = Epicker;