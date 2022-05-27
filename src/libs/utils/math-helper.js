import { round } from 'lodash-es'
import { mapMonthNameToNumber } from 'libs/utils'
export function matrixTranspose (metrix) {
  let res = [...metrix[0].map(() => [])]

  for (let i = 0; i < metrix.length; i++) {
    for (let j = 0; j < metrix[i].length; j++) {
      res[j][i] = metrix[i][j]
    }
  }

  return res
}

function getStyle (el) {
  if (window.getComputedStyle) {
    return window.getComputedStyle(el, null)
  } else {
    return el.currentStyle
  }
}
export function getWH (el, name) {
  let val = name === 'width' ? el.offsetWidth : el.offsetHeight
  let which = name === 'width' ? ['Left', 'Right'] : ['Top', 'Bottom']
  // display is none
  if (val === 0) {
    return 0
  }
  const style = getStyle(el)
  // 左右或上下两边的都减去
  for (let i = 0, a; (a = which[i++]);) {
    val -= parseFloat(style[`border${a}Width`]) || 0
    val -= parseFloat(style[`padding${a}`]) || 0
  }
  return val
}

export function keepDecimal (num, index) {
  const decimals = num.toString().split('.')[1]
  if (decimals && decimals.length > index) {
    return round(num, index)
  }
  return Number(num)
}

export function getDaysInOneMonth (year, month) {
  const monthNum = mapMonthNameToNumber(month)
  const d = new Date(year, monthNum, 0)
  return d.getDate()
}
