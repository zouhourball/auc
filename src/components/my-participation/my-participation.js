import { useState } from 'react'
import { useTranslation } from 'libs/langs'

import { Button } from 'react-md'
import { useQuery } from 'react-query'
import { getMyAuctions } from 'libs/api/auctions-api'
import BiddingCard from 'components/bidding-card'

import './style.scss'

const ParticipatedAuctions = () => {
  const { t } = useTranslation()

  const [tab, setTab] = useState(0)
  const tabsData = [
    { id: 0, label: t('active') },
    { id: 1, label: t('won') },
    { id: 2, label: t('lost') },
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
        className="md-cell md-cell--6"
        key={i}
        auctionData={el}
        status={tab === 0 ? 'active' : ''}
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
        {el.label}
      </Button>
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
