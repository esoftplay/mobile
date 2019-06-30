import React from 'react';
import { View, RefreshControl } from 'react-native';
import { LibComponent, LibCurl, LibScroll, LibTextstyle, LibLoading } from 'esoftplay';

export interface LibRollProps {
  url: string,
  renderData: (data: any) => any[],
  onDataChange?: (data: any) => void,
  post?: any,
  msg?: string,
  numColumns?: number,
  defaultHeight?: number,
  children?: any,
  onEndReached?: () => void,
  renderFooter?: () => any,
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

export interface LibRollState {
  data: any,
  msg: string
}

export default class m extends LibComponent<LibRollProps, LibRollState>{

  constructor(props: LibRollProps) {
    super(props);
    this.state = {
      data: undefined,
      msg: ''
    }
    this.loadData = this.loadData.bind(this);
  }

  componentDidMount(): void {
    super.componentDidMount()
    this.loadData()
  }

  loadData(): void {
    const { url, post, msg } = this.props
    this.setState({ data: undefined, msg: '' }, () => {
      if (url)
        new LibCurl(url, post,
          (res, msg) => {
            this.setState({ data: res }, () => {
              if (this.props.onDataChange) {
                this.props.onDataChange(res)
              }
            })
          },
          (_msg) => {
            this.setState({ msg: _msg })
          }
        )
      else
        this.setState({ msg: msg ? msg : "Failed to access" })
    })
  }

  render(): any {
    const { data, msg } = this.state
    const { renderData } = this.props
    return (
      <View style={{ flex: 1 }} >
        {
          msg != '' ?
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
              <LibTextstyle text={msg} textStyle="body" style={{ textAlign: 'center' }} />
            </View>
            :
            !data || data.length == 0 ?
              <LibLoading />
              :
              <LibScroll
                scrollViewProps={{ refreshControl: <RefreshControl refreshing={false} onRefresh={() => this.loadData()} /> }}
                {...this.props}>
                {renderData(data)}
              </LibScroll>
        }
      </View>
    )
  }
}