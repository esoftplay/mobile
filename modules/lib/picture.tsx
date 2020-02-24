// withHooks

import React, { useEffect, useState } from 'react';
import { Image, Platform, PixelRatio, InteractionManager, } from 'react-native';
import { esp, LibUtils } from 'esoftplay'
import * as FileSystem from 'expo-file-system';
import shorthash from 'shorthash'
import * as ImageManipulator from 'expo-image-manipulator';

export interface LibPictureSource {
  uri: string
}

export interface LibPictureProps {
  source: LibPictureSource | number,
  width?: number,
  height?: number,
  style?: any,
  resizeMode?: 'contain' | 'cover',
}

const initState = {
  images: {}
}

const persist = true;
export function reducer(state: any, action: any): any {
  if (state == undefined) state = initState
  const actions: any = {
    "lib_picture_images": {
      ...state,
      images: { ...state.images, ...action.payload }
    }
  }
  const _action = actions[action.type]
  return _action ? _action : state
}

export function save(key: string, url: string): void {
  esp.dispatch({
    type: "lib_picture_images",
    payload: {
      [key]: url
    }
  })
}

export default function m(props: LibPictureProps): any {
  const originSource: string = typeof (props.source) == 'number' ? String(props.source) : props.source.uri
  const key = shorthash.unique(originSource)
  const height = props.height || props.style.height || 0
  const width = props.width || props.style.width || 0
  const cachedUrl = LibUtils.getReduxState('lib_picture', 'images', key)
  const [imgSource, setImgSource] = useState(cachedUrl.length > 2 ? cachedUrl : undefined)

  function doCache() {
    Image.getSize(String(originSource), (w, h) => {
      compress(String(originSource), key, w, h)
    }, () => {

    })
  }

  useEffect(() => {
  },
    [imgSource])


  function compress(uri: string, key: string, w: number, h: number) {
    InteractionManager.runAfterInteractions(async () => {
      if (uri && w && h) {
        let destHeight = height
        let destWidth = width
        if (destWidth > destHeight) {
          destHeight = h / w * destWidth
        } else {
          destWidth = w / h * destHeight
        }
        ImageManipulator.manipulateAsync(
          uri,
          [
            {
              resize: {
                width: PixelRatio.getPixelSizeForLayoutSize(destWidth),
                height: PixelRatio.getPixelSizeForLayoutSize(destHeight)
              }
            }
          ],
          { format: ImageManipulator.SaveFormat.PNG }
        ).then((manipImage: any) => {
          if (manipImage.uri) {
            setImgSource(manipImage.uri)
            FileSystem.copyAsync({ from: manipImage.uri, to: FileSystem.cacheDirectory + key + '.png' }).then(() => {
              save(key, FileSystem.cacheDirectory + key + '.png')
            }, (error) => {
            })
          }
        })
      }
    })
  }



  useEffect(() => {
    if (typeof cachedUrl != 'string') {
      if (Platform.OS == 'android')
        Image.prefetch(originSource).then((r) => {
          save(key, originSource)
          setImgSource(originSource)
        })
      else
        doCache()
    }
  }, [])

  return (
    <Image
      key={imgSource}
      style={{ ...props.style }}
      source={{ uri: Platform.OS == 'android' ? originSource : imgSource }} />
  )
}