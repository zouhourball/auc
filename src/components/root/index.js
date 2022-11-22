import PropTypes from 'prop-types'
import withOAuth from '@target-energysolutions/hoc-oauth'
import { Provider } from 'react-redux'
import {
  ApolloProvider,
  // graphql,
  useQuery as useQueryGraphql,
} from 'react-apollo'
import { useMemo, useState } from 'react'
import { Router, Redirect } from '@reach/router'
import { hot } from 'react-hot-loader/root'
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks'
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'

import meQuery from 'libs/queries/me-query.gql'
import { getFSToken, getFSDlToken } from 'libs/api'
import store from 'libs/store'
import { LangProvider, useSupportedLangs, useTranslation } from 'libs/langs'

import App from 'components/app'
import SSO from 'components/sso'
import GeneralErrorBoundary from 'components/general-error-boundary'
import Public from 'components/public'
import Admin from 'components/admin-page'
import RegistrationPage from 'components/registration'
import Notifications from 'components/notifications'
import AdminTopBar from 'components/admin-top-bar'
import AuctionDetail from 'components/auction-detail'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

const Root = ({ store, apolloClient }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <GeneralErrorBoundary>
        <LangProvider>
          <ApolloProvider client={apolloClient}>
            <ApolloHooksProvider client={apolloClient}>
              <Provider store={store}>
                {/* <ShellProvider> */}
                <Main />
                {/* </ShellProvider> */}
              </Provider>
            </ApolloHooksProvider>
          </ApolloProvider>
        </LangProvider>
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
  const auctionRole =
    roles?.includes('public:auction:template:approver') &&
    roles?.includes('sys:admin')

  return (
    <Router>
      <SSO path="/sso/callback" ssoCallback={ssoCallback} />
      {auctionRole && (
        <>
          <Redirect from="/auctions/home" to="/admin" />
          <AdminSection path={'/admin/*'} />
          {/* <Admin path={'/admin'} /> */}
        </>
      )}

      <App path="/*" langs={langs} />
    </Router>
  )
})
const AdminSection = () => {
  const { t } = useTranslation()
  const modulesList = [
    { label: t('auctions') },
    {
      label: t('new_registered_broker'),
    },
    { label: t('registered_bidders_brokers') },
  ]
  const [currentTab, setCurrentTab] = useState(0)

  return (
    <div>
      <AdminTopBar
        modules={modulesList}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />

      <Router>
        <Admin path={'/'} currentTab={currentTab} />
        <Notifications path={'/notifications/:admin'} />
        <AuctionDetail path={'/detail/:auctionId'} logged />
      </Router>
    </div>
  )
}
// const Private = () => {
//   const langs = useSupportedLangs()

//   return (
//     <Router>
//       <App path="/*" langs={langs} />
//     </Router>
//   )
// }
