import React from 'react';
import { SafeAreaView } from 'react-navigation';
import { StatusBar, View, StyleSheet } from 'react-native';
import esp from '../../index';
const { defaultStyle, colorPrimaryDark } = esp.mod('lib/style');
const Elist = esp.mod('content/list');

class Econtent extends React.Component {
  render() {
    return (
      <View
        style={styles.container}>
        <Elist navigation={this.props.navigation} />
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

module.exports = Econtent 
 export default  Econtent;