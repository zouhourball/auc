// import { useState } from 'react'

// import AuctionsFilter from 'components/auction-filter'
// import AuctionTimer from 'components/auction-timer'
import UpcomingAuctions from 'components/upcoming-auctions'
import HomeSlider from 'components/home-slider'
import TopBar from 'components/top-bar'
import Footer from 'components/footer'

import { dummyData } from './helper.js'

const AuctionsPublic = () => {
  // const [filterData, setFilterData] = useState({})
  const modulesList = [
    { label: 'Services', link: '', key: 'services', linkToNewTab: '' },
    {
      label: 'How it works',
      link: '',
      key: 'how-it-works',
      linkToNewTab: 'newtab',
    },
    { label: 'Contact us', link: '', key: 'contact-us' },
  ]

  return (
    <div>
      <TopBar modulesList={modulesList} />
      <HomeSlider />
      <UpcomingAuctions cards={dummyData} />
      <Footer />
      {/* <AuctionsFilter filterData={filterData} setFilterData={setFilterData} />
      <AuctionTimer time={{}} /> */}
    </div>
  )
}
export default AuctionsPublic
