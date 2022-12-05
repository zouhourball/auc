import { useEffect } from 'react'

import { Router, Redirect } from '@reach/router'
import { useTranslation } from 'libs/langs'
import { useSelector } from 'react-redux'

import {
  QueryClient,
  QueryClientProvider,
  useQuery as useQueryReact,
} from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { useQuery } from 'react-apollo'

import { meQuery } from 'libs/queries/me-query.gql'
import meOrganizations from 'libs/queries/me-organizations.gql'

// import Auctions from 'components/auctions'
import AuctionsPublic from 'components/auctions-public'
import AuctionsList from 'components/auctions-list'
import AuctionDetail from 'components/auction-detail'
import AuctionAsset from 'components/auction-asset'
import MyAuctions from 'components/my-auctions'
import ParticipatedAuctions from 'components/my-participation'
import MyAuctionDetails from 'components/my-auction-details'
import TopBar from 'components/top-bar'
import Footer from 'components/footer'
import BrokerPage from 'components/broker-page'
import BrokerProfile from 'components/broker-profile'
import HowItWorks from 'components/how-it-works'
import Notifications from 'components/notifications'
import AuctionRequestAppointment from 'components/auction-request-appointment'
import AppointmentsRequests from 'components/appointments-request'
import AppointmentsCalendar from 'components/appointments-calendar'
import { countNotifications } from 'libs/api/auctions-api'
import './style.scss'
import store from 'libs/store'
import ProfilePage from 'components/profile-page'

const queryClient = new QueryClient()

const Home = () => {
  const { t } = useTranslation()

  const { data: currentUser } = useQuery(meQuery, {
    notifyOnNetworkStatusChange: true,
    context: {
      uri: `${PRODUCT_WORKSPACE_URL}/graphql`,
    },
  })
  const { data: myOrgs, refetch } = useQuery(meOrganizations, {
    notifyOnNetworkStatusChange: true,
    context: {
      uri: `${PRODUCT_WORKSPACE_URL}/graphql`,
    },
  })
  const { data: notifNumber, refetch: refetchCount } = useQueryReact(
    ['getCount'],
    countNotifications,
  )
  const meOrgs = useSelector(({ app }) => app?.myOrgs)
  useEffect(() => {
    refetch()
  }, [currentUser])
  useEffect(() => {
    store.dispatch({
      type: 'APP_SET_MY_ORGS',
      payload: { myOrgs: myOrgs?.meOrganizations },
    })
    store.dispatch({
      type: 'APP_SET_USERINFOS',
      payload: { userInfos: currentUser?.mev2?.user },
    })
  }, [myOrgs, currentUser])
  const modules = location.pathname.split('/').filter((v) => v !== '')
  const modulesList = [
    { label: t('broker'), key: 'broker', linkToNewTab: 'broker' },
    { label: t('appointments'), key: 'appointments', linkToNewTab: 'calendar' },

    {
      label: t('how_it_works'),
      key: 'how-it-works',
      linkToNewTab: 'how-it-works',
    },
    {
      label: t('my_activity'),
      key: 'my-activity',
      subMenu: [
        { label: t('saved_auctions'), link: 'saved-auctions' },
        { label: t('my_participation'), link: 'my-participation' },
      ],
    },
    {
      label: t('contact'),
      linkToNewTab: 'contact-us',
      key: 'contact-us',
    },
    // {
    //   label: t('auction_asset'),
    //   linkToNewTab: 'auction-asset',
    //   key: 'auction-asset',
    // },
    // { label: t('contact'), linkToNewTab: 'contact-us', key: 'contact-us' },
  ]
  const modulesListUser = [
    { label: t('broker'), key: 'broker', linkToNewTab: 'broker' },
    {
      label: t('appointments'),
      key: 'appointments',
      subMenu: [
        { label: t('requests'), link: 'requests' },
        { label: t('calendar'), link: 'calendar' },
      ],
    },
    {
      label: t('how_it_works'),
      key: 'how-it-works',
      linkToNewTab: 'how-it-works',
    },
    {
      label: t('my_auctions'),
      key: 'my-auctions',
      linkToNewTab: 'my-auctions',
    },
    {
      label: t('auction_asset'),
      linkToNewTab: 'auction-asset',
      key: 'auction-asset',
    },
    { label: t('contact'), linkToNewTab: 'contact-us', key: 'contact-us' },

    // {
    //   label: t('auction_asset'),
    //   linkToNewTab: 'auction-asset',
    //   key: 'auction-asset',
    // },
    // { label: t('contact'), linkToNewTab: 'contact-us', key: 'contact-us' },
  ]
  // if (myOrgs?.meOrganizations.length > 0) {
  //   modulesListUser

  // } else {
  //   modulesList.push({
  //     label: t('contact'),
  //     linkToNewTab: 'contact-us',
  //     key: 'contact-us',
  //   })
  // }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="auction-wrapper">
        <TopBar
          modulesList={meOrgs?.length > 0 ? modulesListUser : modulesList}
          logged
          clear={modules && [modules[0], modules[1]].includes('home')}
          broker={meOrgs?.length > 0 ? meOrgs?.[0]?.ID : ''}
          notifNumber={notifNumber}
          refetchCount={() => refetchCount()}
        />
        <Router>
          <Redirect from="/" to={`/auctions/home`} noThrow />
          {/* <Auctions path={'/add-auction'} /> */}
          <AuctionsPublic path={'/home'} logged />
          {['/live-auctions', '/upcoming-auctions'].map((page, i) => (
            <AuctionsList meOrgs={meOrgs} logged key={i} path={page} />
          ))}
          <BrokerPage path={'/broker'} logged />
          <BrokerProfile path={'/broker/:brokerId'} logged meOrgs={meOrgs} />
          <ProfilePage path={'/profile'} />
          <ProfilePage path={'/company-profile/:companyId'} company />
          {['/my-auctions', '/saved-auctions'].map((page, i) => (
            <MyAuctions key={i} path={page} meOrgs={meOrgs} />
          ))}
          <ParticipatedAuctions path={'/my-participation'} meOrgs={meOrgs} />
          <HowItWorks path={'/how-it-works'} />
          <Notifications
            path={'/notifications'}
            refetchCount={() => refetchCount()}
          />
          {[
            '/detail/:auctionId',
            '/detail/:auctionId/public/:callback',
            '/detail/:auctionId/:admin',
          ].map((page, i) => (
            <AuctionDetail key={i} path={page} logged meOrgs={meOrgs} />
          ))}
          <AuctionRequestAppointment path={'/appointment/:auctionId'} />
          <AppointmentsRequests path={'/requests'} />
          <AppointmentsCalendar path={'/calendar'} />
          <MyAuctionDetails path={'/my-auction-details/:auctionId'} />
          <AuctionAsset path={'/auction-asset'} />
        </Router>
        <Footer />
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      </div>
    </QueryClientProvider>
  )
}
export default Home
