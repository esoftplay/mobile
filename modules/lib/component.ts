import { Component } from "react";

export default class SaveComponent <K, S, U = any> extends Component<K, S, U>{
  _isMounted: boolean = false
  state: any
  props: any
  constructor(props: any) {
    super(props)
    this._isMounted = false
    this.setState = this.setState.bind(this)
  }

  setState(obj: any, callback?: () => void): void {
    if (this._isMounted)
      super.setState(obj, callback)
  }

  shouldComponentUpdate(nextProps: any, nextState: any): boolean {
    return this.props != nextProps || this.state != nextState;
  }

  onBackPress(): boolean {
    return true
  }

  componentDidMount(): void {
    this._isMounted = true
  }

  componentWillUnmount(): void {
    this._isMounted = false
  }

}
