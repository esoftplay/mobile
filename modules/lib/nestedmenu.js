import * as React from '../../../react'
import { Text, View, FlatList, TouchableOpacity } from '../../../react-native/Libraries/react-native/react-native-implementation.js';
import { Icon } from 'native-base';
import esp from 'esoftplay';
const { colorPrimary } = esp.mod('lib/style');

class NestedMenu extends React.Component {
  onItemSelected(item) {
    if (this.props.onItemSelected) {
      delete item.data
      this.props.onItemSelected(item)
    }
  }
  render() {
    var parent = this.props.parent ? this.props.parent : 0
    var style = this.props.style ? this.props.style : {}
    var data = this.props.data
    if (parent == 0) {
      data = this.props.data.filter((item) => item.par_id == parent).map((item) => item)
    }
    return (
      <FlatList
        style={style}
        data={data}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <NestedMenuItem {...item} selectedId={this.props.selectedId} data={this.props.data} parent={parent} onClick={(item) => this.onItemSelected(item)} />}
      />
    )
  }
}

class NestedMenuItem extends React.Component {
  state = {
    expanded: false
  }
  render() {
    var data = this.props.data.filter((item) => item.par_id == this.props.id).map((item) => item)
    return (
      <View>
        <View style={{ flexDirection: 'row', paddingRight: 10, alignItems: 'center', backgroundColor: this.props.selectedId == this.props.id ? 'rgba(0,0,0,0.05)' : 'transparent' }}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => {
              this.props.onClick(this.props)
            }}>
            <Text style={{ color: '#353535', flex: 1, padding: 16, fontSize: 15 }} >{this.props.title} </Text>
          </TouchableOpacity>
          {
            data.length > 0 ?
              <TouchableOpacity onPress={() => this.setState({ expanded: !this.state.expanded })} >
                <View style={{ paddingLeft: 10, flexDirection: 'column' }}>
                  <Icon name={!this.state.expanded ? "ios-arrow-down-outline" : "ios-arrow-up-outline"} style={{ color: colorPrimary, fontSize: 20, paddingRight: 16 }} />
                </View>
              </TouchableOpacity>
              : null
          }
        </View>
        {this.state.expanded ? <NestedMenu style={{ paddingLeft: 15 }} selectedId={this.props.selectedId} onItemSelected={(item) => { this.props.onClick(item) }} parent={this.props.id} data={data} /> : null}
      </View>
    )
  }
}
module.exports = NestedMenu;