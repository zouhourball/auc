import { useEffect, useState } from 'react'
import moment from 'moment'

import { useTranslation } from 'libs/langs'

import './style.scss'

const AuctionTimer = ({ auctionData, isActive = true, node }) => {
  const { t } = useTranslation()
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

  return (
    <div className={`auction-timer ${isActive ? 'active' : ''}`}>
      <div className="countdown">
        <div className="countdown-element">
          <span className="value">{countdown.d}</span>{' '}
          <span className="label">{t('days')}</span>
        </div>
        <div className="countdown-separator">:</div>
        <div className="countdown-element">
          <span className="value">{countdown.h}</span>{' '}
          <span className="label">{t('hours_auction')}</span>
        </div>
        <div className="countdown-separator">:</div>
        <div className="countdown-element">
          <span className="value">{countdown.m}</span>{' '}
          <span className="label">{t('min_auctions')}</span>
        </div>
        <div className="countdown-separator">:</div>
        <div className="countdown-element">
          <span className="value">{countdown.s}</span>{' '}
          <span className="label">{t('seconds_auction')}</span>
        </div>
      </div>
      {node && (
        <div className="auction-info">
          <div className="auction-info-details">
            <div className="price blueText">{node?.bid} AED</div>
            <div className="label">My Bid</div>
          </div>
          <div className="sep"></div>
          <div className="auction-info-details">
            <div className="price">{node?.increment} AED</div>
            <div className="label">Minimum Increment</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AuctionTimer

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
