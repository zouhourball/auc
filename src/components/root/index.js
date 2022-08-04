import PropTypes from 'prop-types'
import withOAuth from '@target-energysolutions/hoc-oauth'
import { Provider } from 'react-redux'
import {
  ApolloProvider,
  // graphql,
  useQuery as useQueryGraphql,
} from 'react-apollo'
import { Router, Redirect } from '@reach/router'
import { hot } from 'react-hot-loader/root'
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks'
import { QueryClient, QueryClientProvider } from 'react-query'
// import { ShellProvider } from '@target-energysolutions/app-shell'
// import { get as getLodash } from 'lodash-es'
import meQuery from 'libs/queries/me-query.gql'

import { LangProvider, useSupportedLangs } from 'libs/langs'

import App from 'components/app'
import SSO from 'components/sso'
import GeneralErrorBoundary from 'components/general-error-boundary'

import Public from 'components/public'
import Admin from 'components/admin-page'
import { useMemo } from 'react'

const queryClient = new QueryClient()

const Root = ({ store, apolloClient }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <GeneralErrorBoundary>
        <Provider store={store}>
          <LangProvider>
            <ApolloProvider client={apolloClient}>
              <ApolloHooksProvider client={apolloClient}>
                {/* <ShellProvider> */}
                <Main />
                {/* </ShellProvider> */}
              </ApolloHooksProvider>
            </ApolloProvider>
          </LangProvider>
        </Provider>
      </GeneralErrorBoundary>
    </QueryClientProvider>
  )
}
Root.propTypes = {
  store: PropTypes.object.isRequired,
  apolloClient: PropTypes.object.isRequired,
  // ssoCallback: PropTypes.func.isRequired,
}

export default hot(Root)
const Main = () => {
  // const { data } =
  //   location.pathname.split('/').filter((v) => v !== '')[0] !== 'home'
  //     ? useQueryGraphql(meQuery, {
  //       notifyOnNetworkStatusChange: true,
  //       context: {
  //         uri: `${PRODUCT_WORKSPACE_URL}/graphql`,
  //       },
  //     })
  //     : {}
  // const me = data?.mev2
  // console.log(me, 'userInfo')

  return (
    <Router>
      <Public path={'/public/*'} />
      <Private path={'/*'} />
    </Router>
  )
}

const Private = withOAuth()(({ ssoCallback }) => {
  const langs = useSupportedLangs()
  const { data } = useQueryGraphql(meQuery, {
    notifyOnNetworkStatusChange: true,
    context: {
      uri: `${PRODUCT_WORKSPACE_URL}/graphql`,
    },
  })
  const roles = useMemo(() => data?.mev2?.roles, [data])
  const auctionRole = roles?.map((role) => {
    let roleSplitted = role.split(':')
    return (roleSplitted = roleSplitted
      .slice(roleSplitted?.length - 3, roleSplitted?.length)
      .join(' '))
  })

  return (
    <Router>
      <SSO path="/sso/callback" ssoCallback={ssoCallback} />
      {auctionRole?.find((el) => el === 'auction template approver') && (
        <>
          <Redirect from="/auctions/home" to="/admin" />
        </>
      )}
      <Admin path={'/admin'} />

      <App path="/*" langs={langs} />
    </Router>
  )
})
// const Private = () => {
//   const langs = useSupportedLangs()

//   return (
//     <Router>
//       <App path="/*" langs={langs} />
//     </Router>
//   )
// }
