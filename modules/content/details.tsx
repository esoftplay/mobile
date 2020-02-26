import React from "react";
import { LibComponent, ContentDetail, LibUtils, LibStyle } from "esoftplay";
import { View, ScrollView, FlatList } from "react-native";
const { width } = LibStyle
export interface ContentDetailsProps {
  navigation?: any,
  data: any[],
  id: number,
  title: string,
  url: string,
  created: string,
  image: string,
}

export interface ContentDetailsState {
  datasToShow: any[],
  id: number
}

export default class details extends LibComponent<ContentDetailsProps, ContentDetailsState>{

  _props: any
  scrollView: any;
  constructor(props: ContentDetailsProps) {
    super(props);
    this.state = {
      datasToShow: [],
      id: LibUtils.getArgs(props, "id"),
    }
    this._props = {
      data: LibUtils.getArgs(props, "data").filter((v: any) => v.created != "sponsor"),
    }
    this.scrollView = React.createRef();
    this.getViewableData = this.getViewableData.bind(this);
  }


  componentDidMount(): void {
    super.componentDidMount()
    this.getViewableData(true)
  }

  getViewableData(initial?: boolean): void {
    const _index = this._props.data.indexOf(this._props.data.filter((item: any) => item.id == this.state.id)[0])
    let _indexsToShow: number[] = []
    let scrollToIndex = 0
    if (_index > 0) {
      _indexsToShow.push(_index - 1)
      scrollToIndex = 1
    }
    _indexsToShow.push(_index)
    if (_index < this._props.data.length) {
      _indexsToShow.push(_index + 1)
    }
    const _showData = this._props.data.filter((v: any, i: number) => _indexsToShow.includes(i))
    this.setState({ datasToShow: _showData }, () => {
      if (this.scrollView) {
        setTimeout(() => {
          this.scrollView.scrollToIndex({ index: scrollToIndex, animated: false })
        }, initial ? 100 : 0)
      }
    })
  }

  componentDidUpdate(prevProps: ContentDetailsProps, prevState: ContentDetailsState): void {
    if (prevState.id != this.state.id) {
      this.getViewableData()
    }
  }

  render(): any {
    return (
      <View style={{ flex: 1 }} >
        <FlatList
          ref={(e: any) => this.scrollView = e}
          data={this.state.datasToShow}
          horizontal
          getItemLayout={(data, index) => ({ length: width, offset: width * index, index })}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={160}
          pagingEnabled
          extraData={this.state.id}
          keyExtractor={(e) => e.id}
          onMomentumScrollEnd={(e) => { if (e.nativeEvent.contentOffset.x % width == 0) this.setState({ id: this.state.datasToShow[(e.nativeEvent.contentOffset.x / width)].id }) }}
          renderItem={({ item, index }) => (
            <View style={{ width }} >
              <ContentDetail
                id={item.id}
                url={item.url}
                title={item.title}
                created={item.created}
                image={item.image}
                navigation={this.props.navigation} />
            </View>
          )}
        />
      </View>
    )
  }
}