import { Button, FontIcon } from 'react-md'
import Slider from 'react-slick'
import moment from 'moment'

import { useCurrentLang, useTranslation } from 'libs/langs'

import store from 'libs/store'

import AuctionTimer from 'components/auction-timer'

import './style.scss'

const HomeSlider = ({ auctions }) => {
  const { t } = useTranslation()
  const downloadToken = store?.getState()?.app?.dlToken

  let currentLang = useCurrentLang()
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
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
  return (
    <Slider {...settings} className="home-slider">
      {auctions?.map((auction) => (
        <div key={auction.uuid} className="slide-section">
          <img
            src={`${
              auction?.listing?.images?.find((img) => img?.['cover_image'])?.url
            }?token=${downloadToken}&view=true`}
          />
          <div className="data-section">
            <div className="data-section-title">{t('villa')}</div>
            <div>{auction?.listing?.title}</div>
            <div className="data-section-separateur" />
            <div>Current Ask: 0</div>
            {+moment.utc(auction?.['auction_start_date']) < +moment() &&
              +moment.utc(auction?.['auction_end_date']) > +moment() && (
              <AuctionTimer auctionData={auction} />
            )}
            <Button flat primary swapTheming className="data-section-button">
              Bid Now
            </Button>
          </div>
        </div>
      ))}
    </Slider>
  )
}
export default HomeSlider
