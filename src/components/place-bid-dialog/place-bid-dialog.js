import { Button, DialogContainer, TextField } from 'react-md'
import { useTranslation } from 'libs/langs'
import { useDispatch } from 'react-redux'
import { addToast } from 'modules/app/actions'

import ToastMsg from 'components/toast-msg'

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
  label,
  currentAmount,
  depositAmount,
}) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const onShowError = () => {
    dispatch(
      addToast(<ToastMsg text={'Wrong Bid Amount'} type="error" />, 'hide'),
    )
  }
  return (
    <DialogContainer
      className="placeBidDialog"
      visible={visible}
      onHide={onHide}
      focusOnMount={false}
      actions={[
        <Button key={1} flat onClick={onClickCancel} className="cancel-button">
          {t('cancel')}
        </Button>,
        <Button
          key={2}
          flat
          primary
          // disabled={bidAmount < lastBidAmount + incrementPrice}
          swapTheming
          onClick={() =>
            bidAmount < lastBidAmount + incrementPrice
              ? onShowError()
              : onclickPlace()
          }
          className="continue-button"
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
        <div className="placeBid-amount">
          <div className="placeBid-amount-item">
            <div className="label">Current Amount:</div>
            <div className="value">{currentAmount}</div>
          </div>
          <div className="placeBid-amount-item">
            <div className="label">Deposit Amount:</div>
            <div className="value">{depositAmount}</div>
          </div>
        </div>
        <TextField
          className={`placeBid-TextField  ${
            +bidAmount > 0 && bidAmount < lastBidAmount + incrementPrice
              ? 'error'
              : ''
          }`}
          placeholder={t('add_bidding_amount_placeholder')}
          value={bidAmount}
          onChange={setBidAmount}
          rightIcon={<span>OMR</span>}
          type="number"
          error={+bidAmount > 0 && bidAmount < lastBidAmount + incrementPrice}
          errorText={`${t('minimum_amount')}${lastBidAmount + incrementPrice} `}
        />
      </div>
      <div className="amounts">
        <div className="lastBid">
          <div className="title">
            {lastBidAmount} {t('OMR')}
          </div>
          <div className="value">{label}</div>
        </div>
        <div className="sep" />
        <div className="increment">
          <div className="title">
            {' '}
            {incrementPrice} {t('OMR')}
          </div>
          <div className="value">{t('increment_price')}</div>
        </div>
      </div>
    </DialogContainer>
  )
}

export default PlaceBidDialog
