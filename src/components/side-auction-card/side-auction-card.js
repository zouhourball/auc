import { useMutation } from 'react-query'
import { Button } from 'react-md'
import moment from 'moment'
import { useDispatch } from 'react-redux'

import store from 'libs/store'
import { useTranslation } from 'libs/langs'

import { saveAsFav, unsaveAsFav } from 'libs/api/auctions-api'

import { addToast } from 'modules/app/actions'

import ToastMsg from 'components/toast-msg'
import { propertyTypeList } from 'components/helpers'
import './style.scss'
import { useEffect, useState } from 'react'
const SideAuctionCard = ({
  activePin,
  setPin,
  auctionData,
  className,
  status,
  user,
  refetch,
  key,
}) => {
  const dispatch = useDispatch()
  const [countdown, setCountdown] = useState({
    d: 0,
    h: 0,
    m: 0,
    s: 0,
  })
  useEffect(() => {
    let interval = setInterval(() => {
      let newCount = secondsToTime(
        (+moment.utc(auctionData?.['auction_end_date']) - +new Date()) / 1000,
      )
      setCountdown(newCount)
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [auctionData])
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
      className={`auction-card${
        activePin?.uuid === auctionData?.uuid ? ' active' : ''
      }`}
      onClick={() => {
        setPin(pinData)
      }}
    >
      <div className="auction-image">
        <img
          src={`${
            auctionData?.listing?.images?.find((img) => img?.['cover_image'])
              ? auctionData?.listing?.images?.find(
                  (img) => img?.['cover_image'],
                )?.url
              : auctionData?.listing?.images?.[0]?.url
          }?token=${downloadToken}&view=true`}
        />
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
      <div className="auction-info">
        <div className="title">
          {t(
            propertyTypeList.find(
              (el) =>
                el?.value ===
                +auctionData?.listing?.property?.['property_type_id'],
            )?.label,
          )}
        </div>

        <div className="description">
          {auctionData?.listing?.property?.city?.['name_en']},{' '}
          {auctionData?.listing?.property?.country?.['name_en']}
        </div>
        <div className="sep" />
        <div className="description">
          {t('current_ask')} {auctionData?.['last_bid']?.['bid_amount'] || 0}
        </div>
        <div className="countdown" style={{ display: 'flex' }}>
          <div className="countdown-element">
            <span className="value">{countdown.d}</span>{' '}
            {/* <span className="label">{t('days')}</span> */}
          </div>
          <div className="countdown-separator">:</div>
          <div className="countdown-element">
            <span className="value">{countdown.h}</span>{' '}
            {/* <span className="label">{t('hours_auction')}</span> */}
          </div>
          <div className="countdown-separator">:</div>
          <div className="countdown-element">
            <span className="value">{countdown.m}</span>{' '}
            {/* <span className="label">{t('min_auctions')}</span> */}
          </div>
          <div className="countdown-separator">:</div>
          <div className="countdown-element">
            <span className="value">{countdown.s}</span>{' '}
            {/* <span className="label">{t('seconds_auction')}</span> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SideAuctionCard

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
}
