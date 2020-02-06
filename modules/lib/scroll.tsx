//

import React from "react"
import { RecyclerListView, BaseItemAnimator, LayoutProvider, DataProvider, ContextProvider } from "recyclerlistview";
import { Dimensions, View, ScrollView, FlatList } from "react-native";
import { LibComponent, LibContext } from "esoftplay";
import { LibListItemLayout } from "esoftplay/modules/lib/list";

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
  defaultHeight?: number,
  bounces?: boolean,
  style?: any,
  staticHeight?: number,
  ItemSeparatorComponent?: any,
  ListEmptyComponent?: any,
  ListFooterComponent?: any,
  ListHeaderComponent?: any,
  columnWrapperStyle?: any,
  onScroll?: (e: any) => void,
  scrollEventThrottle?: number,
  keyboardShouldPersistTaps?: boolean | "always" | "never" | "handled",
  children?: any[],
  extraData?: any,
  pagingEnabled?: boolean,
  horizontal?: boolean,
  initialNumToRender?: number,
  initialScrollIndex?: number,
  keyExtractor?: (item: any, index: number) => string,
  legacyImplementation?: boolean,
  numColumns?: number,
  onEndReached?: (() => void) | null,
  onEndReachedThreshold?: number | null,
  onRefresh?: (() => void) | null,
  refreshing?: boolean | null,
  viewabilityConfig?: any,
  removeClippedSubviews?: boolean,
}

export interface LibScrollState {
  width: number,
  data: any
}

export default class escroll extends LibComponent<LibScrollProps, LibScrollState> {

  flatscroll = React.createRef<FlatList<View>>();
  constructor(props: LibScrollProps) {
    super(props);
  }

  rowRenderer(index: any, data: any): any {
    return <View key={index.toString()}>{data}</View>
  }

  scrollToIndex(x: number, anim?: boolean): void {
    if (!anim) anim = true;
    this.flatscroll.current!.scrollToIndex({ index: x, animated: anim })
  }

  render(): any {
    return (
      <View style={[{ flex: 1 }]} >
        <FlatList
          ref={this.flatscroll}
          data={this.props.children}
          refreshing={false}
          windowSize={5}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          keyExtractor={(_, i) => i.toString()}
          {...this.props}
          renderItem={({ item, index }) => this.rowRenderer(index, item)}
        />
      </View>
    )
  }
}
