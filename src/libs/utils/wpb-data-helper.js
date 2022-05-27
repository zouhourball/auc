import { MonthNames } from 'libs/consts'
import { uniq, curry } from 'lodash-es'

export function add (a, b) {
  return a + b
}

export function getDataFromFilters (data, filterGroup) {
  const { Year, Unit, Company, KPI } = filterGroup
  const concessions = Company
    ? Object.keys(Company).reduce(
      (r, k) => r.concat(Object.keys(Company[k])),
      [],
    )
    : []
  const KPIs = Object.keys(KPI || {})
  const dataStatus = Object.keys(filterGroup['Data Status'] || {})

  return dataFilter(
    dataFilter(data, [
      { attr: 'ppdmYear', value: Year },
      { attr: 'ppdmUnit', value: Unit },
      { attr: 'ppdmDataStatus', value: dataStatus },
      { attr: 'ppdmConcession', value: concessions },
    ]),
    [{ attr: 'ppdmProductTypeName', value: KPIs }],
    (src, target) => src.indexOf(target) !== -1,
  )
}

export function getTotal (data, filters) {
  return getAddedMonthly(data, filters).reduce(add, 0)
}

export function dataFilter (
  data,
  filters,
  matcher = (src, target) => src === target,
) {
  if (!data || !filters || filters.length === 0) {
    return data
  }
  let localData = data
  filters.forEach((filter) => {
    const filterValue = filter && filter.value
    if (filterValue) {
      if (!Array.isArray(filterValue)) {
        localData = localData.filter((i) =>
          matcher(i[filter.attr], filterValue),
        )
      } else {
        localData = localData.filter((i) =>
          filterValue.some((s) => matcher(i[filter.attr], s)),
        )
      }
    }
  })
  return localData
}

export function getAddedMonthly (data, filters) {
  const actualData = dataFilter(data, filters)
  if (actualData && actualData.length) {
    const res = actualData[0]
    return MonthNames.map((m) => {
      const monthKey = Object.keys(res).find((k) => k.indexOf(m) >= 1)
      return actualData.reduce((r, i) => r + (Number(i[monthKey]) || 0), 0)
    })
  } else {
    return new Array(MonthNames.length).fill(0)
  }
}

export function getMonthly (data, filters) {
  const actualData = dataFilter(data, filters)
  if (actualData && actualData.length) {
    const res = actualData[0]
    return MonthNames.map(
      (m) => Number(res[Object.keys(res).find((k) => k.indexOf(m) >= 0)]) || 0,
    )
  } else {
    return new Array(MonthNames.length).fill(0)
  }
}

export function mapMonthNameToNumber (monthName) {
  switch (monthName) {
    case 'January':
    case 'Jan':
      return 1

    case 'February':
    case 'Feb':
      return 2

    case 'March':
    case 'Mar':
      return 3

    case 'April':
    case 'Apr':
      return 4

    case 'May':
      return 5

    case 'June':
    case 'Jun':
      return 6

    case 'July':
    case 'Jul':
      return 7

    case 'August':
    case 'Aug':
      return 8

    case 'September':
    case 'Sep':
      return 9

    case 'October':
    case 'Oct':
      return 10

    case 'November':
    case 'Nov':
      return 11

    case 'December':
    case 'Dec':
      return 12

    default:
      return new Date().getMonth() + 1
    // throw new Error(`Unknown month name: \`${monthName}\``)
  }
}

/**
 * @param data {Array} 2d array
 * */
export function reduceMultipleMonthly (data) {
  let res = new Array(12).fill(0)
  for (let i = 0; i < res.length; ++i) {
    for (let j = 0; j < data.length; ++j) {
      res[i] += data[j][i]
    }
  }

  return res
}

export function extractUniqValue (data, name) {
  if (data) {
    return uniq(data.map((item) => item[name]))
  } else {
    return []
  }
}
export const extractUniqCurry = curry((prop, data) =>
  extractUniqValue(data, prop),
)
