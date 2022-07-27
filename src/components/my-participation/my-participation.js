import { useState } from 'react'
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
            status={'Active'}
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
    <div className="auction-list">
      <div className="auction-list-header">
        <div className="title">{t('my_participation')}</div>
        <div>{renderTabs()}</div>
      </div>
      <div className="md-grid auction-list-cards">{renderCards()}</div>
    </div>
  )
}
export default ParticipatedAuctions
