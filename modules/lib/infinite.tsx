import React from 'react';
import { View, RefreshControl } from 'react-native';
import { LibComponent, LibList, LibLoading, LibCurl, LibTextstyle, esp, LibListItemLayout } from 'esoftplay';

export interface LibInfiniteProps {
  url: string,
  post?: any,
  onDataChange?: (data: any, counter: number) => void
  error?: string,
  errorView?: any,
  mainIndex?: string,
  bounces?: boolean,
  staticHeight?: number,
  ItemSeparatorComponent?: any,
  ListEmptyComponent?: any,
  ListFooterComponent?: any,
  ListHeaderComponent?: any,
  columnWrapperStyle?: any,
  keyboardShouldPersistTaps?: boolean | "always" | "never" | "handled",
  extraData?: any,
  getItemLayout?: (data: any, index: number) => LibListItemLayout,
  horizontal?: boolean,
  initialNumToRender?: number,
  initialScrollIndex?: number,
  keyExtractor?: (item: any, index: number) => string,
  legacyImplementation?: boolean,
  numColumns?: number,
  onEndReached?: (() => void) | null,
  onEndReachedThreshold?: number | null,
  pagingEnabled?: boolean,
  onRefresh?: (() => void) | null,
  refreshing?: boolean | null,
  renderFooter?: () => any,
  renderItem: (item: any, index: number) => any,
  viewabilityConfig?: any,
  removeClippedSubviews?: boolean,
  style?: any
}

export interface LibInfiniteState {
  isStop: boolean,
  data: any[],
  refreshing: boolean,
  page: number,
  error: string
}

export default class m extends LibComponent<LibInfiniteProps, LibInfiniteState>{

  pages: number[]
  constructor(props: LibInfiniteProps) {
    super(props);
    this.loadData = this.loadData.bind(this);
    this.state = {
      isStop: false,
      data: [],
      refreshing: false,
      page: 0,
      error: ''
    }
    this.pages = []
  }

  componentDidMount(): void {
    super.componentDidMount()
    this.loadData()
  }

  loadData(page?: number): void {
    if (page == undefined) {
      this.setState((state: LibInfiniteState, props: LibInfiniteProps) => {
        return {
          isStop: false,
          error: '',
          data: []
        }
      })
      page = 0
      this.pages = []
    }
    var { url, post } = this.props
    if (page > 0) {
      url += url.includes('?') ? '&' : '?'
      url += 'page=' + page
    }
    if (!this.pages.includes(page))
      new LibCurl(url, post,
        (res, msg) => {
          let mainIndex: any = this.props.mainIndex && res[this.props.mainIndex] || res
          if (mainIndex.list.length == 0 || res.list == '') {
            this.setState((state: LibInfiniteState, props: LibInfiniteProps) => {
              return {
                error: this.props.error || 'Belum ada data',
                isStop: true,
                data: page == 0 ? [] : [...state.data, ...mainIndex.list],
                page: page,
              }
            })
            if (page == 0) {
              return
            }
          } else
            this.setState((state: LibInfiniteState, props: LibInfiniteProps) => {
              return {
                data: page == 0 ? mainIndex.list : [...state.data, ...mainIndex.list],
                page: page,
                isStop: (page || 0) >= (mainIndex.pages || mainIndex.total_page) - 1
              }
            })
        },
        (msg) => {
          this.setState({ error: msg, isStop: true })
        }, 1
      )
    this.pages.push(page)
  }

  componentDidUpdate(prevProps: LibInfiniteProps, prevState: LibInfiniteState): void {
    if (prevState.data != this.state.data) {
      this.props.onDataChange && this.props.onDataChange(this.state.data, this.state.data.length)
    }
  }

  render(): any {
    const { isStop, data, refreshing, page, error } = this.state
    const { renderItem, errorView } = this.props
    // esp.log('DDDDD', data);
    return (
      <View style={{ flex: 1 }} >
        {
          (data && data.length == 0) && isStop && error != '' ?
            errorView ? errorView :
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                <LibTextstyle text={error} textStyle="body" style={{ textAlign: 'center' }} />
              </View>
            :
            (!data || data.length) == 0 && !isStop ?
              <LibLoading />
              :
              <LibList
                data={data}
                onRefresh={() => this.loadData(0)}
                refreshing={false}
                renderFooter={() => !isStop ? <View style={{ padding: 20 }} ><LibLoading /></View> : <View style={{ height: 50 }} />}
                onEndReached={() => !isStop ? this.loadData(page + 1) : {}}
                renderItem={(item, index) => renderItem(item, index)}
                {...this.props}
              />
        }
      </View>
    )
  }
}
