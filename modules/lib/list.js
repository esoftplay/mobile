import * as React from 'react'
import { RecyclerListView, BaseItemAnimator, LayoutProvider, DataProvider, ContextProvider } from 'recyclerlistview';
import { Dimensions } from 'react-native';
const { width } = Dimensions.get('window')

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

class EList extends React.Component {
  constructor(props) {
    super(props);
    this.layoutProvider = new LayoutProvider(
      index => {
        return index;
      },
      (type, dim) => {
        dim.width = this.props.staticWidth || width;
        dim.height = this.props.staticHeight || width;
      }
    )

    this.contextProvider = new ContextHelper('parent')
    this.rowRenderer = this.rowRenderer.bind(this)
    this.dataProvider = new DataProvider((a, b) => a !== b)
    this.state = { data: this.dataProvider.cloneWithRows(props.data) }
  }

  rowRenderer(type, data) {
    return this.props.renderItem(data, type)
  }

  scrollToIndex(x, anim = true) {
    this.fastList.scrollToIndex(x, anim)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: this.dataProvider.cloneWithRows(nextProps.data)
    })
  }

  render() {
    return (
      <RecyclerListView
        ref={(e) => this.fastList = e}
        layoutProvider={this.layoutProvider}
        dataProvider={this.state.data}
        itemAnimator={new BaseItemAnimator()}
        forceNonDeterministicRendering={this.props.staticHeight == null}
        contextProvider={this.contextProvider}
        rowRenderer={this.rowRenderer}
        renderAheadOffset={1000}
        {...this.props}

      />
    )
  }
}
module.exports = EList 
 export default  EList;