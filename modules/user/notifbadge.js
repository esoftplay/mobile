
import React, { Component } from '../../../react';
import { View } from '../../../react-native/Libraries/react-native/react-native-implementation.js';
import { Badge, Text } from '../../../native-base'
import esp from 'esoftplay';
import { TouchableOpacity } from 'react-native';
import { connect } from '../../../react-redux';
const Enotification = esp.mod('user/notification');


class Enotifbadge extends Component {

  static mapStateToProps = (state) => {
    return {
      data: state.user_notification.data
    }
  }

  componentDidMount() {
    Enotification.action.user_notification_loadData()
  }

  render = () => {
    const { data } = this.props
    const counter = data.filter((item) => item.status != 2).length
    if (counter == 0) { return null }
    return (
      <View style={{ position: 'absolute', top: 5, right: 5 }} >
        <TouchableOpacity onPress={() => this.props.onPress()} >
          <Badge style={{ transform: [{ scale: 0.7 }] }} >
            <Text>{counter}</Text>
          </Badge>
        </TouchableOpacity>
      </View>
    );
  }
}
module.exports = connect(Enotifbadge.mapStateToProps)(Enotifbadge);