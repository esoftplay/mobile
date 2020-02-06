// useLibs

import React, { useEffect } from 'react';
import { usePersistState, esp, _global } from 'esoftplay';
import { AsyncStorage } from 'react-native';

export default function m<S>(formName: string, def?: S): [S, (a: string) => (v: any) => void, (a?: (x?: S) => void) => void, () => void] {
  const [a, b, d, e] = usePersistState<S>('useForm-' + formName, def)
  function c(field: any) {
    _global.useFormState[formName] = {
      ..._global.useFormState[formName],
      ...field
    }
    b({
      ..._global.useFormState[formName],
      ...a,
      ...field
    })
  }

  useEffect(() => {
    if (!_global.hasOwnProperty('useFormState')) {
      _global.useFormState = {}
    }
    _global.useFormState[formName] = { ..._global.useFormState[formName], ...a }
  }, [a])

  function g(field: string) {
    return (value: any) => {
      c({ [field]: value })
    }
  }

  function h() {
    _global.useFormState[formName] = undefined
    e()
  }

  function f(callback?: (a?: S) => void) {
    d()
    if (callback) {
      AsyncStorage.getItem('useForm-' + formName).then((r) => {
        if (r) {
          callback(JSON.parse(r))
        } else {
          callback(undefined)
        }
      })
    }
  }
  return [a, g, f, h]
}