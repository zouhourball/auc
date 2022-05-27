import { merge, isArray, cloneDeep, round } from 'lodash-es'
import humanize from 'humanize-plus'
import {
  customLineOption,
  customBarOption,
  customStackOption,
  waterfall,
  customGaugeOption,
  pieOption,
  mapOption,
  scatterOption,
  radalOption,
  barOption,
  baseOption,
} from 'libs/echarts-options'
import pieWithTimelineOption from 'libs/echarts-options/pie-with-timeline'
import concessionMapOption from 'libs/echarts-options/map'

export const lineCreator = (config) => {
  const { axisData, legendData, unit, detail, zoomInside } = config
  return customLineOption({
    xData: axisData,
    option: {
      dataZoom: zoomInside
        ? [
          {
            //  startValue: zoomStartValue
          },
          {
            type: 'inside',
          },
        ]
        : [],
      legend: {
        data: legendData || Object.keys(detail),
      },
      yAxis: [
        {
          name: unit,
        },
      ],
      series: !isArray(detail)
        ? Object.keys(detail).map((k) => ({
          name: k,
          type: 'line',
          data: detail[k],
        }))
        : [{ data: detail }],
    },
  })
}

export const barCreator = (config) => {
  const { axisData, legendData, unit, detail, precision = 3, isStack } = config
  let series = isArray(detail)
    ? detail
    : Object.keys(detail).map((k) =>
      isStack
        ? {
          name: k,
          stack: 'one',
          type: 'bar',
          data: [...detail[k]],
        }
        : {
          name: k,
          type: 'bar',
          data: [...detail[k]],
        },
    )
  return customBarOption({
    precision,
    useAbbr: config.hasOwnProperty('useAbbr') ? config.useAbbr : true,
    xData: axisData || [],
    option: {
      legend: {
        data: legendData || !isArray ? Object.keys(detail) : [],
      },
      dataZoom: [
        {
          show: true,
          realtime: true,
          start: 0,
          end: 100,
        },
        {
          type: 'inside',
          realtime: true,
          start: 0,
          end: 100,
        },
      ],
      yAxis: [
        {
          name: unit,
        },
      ],
      xAxis: {
        labelTruncation: 'auto',
      },
      series,
      tooltip: config.tooltip || {},
    },
  })
}

const lineBarCreator = (config) => {
  // units: {name: {string}, symbol: {string}} , detail: {[key]: {data: {Array}, unit: {string}}}
  const {
    axisData,
    units,
    detail,
    zoomInside,
    precision = 3,
    rotateLabel,
  } = config
  return customLineOption({
    precision,
    rotateLabel,
    xData: axisData,
    option: {
      dataZoom: zoomInside
        ? [
          {
            //  startValue: zoomStartValue
          },
          {
            type: 'inside',
          },
        ]
        : [],
      legend: {
        data: Object.keys(detail),
      },
      yAxis: units.map((unit) => ({ type: 'value', name: unit.name })),
      series: Object.keys(detail).map((k) => ({
        name: k,
        type: detail[k].unit === (units[0] && units[0].name) ? 'bar' : 'line',
        yAxisIndex: detail[k].unit === (units[0] && units[0].name) ? 0 : 1,
        data: detail[k].data,
      })),
    },
  })
}
const hBarCreator = (config) => {
  const { axisData, legendData, unit, detail } = config
  return barOption({
    option: {
      legend: {
        data: legendData || !isArray ? Object.keys(detail) : [],
      },
      xAxis: [
        {
          type: 'value',
          name: unit,
          data: [],
        },
      ],
      yAxis: [
        {
          type: 'category',
          name: '',
          data: axisData || [],
        },
      ],
      series: isArray(detail)
        ? [{ data: detail, type: 'bar' }]
        : Object.keys(detail).map((k) => ({
          name: k,
          type: 'bar',
          data: [...detail[k]],
        })),
    },
  })
}

export const stackCreator = (config) => {
  const { axisData, legendData, unit, series, ...rest } = config
  return customStackOption({
    xData: axisData,
    option: {
      dataZoom: [
        {
          //  startValue: zoomStartValue
        },
        {
          type: 'inside',
        },
      ],
      legend: {
        data: legendData,
      },
      yAxis: [
        {
          name: unit,
        },
      ],
      series,
      ...rest,
    },
  })
}

export function gaugeCreator (config) {
  const { detail, unit } = config
  const keys = Object.keys(detail)
  const value = keys.map((i) => humanize.compactInteger(detail[i]))
  if (keys[0] === 'undefined') return ''
  const arr = [
    {
      max: detail[keys[1]] * 2,
      axisLabel: {
        padding: -5,
        formatter: (v, index) => {
          return v === detail.PLAN ? 'plan\n|' : ''
        },
      },
      data: [
        {
          value: detail[keys[0]],
          name: `${Math.floor(
            (detail[keys[0]] / detail[keys[1]]) * 100,
          )}%\n ${unit}`,
        },
      ],
      detail: {
        formatter (v) {
          return `${keys[0]} ${value[0]}\n${keys[1]} ${value[1]}`
        },
      },
    },
  ]
  return customGaugeOption({ option: { series: arr } })
}

