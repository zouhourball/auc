// import { useState } from 'react'

import { useMutation } from 'react-query'
import { Button } from 'react-md'
import moment from 'moment'
import { useDispatch } from 'react-redux'

import store from 'libs/store'
import { useTranslation } from 'libs/langs'

import { saveAsFav, unsaveAsFav } from 'libs/api/auctions-api'

import { addToast } from 'modules/app/actions'

import AuctionTimer from 'components/auction-timer'
import ToastMsg from 'components/toast-msg'
import { propertyTypeList } from 'components/helpers'

import './style.scss'

const SideBiddingCard = ({
  setPin,
  auctionData,
  className,
  status,
  user,
  refetch,
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
        refetch()
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
  const unsaveAuctionMutation = useMutation(unsaveAsFav, {
    onSuccess: (res) => {
      if (res?.success) {
        dispatch(
          addToast(
            <ToastMsg
              text={'Auction is removed from favorites list successfully'}
              type="success"
            />,
            'hide',
          ),
        )
        refetch()
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
  const pinData = {
    latitude: auctionData?.listing?.property?.['general_location_y'],
    longitude: auctionData?.listing?.property?.['general_location_x'],
    img: `${
      auctionData?.listing?.images?.find((img) => img?.['cover_image'])
        ? auctionData?.listing?.images?.find((img) => img?.['cover_image'])?.url
        : auctionData?.listing?.images?.[0]?.url
    }?token=${downloadToken}&view=true`,
    uuid: auctionData?.uuid,
    city: auctionData?.listing?.property?.city?.['name_en'],
    country: auctionData?.listing?.property?.country?.['name_en'],
  }
  return (
    <div
      className={`bidding-card ${className || ''}`}
      onClick={() => setPin(pinData)}
    >
      <img
        src={`${
          auctionData?.listing?.images?.find((img) => img?.['cover_image'])
            ? auctionData?.listing?.images?.find((img) => img?.['cover_image'])
                ?.url
            : auctionData?.listing?.images?.[0]?.url
        }?token=${downloadToken}&view=true`}
        // className="bidding-card-background"
      />
      <div className="bidding-card-header">
        {user?.subject &&
          user?.subject === auctionData.last_bid?.['member_subject'] && (
            <div className="highest-bidder">{t('highest_bidder')}</div>
          )}
        {auctionData?.['is_bookmarked'] ? (
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
        )}
      </div>
      <div className="bidding-card-footer">
        {status !== 'Active' && (
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
        {status === 'Active' && (
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
            <div className="description">{auctionData.location}</div>
            <div className="sep" />
            <div className="description">
              {t('current_ask')}{' '}
              {auctionData?.['last_bid']?.['bid_amount'] || 0}
            </div>
            {status === 'Active' && <AuctionTimer auctionData={auctionData} />}
          </div>
        )}
        {!(user?.subject === auctionData?.['last_bid']?.['member_subject']) &&
          status === 'Active' && (
          <Button
            flat
            primary
            swapTheming
            className="bidding-card-btn"
            onClick={() => setPin(pinData)}
          >
            {t('view_details')}
          </Button>
        )}
      </div>
    </div>
  )
}

export default SideBiddingCard
