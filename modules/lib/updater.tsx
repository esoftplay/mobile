// withHooks

import React from 'react';
import { View, Alert } from 'react-native';
import { Fab } from 'native-base';
import { Updates } from 'expo';
import { LibStyle, LibProgress, esp, LibIcon } from 'esoftplay';
const AppJson = require('../../../../app.json')

export interface LibUpdaterProps {
  show: boolean
}

export function install(): void {
  Updates.reload()
}

export function check(callback: (isNew: boolean) => void): void {
  Updates.fetchUpdateAsync().then((v) => {
    callback(v.isNew)
  }).catch((e) => {
    LibProgress.hide()
    Alert.alert('Oops.!!', 'Try again later...')
    esp.log(e)
  })
}


export default function m(props: LibUpdaterProps): any {
  return (
    <>
      {
        props.show && AppJson.expo.updates.enabled == true &&
        <Fab
          position="bottomRight"
          style={{ backgroundColor: LibStyle.colorRed }}
          onPress={() => {
            LibProgress.show('Sedang memeriksa versi terbaru')
            check((isNew) => {
              if (isNew) {
                LibProgress.hide()
                install()
              }
              else {
                LibProgress.hide()
                Alert.alert('App is fine', 'Your app is up-to-date')
              }
            })
          }}>
          <LibIcon name="cloud-download-outline" color={'white'} />
        </Fab>
      }
    </>
  )
}