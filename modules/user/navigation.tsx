// useLibs

import React, { useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { _global } from 'esoftplay';
import { Platform } from 'react-native';

const Stack = createStackNavigator();


export interface UserNavigation {
  onStateChange: (curr: any) => void,
  routeNames: any,
  initialRouteName: string
}


export default function m(props: UserNavigation): any {
  function router(key: string) {
    return <Stack.Screen key={key} name={key} component={props.routeNames[key]} />
  }
  const routers = useMemo(() => Object.keys(props.routeNames).map(router), [props.routeNames])
  return (
    <NavigationContainer
      theme={{ colors: { background: 'white' } }}
      ref={(r) => _global._navigator = r}
      onStateChange={props.onStateChange} >
      <Stack.Navigator
        headerMode="none"
        initialRouteName={props.initialRouteName}
        screenOptions={{ gestureEnabled: Platform.OS == 'ios', cardStyleInterpolator: Platform.OS == 'ios' ? CardStyleInterpolators.forHorizontalIOS : CardStyleInterpolators.forFadeFromBottomAndroid }} >
        {routers}
      </Stack.Navigator>
    </NavigationContainer>
  )
}