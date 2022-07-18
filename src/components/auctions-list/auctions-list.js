import { useState } from 'react'
import { useTranslation } from 'libs/langs'

import BiddingCard from 'components/bidding-card'
import AuctionsFilter from 'components/auction-filter'

import { dummyData } from 'components/auctions-public/helper'

import './style.scss'

const AuctionsList = () => {
  const { t } = useTranslation()

  const modules = location.pathname.split('/').filter((v) => v !== '')

  const [filterData, setFilterData] = useState({})

  const renderCards = () =>
    dummyData?.map((el, i) => (
      <BiddingCard
        className="md-cell md-cell--6"
        key={i}
        auctionData={el}
        status={'Active'}
        live={modules.includes('live-auctions')}
      />
    ))
  return (
    <div className="auction-list">
      <div className="auction-list-header">
        {modules.includes('live-auctions') && (
          <div className="title">{t('live_auctions')}</div>
        )}
        {modules.includes('upcoming-auctions') && (
          <div className="title">{t('upcoming_auctions')}</div>
        )}
        <div>
          {t('showing_results')}
          <span>({dummyData?.length})</span>
        </div>
      </div>
      <AuctionsFilter filterData={filterData} setFilterData={setFilterData} />
      <div className="md-grid auction-list-cards">{renderCards()}</div>
    </div>
  )
}
export default AuctionsList
