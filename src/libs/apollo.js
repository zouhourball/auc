import ApolloClient from 'apollo-boost'
import ClientOauth2 from 'client-oauth2'

import oauthConfig from 'libs/oauth'
import { getAuthToken } from 'libs/utils/oauth-token'

export default function configureApolloClient () {
  return new ApolloClient({
    // uri: GRAPHQL_API,
    request (operation) {
      const accessToken = getAuthToken()
      operation.setContext(({ headers }) => {
        return {
          headers: {
            ...headers,
            Authorization: accessToken ? `Bearer ${accessToken}` : null,
          },
        }
      })
    },
    onError ({ graphQLErrors, networkError }) {
      const client = new ClientOauth2(oauthConfig)
      const redirectToSSO = () => {
        localStorage.setItem('redirectTo', window.location.pathname)
        window.location.href = client.code.getUri()
      }
      if (graphQLErrors) {
        // alert(
        //   'We meet some GraphQL errors. Please edit `src/libs/apollo.js` to handle those errors.',
        // )
      }
      if (
        networkError &&
        networkError.statusCode === 401 &&
        location.pathname !== '/sso/callback'
      ) {
        redirectToSSO()
      }
    },
  })
}
