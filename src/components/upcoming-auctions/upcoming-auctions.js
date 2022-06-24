import BiddingCard from 'components/bidding-card'
import { Button } from 'react-md'

import './styles.scss'

const UpcomingAuctions = ({ cards }) => {
  const renderCards = () =>
    cards?.map((el, i) => (
      <BiddingCard
        className={'md-cell md-cell--6'}
        key={i}
        auctionData={el}
        status={'Upcoming'}
      />
    ))
  return (
    <div className="upcoming-auctions">
      <div className="upcoming-auctions-title">
        REVOLUTIONIZING THE REAL ESTATE AUCTION MARKET
      </div>
      <div className="upcoming-auctions-separateur" />
      <div className="upcoming-auctions-description">
        With mazed, you can now browse through thousands of auctions to find
        <br />
        your next big purchase
      </div>
      <div className="upcoming-auctions-header">
        <div className="upcoming-auctions-subTitle">Upcoming Auctions</div>
        <Button flat primary className="upcoming-auctions-btn">
          Explore more
        </Button>
      </div>
      <div className="upcoming-auctions-cards md-grid">{renderCards()}</div>
    </div>
  )
}

export default UpcomingAuctions
