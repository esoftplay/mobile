// withHooks

import React from 'react';
import { View, Text } from 'react-native';
import App from '../../../../App';
import { useSelector } from 'react-redux';
import { LibStyle } from 'esoftplay';


export interface LibToastProps {

}

const initState = {
  message: undefined,
  timeout: 2000
}

export function reducer(state: any, action: any): any {
  if (state == undefined) state = initState
  const actions: any = {
    "lib_toast_show": {
      ...state,
      ...action.payload
    },
    "lib_toast_hide": {
      ...state,
      ...initState
    }
  }
  const _action = actions[action.type]
  return _action ? _action : state
}
let _timeout: any = undefined

export function hide(): void {
  App.getStore().dispatch({ type: 'lib_toast_hide' })
}

export function show(message: string, timeout?: number): void {
  App.getStore().dispatch({
    type: 'lib_toast_show',
    payload: {
      message: message,
      timeout: timeout || initState.timeout
    }
  })
  if (_timeout) {
    clearTimeout(_timeout)
    _timeout = undefined
  }
  _timeout = setTimeout(() => {
    App.getStore().dispatch({ type: 'lib_toast_hide' })
  }, timeout || initState.timeout);
}

export default function m(props: LibToastProps): any {
  const data = useSelector((state: any) => state.lib_toast)
  if (!data.message) return null
  return (
    <View style={{ position: 'absolute', bottom: 58 + (LibStyle.isIphoneX ? 30 : 0), left: 36, right: 36, alignItems: 'center' }}>
      <View style={{ borderRadius: 30, backgroundColor: '#323232', padding: 16 }} >
        <Text style={{ fontSize: 12, fontWeight: "normal", fontStyle: "normal", letterSpacing: 0, textAlign: "center", color: "white" }} >{data.message}</Text>
      </View>
    </View>
  )
}