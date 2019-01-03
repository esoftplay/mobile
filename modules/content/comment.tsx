
import React from 'react';
import { Component } from 'react';
import { View, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { Text, Button, Container, Icon } from 'native-base';
import moment from 'moment/min/moment-with-locales'
const { colorPrimary, colorAccent, STATUSBAR_HEIGHT } = esp.mod('lib/style');
import { esp, LibSociallogin, ContentComment_list } from 'esoftplay';
const config = esp.config();

export interface ContentCommentProps {
  navigation: any,
  url?: string,
  id: string,
  url_post?: string,
  user?: any
}

export interface ContentCommentState {
  user: object,
  url: string,
  url_post: string
}

export default class ecomment extends Component<ContentCommentProps, ContentCommentState> {

  state: ContentCommentState
  props: ContentCommentProps

  constructor(props: ContentCommentProps) {
    super(props)
    this.props = props;
    props = props.hasOwnProperty('id') || props.hasOwnProperty('url') ? props : props.navigation.state.params;
    moment.locale('id');
    this.state = {
      url: props.hasOwnProperty('url') ? props.url : config.content + 'user/commentlist/' + props.id,
      url_post: props.hasOwnProperty('url_post') ? props.url_post : config.content + 'user/commentpost/' + props.id,
      user: props.user || 1
    };
  }

  componentDidMount(): void {
    LibSociallogin.getUser((res: any) => {
      if (res) {
        this.setState({ user: res })
      }
    })
  }

  render() {
    const { goBack } = this.props.navigation
    return (
      <KeyboardAvoidingView
        behavior={"padding"}
        keyboardVerticalOffset={20}
        style={styles.container}>
        <Container>
          <View
            style={{ flexDirection: 'row', height: 50 + STATUSBAR_HEIGHT, paddingTop: STATUSBAR_HEIGHT, paddingHorizontal: 0, alignItems: 'center', backgroundColor: colorPrimary }}>
            <Button transparent
              style={{ width: 50, height: 50, alignItems: 'center', margin: 0 }}
              onPress={() => goBack()}>
              <Icon
                style={{ color: colorAccent }}
                name='md-arrow-back' />
            </Button>
            <Text
              style={{
                marginHorizontal: 10,
                fontSize: 18,
                textAlign: 'left',
                flex: 1,
                color: colorAccent
              }}>
              Komentar
            </Text>
          </View>
          <ContentComment_list
            style={{ flex: 1 }}
            setUser={(user: any) => this.setState({ user: user })}
            url={this.state.url} url_post={this.state.url_post}
            user={this.state.user} par_id={0} />
        </Container>
      </KeyboardAvoidingView>
    )
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  }
})
