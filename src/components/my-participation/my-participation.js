import { useState } from 'react'
// import moment from 'moment'

import { useTranslation } from 'libs/langs'

import { Button } from 'react-md'
import { useQuery } from 'react-query'
import { getMyAuctions } from 'libs/api/auctions-api'
import BiddingCard from 'components/bidding-card'

import './style.scss'

const ParticipatedAuctions = ({ meOrgs }) => {
  const { t } = useTranslation()

  const [tab, setTab] = useState(0)
  const tabsData = [
    { id: 0, label: t('active') },
    { id: 1, label: t('won') },
    { id: 2, label: t('lost') },
    { id: 3, label: t('my_deposit') },
  ]
  const renderTabName = () => {
    switch (tab) {
      case 0:
        return 'Active'
      case 1:
        return 'Awarded'
      case 2:
        return 'Lost'
      default:
        return 'Active'
    }
  }
  const { data: myAuctions } = useQuery(
    [
      'getMyAuctions',
      {
        filter: {},
        sort: [],
        limit: 10,
        offset: 0,
      },
      renderTabName(),
    ],
    getMyAuctions,
  )

  const renderCards = () => {
    return myAuctions?.results?.map((el, i) => (
      <BiddingCard
        className="md-cell md-cell--4"
        key={i}
        auctionData={el}
        status={tab === 0 && 'Active'}
        saveAuctionTag
        logged
        meOrgs={meOrgs}
      />
    ))
  }
  const renderTabs = () =>
    tabsData?.map((el) => (
      <Button
        className={`${tab === el?.id ? 'active' : ''}`}
        key={el.id}
        onClick={() => setTab(el.id)}
        primary={tab === el.id}
      >
        <span>{el.label}</span>
      </Button>
    ))

  // const renderStatus = (auction) => {
  //   if (
  //     +moment.utc(auction?.['auction_end_date']).add(2, 'seconds') <
  //       +moment() ||
  //     auction?.['awarded_to']?.uuid
  //   ) {
  //     return 'Ended'
  //   } else if (+moment.utc(auction?.['auction_start_date']) > +moment()) {
  //     return 'Upcoming'
  //   } else return 'Active'
  // }

  return (
    <div className="auction-participation-list">
      <div className="auction-participation-list-header">
        <div className="title">{t('my_participation')}</div>
        <div className="tabs-list">{renderTabs()}</div>
      </div>
      <div className="md-grid auction-participation-list-cards">
        {renderCards()}
      </div>
    </div>
  )
}
export default ParticipatedAuctions
