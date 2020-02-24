// useLibs

import { useEffect } from 'react';
import { _global, useSafeState } from 'esoftplay';

export default function m<S>(formName: string, def?: S): [S, (a: string) => (v: any) => void, (a?: (x?: S) => void) => void, () => void] {
  const [a, b] = useSafeState<S>(_global.use_form_state && _global.use_form_state[formName] || def)
  function c(field: any) {
    _global.use_form_state[formName] = {
      ..._global.use_form_state[formName],
      ...field
    }
    b({
      ..._global.use_form_state[formName],
    })
  }

  function init() {
    if (!_global.hasOwnProperty('use_form_state')) {
      _global.use_form_state = {}
    }
  }

  useEffect(() => {
    init()
    c(_global.use_form_state[formName])
  }, [])

  useEffect(() => {
    init()
    _global.use_form_state[formName] = { ..._global.use_form_state[formName], ...a }
  }, [a])

  function g(field: string) {
    return (value: any) => {
      c({ [field]: value })
    }
  }

  function h() {
    delete _global.use_form_state[formName]
  }

  function f(callback?: (a?: S) => void) {
    const restate = {
      ..._global.use_form_state[formName],
    }
    if (callback)
      callback(restate)
  }
  return [a, g, f, h]
}