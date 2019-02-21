// 
import React from "react"
import { Component } from "react";
import { RecyclerListView, BaseItemAnimator, LayoutProvider, DataProvider } from "recyclerlistview";
import { Dimensions } from "react-native";
const { width } = Dimensions.get("window")
import { LibContext, LibComponent } from "esoftplay";

export interface LibListProps {
  staticWidth?: number,
  staticHeight?: number,
  data: any[],
  renderItem: (data: any, index: number) => void,
  onEndReached?: () => void,
  renderFooter?: () => any,
  bounces?: boolean,
  layoutProvider?: any,
  dataProvider?: any,
  contextProvider?: any,
  initialOffset?: number,
  renderAheadOffset?: number,
  isHorizontal?: boolean,
  onScroll?: (rawEvent: any, offsetX: number, offsetY: number) => void,
  onRecreate?: Function,  
  onEndReachedThreshold?: number,
  initialRenderIndex?: number,
  scrollThrottle?: number,
  canChangeSize?: boolean,
  distanceFromWindow?: number,
  useWindowScroll?: boolean,
  disableRecycling?: boolean,
  forceNonDeterministicRendering?: boolean,
  extendedState?: any,
  itemAnimator?: any,
  optimizeForInsertDeleteAnimations?: boolean,
  style?: any,
  scrollViewProps?: any
}

export interface LibListState {
  data: any[]
}

export default class EList extends LibComponent<LibListProps, LibListState> {
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

    this.contextProvider = new LibContext("parent")
    this.rowRenderer = this.rowRenderer.bind(this)
    this.dataProvider = new DataProvider((a: any, b: any) => a !== b)
    this.state = { data: this.dataProvider.cloneWithRows(props.data) }
  }

  rowRenderer(type: number, data: any): any {
    return this.props.renderItem(data, type)
  }

  scrollToIndex(x: number, anim?: boolean): void {
    if (!anim) anim = true;
    this.fastList.scrollToIndex(x, anim)
  }

  componentDidUpdate(prevProps: LibListProps, prevState: LibListState): void {
    if (prevProps.data !== this.props.data) {
      this.setState({
        data: this.props.data
      })
    }
  }

  render(): any {
    return (
      <RecyclerListView
        ref={(e) => this.fastList = e}
        layoutProvider={this.layoutProvider}
        dataProvider={this.dataProvider.cloneWithRows(this.state.data)}
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