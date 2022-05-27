import { uniq, isArray } from 'lodash-es'
export function fixNbr (value, fixNum = 3) {
  return Number((Number(value) || 0).toFixed(fixNum))
}
export function extractUniqValue (data, name) {
  if (data && isArray(data)) {
    return uniq(data.map((item) => item[name]))
  } else {
    return []
  }
}
