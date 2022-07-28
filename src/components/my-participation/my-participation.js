import { useState } from 'react'
import moment from 'moment'

import { useTranslation } from 'libs/langs'

import BiddingCard from 'components/bidding-card'

import { dummyData } from 'components/auctions-public/helper'

import './style.scss'

const ParticipatedAuctions = () => {
  const { t } = useTranslation()

  const [tab, setTab] = useState(0)
  const modules = location.pathname.split('/').filter((v) => v !== '')
  const tabsData = [
    { id: 0, label: t('active') },
    { id: 1, label: t('won') },
    { id: 2, label: t('lost') },
  ]

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

  const renderCards = () => {
    switch (tab) {
      case 0:
      case 1:
      case 2:
        return dummyData?.map((el) => (
          <BiddingCard
            className="md-cell md-cell--6"
            key={el?.uuid}
            auctionData={el}
            status={renderStatus(el)}
            live={modules.includes('live-auctions')}
          />
        ))
      default:
        break
    }
  }
  const renderTabs = () =>
    tabsData?.map((el) => (
      <div
        className={`${tab === el?.id ? 'active' : ''}`}
        key={el.id}
        onClick={() => setTab(el.id)}
      >
        {el.label}
      </div>
    ))
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
