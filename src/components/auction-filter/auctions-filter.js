import {
  Checkbox,
  ExpansionList,
  ExpansionPanel,
  FontIcon,
  SelectField,
  TextField,
} from 'react-md'
import { useTranslation, useCurrentLang } from 'libs/langs'
import { propertyTypeList } from 'components/helpers/index'
import PriceRange from 'components/price-range'
// import allCountryStateCitiesGql from 'libs/queries/all-countries.gql'
// import { useQuery as useQueryApollo } from 'react-apollo-hooks'
import { useCallback, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { allBrokers, allLocations } from 'libs/api/auctions-api'

import './style.scss'

const AuctionsFilter = ({ filterData, setFilterData, status }) => {
  const { t } = useTranslation()
  const lang = useCurrentLang()
  const [chips, setChips] = useState([])

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

  useEffect(() => {
    // setChips(prev => prev.filter((ell) => filterData?.location?.includes(ell?.data?.id)))
    setChips((prev) =>
      prev.filter((ell) => {
        return ell?.category === 'search'
          ? filterData?.[ell?.category]
          : ell?.category === 'auctionEndingSoon'
            ? ell?.data?.id === filterData?.[ell?.category]
            : filterData?.[ell?.category]?.includes(
              ell?.data?.id || ell?.data?.name,
            )
      }),
    )
  }, [filterData])
  const renderChips = () => {
    return chips.map((el, i) => {
      // filterData?.[el?.category]?.filter((ell) => ell !== el?.data?.id)
      return (
        <div key={i} className="auctions-filter-chip">
          <span>{el?.data?.name}</span>
          <FontIcon
            onClick={() => {
              setFilterData((v) => ({
                ...v,
                [el?.category]:
                  el?.category === 'search'
                    ? ''
                    : el?.category === 'auctionEndingSoon'
                      ? status === 'Upcoming'
                        ? 'ass'
                        : 'aes'
                      : v?.[el?.category]?.filter((ell) => ell !== el?.data?.id),
              }))
              // setChips(prev => prev.filter((ell) => {
              //   return el?.category === 'search' ? '' : filterData?.[el?.category]?.includes(ell?.data?.id || ell?.data?.name)
              // }))
            }}
          >
            close
          </FontIcon>
        </div>
      )

      // switch (el?.category) {
      //   case 'location':
      //     return <Chip key={i} label={<span>
      //       {`${el?.countryName}, ${el?.data?.name}`}<FontIcon onClick={() => setFilterData(v => ({ ...v, location: v?.location?.filter((ell) => ell !== el?.data?.id) }))}>add_circle</FontIcon>
      //     </span>} >
      //     </Chip>
      //   case 'search':
      //     return <Chip key={i} label={<span>
      //       {`${el?.searchText}`}<FontIcon onClick={() => {
      //         setFilterData((prev) => {
      //           return { ...prev, search: '' }
      //         })
      //         setChips(prev => prev.filter(el => el?.category !== 'search'))
      //       }
      //       }>add_circle</FontIcon>
      //     </span>} >
      //     </Chip>
      //   case 'type':
      //     return <Chip key={i} label={<span>
      //       {`${el?.data?.name}`}<FontIcon onClick={() => setFilterData((prev) => {
      //         return { ...prev, type: prev.type?.filter((ell) => ell !== el?.data?.id) }
      //       })}>add_circle</FontIcon>
      //     </span>} >
      //     </Chip>
      //   case 'brokerCompany':
      //     return <Chip key={i} label={<span>
      //       {`${el?.data?.name}`}<FontIcon onClick={() => setFilterData((prev) => {
      //         return { ...prev, brokerCompany: prev.brokerCompany?.filter((ell) => ell !== el?.data?.id) }
      //       })}>add_circle</FontIcon>
      //     </span>} >
      //     </Chip>
      //   case 'auctionEndingSoon':
      //     return <Chip key={i} label={<span>
      //       {`${el?.data?.name}`}<FontIcon onClick={() => {
      //         setFilterData(prev => ({
      //           ...prev,
      //           auctionEndingSoon: status === 'Upcoming' ? 'ass' : 'aes',
      //         }))
      //         setChips(prev => prev.filter(el => el?.category !== 'auctionEndingSoon'))
      //       }}>add_circle</FontIcon>
      //     </span>} >
      //     </Chip>

      //   // case 'price':
      //   //   return <Chip key={i} label={<span>
      //   //     {`${el?.data?.min} - ${el?.data?.max}`}<FontIcon onClick={() => onChangeLocation(el?.data?.id)}>add_circle</FontIcon>
      //   //   </span>} >
      //   //   </Chip>
      // }
    })
  }

  const { data: allCountryStateCities } = useQuery(
    ['allLocations'],
    allLocations,
  )
  const [newPrice, setNewPrice] = useState(false)
  useEffect(() => {
    setFilterData({
      ...filterData,
      auctionEndingSoon: status === 'Upcoming' ? 'ass' : 'aes',
    })
  }, [])
  // const { data: allCountryStateCities } = useQueryApollo(
  //   allCountryStateCitiesGql,
  //   {
  //     context: {
  //       uri: `${PRODUCT_APP_URL_PROFILE}/graphql`,
  //     },
  //   },
  // )

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
  const renderStates = (states, countryName) => {
    return (
      <div>
        {states?.map((st) => {
          return (
            <Checkbox
              key={st.id}
              id={`${st.id}-auction-location`}
              name={`${st.name_en}-checkboxes`}
              label={lang === 'ar' ? st.name_ar : st.name_en}
              onChange={() => {
                onChangeLocation(st.id)
                !filterData?.location?.find((ch) => ch === st.id) &&
                  setChips((prev) => [
                    ...prev,
                    {
                      category: 'location',

                      data: {
                        id: st.id,
                        name: `${countryName}, ${
                          lang === 'ar' ? st.name_ar : st.name_en
                        }`,
                      },
                    },
                  ])
              }}
              checked={!!filterData?.location?.find((ch) => ch === st.id)}
            />
          )
        })}
      </div>
    )
  }

  const renderCountries = () => {
    return allCountryStateCities?.results?.map((el) => {
      return (
        <ExpansionPanel
          key={el.id}
          label={lang === 'ar' ? el.name_ar : el.name_en}
          footer={null}
        >
          {renderStates(el?.cities, lang === 'ar' ? el.name_ar : el.name_en)}
        </ExpansionPanel>
      )
    })
  }
  return (
    <div className="md-grid auctions-filter">
      <TextField
        placeholder={t('looking_for_what')}
        className="md-cell md-cell--3 auctions-filter-textField"
        value={search}
        onChange={(v) => {
          setFilterData({ ...filterData, search: v })
          filterData?.search &&
            setChips((prev) => [
              ...prev?.filter((el) => el?.category !== 'search'),
              {
                category: 'search',
                data: {
                  name: v,
                },
              },
            ])
        }}
        rightIcon={<FontIcon>search</FontIcon>}
        block
      />
      <SelectField
        placeholder={t('type')}
        className="md-cell md-cell--1 auctions-filter-selectField"
        value={'type'}
        position={SelectField.Positions.BELOW}
        closeMenuOnSelect={false}
        dropdownIcon={<FontIcon>expand_more</FontIcon>}
        menuItems={propertyTypeList?.map((tp, index) => {
          return tp?.props?.text ? (
            <div className="md-selection-control-container">
              <b>{t(tp?.props?.text)}</b>
            </div>
          ) : (
            <Checkbox
              key={`${tp.value}-auction-type-${index}`}
              id={`${tp.value}-auction-type`}
              name={`${tp.value}-checkboxes`}
              label={t(tp.label)}
              onChange={(a, e) => {
                filterData?.type?.find((el) => el === tp.value)
                  ? setFilterData({
                    ...filterData,
                    type: filterData.type?.filter((el) => el !== tp.value),
                  })
                  : setFilterData({
                    ...filterData,
                    type: [...(filterData?.type || []), tp.value],
                  })
                !filterData?.type?.find((el) => el === tp.value) &&
                  setChips((prev) => [
                    ...prev,
                    {
                      category: 'type',
                      data: {
                        id: tp.value,
                        name: t(tp.label),
                      },
                    },
                  ])
                e.stopPropagation()
              }}
              checked={!!filterData?.type?.find((el) => el === tp.value)}
            />
          )
        })}
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
              // setChips(prev => [...prev, {
              //   category: 'price',
              //   data: {
              //     min: v.min,
              //     max: v.max,
              //   },

              // }])
            }}
            onFinalChange={() => {
              setNewPrice(false)
            }}
            price={price}
          />
        )}
        <TextField
          value={
            !newPrice && price
              ? `${price?.min} - ${price?.max}`
              : t('price_range')
          }
          className={`auctions-filter-textField price-range ${
            newPrice ? 'expanded' : ''
          }`}
          onClick={() => setNewPrice(!newPrice)}
          disabled
          rightIcon={
            <FontIcon>{newPrice ? 'expand_less' : 'expand_more'}</FontIcon>
          }
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
        placeholder={t('location')}
        className=" md-cell md-cell--2 auctions-filter-selectField"
        value={'location'}
        dropdownIcon={<FontIcon>expand_more</FontIcon>}
        menuItems={[
          <ExpansionList key={'LocationExpansionList'}>
            {renderCountries()}
          </ExpansionList>,
        ]}
        position={SelectField.Positions.BELOW}
      />

      <SelectField
        placeholder={t('broker_company')}
        className=" md-cell md-cell--2 auctions-filter-selectField"
        dropdownIcon={<FontIcon>expand_more</FontIcon>}
        value={'Broker Company'}
        // onChange={(v) => setFilterData({ ...filterData, brokerCompany: v })}
        menuItems={getBrokers?.results?.map((bc, index) => (
          <Checkbox
            key={index}
            id={`${bc.id}-auction-type`}
            name={`${bc.id}-checkboxes`}
            label={bc.name}
            onChange={(a, e) => {
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
              !filterData?.brokerCompany?.find((el) => el === bc.id) &&
                setChips((prev) => [
                  ...prev,
                  {
                    category: 'brokerCompany',
                    data: {
                      id: bc.id,
                      name: bc.name,
                    },
                  },
                ])
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
        dropdownIcon={<FontIcon>expand_more</FontIcon>}
        value={auctionEndingSoon}
        defaultValue={status === 'Upcoming' ? 'ass' : 'aes'}
        onChange={(v) => {
          setFilterData({ ...filterData, auctionEndingSoon: v })
          setChips((prev) => [
            ...prev?.filter((el) => el?.category !== 'auctionEndingSoon'),
            {
              category: 'auctionEndingSoon',
              data: {
                name:
                  v === 'ass'
                    ? t('auction_starting_soon')
                    : v === 'aes'
                      ? t('auction_ending_soon')
                      : t('recently_added'),
                id: v,
              },
            },
          ])
        }}
        menuItems={[
          status === 'Upcoming'
            ? { label: t('auction_starting_soon'), value: 'ass' }
            : { label: t('auction_ending_soon'), value: 'aes' },
          { label: t('recently_added'), value: 'ra' },
        ]}
        position={SelectField.Positions.BELOW}
      />
      <div className="auctions-filter-chipWrapper">
        {chips?.length > 0 && (
          <div
            className="auctions-filter-chip active"
            onClick={() => {
              setFilterData({
                auctionEndingSoon: status === 'Upcoming' ? 'ass' : 'aes',
                search: '',
              })
            }}
          >
            <span>{t('reset_filters')}</span>
          </div>
        )}
        {renderChips()}
      </div>
    </div>
  )
}

export default AuctionsFilter
