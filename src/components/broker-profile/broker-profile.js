import {
  FontIcon,
  Avatar,
  Checkbox,
  SelectField,
  ExpansionList,
  ExpansionPanel,
} from 'react-md'
import { navigate } from '@reach/router'
import { useState } from 'react'
import { useQuery } from 'react-apollo-hooks'
import { useQuery as useQueryReact } from 'react-query'

import allCountryStateCitiesGql from 'libs/queries/all-countries.gql'
import { filterFeatureAuctions } from 'libs/api/auctions-api'

import BrokerHeader from 'components/broker-header'
import BiddingCard from 'components/bidding-card'

import { propertyTypeList } from 'components/helpers/index'

import './style.scss'

import avatar from './avatar.png'
// import { useSelector } from 'react-redux'
// import { get } from 'lodash-es'

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
  const { data: auctionsData, refetch } = useQueryReact(
    [
      'filterFeatureAuctions',
      {
        search_key: filterData?.search,
        city_id: filterData?.location,
        property_type_id: filterData?.type,
        auction_status: renderAuctionStatus(),
        // configurator_organization_id: 1634,
      },

      {
        filter: {
          // configurator_organization_id: { $in: [1634] },
        },
        sort: [],
        limit: 9,
        offset: 0,
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
          <div className="general-info">
            <div className="infos">
              <Avatar src={avatar}></Avatar>
              <div className="title dark">{'name'}</div>
              <div className="title">{'phone'}</div>
              <div className="title">{'email'}</div>
              <div className="title">{'city, country'}</div>
            </div>
            <div className="bio">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry s standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it{' '}
            </div>
          </div>
          <div
            onClick={() => window.open('www.link.com')}
            className="website-link"
          >
            <FontIcon>language</FontIcon>
            <span>www.link.com</span>
          </div>
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
              simplifiedMenu={true}
              position={SelectField.Positions.BELOW}
              closeMenuOnSelect={true}
              menuItems={propertyTypeList?.map((tp, index) => {
                return {
                  label: (
                    <Checkbox
                      id={`${tp.value}-auction-type`}
                      name={`${tp.value}-checkboxes`}
                      label={tp.label}
                      // onChange={(v) => {
                      //   filterData?.type?.find(el => { return el === tp.value })
                      //     ? setFilterData({ ...filterData, type: filterData.type.filter(el => el !== tp.value) })
                      //     : setFilterData({ ...filterData, type: [...filterData.type, tp?.value] })
                      // }}
                      onChange={() => {
                        filterData?.type === tp.value
                          ? setFilterData({ ...filterData, type: null })
                          : setFilterData({ ...filterData, type: tp.value })
                      }}
                      checked={filterData?.type === tp.value}
                    />
                  ),
                }
              })}
            />
            <SelectField
              placeholder={'location'}
              className=" md-cell md-cell--2 auctions-filter-selectField"
              value={'location'}
              // onChange={(v) => setFilterData({ ...filterData, location: v })}
              menuItems={allCountryStateCities?.allCountries?.countries.flatMap(
                (el) => {
                  return (
                    <ExpansionList>
                      <ExpansionPanel
                        key={el.id}
                        label={el.countryName}
                        footer={null}
                      >
                        {el?.states?.edges?.map((st, index) => {
                          return (
                            <Checkbox
                              key={st.node.id}
                              id={`${st.node.id}-auction-location`}
                              name={`${st.node.name}-checkboxes`}
                              label={st.node.name}
                              onChange={(v) => {
                                filterData?.location === st.node.id
                                  ? st.node.id &&
                                    setFilterData({
                                      ...filterData,
                                      location: null,
                                    })
                                  : setFilterData({
                                    ...filterData,
                                    location: st.node.id,
                                  })
                              }}
                              checked={filterData?.location === st.node.id}
                            />
                          )
                        })}
                      </ExpansionPanel>
                    </ExpansionList>
                  )
                },
              )}
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
