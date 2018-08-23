import React from '../../../../react';
import { SafeAreaView } from 'react-navigation';
import { StatusBar, View, StyleSheet } from '../../../../react-native/Libraries/react-native/react-native-implementation.js';
import { defaultStyle, colorPrimaryDark } from '../../style';
import esp from '../../index';
const Router = esp.home();

class Content extends React.Component {
  render() {
    return (
      <View
        style={styles.container}>
        <View
          style={styles.statusBar}>
          <StatusBar translucent
            barStyle='light-content' />
        </View>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#e9e9e9' }} >
          <Router />
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  ...defaultStyle,
  container: {
    ...defaultStyle.container,
    backgroundColor: colorPrimaryDark
  }
})

module.exports = Content;