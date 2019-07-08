import React from "react";
import { LibComponent, LibTextstyle } from "esoftplay";
import { View } from "react-native";

export interface LibToastProps {
  show?: boolean,
  text?: string
}
export interface LibToastState {
  show: boolean,
  text?: string
}
export type LibToastInterval = 2000 | 3000

export default class Toast extends LibComponent<LibToastProps, LibToastState>{

  timeout: any
  constructor(props: LibToastProps) {
    super(props)
    this.state = { show: false, text: undefined }
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
  }

  show(msg: string): void {
    this.setState({ show: true, text: msg }, () => {
      if (this.timeout) {
        clearTimeout(this.timeout)
        this.timeout = undefined
      }
      this.timeout = setTimeout(() => {
        this.setState({ show: false, text: undefined })
      }, 3000);
    })
  }

  hide(): void {
    this.setState({ show: false, text: undefined })
  }

  render(): any {
    let text = this.state.text || this.props.text || "Tekan sekali lagi untuk keluar"
    if (!this.state.show && !this.props.show) {
      return null
    }
    return (
      <View style={{ position: "absolute", bottom: 60, left: 24, right: 24, alignItems: "center", justifyContent: "center", flexDirection: 'row' }} >
        <View style={{ backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", alignItems: "center", borderRadius: 5, paddingHorizontal: 26, paddingVertical: 5 }} >
          <LibTextstyle text={text} textStyle={"footnote"} style={{ color: 'white' }} />
        </View>
      </View>
    )
  }
}