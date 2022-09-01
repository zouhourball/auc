export default {
  clientId: OAUTH_CLIENT_ID,
  clientSecret: OAUTH_CLIENT_SECRET,
  accessTokenUri: `${OAUTH_HOST}/token`,
  authorizationUri: `${OAUTH_HOST}/auth`,
  redirectUri:
    process.env.NODE_ENV !== 'production'
      ? 'http://localhost:8000/sso/callback'
      : `${OAUTH_CALLBACK_HOST}/sso/callback`,
  userinfoUri: `${OAUTH_HOST}/userinfo`,
  scopes: ['openid', 'email', 'groups', 'profile', 'offline_access'],
}
