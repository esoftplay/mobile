// 
import React from 'react';
import { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Icon, Input } from 'native-base';
import { esp, LibUtils } from 'esoftplay';
const { elevation, colorPrimary } = esp.mod('lib/style');
// create a component

export interface ContentSearchProps {
  defaultValue?: string,
  close(): void,
  onSubmit(uri: string): void,
}

export interface ContentSearchState {

}

export default class esearch extends Component<ContentSearchProps, ContentSearchState> {

  inputSearch: any;
  props: ContentSearchProps;
  constructor(props: ContentSearchProps) {
    super(props)
    this.props = props
  }

  componentWillMount(): void {
    this.inputSearch = this.props.defaultValue || ''
  }

  render() {
    return (
      <View>
        <View style={[{
          backgroundColor: 'white',
          height: 50,
          alignItems: 'center',
          flexDirection: 'row'
        }, elevation(2)]} >
          <Button
            transparent={true}
            style={{
              height: 50,
              width: 50,
            }}
            onPress={() => this.props.close()}>
            <Icon
              name={'md-arrow-back'}
              style={{
                fontSize: 24,
                color: '#353535'
              }} />
          </Button>
          <Input
            style={{ height: 50, width: '100%', fontSize: 17, color: '#555' }}
            placeholderTextColor={'#999'}
            selectionColor={LibUtils.colorAdjust(colorPrimary, 3)}
            defaultValue={this.inputSearch}
            returnKeyType="search"
            onSubmitEditing={() => {
              this.props.onSubmit(encodeURI(this.inputSearch))
              this.props.close()
            }}
            onChangeText={(e: any) => this.inputSearch = e}
            placeholder={'Temukan Berita ...'} />
          <Button
            transparent={true}
            style={{
              height: 50,
              width: 50,
            }}
            onPress={() => {
              this.props.onSubmit(encodeURI(this.inputSearch))
              this.props.close()
            }}>
            <Icon
              name='ios-search'
              style={{
                fontSize: 24,
                color: '#353535'
              }} />
          </Button>
        </View>
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
});

//make this component available to the app
