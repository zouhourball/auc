import { useState } from 'react'

import BiddingCard from 'components/bidding-card'
import AuctionsFilter from 'components/auction-filter'

import { dummyData } from 'components/auctions-public/helper'

import './style.scss'

const AuctionsList = () => {
  const [filterData, setFilterData] = useState({})

  const renderCards = () =>
    dummyData?.map((el, i) => (
      <BiddingCard
        className="md-cell md-cell--6"
        key={i}
        auctionData={el}
        status={'Active'}
      />
    ))
  return (
    <div className="auction-list">
      <div className="auction-list-header">
        <div className="title">Live Auctions</div>
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
