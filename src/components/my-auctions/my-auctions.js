import { useState, useEffect } from 'react'
import moment from 'moment'
import { navigate } from '@reach/router'
import { Button } from 'react-md'
import { useSelector } from 'react-redux'

import { useTranslation } from 'libs/langs'
import { useQuery } from 'react-query'

import { myAuctions, savedAuctions } from 'libs/api/auctions-api'

import BiddingCard from 'components/bidding-card'

import './style.scss'

const MyAuctions = ({ meOrgs }) => {
  const { t } = useTranslation()
  const user = useSelector(({ app }) => app?.userInfos)
  const [tab, setTab] = useState(0)
  const [statusTab, setStatusTab] = useState(0)
  const tabsData = [
    { id: 0, label: t('active') },
    { id: 1, label: t('pending') },
    { id: 2, label: t('closed') },
  ]
  const renderTabName = () => {
    switch (statusTab) {
      case 0:
        return 'Active'
      case 1:
        return 'Pending'
      case 2:
        return 'Closed'
      default:
        return 'Active'
    }
  }
  const { data: auctionsData, refetch } = useQuery(
    [
      tab === 1 ? 'savedAuctions' : 'myAuctions',
      {
        filter: {},
        sort: [],
        limit: 10,
        offset: 0,
      },
      renderTabName(),
    ],
    tab === 1 ? savedAuctions : myAuctions,
  )

  const modules = location.pathname.split('/').filter((v) => v !== '')
  useEffect(() => {
    if (modules.includes('my-auctions')) {
      setTab(0)
    }
    if (modules.includes('saved-auctions')) {
      setTab(1)
    }
  }, [modules])
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
    auctionsData?.results?.map((el) => (
      <BiddingCard
        saveAuctionTag
        user={user}
        className="md-cell md-cell--4"
        key={el?.uuid}
        auctionData={el}
        tabPending={statusTab === 1}
        status={renderStatus(el)}
        {...(modules.includes('my-auctions')
          ? {
            detailsUrl: () =>
              navigate(`/auctions/my-auction-details/${el?.uuid}`),
          }
          : {})}
        // {...(tab === 1 ? { saveAuctionTag: false } : {})}
        refetch={() => refetch()}
        logged
        meOrgs={meOrgs}
      />
    ))
  const renderTabs = () =>
    tabsData?.map((el) => (
      <Button
        className={`${statusTab === el?.id ? 'active' : ''}`}
        key={el.id}
        onClick={() => setStatusTab(el.id)}
        primary={statusTab === el.id}
      >
        <span>{el.label}</span>
      </Button>
    ))
  return (
    <div className="auction-list">
      <div className="auction-list-header">
        {tab === 0 && <div className="title">{t('my_auctions')}</div>}
        {tab === 1 && <div className="title">{t('saved_auctions')}</div>}
      </div>
      {modules.includes('my-auctions') && (
        <div className="tabs-list">{renderTabs()}</div>
      )}
      <div className="md-grid auction-list-cards">{renderCards()}</div>
    </div>
  )
}
export default MyAuctions
