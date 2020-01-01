import React from 'react';
import { View } from 'react-native';
import { LibComponent } from 'esoftplay';
import { connect } from 'react-redux';
import App from '../../../../App'
export interface ContentConfigProps {
  navigation: any
}
export interface ContentConfigState {

}

class m extends LibComponent<ContentConfigProps, ContentConfigState> {

  static initState = {
    list: {
      template: "list.html.php",
      title: "1",
      title_link: "1",
      intro: "1",
      created: "1",
      modified: "1",
      author: "0",
      tag: "1",
      tag_link: "1",
      rating: "1",
      read_more: "1",
      tot_list: "12",
      thumbnail: "1"
    },
    detail: {
      template: "detail.html.php",
      title: "1",
      created: "1",
      modified: 0,
      author: "1",
      tag: "1",
      tag_link: "1",
      rating: "1",
      rating_vote: "1",
      thumbsize: "250",
      comment: 1,
      comment_auto: "1",
      comment_list: "9",
      comment_form: "1",
      comment_emoticons: "1",
      comment_spam: "0",
      comment_email: "1",
      pdf: "1",
      print: "1",
      email: "1",
      share: "1"
    }
  }

  static persist = true;
  static reducer(state: any, action: any): any {
    if (state == undefined) state = m.initState
    const actions: any = {
      "content_config_list": {
        ...state,
        list: action.payload
      },
      "content_config_detail": {
        ...state,
        detail: action.payload
      },
    }
    const _action = actions[action.type]
    return _action ? _action : state
  }

  static setList(config: any): void {
    App.getStore().dispatch({
      type: 'content_config_list',
      payload: config
    })
  }

  static setDetail(config: any): void {
    App.getStore().dispatch({
      type: 'content_config_detail',
      payload: config
    })
  }

  render(): any {
    return null
  }
}

export default m;