// useLibs

import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useSafeState } from 'esoftplay'
import { isEqual } from 'lodash'


export default function m(a: (state: any) => any): any {
  const b = useSelector(a, isEqual)
  const [c, d] = useSafeState(b || null)

  useEffect(() => {
    if (b != null)
      d(b)
  }, [b])

  return c
}