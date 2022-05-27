import { uniq } from 'lodash-es'
import { getCookie } from 'tiny-cookie'

export function extractUniqValue (data, name) {
  return data && data.length ? uniq(data.map((i) => i[name])) : []
}

export function deepCopy (o) {
  var output, v, key
  output = Array.isArray(o) ? [] : {}
  for (key in o) {
    v = o[key]
    output[key] = typeof v === 'object' ? deepCopy(v) : v
  }
  return output
}

export const getAccessToken = () => {
  const accessToken =
    process.env.NODE_ENV === 'development'
      ? localStorage.getItem('access_token')
      : getCookie('__Secure-id_token') ||
        getCookie('__Secure-access_token') ||
        localStorage.getItem('access_token')
  return accessToken
}
