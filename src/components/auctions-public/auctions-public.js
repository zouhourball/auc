// import { useState } from 'react'

//
//

import HomeSlider from 'components/home-slider'

import { useQuery } from 'react-query'
import { featuredAuctions, listAuction } from 'libs/api/auctions-api'
import UpcomingAuctions from 'components/upcoming-auctions/upcoming-auctions.js'

const AuctionsPublic = ({ logged, user }) => {
  //

  const { data: featAuctions } = useQuery(
    ['featuredAuctions', 'Upcoming', 4],
    featuredAuctions,
  )
  const { data: upcomingAuctionsData } = useQuery(
    [logged ? 'UpcomingAuctions' : 'featuredAuctions', 'Upcoming', 4],
    logged ? listAuction : featuredAuctions,
  )

  return (
    <>
      <HomeSlider logged={logged} auctions={featAuctions?.results} />
      <UpcomingAuctions
        cards={upcomingAuctionsData?.results}
        logged={logged}
        user={user}
      />
    </>
  )
}
export default AuctionsPublic
