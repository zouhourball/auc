import PropTypes from 'prop-types'
import withOAuth from '@target-energysolutions/hoc-oauth'
import { Provider } from 'react-redux'
import { ApolloProvider } from 'react-apollo'
import { Router } from '@reach/router'
import { hot } from 'react-hot-loader/root'
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks'
import { ShellProvider } from '@target-energysolutions/app-shell'

import { LangProvider, useSupportedLangs } from 'libs/langs'

import App from 'components/app'
import SSO from 'components/sso'
import GeneralErrorBoundary from 'components/general-error-boundary'

const Root = ({ store, apolloClient, ssoCallback }) => {
  const langs = useSupportedLangs()
  return (
    <GeneralErrorBoundary>
      <Provider store={store}>
        <LangProvider>
          <ApolloProvider client={apolloClient}>
            <ApolloHooksProvider client={apolloClient}>
              <ShellProvider>
                <Router>
                  <SSO path="/sso/callback" ssoCallback={ssoCallback} />
                  <App path="/*" langs={langs} />
                </Router>
              </ShellProvider>
            </ApolloHooksProvider>
          </ApolloProvider>
        </LangProvider>
      </Provider>
    </GeneralErrorBoundary>
  )
}
Root.propTypes = {
  store: PropTypes.object.isRequired,
  apolloClient: PropTypes.object.isRequired,
  ssoCallback: PropTypes.func.isRequired,
}

export default hot(withOAuth()(Root))
