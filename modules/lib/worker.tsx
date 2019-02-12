import React from 'react';
import { Component } from 'react'
import { WebView, View } from 'react-native';
import { store } from '../../../../App';
import { connect } from 'react-redux';

export interface WorkerInit {
  /** please use pure `javascript browser` function as string, dont load any react native module, and use `window.postMessage(value)` to return a `value` */
  task: string,
  /** `TaskName` for indentifiying props */
  taskName: string,
  /** `output` that return from `window.postMessage` from `task` props */
  result: (res: string) => void,
  /** `true` if you want warker keep alive after  */
  keepAlive: boolean,
  isCurl: boolean
}

export interface LibWorkerProps {
  tasks?: WorkerInit[],
}
export interface LibWorkerState {

}


class Worker extends Component<LibWorkerProps, LibWorkerState> {

  static initState = {
    tasks: []
  }

  static reducer(state: any, action: any): any {
    if (!state) {
      state = Worker.initState
    }
    switch (action.type) {
      case 'lib_worker_add':
        return {
          tasks: [...state.tasks, action.payload]
        }
        break;
      case 'lib_worker_del':
        return {
          tasks: state.tasks.filter((value: any) => value.taskName != action.payload)
        }
        break;
      default:
        return state
    }
  }

  static add(taskName: string, task: string, result: (data: string) => void, keepAlive?: boolean): void {
    if (task.includes('window.postMessage')) {
      store.dispatch({
        type: 'lib_worker_add',
        payload: {
          taskName: taskName,
          task: task,
          result: result,
          keepAlive: !!keepAlive,
          isCurl: false
        }
      })
    } else {
      throw 'Please include window.postMessage on task'
    }
  }
  static delete(taskName: string): void {
    store.dispatch({
      type: 'lib_worker_del',
      payload: taskName
    })
  }

  static mapStateToProps(state: any): any {
    return {
      tasks: state.lib_worker.tasks
    }
  }

  constructor(props: LibWorkerProps) {
    super(props)
  }


  static curl(url: string, options: any, result: (r: any) => void): void {
    function parseObject(obj: any): string {
      var sObj = ''
      let objKeys = Object.keys(obj)
      sObj += '{'
      objKeys.forEach((key: any, index: number) => {
        let value = obj[key]
          if (!value) {
            sObj += '\"' + key + '\":' + value + ','
          } else if (typeof value != 'string') {
            sObj += '\"' + key + '\":' + parseObject(value) + ','
          } else {
            sObj += '\"' + key + '\":\"' + value + '\",'
          }
      })
      return sObj.substring(0, sObj.length - 1) + '}'
    }
    var _task = 'fetch(\"' + url + '\"' + ',' + parseObject(options) + ').then( async (e) => { var r = await e.text(); window.postMessage(r)}).catch((e)=> window.postMessage(e))';
    store.dispatch({
      type: 'lib_worker_add',
      payload: {
        taskName: url,
        task: _task,
        result: result,
        keepAlive: false,
        isCurl: true
      }
    })
  }

  render(): any {
    return (
      <View style={{ width: 0, height: 0 }} >
        {
          this.props.tasks && this.props.tasks.map((item, i) => (
            <WebView
              key={item.taskName + i}
              style={{ width: 0, height: 0 }}
              javaScriptEnabled={true}
              useWebKit
              originWhitelist={['*']}
              injectedJavaScript={item.task || `alert('wow')`}
              source={item.isCurl ? { uri: item.taskName } : { html: '<html><body></body></html>' }}
              onMessage={(e) => {
                item.result(e.nativeEvent.data);
                if (!item.keepAlive) Worker.delete(item.taskName)
              }}
            />
          ))
        }
      </View>
    )
  }
}

export default connect(Worker.mapStateToProps)(Worker)
