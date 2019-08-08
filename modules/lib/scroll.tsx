//

import React from "react"
import { RecyclerListView, BaseItemAnimator, LayoutProvider, DataProvider, ContextProvider } from "recyclerlistview";
import { Dimensions, View, ScrollView } from "react-native";
import { LibComponent, LibContext } from "esoftplay";

/*
Using ScrollView

import { ScrollView } from "react-native"

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

const { width } = Dimensions.get("window");


export interface LibScrollProps {
  numColumns?: number,
  defaultHeight?: number,
  delay?: number,
  children?: any,
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

export interface LibScrollState {
  width: number,
  data: any
}

export default class escroll extends LibComponent<LibScrollProps, LibScrollState> {

  layoutProvider: any;
  contextProvider: any;
  dataProvider: any;
  state: LibScrollState;
  props: LibScrollProps;
  view: any;
  fastScroll: any;
  constructor(props: LibScrollProps) {
    super(props);
    this.props = props;
    this.layoutProvider = new LayoutProvider(
      (index: number) => index,
      (type: any, dim: any) => {
        dim.width = width / (props.numColumns || 1);
        dim.height = props.defaultHeight || 100;
      }
    )
    this.view = React.createRef()
    this.contextProvider = new LibContext("parent")
    this.rowRenderer = this.rowRenderer.bind(this)
    this.dataProvider = new DataProvider((a: any, b: any) => a !== b)
    this.state = { data: this.dataProvider.cloneWithRows(props.children), width: width }
  }

  rowRenderer(index: any, data: any, width: number): any {
    return <View key={index.toString()} style={[{ width: width }]} >{data}</View>
  }

  scrollToIndex(x: number, anim?: boolean): void {
    if (!anim) anim = true;
    this.fastScroll.scrollToIndex(x, anim)
  }


  componentDidMount(): void {
    super.componentDidMount()
    this.setState({ data: this.dataProvider.cloneWithRows(this.props.children) })
    setTimeout(() => {
      this.view && this.view.setNativeProps && this.view.setNativeProps({ opacity: 1 })
    }, this.props.delay || 300);
  }

  componentDidUpdate(prevProps: any, prevState: any): void {
    if (prevProps.children !== this.props.children)
      this.setState({ data: this.dataProvider.cloneWithRows(this.props.children) })
  };

  render(): any {
    const w = this.state.width / (this.props.numColumns || 1)
    return (
      <View ref={(e) => this.view = e} onLayout={(e: any) => this.setState({ width: e.nativeEvent.layout.width })} style={[{ flex: 1, opacity: 0 }]} >
        <RecyclerListView
          ref={(e) => this.fastScroll = e}
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
