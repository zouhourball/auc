import { useState } from 'react'
import { useTranslation } from 'libs/langs'

import BiddingCard from 'components/bidding-card'
import AuctionsFilter from 'components/auction-filter'
import CardsWithMap from 'components/cards-with-map'

import './style.scss'
import { useQuery } from 'react-query'
import {
  listAuction,
  featuredAuctions,
  //  filterAuctions
} from 'libs/api/auctions-api'
import { FontIcon } from 'react-md'

const AuctionsList = ({ logged, user }) => {
  const { t } = useTranslation()

  const modules = location.pathname.split('/').filter((v) => v !== '')
  const [filterData, setFilterData] = useState({})
  const [gridView, setGridView] = useState(0)
  const type = modules.includes('live-auctions') ? 'Active' : 'Upcoming'

  const { data: auctionsData, refetch } = useQuery(
    [logged ? 'upcomingAuctions' : 'featuredAuctions', type, 20],
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
        user={user}
        className="md-cell md-cell--4"
        key={el?.uuid}
        auctionData={el}
        status={type}
        live={modules.includes('live-auctions')}
        saveAuctionTag
        refetch={() => refetch()}
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
      <span>
        <FontIcon onClick={() => setGridView(0)} primary>
          task_alt
        </FontIcon>
        <FontIcon onClick={() => setGridView(1)} primary>
          task_alt
        </FontIcon>
      </span>
      {gridView === 0 ? (
        <div className="md-grid auction-list-cards">{renderCards()}</div>
      ) : (
        <CardsWithMap
          cardsData={auctionsData?.results}
          live={modules.includes('live-auctions')}
          type={type}
          user={user}
          refetch={refetch}
        />
      )}
    </div>
  )
}
export default AuctionsList
