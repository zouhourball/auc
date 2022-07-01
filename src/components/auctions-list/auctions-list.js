import { useState } from 'react'

import BiddingCard from 'components/bidding-card'
import AuctionsFilter from 'components/auction-filter'

import { dummyData } from 'components/auctions-public/helper'

import './style.scss'

const AuctionsList = () => {
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
          <div className="title">Live Auctions</div>
        )}
        {modules.includes('upcoming-auctions') && (
          <div className="title">Upcoming Auctions</div>
        )}
        <div>
          Showing Results <span>({dummyData?.length})</span>
        </div>
      </div>
      <AuctionsFilter filterData={filterData} setFilterData={setFilterData} />
      <div className="md-grid auction-list-cards">{renderCards()}</div>
    </div>
  )
}
export default AuctionsList
