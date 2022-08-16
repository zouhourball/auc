import { OauthHelper } from '@target-energysolutions/hoc-oauth'

import { clearAuthTokenCache } from 'libs/utils/oauth-token'

const oauthConfig = {
  clientId: OAUTH_CLIENT_ID,
  accessTokenUri: `${OAUTH_HOST}/token`,
  authorizationUri: `${OAUTH_HOST}/auth`,
  redirectUri: `${window.location.origin}/sso/callback`,
  userinfoUri: `${OAUTH_HOST}/userinfo`,
  scopes: ['openid', 'email', 'groups', 'profile', 'offline_access'],
}

export function initOauthHelper (jump) {
  OauthHelper.init(oauthConfig, {
    isDev: process.env.NODE_ENV !== 'production',
    historyReplace: (prevUrl) => {
      clearAuthTokenCache()
      if (jump != null) {
        jump(prevUrl)
      } else {
        // fallback to reopen page with previous url
        window.location.href = prevUrl
      }
    },
  })
}
