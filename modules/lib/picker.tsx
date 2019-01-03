// 

import React from 'react';
import { Component } from 'react';
import { StyleSheet, Text, View, CameraRoll, Dimensions, TouchableHighlight, Image, Modal, ActivityIndicator } from 'react-native';
import { Permissions } from 'expo';
import { RecyclerListView, LayoutProvider, DataProvider } from 'recyclerlistview';
import update from 'immutability-helper';
import { Ionicons } from '@expo/vector-icons';
const { width } = Dimensions.get('window')
/*
USAGE

var Imagespicker = esp.mod("lib/picker")

...
<Imagespicker
  images={(images)=>console.log(images)}
  max={3}
  color={colorPrimary}
  show={this.state.showImagespicker}
  dismiss={()=>this.setState({showImagespicker:false})}
PROPS

  images  = funtion   = A callback to receive images selection
  max     = number    = maximum count images selection
  color   = string    = color code for Imagespicker
  show    = boolean   = determine Imagespicker show or not
  dismiss = function  = function to make props.show = false
*/


export interface LibPickerProps {
  max: number | 0,
  color?: string,
  show: boolean,
  dismiss(): void
}
export interface LibPickerState {
  photos: any[],
  selected: any,
  after: any,
  has_next_page: boolean
}

export default class epicker extends Component<LibPickerProps, LibPickerState> {
  layoutProvider: any;
  ImageTile: any;
  dataProvider: any;
  state: LibPickerState
  props: LibPickerProps
  constructor(props: LibPickerProps) {
    super(props);
    this.props = props
    this.layoutProvider = new LayoutProvider((index: number) => index,
      (type: number, dim: any) => {
        dim.width = width / 3;
        dim.height = width / 3
      })
    this.dataProvider = new DataProvider((a: any, b: any) => a !== b)
    // this.rowRenderer = this.rowRenderer.bind(this);
    this.selectImage = this.selectImage.bind(this);
    this.ImageTile = this.ImageTile.bind(this);
    this.state = {
      photos: [],
      selected: {},
      after: null,
      has_next_page: true
    }
  }

  async componentDidMount(): Promise<void> {
    const { existingStatus } = await Permissions.getAsync(Permissions.CAMERA_ROLL);
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      finalStatus = status;
    }
    if (finalStatus !== 'granted') return
    this.getPhotos()
  }


  getPhotos(): void {
    let params: any = { first: 50, mimeTypes: ['image/jpeg'] };
    if (this.state.after) params.after = this.state.after
    if (!this.state.has_next_page) return
    CameraRoll.getPhotos(params).then(this.processPhotos)
  }

  processPhotos(r: any): void {
    if (this.state.after === r.page_info.end_cursor) return;
    let uris = r.edges.map((i: any) => i.node).map((i: any) => i.image).map((i: any) => ({ image: i.uri, selected: false }))
    this.setState({
      photos: [...this.state.photos, ...uris],
      after: r.page_info.end_cursor,
      has_next_page: r.page_info.has_next_page
    });
  }

  selectImage(index: number): void {
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

  // ImageTile(props: any) {
  //   let { item, index, selectImage } = props;
  //   var color = this.props.color || 'blue'
  //   if (!item) return null;
  //   return (
  //     <TouchableHighlight
  //       underlayColor='transparent'
  //       onPress={() => selectImage(index)}>
  //       <View style={{ width: width / 3, height: width / 3 }} >
  //         <Image
  //           style={{ width: width / 3, height: width / 3 }}
  //           source={{ uri: item.image }}
  //         />
  //         <Ionicons name={item.selected ? 'ios-checkmark-circle' : 'ios-radio-button-off'} style={{ color: color, position: 'absolute', bottom: 5, right: 5, fontSize: 34, fontWeight: 'bold' }} />
  //       </View>
  //     </TouchableHighlight>
  //   )
  // }

  // rowRenderer = (index: number, item: any) => {
  //   return (
  //     <ImageTile
  //       item={item}
  //       index={index}
  //       selectImage={this.selectImage}
  //     />
  //   )
  // }
}
