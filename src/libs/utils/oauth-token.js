import { get } from 'js-cookie'

let authToken = null

function getAuthTokenWithoutCache () {
  if (process.env.NODE_ENV !== 'production') {
    authToken = localStorage.getItem('access_token')
  } else {
    authToken = get('__Secure-id_token') || get('__Secure-access_token') || null
  }
}

export function clearAuthTokenCache () {
  authToken = null
}

export function getAuthToken () {
  if (authToken == null) {
    getAuthTokenWithoutCache()
  }

  return authToken
}
