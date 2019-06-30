import { Component } from "react";
import { BackHandler } from 'react-native';

export default class SaveComponent <K, S, U=any> extends Component<K, S, U>{
  _isMounted: boolean = false
  navigationFocus: any;
  navigationBlur: any;
  hookBackAndroid: boolean = false
  navigation: any;
  constructor(props: any) {
    super(props)
    this._isMounted = false
    this.setState = this.setState.bind(this)
    this.navigation = props.navigation
    if (this.hookBackAndroid) {
      console.log('disni')
      this.navigationFocus = props.navigation.addListener('didFocus', () => BackHandler.addEventListener('hardwareBackPress', this.onBackPress));
    }
  }

  setState(obj: any, callback?: () => void): void {
    if (this._isMounted)
      super.setState(obj, callback)
  }

  onBackPress(): boolean {
    return true
  }

  componentDidMount(): void {
    this._isMounted = true
    if (this.hookBackAndroid && this.navigation) {
      this.navigationBlur = this.navigation.addListener('willBlur', () => BackHandler.removeEventListener('hardwareBackPress', this.onBackPress));
    }
  }

  componentWillUnmount(): void {
    this._isMounted = false
    if (this.hookBackAndroid) {
      this.navigationBlur && this.navigationBlur.remove()
      this.navigationFocus && this.navigationFocus.remove()
    }
  }

}
