import {
  Checkbox,
  ExpansionList,
  ExpansionPanel,
  FontIcon,
  SelectField,
  TextField,
} from 'react-md'
import { useTranslation } from 'libs/langs'
import { propertyTypeList } from 'components/helpers/index'
import PriceRange from 'components/price-range'
import allCountryStateCitiesGql from 'libs/queries/all-countries.gql'
import './style.scss'
import { useQuery as useQueryApollo } from 'react-apollo-hooks'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { allBrokers } from 'libs/api/auctions-api'
const AuctionsFilter = ({ filterData, setFilterData, status }) => {
  const { t } = useTranslation()
  const {
    search,
    price,
    // type,
    // bedsBaths,
    // more,
    auctionEndingSoon,
    // location,
    // brokerCompany,
  } = filterData
  const [newPrice, setNewPrice] = useState(false)
  useEffect(() => {
    setFilterData({
      ...filterData,
      auctionEndingSoon: status === 'Upcoming' ? 'ass' : 'aes',
    })
  }, [])
  const { data: allCountryStateCities } = useQueryApollo(
    allCountryStateCitiesGql,
    {
      context: {
        uri: `${PRODUCT_APP_URL_PROFILE}/graphql`,
      },
    },
  )

  const { data: getBrokers } = useQuery(['getBrokers'], allBrokers)

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
    <div className="md-grid auctions-filter">
      <TextField
        placeholder={t('looking_for_what')}
        className="md-cell md-cell--3 auctions-filter-textField"
        value={search}
        onChange={(v) => setFilterData({ ...filterData, search: v })}
        rightIcon={<FontIcon>{t('search')}</FontIcon>}
        block
      />
      <SelectField
        placeholder={t('type')}
        className="md-cell md-cell--1 auctions-filter-selectField"
        toggleClassName="is-toggled"
        value={'type'}
        position={SelectField.Positions.BELOW}
        menuItems={propertyTypeList?.map((tp, index) => (
          <Checkbox
            key={`${tp.value}-auction-type-${index}`}
            id={`${tp.value}-auction-type`}
            name={`${tp.value}-checkboxes`}
            label={tp.label}
            onChange={(e) => {
              filterData?.type?.find((el) => el === tp.value)
                ? setFilterData({
                  ...filterData,
                  type: filterData.type?.filter((el) => el !== tp.value),
                })
                : setFilterData({
                  ...filterData,
                  type: [...(filterData?.type || []), tp.value],
                })
              e.stopPropagation()
            }}
            checked={!!filterData?.type?.find((el) => el === tp.value)}
          />
        ))}
      />
      <div className="price md-cell md-cell--2">
        {newPrice && (
          <PriceRange
            key="price-range"
            onChangeSlider={(v) => {
              setFilterData({
                ...filterData,
                price: { ...price, min: v.min, max: v.max },
              })
            }}
            onFinalChange={() => {
              setNewPrice(false)
            }}
            price={price}
          />
        )}
        <TextField
          value={
            !newPrice && price ? `${price?.min} - ${price?.max}` : 'Price Range'
          }
          className="auctions-filter-textField price-range"
          onClick={() => setNewPrice(!newPrice)}
          disabled
          rightIcon={<FontIcon>arrow_drop_down</FontIcon>}
          // value={newPrice}
          // menuItems={[
          // <div key='price_range'>
          //   <div className='price-slider'></div>
          //   <div className='price-inputs'>
          //     <TextField
          //       type='number'
          //       className='price-range-textField'
          //       placeholder='0'
          //       rightIcon={<span>OMR</span>}
          //       value={price?.min}
          //       onChange={(v) => setFilterData({ ...filterData, price: { ...filterData?.price, min: v } })}
          //       block
          //     />
          //     <TextField
          //       type='number'
          //       className='price-range-textField'
          //       placeholder='0'
          //       rightIcon={<span>OMR</span>}
          //       value={price?.max}
          //       onChange={(v) => setFilterData({ ...filterData, price: { ...filterData?.price, max: v } })}
          //       block
          //     />
          //   </div>
          // </div>,

          /* ]} */
          /* position={SelectField.Positions.BELOW} */
        />
      </div>
      <SelectField
        placeholder={'Location'}
        className=" md-cell md-cell--2 auctions-filter-selectField"
        value={'location'}
        menuItems={[
          <ExpansionList key={'LocationExpansionList'}>
            {renderCountries}
          </ExpansionList>,
        ]}
        position={SelectField.Positions.BELOW}
      />

      <SelectField
        placeholder={'Broker Company'}
        className=" md-cell md-cell--2 auctions-filter-selectField"
        value={'Broker Company'}
        // onChange={(v) => setFilterData({ ...filterData, brokerCompany: v })}
        menuItems={getBrokers?.results?.map((bc, index) => (
          <Checkbox
            key={index}
            id={`${bc.id}-auction-type`}
            name={`${bc.id}-checkboxes`}
            label={bc.name}
            onChange={(e) => {
              filterData?.brokerCompany?.find((el) => {
                return el === bc.id
              })
                ? setFilterData({
                  ...filterData,
                  brokerCompany: filterData.brokerCompany.filter(
                    (el) => el !== bc.id,
                  ),
                })
                : setFilterData({
                  ...filterData,
                  brokerCompany: [
                    ...(filterData?.brokerCompany || []),
                      bc?.id,
                  ],
                })
              e.stopPropagation()
            }}
            checked={!!filterData?.brokerCompany?.find((el) => el === bc.id)}
          />
        ))}
        position={SelectField.Positions.BELOW}
      />
      {/* <SelectField
        placeholder={t('beds_baths')}
        className="md-cell md-cell--2 auctions-filter-selectField"
        value={bedsBaths}
        onChange={(v) => setFilterData({ ...filterData, bedsBaths: v })}
        menuItems={[
          { label: 'beds1', value: 'b1' },
          { label: 'beds2', value: 'b2' },
        ]}
        position={SelectField.Positions.BELOW}
      /> */}
      {/* <SelectField
        placeholder={t('more')}
        className="md-cell md-cell--1 auctions-filter-selectField"
        value={more}
        onChange={(v) => setFilterData({ ...filterData, more: v })}
        menuItems={[
          { label: 'more1', value: 'm1' },
          { label: 'more2', value: 'm2' },
        ]}
        position={SelectField.Positions.BELOW}
      /> */}
      {/* <div className="md-cell md-cell--1">{t('sort')}</div> */}
      <SelectField
        placeholder={t('auction_ending')}
        className="md-cell md-cell--2 auctions-filter-selectField"
        value={auctionEndingSoon}
        defaultValue={status === 'Upcoming' ? 'ass' : 'aes'}
        onChange={(v) => setFilterData({ ...filterData, auctionEndingSoon: v })}
        menuItems={[
          status === 'Upcoming'
            ? { label: 'Auction Starting Soon', value: 'ass' }
            : { label: 'Auction Ending Soon', value: 'aes' },
          { label: 'Recently Added', value: 'ra' },
        ]}
        position={SelectField.Positions.BELOW}
      />
    </div>
  )
}

export default AuctionsFilter
