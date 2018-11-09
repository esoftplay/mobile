import * as React from 'react'
import { Text, View, FlatList, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';
import esp from 'esoftplay';
const { colorPrimary } = esp.mod('lib/style');
const Emenusub = esp.mod('lib/menusub');

class Emenu extends React.Component {
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
        keyExtractor={item => (item.id).toString()}
        renderItem={({ item }) => <Emenusub {...item} selectedId={this.props.selectedId} data={this.props.data} parent={parent} onClick={(item) => this.onItemSelected(item)} />}
      />
    )
  }
}

module.exports = Emenu 
 export default  Emenu;