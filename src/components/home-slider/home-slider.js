import { Button, FontIcon } from 'react-md'
import Slider from 'react-slick'

import { useCurrentLang, useTranslation } from 'libs/langs'

import './style.scss'

const HomeSlider = ({ auctions }) => {
  const { t } = useTranslation()

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
          <img src={auction?.listing?.images[0].url} />
          <div className="data-section">
            <div className="data-section-title">{t('villa')}</div>
            <div>{auction?.listing?.title}</div>
            <div className="data-section-separateur" />
            <div>Current Ask: {auction?.['last_bid']?.['bid_amount'] || 0}</div>
            <div>02 D : 08 H : 35 M : 10 S</div>
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
