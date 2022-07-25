/* eslint-disable jest/require-hook */
import ApolloClient from 'apollo-boost'
import ClientOauth2 from 'client-oauth2'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { WebSocketLink } from 'apollo-link-ws'
import { HttpLink } from 'apollo-link-http'
import { getMainDefinition } from 'apollo-utilities'
import { split, ApolloLink, concat } from 'apollo-link'
import { onError } from 'apollo-link-error'
import { InMemoryCache } from 'apollo-cache-inmemory'

import oauthConfig from 'libs/oauth'
import { getAuthToken } from 'libs/utils/oauth-token'

const token = getAuthToken()

export const wsClient = new SubscriptionClient(
  `${PRODUCT_APP_URL_API_WEBSOCKET}/auction/graphql/subscriptions?access_token=${token}`,
  {
    // uri: '/auction/graphql/query',
    reconnect: true,
  },
)

const wsLink = new WebSocketLink(wsClient)
// wsClient.onConnected(() => console.log('websocket connected!!'))
wsClient.onDisconnected(() => {
  if (getAuthToken()) {
    wsClient.url = `${PRODUCT_APP_URL_API_WEBSOCKET}/auction/graphql/subscriptions?access_token=${token}`
  }
})
const httpLink = new HttpLink({
  // uri: '/auction/graphql/query',
})
const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  const accessToken = getAuthToken()
  operation.setContext({
    headers: {
      Authorization: accessToken ? `Bearer ${accessToken}` : null,
    },
  })

  return forward(operation)
})
const linkError = onError(({ graphQLErrors, networkError }) => {
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
})

const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  concat(authMiddleware, httpLink, linkError),
)

export default function configureApolloClient () {
  return new ApolloClient({
    // uri: GRAPHQL_API,
    link,
    cache: new InMemoryCache(),
  })
}
