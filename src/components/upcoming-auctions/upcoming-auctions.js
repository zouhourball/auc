import { Button } from 'react-md'
import moment from 'moment'

import BiddingCard from 'components/bidding-card'
import { useTranslation } from 'libs/langs'
import { navigate } from '@reach/router'
import bidderIcon from 'images/my_activity_disable.svg'

import './styles.scss'

const UpcomingAuctions = ({ cards, logged, user, refetch, meOrgs }) => {
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
    cards?.map((el) => {
      return (
        <BiddingCard
          user={user}
          className={'md-cell md-cell--4'}
          key={el?.uuid}
          auctionData={el}
          status={renderStatus(el)}
          saveAuctionTag
          refetch={refetch}
          logged={logged}
          meOrgs={meOrgs}
        />
      )
    })
  return (
    <div className="upcoming-auctions">
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
      {!cards || cards?.length === 0 ? (
        <div className="empty-content">
          <img className="empty-content-logo" height={35} src={bidderIcon} />
          <div className="empty-content-title">{t('No_Upcoming_Auctions')}</div>
        </div>
      ) : (
        <div className={`upcoming-auctions-cards md-grid`}>{renderCards()}</div>
      )}
    </div>
  )
}

export default UpcomingAuctions
