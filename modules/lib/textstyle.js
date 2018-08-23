import React, { Component } from '../../../../react';
import { Text, StyleSheet } from '../../../../react-native/Libraries/react-native/react-native-implementation.js';

class EtextStyle extends Component {
  static largeTitle = 'largeTitle'
  static title1 = 'title1'
  static title2 = 'title2'
  static title3 = 'title3'
  static headline = 'headline'
  static body = 'body'
  static callout = 'callout'
  static subhead = 'subhead'
  static footnote = 'footnote'
  static caption1 = 'caption1'
  static caption2 = 'caption2'

  scale = 1

  render() {
    const { text, textStyle, style } = this.props;
    return (
      <Text {...this.props} style={[this.styles[textStyle], { ...StyleSheet.flatten(style) }]}>
        {text}
      </Text>
    );
  }
  styles = {
    largeTitle: {
      fontSize: this.scale * 34,
      fontWeight: "400",
      lineHeight: this.scale * 41,
      letterSpacing: this.scale * 34 * 11 / 1000,
    },
    title1: {
      fontSize: this.scale * 28,
      fontWeight: "400",
      lineHeight: this.scale * 34,
      letterSpacing: this.scale * 28 * 13 / 1000,
    },
    title2: {
      fontSize: this.scale * 22,
      fontWeight: "400",
      lineHeight: this.scale * 28,
      letterSpacing: this.scale * 22 * 16 / 1000,
    },
    title3: {
      fontSize: this.scale * 20,
      fontWeight: "400",
      lineHeight: this.scale * 25,
      letterSpacing: this.scale * 20 * 19 / 1000,
    },
    headline: {
      fontSize: this.scale * 17,
      fontWeight: "600",
      lineHeight: this.scale * 22,
      letterSpacing: this.scale * 17 * -24 / 1000,
    },
    body: {
      fontSize: this.scale * 17,
      fontWeight: "400",
      lineHeight: this.scale * 22,
      letterSpacing: this.scale * 17 * -24 / 1000,
    },
    callout: {
      fontSize: this.scale * 16,
      fontWeight: "400",
      lineHeight: this.scale * 21,
      letterSpacing: this.scale * 16 * -20 / 1000,
    },
    subhead: {
      fontSize: this.scale * 15,
      fontWeight: "400",
      lineHeight: this.scale * 20,
      letterSpacing: this.scale * 15 * -16 / 1000,
    },
    footnote: {
      fontSize: this.scale * 13,
      fontWeight: "400",
      lineHeight: this.scale * 18,
      letterSpacing: this.scale * 13 * -6 / 1000,
    },
    caption1: {
      fontSize: this.scale * 12,
      fontWeight: "400",
      lineHeight: this.scale * 16,
      letterSpacing: this.scale * 12 * 0 / 1000,
    },
    caption2: {
      fontSize: this.scale * 11,
      fontWeight: "400",
      lineHeight: this.scale * 13,
      letterSpacing: this.scale * 11 * 6 / 1000,
    }
  }
  
}

module.exports = EtextStyle;