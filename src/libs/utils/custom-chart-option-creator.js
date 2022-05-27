import { getTotal } from 'libs/utils/wpb-data-helper'
import { groupBy, isFunction } from 'lodash-es'

/*
data=[

{
 "itemKey": "Target^45^2017^PRODUCTION^Well Costs Operations, Maintenance & Integrity-Actual^1^WPB-S08-BUDGETARY & FINANCIAL",
 "ppdmPdenId": "Target Block 45 WPB 2017",
 "ppdmBaName": "Target",
 "ppdmConcession": "45",
 "ppdmFieldName": "null",
 "ppdmPrimaryProduct": "null",
 "ppdmYear": "2017",
 "ppdmGroupId": "6456DFCEF2FC9F6E926212A770D087FF",
 "ppdmGroupName": "PRODUCTION",
 "ppdmProductType": "16A258758FFCA3F4BA4A64AF038371CF",
 "ppdmProductTypeName": "Well Costs Operations, Maintenance & Integrity-Actual",
 "ppdmAmendmentSeqNo": "1",
 "ppdmReportType": "WPB-S08-BUDGETARY & FINANCIAL",
 "ppdmUwi": "null",
 "ppdmUnit": "$MM",
 "ppdmDataStatus": "ACTUAL",
 "ppdmCostGroup": "OPEX",
 "ppdmJanuary": "1.1727",
 "ppdmFebruary": "0.7006",
 "ppdmMarch": "0.9755",
 "ppdmApril": "0.3923",
 "ppdmMay": "2.0000",
 "ppdmJune": "1.0461",
 "ppdmJuly": "3.2289",
 "ppdmAugust": "1.6081",
 "ppdmSeptember": "0.0000",
 "ppdmOctober": "0.0000",
 "ppdmNovember": "0.0000",
 "ppdmDecember": "0.0000",
 "ppdmRowQuality": "RELEASED",
 "ppdmRowCreatedDate": "null",
 "ppdmRowCreatedBy": "null"
}
]
*/

/**
 * 通用xData处理器，将数据按Data[][xField]分组，并返回组和groupIndex（组索引），x轴标签
 * @param {*} data
 * @param {*} xField
 */
function generalXDataProccessor (data, xField) {
  const groupedData = groupBy(data, xField)
  const xlabels = Object.keys(groupedData)
  return {
    groupedData,
    groupIndex: xlabels,
    xlabels,
  }
}
/**
 * 通用optionCreator工厂函数，返回一个定制的optionCreator
 * @param {*} param0
 */
export function generalLogic ({
  seriesType,
  /**
   * seriesItems :[string]|(data)=>[string]
   * seriesItems 的每一项用来生成一个series
   */
  seriesItems,
  /**
   * filter : (seriesName)=>query
   * 决定该series由哪些数据来生成
   */
  filter,
  /**
   * xDataProcessor : (data,xField)=> {
   *  groupedData :{
   *    [groupIndexL:string]: data
   *  }
   *  groupIndex:string[],
   *  xlabels:string[]
   * }
   */
  xDataProccessor,
  /**
   * 提供除legend,series之外的其它echarts option
   * （{xData,onZoomClick})=> optoin
   */
  optionCreator,
  // 决定如何处理filter之后的数据
  sum,
  // x分组依据
  xField,
}) {
  return ({ data, onZoomClick }) => {
    if (!data) {
      return {}
    }
    const { groupedData, xlabels, groupIndex } = (
      xDataProccessor || generalXDataProccessor
    )(data, xField)

    /*eslint-disable */
    sum = sum || getTotal
    /* eslint-enable */
    let seriesNames = isFunction(seriesItems) ? seriesItems(data) : seriesItems
    return optionCreator({
      xData: xlabels,
      onZoomClick,
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
          data: seriesNames,
        },
        yAxis: [
          {
            name: (data[0] || {}).ppdmUnit || (data[0] || {}).unit,
          },
        ],
        series: seriesNames.map((s) => ({
          name: s,
          type: seriesType,
          data: (groupIndex || xlabels).map((x) =>
            sum(filter(s)(groupedData[x])),
          ),
        })),
      },
    })
  }
}

