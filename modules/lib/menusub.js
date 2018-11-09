import * as React from 'react'
import { Text, View, FlatList, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';
import esp from 'esoftplay';
const { colorPrimary } = esp.mod('lib/style');

class Emenusub extends React.Component {
  state = {
    expanded: false
  }
  render() {
    const Emenu = esp.mod('lib/menu');
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
                  <Icon name={!this.state.expanded ? "md-arrow-dropdown" : "md-arrow-dropup"} style={{ color: colorPrimary, fontSize: 20, paddingRight: 16 }} />
                </View>
              </TouchableOpacity>
              : null
          }
        </View>
        {this.state.expanded ? <Emenu style={{ paddingLeft: 15 }} selectedId={this.props.selectedId} onItemSelected={(item) => { this.props.onClick(item) }} parent={this.props.id} data={data} /> : null}
      </View>
    )
  }
}
module.exports = Emenusub 
 export default  Emenusub;