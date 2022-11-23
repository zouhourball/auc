import { useState } from 'react'
import { useTranslation, useCurrentLang } from 'libs/langs'
import { Button } from 'react-md'

import BiddingCard from 'components/bidding-card'
import AuctionsFilter from 'components/auction-filter'
import CardsWithMap from 'components/cards-with-map'

import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import {
  // listAuction,
  // featuredAuctions,
  filterAuctions,
  filterFeatureAuctions,
} from 'libs/api/auctions-api'
// import { filter } from 'lodash-es'
import gridActive from 'images/Map View Selected.svg'
import gridInactive from 'images/Map View Grey.svg'
import listActive from 'images/List View Selected.svg'
import listInactive from 'images/List View Grey.svg'
import noResult from 'images/no_result_found.svg'

import './style.scss'

const AuctionsList = ({ logged, meOrgs }) => {
  const { t } = useTranslation()
  let currentLang = useCurrentLang()
  const user = useSelector(({ app }) => app?.userInfos)

  const modules = location.pathname.split('/').filter((v) => v !== '')
  const [filterData, setFilterData] = useState({})
  const [gridView, setGridView] = useState(0)
  const [offset, setOffset] = useState(0)
  const type = modules.includes('live-auctions') ? 'Active' : 'Upcoming'

  // const { data: auctionsData, refetch } = useQuery(
  //   [logged ? 'upcomingAuctions' : 'featuredAuctions', type, 100],
  //   logged ? listAuction : featuredAuctions,
  // )
  let limit = 9

  const { data: auctionsData, refetch } = useQuery(
    [
      'getAuctions',
      {
        search_key: filterData?.search,
        // city_id: filterData?.location,
        price_gte: filterData?.price?.min,
        price_lte: filterData?.price?.max,
        auction_status: type,
      },

      {
        filter: {
          // auction_start_date: {
          //   $gte: '2022-08-28T08:00:00Z',
          //   $lte: '2022-09-28T23:00:00Z',
          // },
          // property_type_id: { $in: filterData?.type?.filter(el => el !== undefined) },
        },
        sort: filterData?.auctionEndingSoon
          ? [
            type === 'Upcoming'
              ? filterData?.auctionEndingSoon === 'ass'
                ? 'auction_start_date'
                : '-auction_start_date'
              : filterData?.auctionEndingSoon === 'aes'
                ? 'auction_end_date'
                : '-auction_end_date',
          ]
          : [],
        limit,
        offset,
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
    auctionsData?.results?.length > 0 ? (
      auctionsData?.results?.map((el) => (
        <BiddingCard
          meOrgs={meOrgs}
          user={user}
          className="md-cell md-cell--4"
          key={el?.uuid}
          auctionData={el}
          status={type}
          live={modules.includes('live-auctions')}
          saveAuctionTag
          refetch={() => refetch()}
          logged={logged}
        />
      ))
    ) : (
      <div className="empty-content">
        <img className="empty-content-logo" src={noResult} />
        <div className="empty-content-title">{t('no_result')}</div>
        <div className="empty-content-text">{t('result_not_found')}</div>
      </div>
    )
  let limitOfNumberShowing = 5
  const renderPaginationButtons = (indexToShowBtn) => {
    let buttonsArray = []
    let totalPages = Math.ceil(auctionsData?.pagination?.total / limit)
    for (let index = 0; index < totalPages; index++) {
      if (index < limitOfNumberShowing) {
        buttonsArray.push(
          <Button
            className={`table-paginator-btn ${
              index === offset ? 'active' : ''
            }`}
            onClick={() => setOffset(index)}
            flat
          >
            {index + 1}
          </Button>,
        )
      } else break
    }
    if (indexToShowBtn && indexToShowBtn < totalPages) {
      buttonsArray.push(
        <span>...</span>,
        <Button
          className={`table-paginator-btn ${
            indexToShowBtn - 1 === offset ? 'active' : ''
          }`}
          onClick={() => setOffset(indexToShowBtn - 1)}
          flat
        >
          {indexToShowBtn}
        </Button>,
      )
    }
    if (totalPages > limitOfNumberShowing) {
      buttonsArray.push(
        <span>...</span>,
        <Button
          className={`table-paginator-btn ${
            totalPages - 1 === offset ? 'active' : ''
          }`}
          onClick={() => setOffset(totalPages - 1)}
          flat
        >
          {totalPages}
        </Button>,
      )
    }
    return buttonsArray
  }
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
          <span> ({auctionsData?.results?.length || 0})</span>
        </div>
      </div>
      <div className="auction-list-header-filters">
        <AuctionsFilter
          status={type}
          filterData={filterData}
          setFilterData={setFilterData}
        />
        {modules.includes('live-auctions') && (
          <div className="auction-list-header-filters-display">
            <img
              src={gridView === 0 ? listActive : listInactive}
              onClick={() => setGridView(0)}
            />
            <div className="sep"></div>
            <img
              src={gridView === 1 ? gridActive : gridInactive}
              onClick={() => setGridView(1)}
            />

            {/* <FontIcon
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
            </FontIcon> */}
          </div>
        )}
      </div>
      {gridView === 0 ? (
        <>
          <div
            className={`md-grid auction-list-cards ${
              auctionsData?.results?.length === 0 ? 'empty' : ''
            }`}
          >
            {renderCards()}
          </div>
          {+auctionsData?.pagination?.total > limit && (
            <div className="table-paginator">
              <Button
                onClick={() => setOffset((prev) => prev - 1)}
                disabled={offset === 0}
                icon
                className="table-paginator-arrowBtn"
              >
                {currentLang === 'ar-SA' || currentLang === 'ar'
                  ? 'arrow_right'
                  : 'arrow_left'}
              </Button>
              {offset < limitOfNumberShowing
                ? renderPaginationButtons()
                : renderPaginationButtons(offset + 1)}
              <Button
                onClick={() => setOffset((prev) => prev + 1)}
                disabled={
                  !(+auctionsData?.pagination?.total - (offset + 1) * limit > 0)
                }
                icon
                className="table-paginator-arrowBtn"
              >
                {currentLang === 'ar-SA' || currentLang === 'ar'
                  ? 'arrow_left'
                  : 'arrow_right'}
              </Button>
            </div>
          )}
        </>
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
