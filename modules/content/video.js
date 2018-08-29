import * as React from '../../../react'
import { WebView, StyleSheet, View, ActivityIndicator } from '../../../react-native/Libraries/react-native/react-native-implementation.js';
import esp from 'esoftplay';
const { colorPrimary } = esp.mod('lib/style');
class Evideo extends React.Component {
  render() {
    const code = this.props.code
    if (!code) {
      return new Error('Missing Youtube Code in Props');
    }

    return (
      <WebView
        style={[{ position: 'absolute', top: 0, left: 0, right: 0, flex: 1 }, StyleSheet.flatten(this.props.style || {})]}
        startInLoadingState
        renderLoading={() => <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} ><ActivityIndicator color={colorPrimary} /></View>}
        javaScriptEnabled={true}
        source={{ uri: 'https://www.youtube.com/embed/' + this.props.code + '?rel=0&autoplay=0&showinfo=0&controls=1&modestbranding=1' }}
      />
    )
  }
}

module.exports = Evideo;