import { useState } from 'react'
import { useTranslation } from 'libs/langs'

import BiddingCard from 'components/bidding-card'
import AuctionsFilter from 'components/auction-filter'

import './style.scss'
import { useQuery } from 'react-query'
import {
  listAuction,
  featuredAuctions,
  //  filterAuctions
} from 'libs/api/auctions-api'

const AuctionsList = ({ logged }) => {
  const { t } = useTranslation()

  const modules = location.pathname.split('/').filter((v) => v !== '')
  const [filterData, setFilterData] = useState({})
  const type = modules.includes('live-auctions') ? 'Active' : 'Upcoming'

  const { data: auctionsData } = useQuery(
    [logged ? 'upcomingAuctions' : 'featuredAuctions', type, 100],
    logged ? listAuction : featuredAuctions,
  )

  // const { data: auctionsList } = useQuery(
  //   [
  //     'getAuctions',
  //     { search_key: filterData?.search },

  //     {
  //       filter: {},
  //       sort: [],
  //       limit: 20,
  //       offset: 5,
  //     },
  //   ],
  //   filterAuctions,
  //   { refetchOnWindowFocus: false }
  // )

  const renderCards = () =>
    auctionsData?.results?.map((el) => (
      <BiddingCard
        className="md-cell md-cell--6"
        key={el?.uuid}
        auctionData={el}
        status={type}
        live={modules.includes('live-auctions')}
      />
    ))
  return (
    <div className="auction-list">
      <div className="auction-list-header">
        {modules.includes('live-auctions') && (
          <div className="title">{t('live_auctions')}</div>
        )}
        {modules.includes('upcoming-auctions') && (
          <div className="title">{t('upcoming_auctions')}</div>
        )}
        <div>
          {t('showing_results')}
          <span>({auctionsData?.results?.length || 0})</span>
        </div>
      </div>
      <AuctionsFilter filterData={filterData} setFilterData={setFilterData} />
      <div className="md-grid auction-list-cards">{renderCards()}</div>
    </div>
  )
}
export default AuctionsList
