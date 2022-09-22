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
      actions={[
        <Button key={1} flat onClick={onClickCancel} className="cancel-btn">
          {t('cancel')}
        </Button>,
        <Button
          key={2}
          flat
          primary
          disabled={bidAmount < lastBidAmount + incrementPrice}
          swapTheming={!(bidAmount < lastBidAmount + incrementPrice)}
          onClick={onclickPlace}
          className="bid-btn"
        >
          {t('place_bid_button')}
        </Button>,
      ]}
    >
      <div className="header">
        <div className="title">{t('place_bid')}</div>
        <div className="subTitle">{t('add_bidding_amount')}</div>
      </div>

      <div className="placeBid">
        <TextField
          className={`placeBid-TextField  ${
            bidAmount && bidAmount < lastBidAmount + incrementPrice
              ? 'error'
              : ''
          }`}
          placeholder={t('add_bidding_amount_placeholder')}
          value={bidAmount}
          onChange={setBidAmount}
          rightIcon={<span>OMR</span>}
          type="number"
          error={bidAmount < lastBidAmount + incrementPrice}
          errorText={`${t('minimum_amount')}${lastBidAmount + incrementPrice} `}
        />
      </div>
      <div className="amounts">
        <div className="lastBid">
          <div className="title">{lastBidAmount} OMR</div>
          <div className="value">{t('last_bid_amount')}</div>
        </div>
        <div className="sep" />
        <div className="increment">
          <div className="title"> {incrementPrice} OMR</div>
          <div className="value">{t('increment_price')}</div>
        </div>
      </div>
    </DialogContainer>
  )
}

export default PlaceBidDialog
