import BiddingCard from 'components/bidding-card'
import { navigate } from '@reach/router'
import { useTranslation } from 'libs/langs'

import { dummyData } from 'components/auctions-public/helper'

import './style.scss'

const MyAuctions = () => {
  const { t } = useTranslation()

  const modules = location.pathname.split('/').filter((v) => v !== '')

  const renderCards = () =>
    dummyData?.map((el, i) => (
      <BiddingCard
        className="md-cell md-cell--6"
        key={i}
        auctionData={el}
        status={'Active'}
        {...(modules.includes('my-auctions')
          ? { detailsUrl: () => navigate(`/auctions/my-auction-details/${i}`) }
          : {})}
      />
    ))
  return (
    <div className="auction-list">
      <div className="auction-list-header">
        {modules.includes('my-auctions') && (
          <div className="title">{t('my_auctions')}</div>
        )}
        {modules.includes('saved-auctions') && (
          <div className="title">{t('saved_auctions')}</div>
        )}
      </div>
      <div className="md-grid auction-list-cards">{renderCards()}</div>
    </div>
  )
}
export default MyAuctions
