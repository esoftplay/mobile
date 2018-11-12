/**
 * Created by PeterKong on 2017/12/13.
 */

import React, { Component } from 'react';
import { StyleSheet, View, WebView, Animated, Dimensions } from 'react-native';
import esp from 'esoftplay';
let { width, height } = Dimensions.get('window');
const config = esp.config();

//modify webview error:  https://github.com/facebook/react-native/issues/10865
const patchPostMessageJsCode = `
        (${String(function () {
    var originalPostMessage = window.postMessage
    var patchedPostMessage = function (message, targetOrigin, transfer) {
      originalPostMessage(message, targetOrigin, transfer)
    }
    patchedPostMessage.toString = function () {
      return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage')
    }
    window.postMessage = patchedPostMessage
  })})();
`;

class ewebview extends React.Component {

  static defaultProps = {
    needAnimate: true,
    AnimationDuration: 500,
    defaultHeight: 100,
    needAutoResetHeight: true
  };

  constructor(props) {
    super(props);
    this.state = {
      height: props.defaultHeight,
      source: props.source && props.source.hasOwnProperty('html') ? { html: config.webviewOpen + props.source.html + config.webviewClose } : props.source,
    };
    this._animatedValue = new Animated.Value(1);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.source !== undefined && prevProps.source.html !== this.props.source.html) {
      this.setState({
        source: this.props.source && this.props.source.hasOwnProperty('html') ? { html: config.webviewOpen + this.props.source.html + config.webviewClose } : this.props.source,
      });
      this.WebViewResetHeightFunctionJSInsert();
    }
  }

  gotoShow() {
    if (this.props.needAnimate) this._animatedValue.setValue(0);
    Animated.timing(this._animatedValue, {
      toValue: 1,
      duration: this.props.AnimationDuration
    }).start();
  }

  //insert ResizeHeight JS
  WebViewResetHeightFunctionJSInsert() {
    let jsstr = `
        window.location.hash = 1;
        window.postMessage("height:"+document.body.scrollHeight.toString());`;

    setTimeout(() => {
      this.webview && this.webview.injectJavaScript(jsstr);
    }, 500);
  }

  getMessageFromWebView(event) {
    // console.log("getMessageFromWebView");
    // console.log(event);
    let message = event.nativeEvent.data;
    if (message.indexOf('height') === 0) {
      if (this.heightMessage === undefined || this.heightMessage === null || this.heightMessage === "") {
        this.heightMessage = message;
        if (this.props.needAutoResetHeight) {
          this.resetHeight();
        }
      }
    } else if (this.props.onMessage !== undefined) {
      this.props.onMessage(event);
    }
  }

  resetHeight() {
    if (this.heightMessage === undefined || this.heightMessage === null || this.heightMessage === "") {
      return;
    }
    let message = this.heightMessage;
    let height = message.substr(7);
    this.setState({
      height: (parseInt(height) + 50)
    });
    this.gotoShow();
  }

  resetSmallHeight() {
    this.setState({
      height: this.props.defaultHeight
    });
    this.gotoShow();
  }

  render() {

    let { bounces, onLoadEnd, style, scrollEnabled, automaticallyAdjustContentInsets, scalesPageToFit, onMessage, ...otherprops } = this.props;
    return (
      <Animated.View style={{ height: this.state.height, opacity: this._animatedValue }}>
        <WebView
          {...otherprops}
          ref={e => this.webview = e}
          source={this.state.source}
          bounces={bounces !== undefined ? bounces : true}
          javaScriptEnabled
          injectedJavaScript={patchPostMessageJsCode}
          onLoadEnd={() => {
            this.WebViewResetHeightFunctionJSInsert();
            this.props.onFinishLoad !== undefined
              ?
              setTimeout(() => {
                this.props.onFinishLoad()
              }, 1000)
              :
              null;
          }}
          style={[{ width: width, height: this.state.height }, style !== undefined ? style : {}]}
          scrollEnabled={scrollEnabled !== undefined ? scrollEnabled : false}
          automaticallyAdjustContentInsets={automaticallyAdjustContentInsets !== undefined ? automaticallyAdjustContentInsets : true}
          scalesPageToFit={scalesPageToFit !== undefined ? scalesPageToFit : true}
          onMessage={this.getMessageFromWebView.bind(this)}>
        </WebView>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({

});

module.exports = ewebview;
export default ewebview;
