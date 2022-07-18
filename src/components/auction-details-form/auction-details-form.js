import { useState } from 'react'
import { useQuery as useQueryHook } from 'react-apollo-hooks'
import { TextField, FontIcon, SelectField } from 'react-md'
import moment from 'moment'
import allCountryStateCitiesGql from 'libs/queries/all-country.gql'
import { DatePicker } from '@target-energysolutions/date-picker'

import DrawOnMap from 'components/draw-on-map'
// import MapResult from 'components/map-result'

import { DueDate } from 'components/due-date'

import '@target-energysolutions/gis-map/styles.css'

const AuctionDetailsForm = ({ auctionDetails, setAuctionDetails }) => {
  const [visibleDatePicker, setVisibleDatePicker] = useState(false)
  const [visibleStartTimePicker, setVisibleStartTimePicker] = useState(false)
  const [startTime, setStartTime] = useState(moment())
  const [visibleEndTimePicker, setVisibleEndTimePicker] = useState(false)
  const [endTime, setEndTime] = useState(moment())
  const [addressView, setAddressView] = useState(false)

  const { data: allCountryStateCities } = useQueryHook(
    allCountryStateCitiesGql,
    {
      context: {
        uri: `${PRODUCT_APP_URL_PROFILE}/graphql`,
      },
    },
  )

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
    if (
      allCountryStateCities &&
      allCountryStateCities.allCountries &&
      allCountryStateCities.allCountries.countries
    ) {
      arrayName = allCountryStateCities?.allCountries?.countries?.map((ac) => {
        return {
          label: ac.countryName,
          value: `${ac.id}`,
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
  } = auctionDetails

  return (
    <div className="auction-details-form md-grid">
      <div className="auction-details-form-title md-cell md-cell--12">
        {'Add Auction Details'}
      </div>
      <div className="md-cell md-cell--6">
        <label className="auction-details-form-label">Title*</label>
        <TextField
          id="auctionTitle"
          placeholder={'Enter title'}
          value={title}
          onChange={(title) => onSetFormDetails('title', title)}
          className="textField-withShadow"
          required
          block
        />
      </div>
      <div className="md-cell md-cell--6">
        <label className="auction-details-form-label">Address*</label>
        {addressView && (
          <DrawOnMap
            id={'address'}
            onClose={() => {
              setAddressView(false)
            }}
            onSetAddress={(newCoordinates) => {
              onSetFormDetails('address', {
                general_location_x: newCoordinates?.['lat'],
                general_location_y: newCoordinates?.['lon'],
                meta: newCoordinates,
              })
            }}
          />
        )}

        <TextField
          id="auctionAddress"
          placeholder={'Address'}
          value={address?.meta?.['display_name']}
          // onChange={(address) => onSetFormDetails('address', address)}
          onClick={() => setAddressView(!addressView)}
          className="textField-withShadow"
          required
          block
        />
      </div>
      <div className="md-cell md-cell--6">
        <label className="auction-details-form-label">Country*</label>
        <SelectField
          id="select-field-with-elements-country-spinner"
          placeholder={'Select country'}
          menuItems={renderCountry()}
          value={country}
          onChange={(country) => onSetFormDetails('country', country)}
          fullWidth
          position={SelectField.Positions.BELOW}
          repositionOnResize
          repositionOnScroll
          dropdownIcon={<FontIcon>keyboard_arrow_down</FontIcon>}
          simplifiedMenu={false}
          className="selectField-withShadow"
        />
      </div>
      <div className="md-cell md-cell--6">
        <label className="auction-details-form-label">City*</label>
        <TextField
          id="auctionCity"
          placeholder={'City'}
          value={city}
          onChange={(city) => onSetFormDetails('city', city)}
          className="textField-withShadow"
          required
          block
        />
      </div>
      <div className="md-cell md-cell--6">
        <label className="auction-details-form-label">Property Type*</label>
        <SelectField
          id="select-field-with-elements-country-spinner"
          // label={t('country')}
          placeholder={'Select country'}
          menuItems={[
            {
              label: 'menu item1',
              value: 'A',
            },
            {
              label: 'menu item2',
              value: 'B',
            },
          ]}
          value={propertyType}
          onChange={(propertyType) =>
            onSetFormDetails('propertyType', propertyType)
          }
          fullWidth
          position={SelectField.Positions.BELOW}
          repositionOnResize
          repositionOnScroll
          dropdownIcon={<FontIcon>keyboard_arrow_down</FontIcon>}
          simplifiedMenu={false}
          className="selectField-withShadow"
        />
      </div>

      <div className="md-cell md-cell--6">
        <label className="auction-details-form-label">
          Start Date - End Date*
        </label>
        <TextField
          id="range"
          placeholder={'Select start date - end date'}
          block
          required
          rightIcon={<FontIcon>date_range</FontIcon>}
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
        <label className="auction-details-form-label">
          Auction Start Time*
        </label>
        <TextField
          id="time-start"
          placeholder={'Select auction start time'}
          block
          required
          // type="number"
          rightIcon={<FontIcon>date_range</FontIcon>}
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
          />
        )}
      </div>
      <div className="md-cell md-cell--6">
        <label className="auction-details-form-label">Auction End Time*</label>
        <TextField
          id="time-end"
          placeholder={'Select auction end time'}
          block
          required
          // type="number"
          rightIcon={<FontIcon>date_range</FontIcon>}
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
          />
        )}
      </div>
      <div className="md-cell md-cell--6">
        <label className="auction-details-form-label">
          Starting Price (OMR/sq.m)*
        </label>
        <TextField
          id="startingPrice"
          placeholder={'Enter starting price '}
          value={startingPrice < 0 ? 0 : startingPrice}
          onChange={(startingPrice) =>
            onSetFormDetails('startingPrice', startingPrice)
          }
          className="textField-withShadow"
          required
          type="number"
          min={0}
          block
        />
      </div>
      <div className="md-cell md-cell--6">
        <label className="auction-details-form-label">
          Incremental Price (OMR/sq.m)*
        </label>
        <TextField
          id="incrementalPrice"
          placeholder={'Enter incremental price'}
          value={incrementalPrice < 0 ? 0 : incrementalPrice}
          onChange={(incrementalPrice) =>
            onSetFormDetails('incrementalPrice', incrementalPrice)
          }
          className="textField-withShadow"
          required
          type="number"
          min={0}
          block
        />
      </div>
    </div>
  )
}

export default AuctionDetailsForm
