// 
import React from 'react';
import { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { ContentList, LibComponent } from 'esoftplay';

export interface ContentIndexProps {
  navigation: any
}

export interface ContentIndexState {

}

export default class econtent extends LibComponent<ContentIndexProps, ContentIndexState> {
  props: ContentIndexProps

  constructor(props: ContentIndexProps) {
    super(props);
    this.props = props
  }

  render(): any {
    return (
      <View
        style={styles.container}>
        <ContentList navigation={this.props.navigation} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})