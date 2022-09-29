import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'

import { useTranslation } from 'libs/langs'

import { getFeaturedAuctionRemainingTime } from 'libs/api/auctions-api'

import './style.scss'

const AuctionTimer = ({
  auctionData,
  node,
  user,
  timeExtension,
  refetchAuction,
}) => {
  let interval

  const { t } = useTranslation()
  const [countdown, setCountdown] = useState(null)
  useQuery(
    ['getFeaturedAuctionRemainingTime', auctionData?.uuid],
    getFeaturedAuctionRemainingTime,
    {
      refetchOnWindowFocus: false,
      onSuccess: (res) => {
        if (res?.time?.remaining) {
          interval = setInterval(() => {
            setCountdown((st) => {
              if (st?.s === 0 && st?.m === 0 && st?.h === 0 && st?.d === 0) {
                clearInterval(interval)
                return null
              }
              return removeSeconde(st || res?.time?.remaining)
              // return removeSeconde(st || res?.time?.remaining)
            })
          }, 1000)
        }
      },
    },
  )
  const addSeconde = (time) => ({
    d: time?.d,
    h: time?.h,
    m: time?.m + 1,
    s: time?.s,
  })
  useEffect(() => {
    // refetch()
    setCountdown((st) => {
      if (st?.s === 0 && st?.m === 0 && st?.h === 0 && st?.d === 0) {
        clearInterval(interval)
        return null
      }
      return addSeconde(st)
      // return removeSeconde(st || res?.time?.remaining)
    })
    refetchAuction && refetchAuction()
  }, [timeExtension])

  // let start = data?.time?.remaining
  // let time = 0
  // let elapsed = '0.0'

  // const instance = () => {
  //   time += 1000

  //   elapsed = Math.floor(time / 1000) / 100
  //   if (Math.round(elapsed) === elapsed) { elapsed += '.0' }

  //   document.title = elapsed

  //   var diff = (new Date().getTime() - start) - time
  //   setCountdown(instance, (1000 - diff))
  // }

  // removeSeconde(instance, 1000)

  // useEffect(() => {
  //   if (data?.time) {
  //     if (data?.time?.remaining) {
  //       interval = setInterval(() => {
  //         setCountdown((st) => {
  //           if (st?.s === 0 && st?.m === 0 && st?.h === 0 && st?.d === 0) {
  //             clearInterval(interval)
  //             return null
  //           }
  //           // return removeSeconde(st || res?.time?.remaining)
  //         })
  //       }, 1000)
  //     }
  //   }

  //   return () => { removeSeconde(countdown || data?.time?.remaining) }
  // }, [])
  // useEffect(() => {
  //   let interval = setInterval(() => {
  //     let newCount = secondsToTime(
  //       (+moment.utc(auctionData?.['auction_end_date']) - +new Date()) / 1000,
  //     )
  //     setCountdown(newCount)
  //   }, 1000)

  //   return () => {
  //     clearInterval(interval)
  //   }
  // }, [auctionData])

  return (
    <div
      className={`auction-timer ${
        auctionData.last_bid?.['member_subject'] === user?.subject
          ? 'active'
          : 'inactive'
      }`}
    >
      <div className="countdown">
        <div className="countdown-element">
          <span className="value">{countdown?.d}</span>{' '}
          {/* <span className="label">{t('days')}</span> */}
        </div>
        <div className="countdown-separator">:</div>
        <div className="countdown-element">
          <span className="value">{countdown?.h}</span>{' '}
          {/* <span className="label">{t('hours_auction')}</span> */}
        </div>
        <div className="countdown-separator">:</div>
        <div className="countdown-element">
          <span className="value">{countdown?.m}</span>{' '}
          {/* <span className="label">{t('min_auctions')}</span> */}
        </div>
        <div className="countdown-separator">:</div>
        <div className="countdown-element">
          <span className="value">{countdown?.s}</span>{' '}
          {/* <span className="label">{t('seconds_auction')}</span> */}
        </div>
      </div>
      {node && (
        <div className="auction-info">
          <div className="auction-info-details">
            {auctionData.last_bid?.['member_subject'] === user?.subject ? (
              <>
                {' '}
                <div className="price blueText">
                  {auctionData?.['last_bid']?.['bid_amount']} {'OMR'}
                </div>
                <div className="label">{t('my_bid')}</div>
              </>
            ) : (
              <>
                <div className="price blueText">
                  {auctionData?.['current_price']} {t('OMR')}
                </div>
                <div className="label">{t('current_price')}</div>
              </>
            )}
          </div>
          <div className="sep"></div>
          <div className="auction-info-details">
            <div className="price">
              {auctionData?.['incremental_price']} {t('OMR')}
            </div>
            <div className="label">{t('minimum_incr')}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AuctionTimer

const removeSeconde = (time) => {
  if (time?.s > 0) {
    return {
      d: time?.d,
      h: time?.h,
      m: time?.m,
      s: time?.s - 1,
    }
  } else {
    if (time?.m > 0) {
      return {
        d: time?.d,
        h: time?.h,
        m: time?.m - 1,
        s: 59,
      }
    } else {
      if (time?.h > 0) {
        return {
          d: time?.d,
          h: time?.h - 1,
          m: 59,
          s: 59,
        }
      } else {
        if (time?.d > 0) {
          return {
            d: time?.d - 1,
            h: 23,
            m: 59,
            s: 59,
          }
        }
      }
    }
  }
}
