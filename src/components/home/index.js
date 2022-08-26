import { Router, Redirect } from '@reach/router'
import { useTranslation } from 'libs/langs'

import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { useQuery } from 'react-apollo'

import { meQuery } from 'libs/queries/me-query.gql'

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

import './style.scss'
import HowItWorks from 'components/how-it-works'
import Notifications from 'components/notifications'

const queryClient = new QueryClient()

const Home = () => {
  const { t } = useTranslation()

  const { data: currentUser } = useQuery(meQuery, {
    notifyOnNetworkStatusChange: true,
    context: {
      uri: `${PRODUCT_WORKSPACE_URL}/graphql`,
    },
  })
  const modules = location.pathname.split('/').filter((v) => v !== '')

  const modulesList = [
    { label: t('broker'), key: 'broker', linkToNewTab: 'broker' },
    {
      label: t('how_it_works'),
      key: 'how-it-works',
      linkToNewTab: 'how-it-works',
    },
    {
      label: t('my_activity'),
      key: 'my-activity',
      subMenu: [
        {
          label: t('my_auctions'),
          link: 'my-auctions',
        },
        { label: t('saved_auctions'), link: 'saved-auctions' },
        { label: t('my_participation'), link: 'my-participation' },
      ],
    },
    {
      label: t('auction_asset'),
      linkToNewTab: 'auction-asset',
      key: 'auction-asset',
    },
    { label: t('contact'), linkToNewTab: 'contact-us', key: 'contact-us' },
  ]

  return (
    <QueryClientProvider client={queryClient}>
      <div className="auction-wrapper">
        <TopBar
          modulesList={modulesList}
          logged
          clear={modules && [modules[0], modules[1]].includes('home')}
          user={currentUser?.mev2?.user}
        />
        <Router>
          <Redirect from="/" to={`/auctions/home`} noThrow />
          {/* <Auctions path={'/add-auction'} /> */}
          <AuctionsPublic
            user={currentUser?.mev2?.user}
            path={'/home'}
            logged
          />
          {['/live-auctions', '/upcoming-auctions'].map((page, i) => (
            <AuctionsList
              user={currentUser?.mev2?.user}
              logged
              key={i}
              path={page}
            />
          ))}
          <BrokerPage path={'/broker'} />
          {['/my-auctions', '/saved-auctions'].map((page, i) => (
            <MyAuctions key={i} path={page} />
          ))}
          <ParticipatedAuctions path={'/my-participation'} />
          <HowItWorks path={'/how-it-works'} />
          <Notifications path={'/notifications'} />
          {[
            '/detail/:auctionId',
            '/detail/:auctionId/public/:callback',
            '/detail/:auctionId/:admin',
          ].map((page, i) => (
            <AuctionDetail
              user={currentUser?.mev2?.user}
              key={i}
              path={page}
              logged
            />
          ))}
          {/* <AuctionDetail path={'/detail/:auctionId'} /> */}
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
