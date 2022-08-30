import { useState } from 'react'
import { useTranslation } from 'libs/langs'

import BiddingCard from 'components/bidding-card'
import AuctionsFilter from 'components/auction-filter'
import CardsWithMap from 'components/cards-with-map'

import './style.scss'
import { useQuery } from 'react-query'
import {
  // listAuction,
  // featuredAuctions,
  filterAuctions,
  filterFeatureAuctions,
} from 'libs/api/auctions-api'
import { FontIcon } from 'react-md'
// import { filter } from 'lodash-es'

const AuctionsList = ({ logged, user }) => {
  const { t } = useTranslation()

  const modules = location.pathname.split('/').filter((v) => v !== '')
  const [filterData, setFilterData] = useState({})
  const [gridView, setGridView] = useState(0)
  const type = modules.includes('live-auctions') ? 'Active' : 'Upcoming'

  // const { data: auctionsData, refetch } = useQuery(
  //   [logged ? 'upcomingAuctions' : 'featuredAuctions', type, 100],
  //   logged ? listAuction : featuredAuctions,
  // )

  const { data: auctionsData, refetch } = useQuery(
    [
      'getAuctions',
      {
        search_key: filterData?.search,
        city_id: filterData?.location,
        property_type_id: filterData?.type,
        price_gte: filterData?.price?.min,
        price_lte: filterData?.price?.max,
      },

      {
        filter: {
          // auction_start_date: {
          //   $gte: '2022-02-28T08:00:00Z',
          //   $lte: '2022-02-28T23:00:00Z',
          // },
        },
        sort: [
          filterData?.auctionEndingSoon === 'aes'
            ? 'auction_start_date'
            : '-auction_start_date',
        ],
        limit: 20,
        offset: 0,
      },
    ],
    logged ? filterAuctions : filterFeatureAuctions,
    { refetchOnWindowFocus: false },
  )
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
