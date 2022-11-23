import { Button, FontIcon } from 'react-md'
import Slider from 'react-slick'
import moment from 'moment'

import { useCurrentLang, useTranslation } from 'libs/langs'
import { navigate } from '@reach/router'
import { useSelector } from 'react-redux'

import { moneyFormat } from 'libs/utils/hooks'
import store from 'libs/store'

import AuctionTimer from 'components/auction-timer'

import { propertyTypeList } from 'components/helpers'

import defaultBg from './default-bg.jpeg'

import './style.scss'

const HomeSlider = ({ auctions, logged, defaultNode }) => {
  const meOrgs = useSelector(({ app }) => app?.myOrgs)

  const { t } = useTranslation()
  const downloadToken = store?.getState()?.app?.dlToken
  let currentLang = useCurrentLang()
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    rtl: currentLang === 'ar-SA' || currentLang === 'ar',
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
        <img src={defaultBg} />
        <div className="slide-section-defaultSection">{defaultNode}</div>
      </div>
      {auctions?.map((auction) => (
        <div key={auction.uuid} className="slide-section">
          <img
            src={`${
              auction?.listing?.images?.find((img) => img?.['cover_image'])
                ? auction?.listing?.images?.find((img) => img?.['cover_image'])
                    ?.url
                : auction?.listing?.images?.[0].url
            }?token=${downloadToken}&view=true`}
          />
          <div className="data-section">
            <div className="data-section-title">
              {t(
                propertyTypeList.find(
                  (el) =>
                    el?.value ===
                    +auction?.listing?.property?.['property_type_id'],
                )?.label,
              )}
            </div>
            <div className="data-section-text">{auction?.listing?.title}</div>
            <div className="data-section-separateur" />
            <div className="data-section-text">
              {t('current_ask')}
              {t('OMR')}
              {moneyFormat(auction?.['last_bid']?.['bid_amount']) || 0}
            </div>
            {+moment.utc(auction?.['auction_start_date']) < +moment() &&
              +moment.utc(auction?.['auction_end_date']) > +moment() && (
              <AuctionTimer auctionData={auction} />
            )}
            {(!logged || (logged && !(meOrgs?.length > 0))) && (
              <Button
                flat
                primary
                swapTheming
                className="data-section-button"
                onClick={() => navigate(`/auctions/detail/${auction?.uuid}`)}
              >
                {t('bid_now')}
              </Button>
            )}
          </div>
        </div>
      ))}
    </Slider>
  )
}
export default HomeSlider
