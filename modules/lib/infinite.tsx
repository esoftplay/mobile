import React from 'react';
import { View, RefreshControl } from 'react-native';
import { LibComponent, LibList, LibLoading, LibCurl, LibTextstyle, esp } from 'esoftplay';

export interface LibInfiniteProps {
  url: string,
  renderItem: (item: any, index: number) => any,
  post?: any,
  onDataChange?: (data: any, counter: number) => void
  error?: string,
  errorView?: any,
  staticWidth?: number,
  staticHeight?: number,
  onEndReached?: () => void,
  renderFooter?: () => any,
  numColumns?: number,
  bounces?: boolean,
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

export interface LibInfiniteState {
  isStop: boolean,
  data: any[],
  refreshing: boolean,
  page: number,
  error: string
}

export default class m extends LibComponent<LibInfiniteProps, LibInfiniteState>{

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
    }
    var { url, post } = this.props
    if (page > 0) {
      url += url.includes('?') ? '&' : '?'
      url += 'page=' + page
    }
    new LibCurl(url, post,
      (res, msg) => {
        esp.log(res, res.list);
        this.setState((state: LibInfiniteState, props: LibInfiniteProps) => {
          return {
            data: page == 0 ? res.list : [...state.data, ...res.list],
            page: page,
            isStop: (page || 0) >= res.pages - 1
          }
        })
      },
      (msg) => {
        this.setState({ error: msg, isStop: true })
      }, 1
    )
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
                scrollViewProps={{ refreshControl: <RefreshControl refreshing={refreshing} onRefresh={() => this.loadData()} /> }}
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
