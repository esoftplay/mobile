// 

import React from 'react';
import { Component } from 'react';
import { Linking, TouchableWithoutFeedback, View, StyleSheet } from 'react-native';
import { Text } from 'native-base';
import moment from 'moment/min/moment-with-locales';
import { LibImage, LibStyle, esp } from 'esoftplay';
const { defaultStyle, width } = esp.mod('lib/style')

export interface ContentItemProps {
  index: number,
  navigation: any,
  id?: number | string,
  url?: string | '',
  title?: string,
  created?: string,
  image?: string,
  intro?: string,
  description?: string,
  updated?: string,
  publish?: string,
}

export interface ContentItemState {

}

export default class eitem extends Component<ContentItemProps, ContentItemState> {

  props: ContentItemProps
  constructor(props: ContentItemProps) {
    super(props);
    this.props = props;
    this.goToDetail = this.goToDetail.bind(this);
  }

  goToDetail() {
    this.props.navigation.push(
      'content/detail', {
        id: this.props.id,
        title: this.props.title,
        url: this.props.url,
        created: this.props.created,
        image: this.props.image,
      })
  }

  render = () => {
    const props = this.props
    const { id, title, intro, description, image, created, updated, url, publish } = props
    if (created == 'sponsor') {
      const goToSponsor = (url?: string) => {
        if (url)
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
              <LibImage
                style={{ width: width, height: 110, resizeMode: 'contain' }}
                source={{ uri: image }} />
            </View>
          </TouchableWithoutFeedback>
        )
      } else if (image === '') /* NO IMAGE */ {
        return (
          <TouchableWithoutFeedback
            style={styles.overflow}
            onPress={() => goToSponsor(url)}>
            <View
              style={styles.containerRow}>
              <View
                style={[styles.wrapper, { width: width, height: 110 }]}>
                <Text
                  style={{ color: '#353535' }}
                  numberOfLines={2}
                  ellipsizeMode={'tail'}>{title}</Text>
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
            onPress={() => goToSponsor(url)}>
            <View
              style={styles.containerRow}>
              <View
                style={styles.wrapper} >
                <Text
                  style={{ color: '#353535' }}
                  numberOfLines={2}
                  ellipsizeMode={'tail'}>{title}</Text>
                <View
                  style={defaultStyle.container} >
                </View>
                <Text
                  style={styles.text11} note>{created}</Text>
              </View>
              <LibImage style={{ width: 110, height: 110, resizeMode: 'cover' }} source={{ uri: image }} />
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
                  <LibImage
                    style={{ height: width * 9 / 16, width: width }}
                    source={{ uri: image }}>
                  </LibImage>
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
                ellipsizeMode={'tail'}>{title}</Text>
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
              ellipsizeMode={'tail'}>{title}</Text>
            <View
              style={defaultStyle.container} >
            </View>
            <Text
              style={styles.text11} note>{moment(created).format('dddd, DD MMMM YYYY kk:mm')}</Text>
          </View>
          <View>
            <LibImage style={{ width: 110, height: 110, resizeMode: 'cover' }} source={{ uri: image }} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
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
