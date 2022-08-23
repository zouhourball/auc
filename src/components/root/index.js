import PropTypes from 'prop-types'
import withOAuth from '@target-energysolutions/hoc-oauth'
import { Provider } from 'react-redux'
import {
  ApolloProvider,
  // graphql,
  useQuery as useQueryGraphql,
} from 'react-apollo'
import { useMemo } from 'react'
import { Router, Redirect } from '@reach/router'
import { hot } from 'react-hot-loader/root'
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks'
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'

import meQuery from 'libs/queries/me-query.gql'
import { getFSToken, getFSDlToken } from 'libs/api'
import store from 'libs/store'
import { LangProvider, useSupportedLangs } from 'libs/langs'

import App from 'components/app'
import SSO from 'components/sso'
import GeneralErrorBoundary from 'components/general-error-boundary'
import Public from 'components/public'
import Admin from 'components/admin-page'
import RegistrationPage from 'components/registration'

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
  const { data: dataTokenUp } = useQuery('getFSToken', getFSToken)
  const { data: dataTokenDo } = useQuery('getFSDlToken', getFSDlToken)
  store.dispatch({
    type: 'APP_SET_FS_TOKEN',
    payload: { uplToken: dataTokenUp?.['file_token'] },
  })
  store.dispatch({
    type: 'APP_SET_FS_DL_TOKEN',
    payload: { dlToken: dataTokenDo?.['file_token'] },
  })
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
      <RegistrationPage path={'/registration'} />
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
  const auctionRole = roles?.includes('public:auction:template:approver')

  return (
    <Router>
      <SSO path="/sso/callback" ssoCallback={ssoCallback} />
      {auctionRole && (
        <>
          <Redirect from="/auctions/home" to="/admin" />
          <Admin path={'/admin'} />
        </>
      )}

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
