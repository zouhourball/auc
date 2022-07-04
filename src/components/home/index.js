import { Router, Redirect } from '@reach/router'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

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

import './style.scss'

const queryClient = new QueryClient()

const Home = () => {
  const modules = location.pathname.split('/').filter((v) => v !== '')

  const modulesList = [
    { label: 'Services', key: 'services', linkToNewTab: 'services' },
    {
      label: 'How it works',
      key: 'how-it-works',
      linkToNewTab: 'how-it-works',
    },
    {
      label: 'My activity',
      key: 'my-activity',
      subMenu: [
        {
          label: 'My Auctions',
          link: 'my-auctions',
        },
        { label: 'Saved Auctions', link: 'saved-auctions' },
        { label: 'My Participation', link: 'my-participation' },
      ],
    },
    {
      label: 'Auction Asset',
      linkToNewTab: 'auction-asset',
      key: 'auction-asset',
    },
    { label: 'Contact us', linkToNewTab: 'contact-us', key: 'contact-us' },
  ]

  return (
    <QueryClientProvider client={queryClient}>
      <div className="auction-wrapper">
        <TopBar
          modulesList={modulesList}
          logged
          clear={modules && [modules[0], modules[1]].includes('home')}
        />
        <Router>
          <Redirect from="/" to={`/auctions/home`} noThrow />
          {/* <Auctions path={'/add-auction'} /> */}
          <AuctionsPublic path={'/home'} />
          {['/live-auctions', '/upcoming-auctions'].map((page, i) => (
            <AuctionsList key={i} path={page} />
          ))}
          {['/my-auctions', '/saved-auctions'].map((page, i) => (
            <MyAuctions key={i} path={page} />
          ))}
          <ParticipatedAuctions path={'/my-participation'} />
          <AuctionDetail path={'/detail/:auctionId'} />
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
