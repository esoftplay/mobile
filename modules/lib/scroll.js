import * as React from 'react'
import { RecyclerListView, BaseItemAnimator, LayoutProvider, DataProvider, ContextProvider } from 'recyclerlistview';
import { Dimensions, View } from 'react-native';

/*
Using ScrollView

import { ScrollView } from 'react-native'

<ScrollView>
  //scrollable item
  //scrollable item
  //scrollable item
  //scrollable item
</ScrollView>

Using this class for lazy load

var Escroll = esp.mod("lib/scroll")

<Escroll>
  //scrollable item
  //scrollable item
  //scrollable item
  //scrollable item
</Escroll>
*/


const { width } = Dimensions.get('window');
class ContextHelper extends ContextProvider {
  constructor(uniqueKey) {
    super();
    this._contextStore = {};
    this._uniqueKey = uniqueKey;
  }

  getUniqueKey() {
    return this._uniqueKey;
  };

  save(key, value) {
    this._contextStore[key] = value;
  }

  get(key) {
    return this._contextStore[key];
  }

  remove(key) {
    delete this._contextStore[key];
  }
}

class Escroll extends React.Component {
  constructor(props) {
    super(props);
    this.layoutProvider = new LayoutProvider(
      index => 0,
      (type, dim) => {
        dim.width = width / (props.numColumns || 1);
        dim.height = props.defaultHeight || 100;
      }
    )
    this.contextProvider = new ContextHelper('parent')
    this.rowRenderer = this.rowRenderer.bind(this)
    this.dataProvider = new DataProvider((a, b) => a !== b)
    this.state = { data: this.dataProvider.cloneWithRows(props.children), width: width }
  }

  rowRenderer(type, data, width) {
    return <View style={[{ width: width }]} >{data}</View>
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.children !== this.props.children)
      this.setState({ data: this.dataProvider.cloneWithRows(this.props.children) })
  };

  render() {
    const w = this.state.width / (this.props.numColumns || 1)
    return (
      <View onLayout={e => this.state.width = e.nativeEvent.layout.width} style={[{ flex: 1, },]} >
        <RecyclerListView
          layoutProvider={this.layoutProvider}
          itemAnimator={new BaseItemAnimator()}
          dataProvider={this.state.data}
          forceNonDeterministicRendering={true}
          contextProvider={this.contextProvider}
          rowRenderer={(type, data) => this.rowRenderer(type, data, w)}
          {...this.props}
        />
      </View>
    )
  }
}
module.exports = Escroll 
 export default  Escroll;