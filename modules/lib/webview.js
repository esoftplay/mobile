import * as React from 'react';
import { Dimensions, WebView, } from 'react-native';

const injectedScript = function () {
  function waitForBridge() {
    if (window.postMessage.length !== 1) {
      setTimeout(waitForBridge, 300);
    }
    else {
      let height = 0;
      if (document.documentElement.clientHeight > document.body.clientHeight) {
        height = document.documentElement.clientHeight
      }
      else {
        height = document.body.clientHeight
      }
      postMessage(height)
    }
  }
  waitForBridge();
};

class EwebView extends React.Component {
  state = {
    webViewHeight: 0
  };

  static defaultProps = {
    autoHeight: true,
  }

  constructor(props) {
    super(props);
    this.state = {
      webViewHeight: this.props.defaultHeight
    }

    this._onMessage = this._onMessage.bind(this);
  }

  _onMessage(e) {
    this.setState({
      webViewHeight: parseInt(e.nativeEvent.data)
    });
  }

  render() {
    const _w = this.props.width || Dimensions.get('window').width;
    const _h = this.props.autoHeight ? this.state.webViewHeight : this.props.defaultHeight;

    return (
      <WebView
        injectedJavaScript={'(' + String(injectedScript) + ')();'}
        scrollEnabled={this.props.scrollEnabled || false}
        onMessage={(e) => {
          this._onMessage(e)
          setTimeout(() => {
            this.props.onFinishLoad(e)
          },1000);
        }}
        scalesPageToFit={false}
        startInLoadingState
        javaScriptEnabled={true}
        automaticallyAdjustContentInsets={false}
        {...this.props}
        style={[{ width: _w }, this.props.style, { height: _h }]}
      />
    )
  }
}

module.exports = EwebView 
 export default  EwebView;