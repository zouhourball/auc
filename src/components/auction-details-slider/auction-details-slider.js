import { useCurrentLang } from 'libs/langs'
import { Button, FontIcon } from 'react-md'
import Slider from 'react-slick'
import store from 'libs/store'

import './styles.scss'
const AuctionDetailsSlider = ({
  images,
  isBookMarked,
  unsaveAuction,
  saveAuction,
}) => {
  const downloadToken = store?.getState()?.app?.dlToken
  let currentLang = useCurrentLang()
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

        {isBookMarked ? (
          <Button
            icon
            primary
            className="save-btn"
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
            className="save-btn"
            iconClassName="mdi mdi-bookmark-outline"
            onClick={(e) => {
              e.stopPropagation()
              saveAuction()
            }}
          />
        )}
      </div>
    ))
  return (
    <Slider {...settings} className="details-slider">
      {renderImages()}
    </Slider>
  )
}

export default AuctionDetailsSlider
