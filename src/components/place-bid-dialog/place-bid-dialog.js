import { useState } from 'react'
import { Button, DialogContainer, TextField } from 'react-md'

import './style.scss'
const PlaceBidDialog = ({
  onHide,
  visible,
  onclickPlace,
  onClickCancel,
  lastBidAmount,
  incrementPrice,
}) => {
  const [bidAmount, setBidAmount] = useState()

  return (
    <DialogContainer
      className="placeBidDialog"
      visible={visible}
      onHide={onHide}
      focusOnMount={false}
    >
      <div className="header">
        <h1>Place Bid</h1>
        <h1>please add your bidding amount</h1>
      </div>

      <div className="placeBid">
        <TextField
          className="placeBid-TextField"
          placeholder="Add Bid amount"
          value={bidAmount}
          onChange={setBidAmount}
          block
          rightIcon={<span>AED</span>}
          type="number"
          error={bidAmount < lastBidAmount + incrementPrice}
          errorText={`Minimum amount:${lastBidAmount + incrementPrice} `}
        />
      </div>
      <div className="amounts">
        <div className="lastBid">
          <h5>{lastBidAmount} AED</h5>
          <span>Last Bid Amount</span>
        </div>
        <div className="increment">
          <h5> {incrementPrice} AED</h5>
          <span>Increment Price</span>
        </div>
      </div>
      <div className="actions">
        <Button flat onClick={onClickCancel}>
          Cancel
        </Button>
        <Button flat primary onClick={onclickPlace}>
          Place A Bid
        </Button>
      </div>
    </DialogContainer>
  )
}

export default PlaceBidDialog
