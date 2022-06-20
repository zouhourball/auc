import { useState } from 'react'

import BiddingCard from 'components/bidding-card'
import AuctionsFilter from 'components/auction-filter'

import { dummyData } from 'components/auctions-public/helper'

const AuctionsList = () => {
  const [filterData, setFilterData] = useState({})

  const renderCards = () =>
    dummyData?.map((el, i) => <BiddingCard key={i} auctionData={el} />)
  return (
    <div>
      <h1>Live Auctions</h1>
      <span>Showing Results ({dummyData?.length})</span>
      <AuctionsFilter filterData={filterData} setFilterData={setFilterData} />
      <div>{renderCards()}</div>
    </div>
  )
}
export default AuctionsList
