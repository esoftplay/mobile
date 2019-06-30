import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { LibComponent, LibStyle, LibTheme } from 'esoftplay';

export interface LibLoadingProps {

}
export interface LibLoadingState {

}
export default class m extends LibComponent<LibLoadingProps, LibLoadingState>{

  constructor(props: LibLoadingProps) {
    super(props);
  }

  render(): any {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: LibTheme.colors(...LibStyle._colorBackgroundPrimary) }} >
        <ActivityIndicator color={LibTheme.colors(...LibStyle._colorPrimary)} size={'large'} />
      </View>
    )
  }
}