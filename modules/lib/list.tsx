// 
import React from 'react'
import { Component } from 'react';
import { RecyclerListView, BaseItemAnimator, LayoutProvider, DataProvider } from 'recyclerlistview';
import { Dimensions } from 'react-native';
const { width } = Dimensions.get('window')
import { LibContext } from 'esoftplay';

export interface LibListProps {
  staticWidth?: number,
  staticHeight?: number,
  data: any[],
  renderItem(data: any, index: number): void,
}

export interface LibListState {
  data: any[]
}

export default class EList extends Component<LibListProps, LibListState> {

  layoutProvider: any;
  contextProvider: any;
  dataProvider: any;
  fastList: any;
  props: LibListProps
  state: LibListState

  constructor(props: LibListProps) {
    super(props);
    this.props = props;
    this.layoutProvider = new LayoutProvider(
      (index: number) => {
        return index;
      },
      (type: number, dim: any) => {
        dim.width = this.props.staticWidth || width;
        dim.height = this.props.staticHeight || width;
      }
    )

    this.contextProvider = new LibContext('parent')
    this.rowRenderer = this.rowRenderer.bind(this)
    this.dataProvider = new DataProvider((a: any, b: any) => a !== b)
    this.state = { data: this.dataProvider.cloneWithRows(props.data) }
  }

  rowRenderer(type: number, data: any) {
    return this.props.renderItem(data, type)
  }

  scrollToIndex(x: number, anim: boolean = true) {
    this.fastList.scrollToIndex(x, anim)
  }

  componentDidUpdate(prevProps: LibListProps, prevState: LibListState) {
    if (prevProps.data !== this.props.data) {
      this.setState({
        data: this.dataProvider.cloneWithRows(this.props.data)
      })
    }
  }

  render() {
    return (
      <RecyclerListView
        ref={(e) => this.fastList = e}
        layoutProvider={this.layoutProvider}
        dataProvider={this.state.data}
        itemAnimator={new BaseItemAnimator()}
        forceNonDeterministicRendering={this.props.staticHeight == null}
        contextProvider={this.contextProvider}
        rowRenderer={this.rowRenderer}
        renderAheadOffset={1000}
        {...this.props}

      />
    )
  }
}