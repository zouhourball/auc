// import { useState } from 'react'

import { useMutation } from 'react-query'
import { Button } from 'react-md'
import { navigate } from '@reach/router'
import moment from 'moment'
import { useDispatch } from 'react-redux'

import store from 'libs/store'
import { useTranslation } from 'libs/langs'
import { moneyFormat } from 'libs/utils/hooks'

import { saveAsFav, unsaveAsFav } from 'libs/api/auctions-api'

import { addToast } from 'modules/app/actions'

import AuctionTimer from 'components/auction-timer'
import ToastMsg from 'components/toast-msg'
import { propertyTypeList } from 'components/helpers'

import './style.scss'

const BiddingCard = ({
  participated = false,
  auctionData,
  className,
  status,
  user,
  saveAuctionTag,
  refetch,
  logged,
  meOrgs,
  detailsUrl,
  tabPending = false,
  goBackLabel,
}) => {
  const { t } = useTranslation()
  const isClosed = +moment.utc(auctionData?.['auction_end_date']) < +moment()

  const dispatch = useDispatch()

  const saveAuctionMutation = useMutation(saveAsFav, {
    onSuccess: (res) => {
      if (res?.success) {
        dispatch(
          addToast(
            <ToastMsg text={'Auction saved as favorite'} type="success" />,
          ),
        )
        refetch()
      } else {
        dispatch(
          addToast(<ToastMsg text={'Something is wrong'} type="error" />),
        )
      }
    },
  })
  const unsaveAuctionMutation = useMutation(unsaveAsFav, {
    onSuccess: (res) => {
      if (res?.success) {
        dispatch(
          addToast(
            <ToastMsg
              text={'Auction is removed from favorites list successfully'}
              type="success"
            />,
          ),
        )
        refetch()
      } else {
        dispatch(
          addToast(<ToastMsg text={'Something is wrong'} type="error" />),
        )
      }
    },
  })

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
  const unsaveAuction = (uuid) => {
    unsaveAuctionMutation.mutate({
      uuid,
    })
  }

  return (
    <div
      className={`bidding-card ${className || ''}`}
      onClick={() =>
        (detailsUrl && detailsUrl()) ||
        navigate(
          `/${logged ? 'auctions' : 'public'}/detail/${auctionData?.uuid}`,
          {
            state: { goBackLabel },
          },
        )
      }
    >
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
        {user?.subject &&
          user?.subject === auctionData.last_bid?.['member_subject'] && (
            <div className="highest-bidder">{t('highest_bidder')}</div>
          )}
        {!tabPending ? (
          auctionData?.status === 'Pending' &&
          !isClosed &&
          status !== 'Active' && (
            <div className="highest-bidder pending">{t('pending')}</div>
          )
        ) : (
          <div className="highest-bidder pending">{t('pending')}</div>
        )}
        {saveAuctionTag &&
          (auctionData?.['is_bookmarked'] ? (
            <Button
              icon
              primary
              className="save-btn"
              iconClassName="mdi mdi-bookmark"
              onClick={(e) => {
                e.stopPropagation()
                unsaveAuction(auctionData?.uuid)
              }}
            />
          ) : (
            <Button
              icon
              primary
              className="save-btn"
              iconClassName="mdi mdi-bookmark-outline"
              onClick={(e) => {
                e.stopPropagation()
                saveAuction(auctionData?.uuid)
              }}
            />
          ))}
      </div>
      <div className="bidding-card-footer">
        {(status !== 'Active' || tabPending) && (
          <div className="bidding-card-info">
            <div className="data-section-title">
              {t(
                propertyTypeList.find(
                  (el) =>
                    el?.value ===
                    +auctionData?.listing?.property?.['property_type_id'],
                )?.label,
              )}
            </div>
            <div className="title">
              {auctionData?.listing?.title} in{' '}
              {auctionData?.listing?.property?.city?.['name_en']},{' '}
              {auctionData?.listing?.property?.country?.['name_en']}
            </div>
            <div className="description">
              {t('date_start')}{' '}
              {moment(auctionData?.['auction_start_date']).format(
                'DD MMM, YYYY',
              )}
            </div>
          </div>
        )}
        {status === 'Active' && !tabPending && (
          <div className="bidding-card-info">
            <div className="data-section-title">
              {t(
                propertyTypeList.find(
                  (el) =>
                    el?.value ===
                    +auctionData?.listing?.property?.['property_type_id'],
                )?.label,
              )}
            </div>
            <div className="title">{auctionData?.listing?.title}</div>
            {auctionData.location && (
              <div className="description">{auctionData.location}</div>
            )}
            <div className="sep" />
            <div className="description">
              <span>{t('current_ask')}</span>
              <span>
                {moneyFormat(auctionData?.['last_bid']?.['bid_amount']) || 0}
              </span>
              <span>{t('OMR')}</span>
            </div>
            {status === 'Active' && <AuctionTimer auctionData={auctionData} />}
          </div>
        )}
        {(!logged ||
          (!participated &&
            !(
              user?.subject === auctionData?.['last_bid']?.['member_subject']
            ) &&
            !(auctionData?.['submitted_by'] === user?.subject) &&
            status === 'Active' &&
            !(meOrgs?.length > 0))) && (
          <Button
            flat
            primary
            swapTheming
            className="bidding-card-btn"
            onClick={() =>
              navigate(
                `/${logged ? 'auctions' : 'public'}/detail/${
                  auctionData?.uuid
                }`,
                {
                  state: { goBackLabel },
                },
              )
            }
          >
            {renderBtnTitle()}
          </Button>
        )}
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
