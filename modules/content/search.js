//import liraries
import * as React from '../../../react';
import { View, StyleSheet } from '../../../react-native/Libraries/react-native/react-native-implementation.js';
import { Button, Icon, Input } from 'native-base';
import esp from 'esoftplay';
const { elevation } = esp.mod('lib/style');

// create a component
class Esearch extends React.Component {
  componentWillMount = () => {
    this.inputSearch = this.props.defaultValue || ''
  }

  render() {
    return (
      <View>
        <View style={[{
          backgroundColor: 'white',
          height: 50,
          alignItems: 'center',
          flexDirection: 'row'
        }, elevation(2)]} >
          <Button
            transparent={true}
            style={{
              height: 50,
              width: 50,
            }}
            onPress={() => this.props.close()}>
            <Icon
              name={'arrow-back'}
              style={{
                fontSize: 24,
                color: '#353535'
              }} />
          </Button>
          <Input
            style={{ height: 50, width: '100%', fontSize: 15, color: '#353535' }}
            placeholderTextColor={'#999'}
            defaultValue={this.inputSearch}
            returnKeyType="search"
            onSubmitEditing={() => {
              this.props.close()
              this.props.onSubmit(encodeURI(this.inputSearch))
            }}
            onChangeText={(e) => this.inputSearch = e}
            placeholder={'Temukan Berita ...'} />
          <Button
            transparent={true}
            style={{
              height: 50,
              width: 50,
            }}
            onPress={() => {
              this.props.close()
              this.props.onSubmit(encodeURI(this.inputSearch))
            }}>
            <Icon
              name='search'
              style={{
                fontSize: 24,
                color: '#353535'
              }} />
          </Button>
        </View>
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
});

//make this component available to the app
module.exports = Esearch;
