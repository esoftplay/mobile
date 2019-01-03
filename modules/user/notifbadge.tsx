// 

import React from 'react';
import { Component } from 'react'
import { View } from 'react-native';
import { Badge, Text } from 'native-base'
import { esp, UserNotification } from 'esoftplay';
import { TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

export interface UserNotifbadgeProps {
  data: any[],
  onPress(): void
}

export interface UserNotifbadgeState {

}


class Enotifbadge extends Component<UserNotifbadgeProps, UserNotifbadgeState> {

  props: UserNotifbadgeProps
  constructor(props: UserNotifbadgeProps) {
    super(props)
    this.props = props
  }

  static mapStateToProps(state: any) {
    return {
      data: state.user_notification.data
    }
  }

  componentDidMount(): void {
    UserNotification.action.user_notification_loadData()
  }

  render() {
    const { data } = this.props
    const counter = data.filter((item: any) => item.status != 2).length
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
export default connect(Enotifbadge.mapStateToProps)(Enotifbadge);