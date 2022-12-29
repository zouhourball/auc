import {
  FontIcon,
  Avatar,
  Checkbox,
  SelectField,
  ExpansionList,
  ExpansionPanel,
  Button,
} from 'react-md'
import { getPublicUrl } from 'libs/utils/custom-function'
// import { navigate } from '@reach/router'
import { useCallback, useState, useContext } from 'react'
import { useQuery } from 'react-apollo-hooks'
import { useQuery as useQueryReact } from 'react-query'
import { get } from 'lodash-es'
// import { getPublicUrl } from 'libs/utils/custom-function'
import { useTranslation, useCurrentLang } from 'libs/langs'

import allCountryStateCitiesGql from 'libs/queries/all-countries.gql'
import { filterFeatureAuctions } from 'libs/api/auctions-api'
import { useSelector } from 'react-redux'

import BrokerHeader from 'components/broker-header'
import BiddingCard from 'components/bidding-card'
import CompanyInfoById from 'components/company-info-by-id'

import { propertyTypeList } from 'components/helpers/index'

// import gridActive from 'images/Map View Selected.svg'
// import gridInactive from 'images/Map View Grey.svg'
// import listActive from 'images/List View Selected.svg'
// import listInactive from 'images/List View Grey.svg'

import './style.scss'
import { ActiveTab } from 'components/app/context'

