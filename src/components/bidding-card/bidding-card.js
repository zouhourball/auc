import { useState } from 'react'
import { Button } from 'react-md'
import moment from 'moment'

import { navigate } from '@reach/router'

import './style.scss'
/* eslint-disable */
const BiddingCard = ({ detailsUrl, auctionData, className, status, live }) => {
  const [countdown, setCountdown] = useState({
    d: 0,
    h: 0,
    m: 0,
    s: 0,
  })

  //   const startingBid = auctionData?.['starting_price']

  /* const status =
    +moment.utc(auctionData?.['auction_end_date']) < +moment() ||
    auctionData?.['awarded_to']?.uuid
      ? 'Ended'
      : +moment.utc(auctionData?.['auction_start_date']) > +moment()
        ? 'Upcoming'
        : 'Active' */

  //   const renderStatusClassName = () => {
  //     switch (status) {
  //       case 'Active':
  //         return 'auction_active'
  //       case 'Upcoming':
  //         return 'upcoming_auction'
  //       case 'Ended':
  //         return 'auction_ended'
  //     }
  //   }

  const renderBtnTitle = () => {
    if (status === 'Upcoming') return 'View Details'
    else return 'Bid Now'
  }
  /*   useEffect(() => {
    let interval = setInterval(() => {
      let status =
        +moment.utc(auctionData?.['auction_end_date']).add(2, 'seconds') <
          +moment() || auctionData?.['awarded_to']?.uuid
          ? 'Ended'
          : +moment.utc(auctionData?.['auction_start_date']) > +moment()
            ? 'Upcoming'
            : 'Active'
      switch (status) {
        case 'Upcoming':
          if (+moment.utc(auctionData?.['auction_start_date']) < +moment()) {
            let newCount = secondsToTime(
              (+moment.utc(auctionData?.['auction_end_date']) - +new Date()) /
                1000,
            )
            setCountdown(newCount)
          }
          break
        case 'Active':
          let newCount = secondsToTime(
            (+moment.utc(auctionData?.['auction_end_date']) - +new Date()) /
              1000,
          )
          setCountdown(newCount)
          break
        default:
          break
      }
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [auctionData]) */

  return (
    <div
      className={`bidding-card ${className || ''}`}
      onClick={() =>
        detailsUrl ? detailsUrl() : navigate(`detail/${auctionData?.id}`)
      }
    >
      <img src={auctionData?.url} className="bidding-card-background" />
      <div className="bidding-card-header">
        {auctionData.isHighestBid && (
          <div className="highest-bidder">Highest Bidder</div>
        )}
        <Button icon primary className="save-btn">
          bookmark_outlined
        </Button>
      </div>
      <div className="bidding-card-footer">
        {status === 'Upcoming' && (
          <div className="bidding-card-info">
            <div className="title">
              {auctionData.name} in {auctionData.location}
            </div>
            <div className="description">
              Start Date:{' '}
              {moment(auctionData?.['auction_start_date']).format(
                'DD MMM, YYYY',
              )}
            </div>
          </div>
        )}
        {status === 'Active' && (
          <div className="bidding-card-info">
            <div className="title">{auctionData.name}</div>
            <div className="description">{auctionData.location}</div>
            <div className="sep" />
            <div className="description">
              Current Ask: {auctionData?.['starting_price']}
            </div>
            {live && (
              <div className="countdown-container">{`${countdown.d} D : ${countdown.h} H : ${countdown.m} M : ${countdown.s} S`}</div>
            )}
          </div>
        )}
        <Button flat primary swapTheming className="bidding-card-btn">
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
