import { useState } from 'react'
import { useTranslation } from 'libs/langs'

import BiddingCard from 'components/bidding-card'
import AuctionsFilter from 'components/auction-filter'
import CardsWithMap from 'components/cards-with-map'

import { useQuery } from 'react-query'
import {
  // listAuction,
  // featuredAuctions,
  filterAuctions,
  filterFeatureAuctions,
} from 'libs/api/auctions-api'
import { FontIcon } from 'react-md'
// import { filter } from 'lodash-es'

import './style.scss'

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
        // city_id: filterData?.location,
        price_gte: filterData?.price?.min,
        price_lte: filterData?.price?.max,
        auction_status: type,
        page: 2,
      },

      {
        filter: {
          // auction_start_date: {
          //   $gte: '2022-08-28T08:00:00Z',
          //   $lte: '2022-09-28T23:00:00Z',
          // },
          // property_type_id: { $in: filterData?.type?.filter(el => el !== undefined) },
        },
        sort: [
          filterData?.auctionEndingSoon === 'aes'
            ? 'auction_start_date'
            : '-auction_start_date',
        ],
        limit: 9,
        offset: 0,
      },
      {
        cities: filterData?.location,
        property_type_ids: filterData?.type,
        organization_ids: filterData?.brokerCompany,
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
      <div className="auction-list-header-filters">
        <AuctionsFilter filterData={filterData} setFilterData={setFilterData} />
        {modules.includes('live-auctions') && (
          <div className="auction-list-header-filters-display">
            <FontIcon
              className={`gridView ${gridView === 0 ? 'active' : ''}`}
              onClick={() => setGridView(0)}
            >
              view_list
            </FontIcon>
            <div className="sep"></div>
            <FontIcon
              onClick={() => setGridView(1)}
              className={`gridView ${gridView === 1 ? 'active' : ''}`}
            >
              view_module
            </FontIcon>
          </div>
        )}
      </div>
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
