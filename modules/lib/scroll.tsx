// 

import React from 'react'
import { Component } from 'react';
import { RecyclerListView, BaseItemAnimator, LayoutProvider, DataProvider, ContextProvider } from 'recyclerlistview';
import { Dimensions, View } from 'react-native';

/*
Using ScrollView

import { ScrollView } from 'react-native'

<ScrollView>
  //scrollable item
  //scrollable item
  //scrollable item
  //scrollable item
</ScrollView>

Using this class for lazy load

var Escroll = esp.mod("lib/scroll")

<Escroll>
  //scrollable item
  //scrollable item
  //scrollable item
  //scrollable item
</Escroll>
*/
const { width } = Dimensions.get('window');


export interface LibScrollProps {
  numColumns?: number,
  defaultHeight?: number,
  children: any,
}

export interface LibScrollState {
  width: number,
  data: any
}

export default class escroll extends Component<LibScrollProps, LibScrollState> {

  layoutProvider: any;
  contextProvider: any;
  dataProvider: any;
  state: LibScrollState;
  props: LibScrollProps;

  constructor(props: LibScrollProps) {
    super(props);
    this.props = props;
    this.layoutProvider = new LayoutProvider(
      (index: number) => 0,
      (type: any, dim: any) => {
        dim.width = width / (props.numColumns || 1);
        dim.height = props.defaultHeight || 100;
      }
    )
    this.contextProvider = new LibContext('parent')
    this.rowRenderer = this.rowRenderer.bind(this)
    this.dataProvider = new DataProvider((a: any, b: any) => a !== b)
    this.state = { data: this.dataProvider.cloneWithRows(props.children), width: width }
  }

  rowRenderer(type: any, data: any, width: number): any {
    return <View style={[{ width: width }]} >{data}</View>
  }

  componentDidUpdate(prevProps: any, prevState: any): void {
    if (prevProps.children !== this.props.children)
      this.setState({ data: this.dataProvider.cloneWithRows(this.props.children) })
  };

  render() {
    const w = this.state.width / (this.props.numColumns || 1)
    return (
      <View onLayout={(e: any) => this.setState({ width: e.nativeEvent.layout.width })} style={[{ flex: 1 }]} >
        <RecyclerListView
          layoutProvider={this.layoutProvider}
          itemAnimator={new BaseItemAnimator()}
          dataProvider={this.state.data}
          forceNonDeterministicRendering={true}
          contextProvider={this.contextProvider}
          rowRenderer={(type: any, data: any) => this.rowRenderer(type, data, w)}
          {...this.props}
        />
      </View>
    )
  }
}