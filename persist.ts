import { useRef, useEffect, useState } from 'react'
import { AsyncStorage } from 'react-native'

export default function usePersistState(key: string, def?: any): any[] {
  const r = useRef(false)
  const [a, b] = useState(def)

  function c(value: any) {
    if (r.current) {
      AsyncStorage.setItem(key, JSON.stringify(value))
      b(value)
    }
  }

  function e() {
    if (r.current)
      AsyncStorage.getItem(key).then((x) => {
        if (x) {
          c(JSON.parse(x))
        } else {
          c(def)
        }
      })
  }

  function d() {
    AsyncStorage.removeItem(key)
  }

  useEffect(() => {
    r.current = true
    AsyncStorage.getItem(key).then((x) => {
      if (x) {
        c(JSON.parse(x))
      } else {
        c(def)
      }
    })
    return () => { r.current = false }
  }, [])

  return [a, c, e, d]
};