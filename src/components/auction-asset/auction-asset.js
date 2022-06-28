import Auctions from 'components/auctions'

import './styles.scss'

const AuctionAsset = () => {
  return (
    <div className="auction-asset">
      <div className="auction-asset-title">Auction Asset</div>
      <div className="auction-asset-subTitle">
        Please fill in the information to be able to auction your asset
      </div>
      <Auctions />
    </div>
  )
}
export default AuctionAsset
