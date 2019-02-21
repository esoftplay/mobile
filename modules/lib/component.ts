import { Component } from "react";

export default class SaveComponent <K, S, U=any> extends Component<K, S, U>{
  _isMounted: boolean = false
  constructor(props: any) {
    super(props)
    this._isMounted = false
  }

  setState(obj: any, callback?: () => void): void {
    // console.log(this._isMounted)
    if (this._isMounted)
      super.setState(obj, callback)
  }

  componentDidMount(): void {
    this._isMounted = true
  }

  componentWillUnmount(): void {
    this._isMounted = false
  }

}