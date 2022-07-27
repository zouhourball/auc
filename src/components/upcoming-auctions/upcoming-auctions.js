import { Button } from 'react-md'
import moment from 'moment'

import BiddingCard from 'components/bidding-card'
import { useTranslation } from 'libs/langs'
import { navigate } from '@reach/router'

import './styles.scss'

const UpcomingAuctions = ({ cards, logged }) => {
  const { t } = useTranslation()

  const renderStatus = (auction) => {
    if (
      +moment.utc(auction?.['auction_end_date']).add(2, 'seconds') <
        +moment() ||
      auction?.['awarded_to']?.uuid
    ) {
      return 'Ended'
    } else if (+moment.utc(auction?.['auction_start_date']) > +moment()) {
      return 'Upcoming'
    } else return 'Active'
  }

  const renderCards = () =>
    cards?.map((el, i) => (
      <BiddingCard
        className={'md-cell md-cell--6'}
        key={i}
        auctionData={el}
        status={renderStatus(el)}
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