export function generalStackLogic ({
  seriesType,
  /**
   * seriesItems :[string]|(data)=>[string]
   * seriesItems 的每一项用来生成一个series
   */
  seriesItems,
  /**
   * filter : (seriesName)=>query
   * 决定该series由哪些数据来生成
   */
  filter,
  /**
   * xDataProcessor : (data,xField)=> {
   *  groupedData :{
   *    [groupIndexL:string]: data
   *  }
   *  groupIndex:string[],
   *  xlabels:string[]
   * }
   */
  xDataProccessor,
  /**
   * 提供除legend,series之外的其它echarts option
   * （{xData,onZoomClick})=> optoin
   */
  optionCreator,
  // 决定如何处理filter之后的数据
  after,
  // x分组依据
  params,
  stackItems,
}) {
  return ({ data, onZoomClick, startDate }) => {
    const { groupedData, xlabels, groupIndex } = xDataProccessor(data, {
      startDate,
    })

    /*eslint-disable */
    after = after || (() => {})
    /* eslint-enable */
    let seriesNames = isFunction(seriesItems) ? seriesItems(data) : seriesItems
    let stackNames = isFunction(stackItems) ? stackItems(data) : stackItems

    let series = []
    stackNames.forEach((stack) => {
      seriesNames.forEach((s) => {
        series.push({
          name: `${s}-${stack}`,
          type: seriesType,
          stack,
          data: (groupIndex || xlabels).map((x) => {
            return (
              (filter(s)(groupedData[x])[0] &&
                filter(s)(groupedData[x])[0][
                  `DAILY FIELD PRODUCTION VOLS-${stack}`
                ]) ||
              0
            )
          }),
        })
      })
    })

    return {
      axisData: xlabels,
      legendData: series.map((s) => s.name),
      unit: (data[0] || {}).ppdmUnit || (data[0] || {}).unit,
      series,
    }
  }
}
export function generalStackLogicMonthly ({
  seriesType,
  /**
   * seriesItems :[string]|(data)=>[string]
   * seriesItems 的每一项用来生成一个series
   */
  seriesItems,
  /**
   * filter : (seriesName)=>query
   * 决定该series由哪些数据来生成
   */
  filter,
  /**
   * xDataProcessor : (data,xField)=> {
   *  groupedData :{
   *    [groupIndexL:string]: data
   *  }
   *  groupIndex:string[],
   *  xlabels:string[]
   * }
   */
  xDataProccessor,
  /**
   * 提供除legend,series之外的其它echarts option
   * （{xData,onZoomClick})=> optoin
   */
  optionCreator,
  // 决定如何处理filter之后的数据
  after,
  // x分组依据
  params,
  stackItems,
}) {
  return ({ data, onZoomClick, year }) => {
    const { groupedData, xlabels, groupIndex } = xDataProccessor(data, {
      year,
    })

    /*eslint-disable */
    after = after || (() => {})
    /* eslint-enable */
    let seriesNames = isFunction(seriesItems) ? seriesItems(data) : seriesItems
    let stackNames = isFunction(stackItems) ? stackItems(data) : stackItems

    let series = []
    stackNames.forEach((stack) => {
      seriesNames.forEach((s) => {
        series.push({
          name: `${s}-${stack}`,
          type: seriesType,
          stack,
          data: (groupIndex || xlabels).map((x) => {
            const filteredData = filter(s)(groupedData[x])
            const retItem = filteredData.find((item) => item.dataType === stack)
            return retItem && retItem.value
          }),
        })
      })
    })

    return {
      unit: (data[0] || {}).ppdmUnit || (data[0] || {}).unit,
      legendData: series.map((s) => s.name),
      axisData: xlabels,
      series,
    }
  }
}

