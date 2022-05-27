import { uniq, isArray, get } from 'lodash-es'
import { MonthNames } from '../consts'
import { format, differenceInCalendarDays } from 'date-fns'
import reduxStore from 'libs/store'

import immer from 'immer'
export * from './language'
/**
 * Abbreviate a phrase use space split words
 * @param {String} phrase - One phrase use space split words
 * @param {Number} minSize - If string length bigger than minSize, will return abbreviation string
 */
export function abbr (phrase, minSize = '15') {
  if (phrase && phrase.length > minSize) {
    const str = phrase.toLowerCase()
    const t = str.split(' ')
    let res = ''
    for (let i in t) {
      res += t[i].substring(0, 1).toUpperCase()
    }
    return res
  } else {
    return phrase
  }
}

export function groupBy (key, data) {
  return data.reduce((r, i) => {
    if (!r[i[key]]) {
      r[i[key]] = []
    }
    r[i[key]].push(i)
    return r
  }, {})
}
export function buildExpPrediction (exp) {
  return `exp-prediction://${exp}`
}

export function extractUniqValue (data, name) {
  if (data && isArray(data)) {
    return uniq(data.map((item) => item[name]))
  } else {
    return []
  }
}

export function mapMonthNameToNumber (monthName) {
  switch (monthName) {
    case 'January':
    case 'JANUARY':
    case 'Jan':
    case 'JAN':
      return 1

    case 'February':
    case 'FEBRUARY':
    case 'Feb':
    case 'FEB':
      return 2

    case 'March':
    case 'MARCH':
    case 'Mar':
    case 'MAR':
      return 3

    case 'April':
    case 'Apr':
    case 'APRIL':
    case 'APR':
      return 4

    case 'May':
    case 'MAY':
      return 5

    case 'June':
    case 'Jun':
    case 'JUN':
    case 'JUNE':
      return 6

    case 'July':
    case 'Jul':
    case 'JUL':
    case 'JULY':
      return 7

    case 'August':
    case 'Aug':
    case 'AUG':
    case 'AUGUST':
      return 8

    case 'September':
    case 'SEPTEMBER':
    case 'Sep':
    case 'SEP':
      return 9

    case 'October':
    case 'OCTOBER':
    case 'Oct':
    case 'OCT':
      return 10

    case 'November':
    case 'NOVEMBER':
    case 'Nov':
    case 'NOV':
      return 11

    case 'December':
    case 'DECEMBER':
    case 'Dec':
    case 'DEC':
      return 12

    default:
      return 0
  }
}

export function sortMonthNames (names) {
  const sortable = names.map(mapMonthNameToNumber)
  sortable.sort((a, b) => a - b)
  return sortable.map((i) => MonthNames[i - 1])
}
export function sortByYearAndMonth (items) {
  function compare (a, b) {
    const [aYear, aMonth] = a.split('-')
    const [bYear, bMonth] = b.split('-')
    if (aYear === bYear) {
      if (mapMonthNameToNumber(aMonth) > mapMonthNameToNumber(bMonth)) {
        return 1
      }
    } else {
      return aYear - bYear
    }
  }
  return immer(items, (draft) => {
    draft.sort(compare)
  })
}

export function buildJsonQuery (obj) {
  return `json://${JSON.stringify(obj)}`
}

export function dateFormat (date) {
  const d = new Date(date)
  return format(d, 'MM/DD/YYYY')
}

export function urlToModuleName (url) {
  let [, , module, sub] = url.split('/')
  return {
    currentModule: module,
    currentSubModule: sub === 'analytics' ? null : sub,
  }
}

export function fixNbr (value, fixNum = 3) {
  return Number((Number(value) || 0).toFixed(fixNum))
}

export function validURL (str) {
  let regex =
    /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(#[-a-z\d_]*)?$/i
  if (!regex.test(str)) {
    return false
  } else {
    return true
  }
}

export function newDatePolyfill (d) {
  if (!d) return
  let date = new Date(d)
  // Sarafi need to this hack
  if (date.toString() === 'Invalid Date') {
    date = new Date(d.replace(/([0-9]+-[0-9]+-[0-9]+).*/, '$1'))
  }
  return date
}

export function getDays () {
  const store = reduxStore.getState()
  const { startDate, endDate } = store.commonAnalytics.sharedFilters.dateRange
  const days = differenceInCalendarDays(new Date(endDate), new Date(startDate))
  return days + 1
}
export function getMonths (filterKey = 'production-monthly') {
  const store = reduxStore.getState()
  const year = get(store, `commonAnalytics.sharedFilters.${filterKey}.year`, [])
  const month = get(
    store,
    `commonAnalytics.sharedFilters.${filterKey}.month`,
    [],
  )
  return {
    year,
    month,
  }
}
