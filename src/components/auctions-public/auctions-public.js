// import { useState } from 'react'

//
//
import UpcomingAuctions from 'components/upcoming-auctions'
import HomeSlider from 'components/home-slider'

import { dummyData } from './helper.js'

const AuctionsPublic = () => {
  //

  return (
    <div>
      <HomeSlider />
      <UpcomingAuctions cards={dummyData} />
    </div>
  )
}
export default AuctionsPublic