export function generalGaugeLogic (data) {
  return ({ data }) => {
    const { Target: target, Actual: actual, unit } = data

    return {
      unit,
      detail: {
        Target: target,
        Actual: actual,
      },
    }
  }
}

export function generalPieLogic (config) {
  const { detail } = config
  const keys = Object.keys(detail)
  const arr = [
    {
      tooltip: {
        formatter: '',
      },
      series: [
        {
          data: keys.map((i) => ({
            name: i,
            value: detail[i],
          })),
        },
      ],
    },
  ]
  return {
    option: arr,
    data: keys.map((i) => ({
      name: i,
      value: detail[i],
    })),
  }
}

export function generalLineLogic ({
  seriesType,
  /**
   * seriesItems :[string]|(data)=>[string]
   * seriesItems 的每一项用来生成一个series
   */
  seriesItems,
  /**
   * filter : (seriesName)=>query
   * 决定该series由哪些数据来生成
   */
  filter,
  /**
   * xDataProcessor : (data,xField)=> {
   *  groupedData :{
   *    [groupIndexL:string]: data
   *  }
   *  groupIndex:string[],
   *  xlabels:string[]
   * }
   */
  xDataProccessor,
  /**
   * 提供除legend,series之外的其它echarts option
   * （{xData,onZoomClick})=> optoin
   */
  optionCreator,
  // 决定如何处理filter之后的数据
  sum,
  // x分组依据
  xField,
}) {
  return ({ data, onZoomClick }) => {
    if (!data) {
      return {}
    }
    const { groupedData, xlabels, groupIndex } = (
      xDataProccessor || generalXDataProccessor
    )(data, xField)

    /*eslint-disable */
    sum = sum || getTotal
    /* eslint-enable */
    let seriesNames = isFunction(seriesItems) ? seriesItems(data) : seriesItems
    return {
      unit: (data[0] || {}).ppdmUnit || (data[0] || {}).unit,
      axisData: xlabels,
      legendData: seriesNames,
      zoomInside: true,
      detail: seriesNames.reduce(
        (pre, s) => ({
          [s]: (groupIndex || xlabels).map((x) =>
            sum(filter(s)(groupedData[x])),
          ),
        }),
        {},
      ),
    }
  }
}

export function generalLineBarLogic ({
  seriesType,
  /**
   * seriesItems :[string]|(data)=>[string]
   * seriesItems 的每一项用来生成一个series
   */
  seriesItems,
  /**
   * filter : (seriesName)=>query
   * 决定该series由哪些数据来生成
   */
  filter,
  /**
   * xDataProcessor : (data,xField)=> {
   *  groupedData :{
   *    [groupIndexL:string]: data
   *  }
   *  groupIndex:string[],
   *  xlabels:string[]
   * }
   */
  xDataProccessor,
  /**
   * 提供除legend,series之外的其它echarts option
   * （{xData,onZoomClick})=> optoin
   */
  optionCreator,
  // 决定如何处理filter之后的数据
  sum,
  // x分组依据
  xField,
}) {
  return ({ data, onZoomClick }) => {
    if (!data) {
      return {}
    }
    const { groupedData, xlabels, groupIndex } = (
      xDataProccessor || generalXDataProccessor
    )(data, xField)

    /*eslint-disable */
    sum = sum || getTotal
    /* eslint-enable */
    let seriesNames = isFunction(seriesItems) ? seriesItems(data) : seriesItems
    return {
      unit: (data[0] || {}).ppdmUnit || (data[0] || {}).unit,
      axisData: xlabels,
      legendData: seriesNames,
      zoomInside: true,
      detail: seriesNames.reduce(
        (pre, s) => ({
          [s]: (groupIndex || xlabels).map((x) =>
            sum(filter(s)(groupedData[x])),
          ),
        }),
        {},
      ),
    }
  }
}
