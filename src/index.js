/* eslint-disable jest/require-hook */

import 'styles/index.scss'
import 'normalize.css'

import { createRoot } from 'react-dom/client'
import { navigate } from '@reach/router'

// import { initAxiosInterceptors } from 'libs/utils/axios-interceptors'
import { initOauthHelper } from 'libs/utils/oauth'
import store from 'libs/store'
import configureApolloClient from 'libs/apollo'

import Root from 'components/root'

initOauthHelper(navigate)
// initAxiosInterceptors()

const apolloClient = configureApolloClient()

/* eslint-disable no-console */
console.log(`GIT COMMIT HASH - ${GIT_COMMIT_HASH}`)
/* eslint-enable no-console */

const container = document.getElementById('root')
const root = createRoot(container) // createRoot(container!) if you use TypeScript
root.render(<Root store={store} apolloClient={apolloClient} />)
