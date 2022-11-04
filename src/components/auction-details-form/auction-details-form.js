import { useCurrentLang, useTranslation } from 'libs/langs'
import { useEffect, useState } from 'react'
import { useInfiniteQuery, useQuery } from 'react-query'
// import { useQuery as useQueryHook } from 'react-apollo-hooks'
import { TextField, SelectField, Button } from 'react-md'
import moment from 'moment'
// import allCountryStateCitiesGql from 'libs/queries/all-country.gql'
import { DatePicker } from '@target-energysolutions/date-picker'

import { getCountry, getCity } from 'libs/api/auctions-api'
import DrawOnMap from 'components/draw-on-map'
// import MapResult from 'components/map-result'
import CustomSelectWithSearch from 'components/custom-select-with-search'

import { DueDate } from 'components/due-date'
import { propertyTypeList } from 'components/helpers'
import locationIcon from './location_icon.svg'
import dateIcon from './Date.svg'
import arrowDown from './Arrow.svg'

import './style.scss'

const AuctionDetailsForm = ({ auctionDetails, setAuctionDetails }) => {
  const { t } = useTranslation()
  const lang = useCurrentLang()

  const [visibleDatePicker, setVisibleDatePicker] = useState(false)
  const [visibleStartTimePicker, setVisibleStartTimePicker] = useState(false)
  const [startTime, setStartTime] = useState(moment())
  const [visibleEndTimePicker, setVisibleEndTimePicker] = useState(false)
  const [endTime, setEndTime] = useState(moment())
  const [addressView, setAddressView] = useState(false)
  const [showListCountry, handleShowListCountry] = useState('')
  const [showListCities, handleShowListCities] = useState('')
  const [textSearch, setTextSearch] = useState('')

  // const { data: getCountryList } = useQuery(['getCountry'], getCountry)

  const {
    data: getCountryList,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery([25, textSearch], getCountry, {
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage, pages) => {
      if (
        pages.length <=
        Math.ceil(+lastPage?.pagination?.total / +lastPage?.pagination?.limit)
      ) {
        return pages.length
      }
    },
  })

  const { data: getCityList } = useQuery(
    ['getCity', auctionDetails?.country, textSearch],
    getCity,
  )

  // const { data: allCountryStateCities } = useQueryHook(
  //   allCountryStateCitiesGql,
  //   {
  //     context: {
  //       uri: `${PRODUCT_APP_URL_PROFILE}/graphql`,
  //     },
  //   },
  // )

  const onSetFormDetails = (property, value) => {
    setAuctionDetails({ ...auctionDetails, [property]: value })
  }

  const onSetDate = (start, end) => {
    setAuctionDetails({
      ...auctionDetails,
      startDate: start,
      endDate: end,
    })
  }

  const renderCountry = () => {
    let arrayName = []
    if (getCountryList) {
      arrayName = getCountryList?.pages
        ?.flatMap((el) => el?.results)
        ?.map((ac) => {
          return {
            label: lang === 'ar' ? ac?.['name_ar'] : ac?.['name_en'],
            value: `${ac?.id}`,
          }
        })
      return arrayName
    }
  }
  // const renderCountry = () =>

  //    getCountryList?.flatMap((el) => el?.results)
  //       ?.map((ac) => {
  //         return {
  //           label: lang === 'ar' ? ac.name_ar : ac.name_en,
  //           value: `${ac.id}`,
  //         }
  //       })

  const renderCity = () => {
    let arrayName = []
    if (getCityList) {
      arrayName = getCityList?.results?.map((ac) => {
        return {
          label: lang === 'ar' ? ac?.['name_ar'] : ac?.['name_en'],
          value: `${ac?.id}`,
        }
      })
      return arrayName
    }
  }
  const {
    title,
    address,
    city,
    country,
    propertyType,
    startDate,
    endDate,
    startingPrice,
    incrementalPrice,
    participationFee,
    guaranteeFee,
  } = auctionDetails

  const ref = document.getElementsByClassName('country-list')
  const [test] = useState(0)

  useEffect(() => {
    ref[0] && ref[0].addEventListener('scroll', updateOffsetAndRefetch)

    return () =>
      ref[0] && ref[0].removeEventListener('scroll', updateOffsetAndRefetch)
  }, [test])

  const updateOffsetAndRefetch = () => {
    if (ref[0].scrollHeight - ref[0].scrollTop <= ref[0].clientHeight) {
      hasNextPage && fetchNextPage()
    }
  }
  const errorText = t('please_fill_in_missing_details')
  return (
    <div className="auction-details-form md-grid">
      <div className="auction-details-form-title md-cell md-cell--12">
        {t('add_details')}
      </div>
      <div className="md-cell md-cell--6">
        <label className="auction-details-form-label">
          {t('auction_title')}
        </label>
        <TextField
          id="auctionTitle"
          placeholder={t('enter_title')}
          value={title}
          onChange={(title) => onSetFormDetails('title', title)}
          className="textField-withShadow"
          required
          block
          errorText={errorText}
        />
      </div>
      <div className="md-cell md-cell--6">
        <label className="auction-details-form-label">
          {t('auction_position')}
        </label>
        {addressView && (
          <DrawOnMap
            id={'address'}
            onClose={() => {
              setAddressView(false)
            }}
            visible={addressView}
            onSetAddress={(newCoordinates) => {
              onSetFormDetails('address', {
                general_location_y: newCoordinates?.['lat'],
                general_location_x: newCoordinates?.['lon'],
                meta: newCoordinates?.['display_name'],
              })
            }}
          />
        )}
        <div className="map">
          <TextField
            id="auctionAddress"
            placeholder={t('auction_position')}
            value={address?.meta}
            disabled={!address}
            onChange={(value) =>
              onSetFormDetails('address', {
                general_location_y: address?.['general_location_y'],
                general_location_x: address?.['general_location_x'],
                meta: value,
              })
            }
            className="textField-map"
            required
            block
            errorText={errorText}
          />
          <Button
            icon
            primary
            className="save-btn"
            iconEl={<img height={20} src={locationIcon} />}
            onClick={(e) => {
              e.stopPropagation()
              setAddressView(!addressView)
            }}
          />
        </div>
      </div>
      <div className="md-cell md-cell--6">
        <label className="auction-details-form-label">{t('country')}</label>
        {/* <SelectField
          onClick={() => setTest(1)}
          id="select-field-with-elements-country-spinner"
          placeholder={t('select_country')}
          listClassName="country-list"
          menuItems={renderCountry()}
          value={country || 2}
          onChange={(country) => onSetFormDetails('country', country)}
          fullWidth
          position={SelectField.Positions.BELOW}
          dropdownIcon={<FontIcon>keyboard_arrow_down</FontIcon>}
          className="selectField-withShadow"
        /> */}
        <CustomSelectWithSearch
          items={renderCountry()}
          label={t('country')}
          required
          id={'country'}
          hideSecondaryLabel={false}
          listVisibility={showListCountry}
          setListVisibility={handleShowListCountry}
          selectedItem={
            renderCountry()?.find((el) => el?.value === country)?.label || ''
          }
          searchPlaceholder={t('country')}
          onClickItem={(itemSelected) => {
            onSetFormDetails('country', itemSelected?.value)
            setTextSearch('')
          }}
          hideAvatar={true}
          withHeader={true}
          searchItem={textSearch}
          setSearchItem={setTextSearch}
          searchItemPlaceHolder={t('search_country')}
          singleSelect
          className="selectField-withShadow"
          errorTextProp={errorText}
        />
      </div>

      <div className="md-cell md-cell--6">
        <label className="auction-details-form-label">{t('state_gov')}</label>
        {/* <SelectField
          id="select-field-with-elements-country-spinner"
          placeholder={t('state-gov')}
          menuItems={renderCity()}
          value={city}
          onChange={(city) => onSetFormDetails('city', city)}
          fullWidth
          position={SelectField.Positions.BELOW}
          dropdownIcon={<FontIcon>keyboard_arrow_down</FontIcon>}
          className="selectField-withShadow"
        /> */}
        <CustomSelectWithSearch
          items={renderCity()}
          label={t('state_gov')}
          id={'city'}
          required
          hideSecondaryLabel={false}
          listVisibility={showListCities}
          setListVisibility={handleShowListCities}
          selectedItem={
            renderCity()?.find((el) => el?.value === city)?.label || ''
          }
          searchPlaceholder={t('state_gov')}
          onClickItem={(itemSelected) => {
            onSetFormDetails('city', itemSelected?.value)
            setTextSearch('')
          }}
          hideAvatar={true}
          withHeader={true}
          searchItem={textSearch}
          setSearchItem={setTextSearch}
          searchItemPlaceHolder={t('search_city')}
          singleSelect
          className="selectField-withShadow"
          errorTextProp={errorText}
        />
      </div>
      <div className="md-cell md-cell--6">
        <label className="auction-details-form-label">
          {t('property_type')}
        </label>
        <SelectField
          id="select-field-with-elements-country-spinner"
          // label={t('country')}
          placeholder={t('property_select')}
          menuItems={propertyTypeList?.map((el) =>
            el?.props ? (
              <div>{t(el?.props?.text)}</div>
            ) : (
              { label: t(el?.label), value: el?.value }
            ),
          )}
          value={propertyType}
          onChange={(propertyType) =>
            onSetFormDetails('propertyType', propertyType)
          }
          fullWidth
          position={SelectField.Positions.BELOW}
          dropdownIcon={<img src={arrowDown} height={10} />}
          className="selectField-withShadow"
          required
          errorText={errorText}
        />
      </div>

      <div className="dateWrapper md-cell md-cell--6">
        <label className="auction-details-form-label">{t('dates')}</label>
        <TextField
          id="range"
          placeholder={t('select_dates')}
          block
          required
          // errorText={errorText}
          rightIcon={<img src={dateIcon} height={20} />}
          value={
            startDate
              ? `${moment(startDate)?.format('DD/MM/YYYY')} - ${moment(
                endDate,
              )?.format('DD/MM/YYYY')}`
              : ''
          }
          onClick={() => setVisibleDatePicker(true)}
          className="textField-withShadow"
        />
        {visibleDatePicker && (
          <DueDate
            duedate={endDate}
            startDate={startDate}
            applicationStartDate={startDate}
            onDateChange={(start, end) => {
              let startD = new Date(
                moment(start)
                  .hour(moment(startTime).hour())
                  .minute(moment(startTime).minute())
                  .valueOf(),
              )
              let endD = new Date(
                moment(end)
                  .hour(moment(endTime).hour())
                  .minute(moment(endTime).minute())
                  .valueOf(),
              )
              onSetDate(startD, endD)
              setVisibleDatePicker(!visibleDatePicker)
            }}
          />
        )}
      </div>
      <div className="md-cell md-cell--6">
        <label className="auction-details-form-label">{t('start_time')}</label>
        <TextField
          id="time-start"
          placeholder={t('start_time_select')}
          block
          required
          // errorText={errorText}
          // type="number"
          rightIcon={<img src={dateIcon} height={20} />}
          value={startDate && `${moment(startDate).format('HH:mm')}`}
          onClick={() => setVisibleStartTimePicker(true)}
          className="textField-withShadow"
        />
        {visibleStartTimePicker && (
          <DatePicker
            startView="time"
            endView="time"
            singlePick={true}
            minuteInterval={5}
            timeFormat={null}
            onUpdate={({ timestamp }) => {
              setAuctionDetails({
                ...auctionDetails,
                startDate: new Date(
                  moment(startDate)
                    .hour(moment(timestamp).hour())
                    .minute(moment(timestamp).minute())
                    .valueOf(),
                ),
              })
              setStartTime(timestamp)
              setVisibleStartTimePicker(false)
            }}
            onCancel={() => setVisibleStartTimePicker(false)}
            translation={{ date: 'Time' }}
            onReset={() => {
              setStartTime(moment().valueOf())
              setAuctionDetails({
                ...auctionDetails,
                startDate: new Date(
                  moment(startDate)
                    .hour(moment(moment().valueOf()).hour())
                    .minute(moment(moment().valueOf()).minute())
                    .valueOf(),
                ),
              })
              setVisibleStartTimePicker(false)
            }}
          />
        )}
      </div>
      <div className="md-cell md-cell--6">
        <label className="auction-details-form-label">{t('end_time')}</label>
        <TextField
          id="time-end"
          placeholder={t('end_time_select')}
          block
          required
          // errorText={errorText}
          // type="number"
          rightIcon={<img src={dateIcon} height={20} />}
          value={endDate && `${moment(endDate).format('HH:mm')}`}
          onClick={() => setVisibleEndTimePicker(true)}
          className="textField-withShadow"
        />
        {visibleEndTimePicker && (
          <DatePicker
            startView="time"
            endView="time"
            singlePick={true}
            minuteInterval={5}
            timeFormat={null}
            onUpdate={({ timestamp }) => {
              setAuctionDetails({
                ...auctionDetails,
                endDate: new Date(
                  moment(endDate)
                    .hour(moment(timestamp).hour())
                    .minute(moment(timestamp).minute())
                    .valueOf(),
                ),
              })
              setEndTime(timestamp)
              setVisibleEndTimePicker(false)
            }}
            onCancel={() => setVisibleEndTimePicker(false)}
            translation={{ date: 'Time' }}
            onReset={() => {
              setEndTime(moment().valueOf())
              setAuctionDetails({
                ...auctionDetails,
                endDate: new Date(
                  moment(endDate)
                    .hour(moment(moment().valueOf()).hour())
                    .minute(moment(moment().valueOf()).minute())
                    .valueOf(),
                ),
              })
              setVisibleEndTimePicker(false)
            }}
          />
        )}
      </div>
      <div className="md-cell md-cell--6">
        <label className="auction-details-form-label">{t('start_price')}</label>
        <TextField
          id="startingPrice"
          placeholder={t('enter_start_price')}
          value={startingPrice < 0 ? 0 : startingPrice}
          onChange={(startingPrice) =>
            onSetFormDetails('startingPrice', startingPrice)
          }
          className="textField-withShadow"
          required
          errorText={errorText}
          type="number"
          min={0}
          block
        />
      </div>
      <div className="md-cell md-cell--6">
        <label className="auction-details-form-label">{t('incr_price')}</label>
        <TextField
          id="incrementalPrice"
          placeholder={t('incr_price_enter')}
          value={incrementalPrice < 0 ? 0 : incrementalPrice}
          onChange={(incrementalPrice) =>
            onSetFormDetails('incrementalPrice', incrementalPrice)
          }
          className="textField-withShadow"
          required
          errorText={errorText}
          type="number"
          min={0}
          block
        />
      </div>
      <div className="md-cell md-cell--6">
        <label className="auction-details-form-label">
          {t('participation_fee')}
        </label>
        <TextField
          id="participationFee"
          placeholder={t('part_price_enter')}
          value={participationFee < 0 ? 0 : participationFee}
          onChange={(val) => onSetFormDetails('participationFee', val)}
          className="textField-withShadow"
          required
          errorText={errorText}
          type="number"
          min={0}
          block
        />
      </div>
      <div className="md-cell md-cell--6">
        <label className="auction-details-form-label">
          {t('guarantee_fee')}
        </label>
        <TextField
          id="guaranteeFee"
          placeholder={t('guar_fee_enter')}
          value={guaranteeFee < 0 ? 0 : guaranteeFee}
          onChange={(val) => onSetFormDetails('guaranteeFee', val)}
          className="textField-withShadow"
          required
          errorText={errorText}
          type="number"
          min={0}
          block
        />
      </div>
    </div>
  )
}

export default AuctionDetailsForm
