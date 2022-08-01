// import { useState } from 'react'

import { useMutation } from 'react-query'
import { Button } from 'react-md'
import { navigate } from '@reach/router'
import moment from 'moment'
import { useDispatch } from 'react-redux'

import store from 'libs/store'
import { useTranslation } from 'libs/langs'

import { saveAsFav } from 'libs/api/auctions-api'

import { addToast } from 'modules/app/actions'

import AuctionTimer from 'components/auction-timer'
import ToastMsg from 'components/toast-msg'

import './style.scss'

const BiddingCard = ({
  detailsUrl,
  auctionData,
  className,
  status,
  user,
  saveAuctionTag,
}) => {
  const dispatch = useDispatch()

  const saveAuctionMutation = useMutation(saveAsFav, {
    onSuccess: (res) => {
      if (res?.success) {
        dispatch(
          addToast(
            <ToastMsg text={'Auction saved as favorite'} type="success" />,
            'hide',
          ),
        )
      } else {
        dispatch(
          addToast(
            <ToastMsg text={'Something is wrong'} type="error" />,
            'hide',
          ),
        )
      }
    },
  })
  const { t } = useTranslation()

  const renderBtnTitle = () => {
    if (status === 'Upcoming') return t('view_details')
    else return t('bid_now')
  }
  const downloadToken = store?.getState()?.app?.dlToken

  const saveAuction = (uuid) => {
    saveAuctionMutation.mutate({
      uuid,
    })
  }
  return (
    <div className={`bidding-card ${className || ''}`}>
      <img
        src={`${
          auctionData?.listing?.images?.find((img) => img?.['cover_image'])
            ? auctionData?.listing?.images?.find((img) => img?.['cover_image'])
                ?.url
            : auctionData?.listing?.images?.[0]?.url
        }?token=${downloadToken}&view=true`}
        className="bidding-card-background"
      />
      <div className="bidding-card-header">
        {auctionData.last_bid?.['member_subject'] === user?.subject && (
          <div className="highest-bidder">{t('highest_bidder')}</div>
        )}
        {saveAuctionTag && (
          <Button
            icon
            primary
            className="save-btn"
            onClick={() => saveAuction(auctionData?.uuid)}
          >
            bookmark_outlined
          </Button>
        )}
      </div>
      <div className="bidding-card-footer">
        {status !== 'Active' && (
          <div className="bidding-card-info">
            <div className="title">
              {auctionData?.listing?.title} in {auctionData.location}
            </div>
            <div className="description">
              {t('date_start')}{' '}
              {moment(auctionData?.['auction_start_date']).format(
                'DD MMM, YYYY',
              )}
            </div>
          </div>
        )}
        {status === 'Active' && (
          <div className="bidding-card-info">
            <div className="title">{auctionData?.listing?.title}</div>
            <div className="description">{auctionData.location}</div>
            <div className="sep" />
            <div className="description">
              {t('current_ask')}{' '}
              {auctionData?.['last_bid']?.['bid_amount'] || 0}
            </div>
            {status === 'Active' && <AuctionTimer auctionData={auctionData} />}
          </div>
        )}
        <Button
          flat
          primary
          swapTheming
          className="bidding-card-btn"
          onClick={() =>
            detailsUrl ? detailsUrl() : navigate(`detail/${auctionData?.uuid}`)
          }
        >
          {renderBtnTitle()}
        </Button>
      </div>
    </div>
  )
}

export default BiddingCard
/*
const secondsToTime = (secs) => {
  let days = Math.floor(secs / (60 * 60 * 24))

  let divisorForHours = secs % (60 * 60 * 24)
  let hours = Math.floor(divisorForHours / (60 * 60))

  let divisorForMinutes = divisorForHours % (60 * 60)
  let minutes = Math.floor(divisorForMinutes / 60)

  let divisorForSeconds = divisorForMinutes % 60
  let seconds = Math.ceil(divisorForSeconds)

  let obj = {
    d: days,
    h: hours,
    m: minutes,
    s: seconds,
  }
  return obj
} */

BiddingCard.defaultProps = {
  auctionData: {
    auction_start_date: moment().add(-1, 'day').valueOf(),
    auction_end_date: moment().add(2, 'day').valueOf(),
    starting_price: 1.2,
    name: 'Villa',
    location: 'Al Muscat, Oman',
    isHighestBid: true,
  },
}
