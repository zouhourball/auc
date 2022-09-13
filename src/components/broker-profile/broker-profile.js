import {
  FontIcon,
  Avatar,
  Checkbox,
  SelectField,
  ExpansionList,
  ExpansionPanel,
} from 'react-md'
import { navigate } from '@reach/router'
import { useCallback, useMemo, useState } from 'react'
import { useQuery } from 'react-apollo-hooks'
import { useQuery as useQueryReact } from 'react-query'

import allCountryStateCitiesGql from 'libs/queries/all-countries.gql'
import { filterFeatureAuctions } from 'libs/api/auctions-api'

import BrokerHeader from 'components/broker-header'
import BiddingCard from 'components/bidding-card'

import { propertyTypeList } from 'components/helpers/index'

import './style.scss'

import { get } from 'lodash-es'
import { getPublicUrl } from 'libs/utils/custom-function'
import CompanyInfoById from 'components/company-info-by-id'

const BrokerProfile = ({ brokerId, user }) => {
  const [filterData, setFilterData] = useState({})
  const [filter, setFilter] = useState(0)
  const { data: allCountryStateCities } = useQuery(allCountryStateCitiesGql, {
    context: {
      uri: `${PRODUCT_APP_URL_PROFILE}/graphql`,
    },
  })
  // const myOrgs = useSelector(({ app }) => app?.myOrgs)

  // console.log(get(myOrgs, '0.ID', 0), 'myOrgs')
  const renderAuctionStatus = () => {
    switch (filter) {
      case 0:
        return 'Active'
      case 1:
        return 'Upcoming'
      case 2:
        return 'Closed'
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

  const { data: auctionsData, refetch } = useQueryReact(
    [
      'filterFeatureAuctions',
      {
        search_key: filterData?.search,
        auction_status: renderAuctionStatus(),
      },

      {
        filter: {},
        sort: [],
        limit: 20,
        offset: 0,
      },
      {
        cities: filterData?.location,
        property_type_ids: filterData?.type,
        organization_ids: [brokerId],
      },
    ],
    filterFeatureAuctions,
    { refetchOnWindowFocus: false },
  )

  const headerFilters = [
    {
      key: 'live',
      className: `switch-toggle ${filter === 0 ? 'active' : ''}`,
      onClick: () => setFilter(0),
      title: 'Live',
      num: 10,
    },
    {
      key: 'upcoming',
      className: `switch-toggle ${filter === 1 ? 'active' : ''}`,
      onClick: () => setFilter(1),
      title: 'Upcoming',
      num: 10,
    },
    {
      key: 'closed',
      className: `switch-toggle ${filter === 2 ? 'active' : ''}`,
      onClick: () => setFilter(2),
      title: 'Closed',
      num: 10,
    },
  ]
  const renderCards = () =>
    auctionsData?.results?.map((el) => (
      <BiddingCard
        user={user}
        key={el?.uuid}
        auctionData={el}
        status={filter === 0 && 'Active'}
        live={filter === 0}
        saveAuctionTag
        refetch={() => refetch()}
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

  const renderCountries = useMemo(() => {
    return allCountryStateCities?.allCountries?.countries.map((el) => {
      return (
        <ExpansionPanel key={el.id} label={el.countryName} footer={null}>
          {renderStates(el?.states?.edges)}
        </ExpansionPanel>
      )
    })
  }, filterData.location)
  return (
    <div className="broker-profile">
      <div className="broker-profile-header">
        <FontIcon onClick={() => navigate('/auctions/broker')}>
          arrow_back
        </FontIcon>
        <div className="title">Broker Profile</div>
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
                        {get(res, 'companyLogo.aPIID', null)
                          ? null
                          : get(res, 'name.0', '')}
                      </Avatar>
                      {res?.name && (
                        <div className="title dark">{res?.name}</div>
                      )}
                      {res?.phoneMobile && (
                        <div className="title">{res?.phoneMobile}</div>
                      )}
                      {res?.email && <div className="title">{res?.email}</div>}
                      {res?.city?.cityName && res?.country?.countryName && (
                        <div className="title">
                          {res?.city?.cityName}, {res?.country?.countryName}
                        </div>
                      )}
                    </div>
                    {res?.aboutUs && <div className="bio">{res?.aboutUs}</div>}
                  </div>

                  {res?.webSite && (
                    <div
                      onClick={() => window.open(res?.webSite)}
                      className="website-link"
                    >
                      <FontIcon>language</FontIcon>
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
              searchPlaceholder={'What are you looking for'}
            />
            <SelectField
              placeholder={'type'}
              className="md-cell md-cell--1 auctions-filter-selectField"
              value={'type'}
              simplifiedMenu={false}
              position={SelectField.Positions.BELOW}
              closeMenuOnSelect={false}
              menuItems={propertyTypeList?.map((tp, index) => {
                return (
                  <Checkbox
                    key={index}
                    id={`${tp.value}-auction-type`}
                    name={`${tp.value}-checkboxes`}
                    label={tp.label}
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
                    checked={!!filterData?.type?.find((el) => el === tp.value)}
                  />
                )
              })}
            />
            <SelectField
              placeholder={'location'}
              className=" md-cell md-cell--2 auctions-filter-selectField"
              value={'location'}
              menuItems={[
                <ExpansionList key={'LocationExpansionList'}>
                  {renderCountries}
                </ExpansionList>,
              ]}
              position={SelectField.Positions.BELOW}
            />
            <div className="auction-list-header-filters-display">
              <FontIcon className={`gridView`}>view_list</FontIcon>
              <div className="sep"></div>
              <FontIcon className={`gridView`}>view_module</FontIcon>
            </div>
          </div>
          <div className="cards">{renderCards()}</div>
        </div>
      </div>
    </div>
  )
}
export default BrokerProfile
