import BiddingCard from 'components/bidding-card'

const UpcomingAuctions = ({ cards }) => {
  const renderCards = () =>
    cards?.map((el, i) => <BiddingCard key={i} auctionData={el} />)
  return (
    <div>
      <h1>REVOLUTIONIZING THE REAL ESTATE AUCTION MARKET</h1>
      <hr />
      <span>
        With mazed, you can now browse through thousands of auctions to find
        your next big purchase
      </span>
      <div>{renderCards()}</div>
    </div>
  )
}

export default UpcomingAuctions
