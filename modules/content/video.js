import React, { Component } from '../../../../react'
import { WebView, StyleSheet } from '../../../../react-native/Libraries/react-native/react-native-implementation.js';


class Evideo extends Component {
  render() {
    const code = this.props.code
    if (!code) {
      return new Error('Missing Youtube Code in Props');
    }

    return (
      <WebView
        style={[{ position: 'absolute', top: 0, left: 0, right: 0, flex: 1 }, StyleSheet.flatten(this.props.style || {})]}
        startInLoadingState
        javaScriptEnabled={true}
        source={{ uri: 'https://www.youtube.com/embed/' + result.code + '?rel=0&autoplay=0&showinfo=0&controls=1&modestbranding=1' }}
      />
    )
  }
}

module.exports = Evideo;