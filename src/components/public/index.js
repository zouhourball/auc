import { Suspense } from 'react'
import { Router, Redirect } from '@reach/router'

// import Auctions from 'components/auctions'
import AuctionsPublic from 'components/auctions-public'
import AuctionsList from 'components/auctions-list'
import AuctionDetail from 'components/auction-detail'
import TopBar from 'components/top-bar'
import Footer from 'components/footer'

const Public = () => {
  const modulesList = [
    { label: 'Services', link: '', key: 'services', linkToNewTab: '' },
    {
      label: 'How it works',
      link: '',
      key: 'how-it-works',
      linkToNewTab: 'newtab',
    },

    { label: 'Contact us', link: '', key: 'contact-us' },
  ]
  return (
    <div className="public-view">
      <TopBar modulesList={modulesList} />

      <Suspense fallback={<div>Loading...</div>}>
        <Router>
          <Redirect from="/" to="/home" noThrow />
          {/* <Auctions path={'/add-auction'} /> */}
          <AuctionsPublic path={'/home'} />
          {['/live-auctions', '/upcoming-auctions'].map((page, i) => (
            <AuctionsList key={i} path={page} />
          ))}
          <AuctionDetail path={'/detail/:auctionId'} />
        </Router>
      </Suspense>

      <Footer />
    </div>
  )
}
export default Public
