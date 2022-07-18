import { useState } from 'react'
import { Button, DialogContainer, TextField } from 'react-md'
import { useTranslation } from 'react-i18next'

import './style.scss'
const PlaceBidDialog = ({
  onHide,
  visible,
  onclickPlace,
  onClickCancel,
  lastBidAmount,
  incrementPrice,
}) => {
  const { t } = useTranslation()

  const [bidAmount, setBidAmount] = useState()

  return (
    <DialogContainer
      className="placeBidDialog"
      visible={visible}
      onHide={onHide}
      focusOnMount={false}
    >
      <div className="header">
        <h1>{t('place_bid')}</h1>
        <h1>{t('add_bidding_amount')}</h1>
      </div>

      <div className="placeBid">
        <TextField
          className="placeBid-TextField"
          placeholder={t('add_bidding_amount_placeholder')}
          value={bidAmount}
          onChange={setBidAmount}
          block
          rightIcon={<span>AED</span>}
          type="number"
          error={bidAmount < lastBidAmount + incrementPrice}
          errorText={t('minimum_amount')`${lastBidAmount + incrementPrice} `}
        />
      </div>
      <div className="amounts">
        <div className="lastBid">
          <h5>{lastBidAmount} AED</h5>
          <span>{t('last_bid_amount')}</span>
        </div>
        <div className="increment">
          <h5> {incrementPrice} AED</h5>
          <span>{t('increment_price')}</span>
        </div>
      </div>
      <div className="actions">
        <Button flat onClick={onClickCancel}>
          {t('cancel')}
        </Button>
        <Button flat primary onClick={onclickPlace}>
          {t('place_bid_button')}
        </Button>
      </div>
    </DialogContainer>
  )
}

export default PlaceBidDialog
