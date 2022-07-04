import PropTypes from 'prop-types'
import withOAuth from '@target-energysolutions/hoc-oauth'
import {
  Provider,
  // , useSelector, connect
} from 'react-redux'
import {
  ApolloProvider,
  // graphql,
  // useQuery as useQueryGraphql,
} from 'react-apollo'
import { Router } from '@reach/router'
import { hot } from 'react-hot-loader/root'
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks'
import { QueryClient, QueryClientProvider } from 'react-query'
// import { ShellProvider } from '@target-energysolutions/app-shell'
// import { get as getLodash } from 'lodash-es'
// import meQuery from 'libs/queries/me-query.gql'

import { LangProvider, useSupportedLangs } from 'libs/langs'

import App from 'components/app'
import SSO from 'components/sso'
import GeneralErrorBoundary from 'components/general-error-boundary'

import Public from 'components/public'
import Admin from 'components/admin-page'

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
      <Admin path={'/admin'} />
    </Router>
  )
}

const Private = withOAuth()(({ ssoCallback }) => {
  const langs = useSupportedLangs()

  return (
    <Router>
      <SSO path="/sso/callback" ssoCallback={ssoCallback} />
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
