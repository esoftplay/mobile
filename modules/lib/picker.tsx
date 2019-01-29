import React from 'react';
import { StyleSheet, Text, View, CameraRoll, Dimensions, TouchableHighlight, Image, Modal, ActivityIndicator } from 'react-native';
import { Permissions } from 'expo';
import { RecyclerListView, LayoutProvider, DataProvider } from 'recyclerlistview';
import update from 'immutability-helper';
import { Ionicons } from '@expo/vector-icons';
const { width } = Dimensions.get('window')
import { esp, LibComponent } from 'esoftplay';


export interface LibPickerProps {
  max: number | 0,
  color?: string,
  show: boolean,
  dismiss: () => void,
  images: (images: any) => void
}
export interface LibPickerState {
  photos: any[],
  selected: any,
  after: any,
  has_next_page: boolean
}

export default class libPicker extends LibComponent<LibPickerProps, LibPickerState> {

  layoutProvider: any;
  dataProvider: any;
  state: LibPickerState
  constructor(props: LibPickerProps) {
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

  async componentDidMount(): Promise<void> {
    super.componentDidMount()
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
    let uris = r.edges.map(i => i.node).map(i => i.image).map(i => ({ image: i.uri, selected: false }))
    this.setState({
      photos: [...this.state.photos, ...uris],
      after: r.page_info.end_cursor,
      has_next_page: r.page_info.has_next_page
    });
  }

  selectImage(index: any): void {
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

  ImageTile(props: any): any {
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

  rowRenderer(index: any, item: number): any {
    return (
      <this.ImageTile
        item={item}
        index={index}
        selectImage={this.selectImage}
      />
    )
  }

  render(): any {
    var { max, show, dismiss, color, images } = this.props
    var { has_next_page, photos } = this.state
    color = color ? color : 'blue'
    var selectedPhotos = this.state.photos.filter((item) => item.selected === true).map((item) => item.image)
    var selectedCount = selectedPhotos.length
    let headerText = selectedCount + ' dipilih';
    if (max && selectedCount === max) headerText = headerText + ' (max)';
    return (
      <Modal
        animationType={'fade'}
        transparent={false}
        onRequestClose={() => dismiss()}
        visible={show}>
        <View style={this.styles.container}>
          <View style={this.styles.header}>
            <TouchableHighlight onPress={() => dismiss()} >
              <Text style={{ fontSize: 20, color: color }} >Batal</Text>
            </TouchableHighlight>
            <Text style={{ fontSize: 16 }} >{headerText}</Text>
            <TouchableHighlight onPress={() => {
              images(selectedPhotos)
              dismiss()
            }} >
              <Text style={{ fontSize: 20, color: color }} >Selesai</Text>
            </TouchableHighlight>
          </View>
          {
            has_next_page && photos.length == 0 ? <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} ><ActivityIndicator color={color} size="large" /></View>
              : !has_next_page && photos.length == 0 ? <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} ><Text>Gambar Tidak ditemukan</Text></View>
                :
                <RecyclerListView
                  layoutProvider={this.layoutProvider}
                  dataProvider={this.dataProvider.cloneWithRows(this.state.photos)}
                  rowRenderer={this.rowRenderer}
                  onEndReached={() => { this.getPhotos() }}
                />
          }
        </View>
      </Modal>
    );
  }
}
