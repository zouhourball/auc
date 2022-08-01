import { Button, DialogContainer, TextField } from 'react-md'
import { useTranslation } from 'libs/langs'

import './style.scss'
const PlaceBidDialog = ({
  onHide,
  visible,
  onclickPlace,
  onClickCancel,
  lastBidAmount,
  incrementPrice,
  bidAmount,
  setBidAmount,
}) => {
  const { t } = useTranslation()

  return (
    <DialogContainer
      className="placeBidDialog"
      visible={visible}
      onHide={onHide}
      focusOnMount={false}
    >
      <div className="header">
        <div className="header-title">{t('place_bid')}</div>
        <div className="header-subtitle">{t('add_bidding_amount')}</div>
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
          // error={bidAmount < lastBidAmount + incrementPrice}
          // errorText={`${t('minimum_amount')}${lastBidAmount + incrementPrice} `}
        />
      </div>
      <div className="amounts">
        <div className="lastBid">
          <div className="value">{lastBidAmount} AED</div>
          <span className="label">{t('last_bid_amount')}</span>
        </div>
        <div className="sep"></div>
        <div className="increment">
          <div className="value">{incrementPrice} AED</div>
          <span className="label">{t('increment_price')}</span>
        </div>
      </div>
      <div className="actions">
        <Button flat onClick={onClickCancel} className="action-btn cancel-btn">
          {t('cancel')}
        </Button>
        <Button flat primary onClick={onclickPlace} className="action-btn">
          {t('place_bid_button')}
        </Button>
      </div>
    </DialogContainer>
  )
}

export default PlaceBidDialog
