import BiddingCard from 'components/bidding-card'
import { Button } from 'react-md'
import { useTranslation } from 'libs/langs'

import './styles.scss'

const UpcomingAuctions = ({ cards }) => {
  const { t } = useTranslation()

  const renderCards = () =>
    cards?.map((el, i) => (
      <BiddingCard
        className={'md-cell md-cell--6'}
        key={i}
        auctionData={el}
        status={'Upcoming'}
      />
    ))
  return (
    <div className="upcoming-auctions">
      <div className="upcoming-auctions-title">{t('auction_market')}</div>
      <div className="upcoming-auctions-separateur" />
      <div className="upcoming-auctions-description">
        {t('browse_auctions')}
        <br />
        {t('big_purchase')}
      </div>
      <div className="upcoming-auctions-header">
        <div className="upcoming-auctions-subTitle">
          {t('upcoming_auctions')}
        </div>
        <Button flat primary className="upcoming-auctions-btn">
          {t('explore_more')}
        </Button>
      </div>
      <div className="upcoming-auctions-cards md-grid">{renderCards()}</div>
    </div>
  )
}

export default UpcomingAuctions
