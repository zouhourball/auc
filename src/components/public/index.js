import { Suspense } from 'react'
import { Router, Redirect, navigate } from '@reach/router'

import { OauthHelper } from '@target-energysolutions/hoc-oauth'
// import Auctions from 'components/auctions'
import AuctionsPublic from 'components/auctions-public'
import AuctionsList from 'components/auctions-list'
import AuctionDetail from 'components/auction-detail'
import TopBar from 'components/top-bar'
import Footer from 'components/footer'

import './style.scss'

const Public = () => {
  const modules = location.pathname.split('/').filter((v) => v !== '')
  const goTo = (link) => {
    window.location.href = link
  }
  const { authorizationUri, clientId, scopes } = OauthHelper.config

  const modulesList = [
    { label: 'Services', key: 'services', linkToNewTab: 'services' },
    {
      label: 'How it works',
      key: 'how-it-works',
      linkToNewTab: 'how-it-works',
    },

    { label: 'Contact us', linkToNewTab: 'contact-us', key: 'contact-us' },
  ]
  return (
    <div className="public-view">
      <TopBar
        modulesList={modulesList}
        logged={false}
        clear={modules && [modules[0], modules[1]].includes('home')}
        onClickLoginUrl={() => navigate('/auctions')}
        onClickRegisterUrl={() =>
          goTo(
            `${authorizationUri}?client_id=${clientId}&redirect_uri=${BASE_ENV_URL}/sso/callback&response_type=code&state=&scope=${scopes.join(
              '%20',
            )}&is_register=true`,
          )
        }
      />

      <Suspense fallback={<div>Loading...</div>}>
        <Router>
          <Redirect from="/" to="/public/home" noThrow />
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
