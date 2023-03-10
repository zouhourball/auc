import { Suspense } from 'react'
import { Router, Redirect, navigate } from '@reach/router'
import { useTranslation } from 'libs/langs'

import { OauthHelper } from '@target-energysolutions/hoc-oauth'
// import Auctions from 'components/auctions'
import AuctionsPublic from 'components/auctions-public'
import AuctionsList from 'components/auctions-list'
import AuctionDetail from 'components/auction-detail'
import TopBar from 'components/top-bar'
import Footer from 'components/footer'
import BrokerPage from 'components/broker-page'
import BrokerProfile from 'components/broker-profile'
import HowItWorks from 'components/how-it-works'

import './style.scss'

const Public = () => {
  const { t } = useTranslation()

  const modules = location.pathname.split('/').filter((v) => v !== '')
  const goTo = (link) => {
    window.location.href = link
  }
  const { authorizationUri, clientId, scopes } = OauthHelper.config

  const modulesList = [
    { label: t('broker'), key: 'broker', linkToNewTab: 'broker' },
    {
      label: t('how_it_works'),
      key: 'how-it-works',
      linkToNewTab: 'how-it-works',
    },

    { label: t('contact'), linkToNewTab: 'contact-us', key: 'contact-us' },
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

      <Suspense fallback={<div>{t('loading')}</div>}>
        <Router>
          <Redirect from="/" to="/public/home" noThrow />
          {/* <Auctions path={'/add-auction'} /> */}
          <AuctionsPublic path={'/home'} />
          {['/live-auctions', '/upcoming-auctions'].map((page, i) => (
            <AuctionsList key={i} path={page} />
          ))}
          <BrokerPage path={'/broker'} logged={false} />
          <BrokerProfile path={'/broker/:brokerId'} />

          <AuctionDetail path={'/detail/:auctionId'} />
          <HowItWorks path={'/how-it-works'} />
        </Router>
      </Suspense>

      <Footer />
    </div>
  )
}
export default Public
