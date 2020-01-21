// withHooks

import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import ScrollPicker from 'react-native-picker-scrollview';
import { useSafeState, LibLoading, LibToastProperty } from 'esoftplay';

export interface LibDatepickerProps {
  minDate: string,
  maxDate: string,
  monthsDisplay?: string[],
  selectedDate: string,
  onDateChange: (date: string) => void
}

export default function m(props: LibDatepickerProps): any {

  const refYear = useRef<any>(null)
  const refMonth = useRef<any>(null)
  const refDate = useRef<any>(null)

  const minDate = props.minDate
  const maxDate = props.maxDate
  const selectedDate = props.selectedDate || minDate
  const sYear = Number(selectedDate.split('-')[0])
  const sMonth = Number(selectedDate.split('-')[1])
  const sDate = Number(selectedDate.split('-')[2])
  const minYear = Number(minDate.split('-')[0])
  const maxYear = Number(maxDate.split('-')[0])
  const minMonth = Number(minDate.split('-')[1]) - 1
  const maxMonth = Number(maxDate.split('-')[1]) - 1
  const minDay = Number(minDate.split('-')[2])
  const maxDay = Number(maxDate.split('-')[2])
  const monthsName = props.monthsDisplay || ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
  const [years, setYears] = useSafeState<number[]>([])
  const [months, setMonths] = useSafeState<string[]>([])
  const [dates, setDates] = useSafeState<number[]>([])
  const [year, setYear] = useSafeState<number>(sYear)
  const [month, setMonth] = useSafeState<string>(monthsName[sMonth - 1])
  const [date, setDate] = useSafeState<number>(sDate)

  function generateMonths(year: number) {
    let m = 0
    let n = monthsName.length

    if (years.indexOf(year) == 0) {
      m = minMonth

    }
    if (years.indexOf(year) == years.length - 1) {
      n = maxMonth + 1

    }
    let reset = false
    let _months = [...monthsName].slice(m, n)
    if ((_months.length - 1) < months.indexOf(month)) {
      reset = true
    }
    setMonths(_months)
    if (reset) {
      refMonth.current!.scrollToIndex(0)
      setMonth(monthsName[0])
    }
  }

  function generateDays(year: number, month: string) {
    function generateNumberBetween(start: number, end: number) {
      let list = [];
      for (let i = start; i <= end; i++) {
        list.push(i);
      }
      return list
    }
    const dateCount = new Date(year, monthsName.indexOf(month) + 1, 0).getDate()
    let m = 1
    let n = dateCount
    let reset = false
    if (minYear == year && minMonth == monthsName.indexOf(month)) {
      m = minDay
    }
    if (maxYear == year && maxMonth == monthsName.indexOf(month)) {
      n = maxDay > dateCount ? dateCount : maxDay
    }
    dates.indexOf(date)
    let _dates = generateNumberBetween(m, n)
    if (_dates.length - 1 < dates.indexOf(date)) {
      reset = true
    }
    setDates(_dates)
    if (reset) {
      refDate.current!.scrollToIndex(0)
    }
  }

  useEffect(() => {
    generateYears()
  }, [minDate, maxDate])

  useEffect(() => {
    if (years.length > 0)
      generateMonths(year)
  }, [year, years])

  useEffect(() => {
    generateDays(year, month)
  }, [month, year])

  function generateYears() {
    let list = [];
    for (let i = minYear; i <= maxYear; i++) {
      list.push(i);
    }
    setYears(list)
  }

  function getDateChange() {
    const monthNumber = monthsName.indexOf(refMonth.current!.getSelected()) + 1
    const date = refDate.current!.getSelected()
    const dateSelected = refYear.current!.getSelected() + '-' + String(monthNumber < 10 ? ('0' + monthNumber) : monthNumber) + '-' + String(date < 10 ? ('0' + date) : date)
    if (props.onDateChange)
      props.onDateChange(dateSelected)
    else {
      console.log(dateSelected)
      LibToastProperty.show(dateSelected)
    }
  }

  if (!years) {
    return <LibLoading />
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }} >
      <View style={{ height: 44, alignItems: 'flex-end', backgroundColor: '#f1f2f3' }} >
        <TouchableOpacity onPress={() => { getDateChange() }} >
          <Text style={{ fontSize: 15, fontWeight: "500", paddingHorizontal: 9, paddingVertical: 13, fontStyle: "normal", letterSpacing: 0, color: "#007aff" }} >Done</Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: 175, flexDirection: 'row' }} >
        <ScrollPicker
          ref={refYear}
          style={{ flex: 1, backgroundColor: 'white' }}
          dataSource={years}
          selectedIndex={years.indexOf(year)}
          itemHeight={35}
          wrapperHeight={175}
          wrapperColor={'#ffffff'}
          highlightColor={'#c8c7cc'}
          renderItem={(data: any, index: number, isSelected: boolean) => {
            return (
              <View>
                <Text style={{ fontWeight: isSelected ? 'bold' : 'normal' }} >{data}</Text>
              </View>
            )
          }}
          onValueChange={(data: any, selectedIndex: number) => {
            setYear(data)
          }}
        />
        <ScrollPicker
          ref={refMonth}
          style={{ flex: 1, backgroundColor: 'white' }}
          dataSource={months}
          selectedIndex={months.indexOf(month)}
          itemHeight={35}
          wrapperHeight={175}
          wrapperColor={'#ffffff'}
          highlightColor={'#c8c7cc'}
          renderItem={(data: any, index: number, isSelected: boolean) => {
            return (
              <View>
                <Text style={{ fontWeight: isSelected ? 'bold' : 'normal' }} >{data}</Text>
              </View>
            )
          }}
          onValueChange={(data: any, selectedIndex: number) => {
            setMonth(data)
          }}
        />
        <ScrollPicker
          ref={refDate}
          style={{ flex: 1, backgroundColor: 'white' }}
          dataSource={dates}
          selectedIndex={dates.indexOf(date)}
          itemHeight={35}
          wrapperHeight={175}
          wrapperColor={'#ffffff'}
          highlightColor={'#c8c7cc'}
          renderItem={(data: any, index: number, isSelected: boolean) => {
            return (
              <View>
                <Text style={{ fontWeight: isSelected ? 'bold' : 'normal' }} >{data}</Text>
              </View>
            )
          }}
          onValueChange={(data: any, selectedIndex: number) => {
            setDate(data)
          }}
        />
      </View>
    </View>
  )
}