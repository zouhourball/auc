import BiddingCard from 'components/bidding-card'
import { Button } from 'react-md'
import { useTranslation } from 'libs/langs'
import { navigate } from '@reach/router'

import './styles.scss'

const UpcomingAuctions = ({ cards, logged }) => {
  const { t } = useTranslation()

  const renderCards = () =>
    cards?.map((el) => (
      <BiddingCard
        className={'md-cell md-cell--6'}
        key={el?.uuid}
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
        <Button
          flat
          primary
          className="upcoming-auctions-btn"
          onClick={() =>
            navigate(`/${logged ? 'auctions' : 'public'}/upcoming-auctions`)
          }
        >
          {t('explore_more')}
        </Button>
      </div>
      <div className="upcoming-auctions-cards md-grid">{renderCards()}</div>
    </div>
  )
}

export default UpcomingAuctions
