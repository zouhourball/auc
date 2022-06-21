import PropTypes from 'prop-types'
import withOAuth from '@target-energysolutions/hoc-oauth'
import { Provider } from 'react-redux'
import { ApolloProvider } from 'react-apollo'
import { Router } from '@reach/router'
import { hot } from 'react-hot-loader/root'
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks'
import { QueryClient, QueryClientProvider } from 'react-query'
// import { ShellProvider } from '@target-energysolutions/app-shell'

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
  ssoCallback: PropTypes.func.isRequired,
}

export default hot(Root)
const Main = () => {
  return (
    <Router>
      <Public path={'/*'} />
      <Private path={'/auctions/*'} />
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