const BrokerProfile = ({ brokerId, logged, meOrgs, location }) => {
  const { t } = useTranslation()
  const user = useSelector(({ app }) => app?.userInfos)
  let currentLang = useCurrentLang()
  const [filterData, setFilterData] = useState({})
  // const [filter, setFilter] = useState(0)
  const [showMore, setShowMore] = useState(false)
  // const [broker, setBroker] = useState(false)

  const [state, setState] = useContext(ActiveTab)

  const [offset, setOffset] = useState(0)
  const { data: allCountryStateCities } = useQuery(allCountryStateCitiesGql, {
    context: {
      uri: `${PRODUCT_APP_URL_PROFILE}/graphql`,
    },
  })
  // const myOrgs = useSelector(({ app }) => app?.myOrgs)

  // const renderAuctionStatus = () => {
  //   switch (filter) {
  //     case 0:
  //       return 'Active'
  //     case 1:
  //       return 'Upcoming'
  //     case 2:
  //       return 'Closed'
  //   }
  // }
  // console.log(location.state.cameFrom)
  const renderAuctionData = () => {
    switch (state) {
      case 0:
        return auctionsData0
      case 1:
        return auctionsData1
      case 2:
        return auctionsData2
    }
  }
  const refetch = () => {
    switch (state) {
      case 0:
        return refetch0
      case 1:
        return refetch1
      case 2:
        return refetch2
    }
  }
  // console.log(filterData?.type)
  // const { data: auctionsData, refetch } = useQueryReact(
  //   [
  //     'filterFeatureAuctions',
  //     {
  //       search_key: filterData?.search,
  //       city_id: filterData?.location,
  //       // property_type_id: filterData?.type,
  //       auction_status: renderAuctionStatus(),
  //       // configurator_organization_id: 1634,

  //     },

  //     {
  //       filter: {
  //         '$or': [
  //           { 'configurator_organization_id': 805 },
  //         ],
  //         // configurator_organization_id: { '$in': [805] },

  //       },
  //       sort: [],
  //       limit: 9,
  //       offset: 0,
  //     },
  //   ],
  //   filterFeatureAuctions,
  //   { refetchOnWindowFocus: false },
  // )
  let limit = 9

  const allFilters = [
    {
      filter: {},
      sort: [],
      limit,
      offset,
    },
    {
      cities: filterData?.location,
      property_type_ids: filterData?.type,
      organization_ids: [brokerId],
    },
  ]
  const { data: auctionsData0, refetch: refetch0 } = useQueryReact(
    [
      'filterFeatureAuctions',
      {
        search_key: filterData?.search,
        auction_status: 'Active',
      },

      ...allFilters,
    ],
    filterFeatureAuctions,
    { refetchOnWindowFocus: false },
  )
  const { data: auctionsData1, refetch: refetch1 } = useQueryReact(
    [
      'filterFeatureAuctions',
      {
        search_key: filterData?.search,
        auction_status: 'Upcoming',
      },

      ...allFilters,
    ],
    filterFeatureAuctions,
    { refetchOnWindowFocus: false },
  )
  const { data: auctionsData2, refetch: refetch2 } = useQueryReact(
    [
      'filterFeatureAuctions',
      {
        search_key: filterData?.search,
        auction_status: 'Closed',
      },

      ...allFilters,
    ],
    filterFeatureAuctions,
    { refetchOnWindowFocus: false },
  )

  // const { data: downloadToken } = useQueryReact(
  //   ['genUploadToken', 'download'],
  //   genUploadToken,
  // )
  const headerFilters = [
    {
      key: 'live',
      className: `switch-toggle ${state === 0 ? 'active' : ''}`,
      onClick: () => {
        // setFilter(0)
        setState(0)
      },
      title: t('live'),
      num: auctionsData0?.results?.length,
    },
    {
      key: 'upcoming',
      className: `switch-toggle ${state === 1 ? 'active' : ''}`,
      onClick: () => {
        // setFilter(1)

        setState(1)
      },
      title: t('upcoming'),
      num: auctionsData1?.results?.length,
    },
    {
      key: 'closed',
      className: `switch-toggle ${state === 2 ? 'active' : ''}`,
      onClick: () => {
        // setFilter(2)
        setState(2)
      },
      title: t('closed'),
      num: auctionsData2?.results?.length,
    },
  ]
  let limitOfNumberShowing = 5
  const renderPaginationButtons = (indexToShowBtn) => {
    let buttonsArray = []
    let totalPages = Math.ceil(renderAuctionData()?.pagination?.total / limit)
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
  const renderCards = () =>
    renderAuctionData()?.results?.map((el) => (
      <BiddingCard
        user={user}
        key={el?.uuid}
        auctionData={el}
        status={state === 0 && 'Active'}
        live={state === 0}
        saveAuctionTag
        refetch={() => refetch()}
        // detailsUrl={() =>
        //   logged
        //     ? navigate(`/auctions/detail/${el?.uuid}`)
        //     : navigate(`/public/detail/${el?.uuid}`)
        // }
        meOrgs={meOrgs}
        logged={logged}
        goBackLabel={`Back to the Broker's Profile Page`}
      />
    ))

  const onChangeLocation = useCallback((id) => {
    filterData?.location?.find((l) => l === id)
      ? setFilterData((v) => {
        return { ...v, location: v?.location?.filter((ell) => ell !== id) }
      })
      : setFilterData({
        ...filterData,
        location: [...(filterData.location || []), id],
      })
  })
  const renderStates = (states) => {
    return (
      <div>
        {states?.map((st) => {
          return (
            <Checkbox
              key={st.node.id}
              id={`${st.node.id}-auction-location`}
              name={`${st.node.name}-checkboxes`}
              label={st.node.name}
              onChange={() => {
                onChangeLocation(st.node.id)
              }}
              checked={!!filterData?.location?.find((ch) => ch === st.node.id)}
            />
          )
        })}
      </div>
    )
  }

  const renderCountries = allCountryStateCities?.allCountries?.countries.map(
    (el) => {
      return (
        <ExpansionPanel key={el.id} label={el.countryName} footer={null}>
          {renderStates(el?.states?.edges)}
        </ExpansionPanel>
      )
    },
  )

  return (
    <div className="broker-profile">
      <div className="broker-profile-header">
        <Button
          className="back-btn"
          primary
          iconBefore
          iconEl={
            <FontIcon
            // onClick={() => {
            //   //  navigate('/auctions/broker')
            //   // window.history.go(-1)
            // }}
            >
              {currentLang === 'ar-SA' || currentLang === 'ar'
                ? 'arrow_forward'
                : 'arrow_back'}
            </FontIcon>
          }
          onClick={() => window.history.go(-1)}
        >
          {location.state.cameFrom === 'broker'
            ? t('broker_profile')
            : t('auction_detail')}
        </Button>

        <div className="title"></div>
      </div>
      <div className="broker-profile-body">
        <div className="broker-profile-body-card">
          <CompanyInfoById orgId={brokerId}>
            {(res) => {
              return (
                <>
                  <div className="general-info">
                    <div className="infos">
                      <Avatar
                        className="owner-card-avatar"
                        src={
                          get(res, 'companyLogo.aPIID', null)
                            ? getPublicUrl(res?.companyLogo?.aPIID)
                            : null
                        }
                      >
                        {!res?.companyLogo?.aPIID && res?.name?.[0]}
                      </Avatar>
                      {res?.name && <div className="title">{res?.name}</div>}
                      {res?.phoneMobile && (
                        <div className="phone">{res?.phoneMobile}</div>
                      )}
                      {res?.email && <div className="phone">{res?.email}</div>}
                      {res?.city?.cityName && res?.country?.countryName && (
                        <div className="phone">
                          {res?.city?.cityName}, {res?.country?.countryName}
                        </div>
                      )}
                    </div>
                    {res?.aboutUs && (
                      <>
                        {' '}
                        <div className={`${!showMore ? 'less' : ''} bio`}>
                          {res?.aboutUs}
                        </div>
                        <div className="float-left">
                          <Button
                            className="less-btn"
                            iconChildren={
                              showMore ? 'expand_less' : 'expand_more'
                            }
                            iconBefore={showMore && !showMore}
                            onClick={() => setShowMore(!showMore)}
                          >
                            {showMore ? 'Less' : 'More'}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>

                  {res?.webSite && (
                    <div
                      onClick={() => {
                        //  setBroker(!broker)
                        window.open(res?.webSite)
                      }}
                      className="website-link"
                    >
                      <FontIcon primary>language</FontIcon>
                      <span>{res?.webSite}</span>
                    </div>
                  )}
                </>
              )
            }}
          </CompanyInfoById>
        </div>
        <div className="broker-profile-body-wrapper">
          <div className="filter">
            <BrokerHeader
              filterData={filterData}
              setFilterData={setFilterData}
              filters={headerFilters}
              searchPlaceholder={t('what_are_you_looking_for')}
            />
            <div className="broker-profile-filter md-grid">
              <SelectField
                placeholder={t('type')}
                className="md-cell md-cell--1 broker-profile-selectField"
                value={'type'}
                dropdownIcon={<FontIcon>expand_more</FontIcon>}
                position={SelectField.Positions.BELOW}
                closeMenuOnSelect={false}
                menuItems={propertyTypeList?.map((tp, index) => {
                  return tp?.props?.text ? (
                    <div className="md-text">
                      <b>{t(tp?.props?.text)}</b>
                    </div>
                  ) : (
                    {
                      label: (
                        <Checkbox
                          key={index}
                          id={`${tp.value}-auction-type`}
                          name={`${tp.value}-checkboxes`}
                          label={t(tp.label)}
                          onChange={(e) => {
                            filterData?.type?.find((el) => el === tp.value)
                              ? setFilterData({
                                ...filterData,
                                type: filterData.type?.filter(
                                    (el) => el !== tp.value,
                                  ),
                              })
                              : setFilterData({
                                ...filterData,
                                type: [...(filterData?.type || []), tp.value],
                              })
                            e.stopPropagation()
                          }}
                          checked={
                            !!filterData?.type?.find((el) => el === tp.value)
                          }
                        />
                      ),
                      value: tp.label,
                    }
                  )
                  //   return (
                  //     <Checkbox
                  //       key={index}
                  //       id={`${tp.value}-auction-type`}
                  //       name={`${tp.value}-checkboxes`}
                  //       label={tp.label}
                  //       onChange={(e) => {
                  //         filterData?.type?.find((el) => el === tp.value)
                  //           ? setFilterData({
                  //             ...filterData,
                  //             type: filterData.type?.filter(
                  //                 (el) => el !== tp.value,
                  //               ),
                  //           })
                  //           : setFilterData({
                  //             ...filterData,
                  //             type: [...(filterData?.type || []), tp.value],
                  //           })
                  //         e.stopPropagation()
                  //       }}
                  //       checked={!!filterData?.type?.find((el) => el === tp.value)}
                  //     />
                  //   )
                })}
              />
              <SelectField
                placeholder={t('location')}
                className=" md-cell md-cell--2 broker-profile-selectField"
                value={'location'}
                dropdownIcon={<FontIcon>expand_more</FontIcon>}
                menuItems={[
                  <ExpansionList key={'LocationExpansionList'}>
                    {renderCountries}
                  </ExpansionList>,
                ]}
                position={SelectField.Positions.BELOW}
              />
            </div>
            {/* <div className="auction-list-header-filters-display">
              <img src={listActive} />
              <div className="sep"></div>
              <img src={gridInactive} />
            </div> */}
          </div>
          <div className="cards">{renderCards()}</div>
          {+renderAuctionData()?.pagination?.total > limit && (
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
                icon
                className="table-paginator-arrowBtn"
                disabled={
                  !(
                    +renderAuctionData()?.pagination?.total -
                      (offset + 1) * limit >
                    0
                  )
                }
              >
                {currentLang === 'ar-SA' || currentLang === 'ar'
                  ? 'arrow_left'
                  : 'arrow_right'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default BrokerProfile
