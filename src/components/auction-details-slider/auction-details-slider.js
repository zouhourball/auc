import { useCurrentLang } from 'libs/langs'
import { Button, FontIcon } from 'react-md'
import Slider from 'react-slick'
import store from 'libs/store'

import './styles.scss'
import { useEffect, useState } from 'react'
import moment from 'moment'
import timeIcon from './time.svg'
const AuctionDetailsSlider = ({
  images,
  isBookMarked,
  unsaveAuction,
  saveAuction,
  startDate,
  status,
}) => {
  const downloadToken = store?.getState()?.app?.dlToken
  let currentLang = useCurrentLang()
  const [countdown, setCountdown] = useState({
    d: 0,
    h: 0,
    m: 0,
    s: 0,
  })
  useEffect(() => {
    let interval = setInterval(() => {
      let newCount = secondsToTime(
        (+moment.utc(startDate) - +new Date()) / 1000,
      )
      setCountdown(newCount)
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [startDate])
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: (
      <FontIcon primary>
        {currentLang === 'ar-SA' || currentLang === 'ar'
          ? 'chevron_left'
          : 'chevron_right'}
      </FontIcon>
    ),
    prevArrow: (
      <FontIcon primary>
        {currentLang === 'ar-SA' || currentLang === 'ar'
          ? 'chevron_right'
          : 'chevron_left'}
      </FontIcon>
    ),
  }

  const renderImages = () =>
    images?.map((auction) => (
      <div key={auction.uuid} className="slide-elements">
        <img src={`${auction?.url}?token=${downloadToken}&view=true`} />
      </div>
    ))
  return (
    <div className="details-slider-wrapper">
      <div className="slide-elements-header">
        {status && (
          <div className="countdown-timer ">
            <img className="time-icon" src={timeIcon} height={15} />:{' '}
            {countdown?.d +
              ' : ' +
              countdown?.h +
              ' : ' +
              countdown?.m +
              ' : ' +
              countdown?.s}
          </div>
        )}
        {isBookMarked ? (
          <Button
            icon
            primary
            className="slide-elements-header-save-btn"
            iconClassName="mdi mdi-bookmark"
            onClick={(e) => {
              e.stopPropagation()
              unsaveAuction()
            }}
          />
        ) : (
          <Button
            icon
            primary
            className="slide-elements-header-save-btn"
            iconClassName="mdi mdi-bookmark-outline"
            onClick={(e) => {
              e.stopPropagation()
              saveAuction()
            }}
          />
        )}
      </div>
      <Slider {...settings} className="details-slider">
        {renderImages()}
      </Slider>
    </div>
  )
}

export default AuctionDetailsSlider

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
