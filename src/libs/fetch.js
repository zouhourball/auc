import fetch from 'isomorphic-fetch'
import * as cookies from 'tiny-cookie'
import * as api from 'libs/api'
export async function refresh () {
  const oldRefreshToken = cookies.get('refresh_token')
  if (!oldRefreshToken) {
    return false
  }
  const { accessToken, refreshToken } = await api.refresh(oldRefreshToken)
  if (accessToken) {
    cookies.set('access_token', accessToken)
    cookies.set('refresh_token', refreshToken)
    return true
  }
  return false
}

export function fetchGeneric (url, opts, auth = true) {
  let token
  if (auth && process.env.NODE_ENV !== 'production') {
    token = localStorage.getItem('access_token')
  } else {
    token =
      cookies.get('__Secure-id_token') || cookies.get('__Secure-access_token')
  }
  return fetch(url, {
    ...opts,
    headers: {
      ...((opts || {}).isFormData
        ? {}
        : {
          'Content-Type': 'application/json',
        }),
      Authorization: `Bearer ${token}`,
      ...((opts && opts.headers) || {}),
    },
  })
}

export async function fetchJSON (url, opts, auth = true) {
  const res = await fetchGeneric(url, opts, auth)

  if (!res.ok) {
    const oldRefreshToken = cookies.get('refresh_token')
    if (res.status === 401 && auth && oldRefreshToken) {
      if (await refresh()) {
        // return await fetchJSON(url, opts, true)
      } else {
        const err = new Error('authentication error')
        err.status = res.status
        throw err
      }
    } else {
      const failed = await res.json()
      const err = new Error(
        failed?.error?.msg || failed?.message || 'network status error',
      )

      err.status = res.status
      try {
        const json = await res.json()
        if (json) {
          err.body = json
        }
      } catch (e) {
        // ignore if there is no json body
      }
      throw err
    }
  }

  let json
  try {
    json = await res.json()
    if (json.error) {
      const err = new Error('error')
      err.body = json.error
      throw err
    }
  } catch (e) {
    // ignore if response is no json.
  }

  return json
}
export function uploadFormData (url, { body, ...rest }) {
  return fetchJSON(url, {
    isFormData: true,
    body,
    ...rest,
  })
}

export async function uploadFile (url, file, opts) {
  const fileData = new FormData()
  fileData.append('file', file)
  const json = await fetchJSON(url, {
    method: 'PUT',
    isFormData: true,
    body: fileData,
    ...opts,
  })

  return json.body || json
}
