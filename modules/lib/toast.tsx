import React from 'react';
import { LibComponent, LibTextstyle } from 'esoftplay';
import { View } from 'react-native';

export interface LibToastProps {
  show: boolean,
  text?: string
}
export interface LibToastState {

}


export default class Toast extends LibComponent<LibToastProps, LibToastState>{

  constructor(props: LibToastProps) {
    super(props)
  }

  render(): any {
    let text = this.props.text || 'Tekan sekali lagi untuk keluar'
    if (!this.props.show)
      return null
    return (
      <View style={{ position: 'absolute', bottom: 60, left: 24, right: 24, alignItems: 'center', justifyContent: 'center' }} >
        <View style={{ backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', borderRadius: 5, paddingHorizontal: 26, paddingVertical: 5 }} >
          <LibTextstyle text={text} textStyle={'body'} light />
        </View>
      </View>
    )
  }
}