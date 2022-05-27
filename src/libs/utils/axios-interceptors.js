import axios from 'axios'

import { OauthHelper } from '@target-energysolutions/hoc-oauth'

import { getAuthToken } from 'libs/utils/oauth-token'

export function initAxiosInterceptors () {
  axios.interceptors.request.use((config) => {
    let shouldAddToken = false
    for (const keyword of API_KEYWORDS) {
      if (config.url.includes(keyword)) {
        shouldAddToken = true
        break
      }
    }
    if (shouldAddToken) {
      const token = getAuthToken()

      config.headers.Authorization = token
    }

    return config
  })

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status === 401) {
        let shouldLogin = false
        for (const keyword of API_KEYWORDS) {
          if (error.config.url != null && error.config.url.includes(keyword)) {
            shouldLogin = true
            break
          }
        }

        if (shouldLogin) {
          OauthHelper.redirectToSSO()
        }
      }

      return error
    },
  )
}
