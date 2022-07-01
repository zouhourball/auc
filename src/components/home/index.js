import { Router, Redirect } from '@reach/router'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

// import Auctions from 'components/auctions'
import AuctionsPublic from 'components/auctions-public'
import AuctionsList from 'components/auctions-list'
import AuctionDetail from 'components/auction-detail'
import AuctionAsset from 'components/auction-asset'
import TopBar from 'components/top-bar'
import Footer from 'components/footer'

import './style.scss'

const queryClient = new QueryClient()

const Home = () => {
  const modules = location.pathname.split('/').filter((v) => v !== '')

  const modulesList = [
    { label: 'Services', link: '', key: 'services', linkToNewTab: '' },
    {
      label: 'How it works',
      link: '',
      key: 'how-it-works',
      linkToNewTab: '',
    },
    { label: 'My activity', link: '', key: 'my-activity' },
    {
      label: 'Auction Asset',
      linkToNewTab: 'auction-asset',
      key: 'auction-asset',
    },
    { label: 'Contact us', link: '', key: 'contact-us' },
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
          <AuctionDetail path={'/detail/:auctionId'} />
          <AuctionAsset path={'/auction-asset'} />
        </Router>
        <Footer />
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      </div>
    </QueryClientProvider>
  )
}
export default Home
