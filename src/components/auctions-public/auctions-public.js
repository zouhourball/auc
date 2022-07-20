// import { useState } from 'react'

//
//

import HomeSlider from 'components/home-slider'

import { useQuery } from 'react-query'
import { featuredAuctions, listAuction } from 'libs/api/auctions-api'
import UpcomingAuctions from 'components/upcoming-auctions/upcoming-auctions.js'

const AuctionsPublic = () => {
  //

  const { data: featAuctions } = useQuery('featuredAuctions', featuredAuctions)
  const { data: upcomingAuctionsData } = useQuery(
    ['UpcomingAuctions', 'Upcoming'],
    listAuction,
  )

  return (
    <>
      <HomeSlider auctions={featAuctions?.results} />
      <UpcomingAuctions cards={upcomingAuctionsData?.results} />
    </>
  )
}
export default AuctionsPublic
