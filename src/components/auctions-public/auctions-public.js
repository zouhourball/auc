// import { useState } from 'react'

//
//
import UpcomingAuctions from 'components/upcoming-auctions'
import HomeSlider from 'components/home-slider'

import { dummyData } from './helper.js'

const AuctionsPublic = () => {
  //

  return (
    <>
      <HomeSlider />
      <UpcomingAuctions cards={dummyData} />
    </>
  )
}
export default AuctionsPublic
