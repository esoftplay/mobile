// 
import React from 'react';
import { Component } from 'react';
import { SafeAreaView } from 'react-navigation';
import { StatusBar, View, StyleSheet } from 'react-native';
import { esp } from 'esoftplay';
const Elist = esp.mod('content/list');

export interface ContentIndexProps {
  navigation: any
}

export interface ContentIndexState {

}

export default class econtent extends Component<ContentIndexProps, ContentIndexState> {
  props: ContentIndexProps
  constructor(props: ContentIndexProps) {
    super(props);
    this.props = props
  }
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
  container: {
    flex: 1
  }
})