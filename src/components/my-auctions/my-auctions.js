import { useState, useEffect } from 'react'
import { navigate } from '@reach/router'
import { useTranslation } from 'libs/langs'
// import { useMutation, useQuery } from 'react-query'

// import { filterAuctions } from 'libs/api/auctions-api'

import BiddingCard from 'components/bidding-card'

import { dummyData } from 'components/auctions-public/helper'

import './style.scss'

const MyAuctions = () => {
  // const { data: filterAuctionsData } = useQuery(['filterAuctions', {
  //   filter: { 'member_subject': 'CiQwMzQxYzc0NS05NmFjLTQ1NDItODMwMy0xNWNmMWU1MGZjOWYSBWxvY2Fs' },
  // }], filterAuctions)
  const { t } = useTranslation()

  const modules = location.pathname.split('/').filter((v) => v !== '')
  const [tab, setTab] = useState(0)
  useEffect(() => {
    if (modules.includes('my-auctions')) {
      setTab(0)
    }
    if (modules.includes('saved-auctions')) {
      setTab(1)
    }
  }, [modules])
  const renderCards = () =>
    dummyData?.map((el) => (
      <BiddingCard
        className="md-cell md-cell--6"
        key={el?.uuid}
        auctionData={el}
        status={'Active'}
        {...(modules.includes('my-auctions')
          ? {
            detailsUrl: () =>
              navigate(`/auctions/my-auction-details/${el.id}`),
          }
          : {})}
      />
    ))
  return (
    <div className="auction-list">
      <div className="auction-list-header">
        {tab === 0 && <div className="title">{t('my_auctions')}</div>}
        {tab === 1 && <div className="title">{t('saved_auctions')}</div>}
      </div>
      <div className="md-grid auction-list-cards">{renderCards()}</div>
    </div>
  )
}
export default MyAuctions
