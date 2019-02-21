import React from "react";
import { LibComponent } from "esoftplay";
import { Animated, View, Text, NetInfo } from "react-native";
import { store } from "../../../../App";
import { connect } from "react-redux";

export interface LibNet_statusProps {
  isOnline?: boolean
}
export interface LibNet_statusState {
  animHeight: any
}


class net_status extends LibComponent<LibNet_statusProps, LibNet_statusState> {
  static reducer(state: any, action: any): any {
    if (!state) {
      state = {
        isOnline: true
      }
    }

    switch (action.type) {
      case "lib_net_status_online":
        return {
          isOnline: true
        }
        break;
      case "lib_net_status_offline":
        return {
          isOnline: false
        }
        break;
      default:
        return state
    }
  }

  static setOnline(isOnline: boolean): void {
    store.dispatch({ type: isOnline ? "lib_net_status_online" : "lib_net_status_offline" })
  }

  static mapStateToProps(state: any): any {
    return {
      isOnline: state.lib_net_status.isOnline
    }
  }

  constructor(props: LibNet_statusProps) {
    super(props)
    this.state = { animHeight: 1 }
    this.onChangeConnectivityStatus = this.onChangeConnectivityStatus.bind(this)
  }

  componentDidMount(): void {
    super.componentDidMount()
    NetInfo.isConnected.fetch().then(isConnected => {
      this.setState({ animHeight: isConnected ? 1 : 2 })
      net_status.setOnline(isConnected)
    });
    NetInfo.isConnected.addEventListener("connectionChange", this.onChangeConnectivityStatus)
  }

  componentWillUnmount(): void {
    super.componentWillUnmount()
    NetInfo.isConnected.removeEventListener("connectionChange", this.onChangeConnectivityStatus)
  }

  onChangeConnectivityStatus(isConnected: boolean): void {
    net_status.setOnline(isConnected)
    if (isConnected) {
      setTimeout(() => {
        this.setState({ animHeight: 1 })
      }, 1500)
    } else {
      this.setState({ animHeight: 2 })
    }
  }

  render(): any {
    const { animHeight } = this.state
    const { isOnline } = this.props
    const text = isOnline ? "Device is Online" : "Device is Offline"
    const color = isOnline ? "green" : "red"
    return (
      <Animated.View style={{ height: animHeight == 1 ? 0 : undefined, backgroundColor: color, width: "100%" }} >
        <Text style={{ margin: 3, color: "white", textAlign: "center" }} >{text}</Text>
      </Animated.View>
    )
  }
}

export default connect(net_status.mapStateToProps)(net_status)
