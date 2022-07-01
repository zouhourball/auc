import { Suspense } from 'react'
import { Router, Redirect, navigate } from '@reach/router'

// import Auctions from 'components/auctions'
import AuctionsPublic from 'components/auctions-public'
import AuctionsList from 'components/auctions-list'
import AuctionDetail from 'components/auction-detail'
import TopBar from 'components/top-bar'
import Footer from 'components/footer'

import './style.scss'

const Public = () => {
  const modules = location.pathname.split('/').filter((v) => v !== '')

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
      <TopBar
        modulesList={modulesList}
        logged={false}
        clear={modules && [modules[0], modules[1]].includes('home')}
        onClickLoginUrl={() => navigate('/auctions')}
      />

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
