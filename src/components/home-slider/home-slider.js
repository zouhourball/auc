import { Button, FontIcon } from 'react-md'
import Slider from 'react-slick'

import { useCurrentLang } from 'libs/langs'
import { useTranslation } from 'react-i18next'

import './style.scss'

const { t } = useTranslation()

const HomeSlider = () => {
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
      <div className="slide-section">
        <img src="https://picsum.photos/id/1031/2000/1000" />
        <div className="data-section">
          <div className="data-section-title">{t('villa')}</div>
          <div>Jumeirah, Dubai</div>
          <div className="data-section-separateur" />
          <div>Current Ask: 0</div>
          <div>02 D : 08 H : 35 M : 10 S</div>
          <Button flat primary swapTheming className="data-section-button">
            Bid Now
          </Button>
        </div>
      </div>
      <div className="slide-section">
        <img src="https://picsum.photos/id/1033/2000/1000" />
        <div className="data-section">
          <div className="data-section-title">Villa</div>
          <div>Jumeirah, Dubai</div>
          <div className="data-section-separateur" />
          <div>Current Ask: 0</div>
          <div>02 D : 08 H : 35 M : 10 S</div>
          <Button flat primary swapTheming className="data-section-button">
            Bid Now
          </Button>
        </div>
      </div>
      <div className="slide-section">
        <img src="https://picsum.photos/id/1078/2000/1000" />
        <div className="data-section">
          <div className="data-section-title">Villa</div>
          <div>Jumeirah, Dubai</div>
          <div className="data-section-separateur" />
          <div>Current Ask: 0</div>
          <div>02 D : 08 H : 35 M : 10 S</div>
          <Button flat primary swapTheming className="data-section-button">
            Bid Now
          </Button>
        </div>
      </div>
    </Slider>
  )
}
export default HomeSlider