export function pieCreator (config) {
  const { detail, unit, showValue, showUnit = true, precision = 2 } = config
  const keys = Object.keys(detail)
  const arr = [
    {
      tooltip: {
        formatter: ({ data }) =>
          `${((data && data.value) || '').toLocaleString() || '-'} ${
            (showUnit && unit) || ''
          }`,
      },
      legend: { data: keys },
    },
  ]
  return pieOption({
    option: arr,
    data: keys.map((i) => ({
      name: showValue ? `${i}: ${round(detail[i], precision)}` : i,
      value: round(detail[i], precision),
      label: { show: true, fontSize: 14 },
    })),
  })
}

export const pieTimeLineCreator = (config) => {
  const { categoryNames, timelineLables, legendData, timelineData, data } =
    config
  const baseOptions = {
    timelineLables,
    radius: '35%',
  }
  let companyBreakdown = categoryNames
    .map((type) => {
      return pieWithTimelineOption(
        merge(baseOptions, {
          legend: legendData,
          timelineData: timelineLables.map((month) => ({
            title: { text: type },
            series: [
              {
                data: data[type] && data[type][month],
              },
            ],
          })),
        }),
      )
    })
    .reduce((r, i, k) => {
      r[categoryNames[k]] = i
      return r
    }, {})

  const rootOption = pieWithTimelineOption(
    merge(baseOptions, {
      legend: categoryNames,
      timelineData,
    }),
  )

  return pieWithTimelineOption(
    merge(rootOption, {
      custOptions: {
        rootOption,
        companyBreakdown,
      },
    }),
  )
}

export const scatterCreator = (config) => {
  const { zoomInside, axisData, detail, lableZ, ...rest } = config

  return scatterOption({
    option: {
      legend: {
        data: Object.keys(detail),
      },
      xAxis: [
        {
          data: axisData,
        },
      ],
      dataZoom: zoomInside
        ? [
          {
            //  startValue: zoomStartValue
          },
          {
            type: 'inside',
          },
        ]
        : [],
      series: Object.keys(detail).map((k) => {
        let useData = cloneDeep(detail[k])
        const sizeData = useData.map((d) => (d && d[2]) || 0)
        if (sizeData) {
          const max = Math.max(...sizeData)
          const min = Math.min(...sizeData)

          useData.forEach(
            (d, k) => (d[2] = ((d[2] - min) / (max - min || 1)) * 40 + 10),
          )
        }

        return {
          name: k,
          type: 'scatter',
          symbolSize: (data) => {
            return data[2] || 10
          },
          label: {
            emphasis: {
              show: true,
              formatter: (param) => {
                return param.data[3] || ''
              },
              position: 'top',
            },
          },
          data: useData,
        }
      }),
    },
    lableZ,
    ...rest,
  })
}

export const washlineCreator = (config) => {
  return waterfall(config)
}

export const mapCreator = (config) => {
  const { mapName, data } = config
  let option = mapOption({ mapName, data })
  option.visualMap.show = false
  return option
}
export const radalCreator = (config) => {
  /**
   * detail: {
   *  [Key]: value
   * }
   */
  const { unit, detail, indicator } = config

  return merge({}, radalOption(), {
    title: {
      text: unit,
    },
    radar: {
      indicator,
    },
    series: [
      {
        data: Object.keys(detail || {}).map((item) => ({
          value: detail[item],
        })),
      },
    ],
  })
}

const heatmap = (config) => {
  return merge(baseOption(), {
    geo: {
      show: true,
      map: 'concession',
      roam: true,
    },
    visualMap: {
      min: 0,
      max: config.max / 2,
      splitNumber: 5,
      inRange: {
        color: ['#50a3ba', '#eac736', '#d94e5d'],
      },
    },
    series: [
      {
        type: 'heatmap',
        coordinateSystem: 'geo',
        geoIndex: 0,
        data: config.detail,
      },
    ],
  })
}

const creatorMap = {
  line: lineCreator,
  bar: barCreator,
  'h-bar': hBarCreator,
  stack: stackCreator,
  washline: washlineCreator,
  gauge: gaugeCreator,
  pie: pieCreator,
  radar: radalCreator,
  'line-bar': lineBarCreator,
  /**
   * data = [{
   *  name, // block
   *  value
   * }]
   */
  concessionMap: ({ data }) => concessionMapOption({ data }),
  'pie-timeline': pieTimeLineCreator,
  map: mapCreator,
  scatter: scatterCreator,
  radal: radalCreator,
  heatmap,
}

export const getOption = (config, type) => {
  const creator = creatorMap[type]
  if (creator) {
    return creator(config)
  }
}
export function getDefaultFilterSelection (filterDefs, filterItems, forConfig) {
  let obj = {}
  if (filterDefs) {
    filterDefs.forEach((i) => {
      if (forConfig) {
        if (!i.forConfig) {
          return
        }
      } else if (i.forConfig) {
        return
      }

      const filterName = i.name || i
      const defaultSelect = i.defaultSelect
      const items = filterItems[filterName]

      obj[filterName] = (
        defaultSelect ? items.filter((i) => defaultSelect.includes(i)) : items
      ).map((a, index) => ({
        index,
        name: `${a}`,
      }))
    })
  }

  return obj
}
