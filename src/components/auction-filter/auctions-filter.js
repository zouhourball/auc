import {
  Checkbox,
  ExpansionList,
  ExpansionPanel,
  FontIcon,
  SelectField,
  TextField,
} from 'react-md'
import { useTranslation } from 'libs/langs'
import { propertyTypeList, brokerCompanyList } from 'components/helpers/index'
import PriceRange from 'components/price-range'
import allCountryStateCitiesGql from 'libs/queries/all-countries.gql'
import './style.scss'
import { useQuery } from 'react-apollo-hooks'
const AuctionsFilter = ({ filterData, setFilterData }) => {
  const { t } = useTranslation()
  const {
    search,
    price,
    // type,
    // bedsBaths,
    // more,
    auctionEndingSoon,
    // location,
    brokerCompany,
  } = filterData

  const { data: allCountryStateCities } = useQuery(allCountryStateCitiesGql, {
    context: {
      uri: `${PRODUCT_APP_URL_PROFILE}/graphql`,
    },
  })

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
        placeholder={'Price Range'}
        className=" md-cell md-cell--2 auctions-filter-selectField"
        value={price}
        // onChange={(v) => setFilterData({ ...filterData, price: v })}
        menuItems={[
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
          <PriceRange
            key="price-range"
            onChangeSlider={(v) =>
              setFilterData({
                ...filterData,
                price: { ...price, min: v.min, max: v.max },
              })
            }
          />,
        ]}
        position={SelectField.Positions.BELOW}
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
                              setFilterData({ ...filterData, location: null })
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

      <SelectField
        placeholder={'Broker Company'}
        className=" md-cell md-cell--2 auctions-filter-selectField"
        value={'Broker Company'}
        // onChange={(v) => setFilterData({ ...filterData, brokerCompany: v })}
        menuItems={brokerCompanyList?.map((bc, index) => {
          return {
            label: (
              <Checkbox
                key={index}
                id={`${bc.value}-auction-type`}
                name={`${bc.value}-checkboxes`}
                label={bc.label}
                onChange={() => {
                  filterData?.brokerCompany?.find((el) => {
                    return el === bc.value
                  })
                    ? setFilterData({
                      ...filterData,
                      brokerCompany: brokerCompany.filter(
                        (el) => el !== bc.value,
                      ),
                    })
                    : setFilterData({
                      ...filterData,
                      brokerCompany: [...brokerCompany, bc?.value],
                    })
                }}
                checked={filterData?.brokerCompany?.find(
                  (el) => el === bc.value,
                )}
              />
            ),
            value: bc.value,
          }
        })}
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
      <div className="md-cell md-cell--1">{t('sort')}</div>
      <SelectField
        placeholder={t('auction_ending')}
        className="md-cell md-cell--2 auctions-filter-selectField"
        value={auctionEndingSoon}
        onChange={(v) => setFilterData({ ...filterData, auctionEndingSoon: v })}
        menuItems={[
          { label: 'Auction Ending Soon', value: 'aes' },
          { label: 'Recently Added', value: 'ra' },
        ]}
        position={SelectField.Positions.BELOW}
      />
    </div>
  )
}

export default AuctionsFilter
