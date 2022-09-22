import { Button } from 'react-md'
import moment from 'moment'

import BiddingCard from 'components/bidding-card'
import { useTranslation } from 'libs/langs'
import { navigate } from '@reach/router'

import './styles.scss'

const UpcomingAuctions = ({ cards, logged, user, refetch }) => {
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
    cards?.map((el) => (
      <BiddingCard
        user={user}
        className={'md-cell md-cell--4'}
        key={el?.uuid}
        auctionData={el}
        status={renderStatus(el)}
        saveAuctionTag
        refetch={refetch}
        logged={logged}
      />
    ))
  return (
    <div className="upcoming-auctions">
      <div className="upcoming-auctions-title">
        {/* {logged ? t('accelerate_asset') : t('auction_market')} */}
        {t('auction_market')}
      </div>
      <div className="upcoming-auctions-separateur" />
      <div
        className="upcoming-auctions-description"
        dangerouslySetInnerHTML={{
          __html: t('browse_auctions'),
        }}
      />
      {/* {t('accelerate_asset')} */}
      {/* <br /> */}
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
