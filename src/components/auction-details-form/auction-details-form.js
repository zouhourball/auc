import { useState } from 'react'
import { TextField, FontIcon } from 'react-md'
import moment from 'moment'

import { DatePicker } from '@target-energysolutions/date-picker'

import { DueDate } from 'components/due-date'

const AuctionDetailsForm = ({ auctionDetails, setAuctionDetails }) => {
  const [visibleDatePicker, setVisibleDatePicker] = useState(false)
  const [visibleStartTimePicker, setVisibleStartTimePicker] = useState(false)
  const [startTime, setStartTime] = useState(moment())
  const [visibleEndTimePicker, setVisibleEndTimePicker] = useState(false)
  const [endTime, setEndTime] = useState(moment())

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
  const {
    title,
    address,
    city,
    country,
    startDate,
    endDate,
    startingPrice,
    incrementalPrice,
  } = auctionDetails

  return (
    <div className="auction-details-form">
      <h2>{'Add Auction Details'}</h2>
      <div className="md-grid">
        <TextField
          id="auctionTitle"
          label={'Enter title'}
          value={title}
          onChange={(title) => onSetFormDetails('title', title)}
          className="auction-details-form_textField md-cell md-cell--12"
          required
        />
        <TextField
          id="auctionAddress"
          label={'Address'}
          value={address}
          onChange={(address) => onSetFormDetails('address', address)}
          className="auction-details-form_textField md-cell md-cell--12"
          required
        />
        <TextField
          id="auctionCity"
          label={'City'}
          value={city}
          onChange={(city) => onSetFormDetails('city', city)}
          className="auction-details-form_textField md-cell md-cell--12"
          required
        />
        <TextField
          id="auctionCountry"
          label={'Country'}
          value={country}
          onChange={(country) => onSetFormDetails('country', country)}
          className="auction-details-form_textField md-cell md-cell--12"
          required
        />
        <div className="md-cell md-cell--6 auction-details-form-date-section">
          <TextField
            id="range"
            lineDirection="center"
            label={'Start Date' + '-' + 'End Date'}
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
            className="auction-details-form_textField filled"
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
          <TextField
            id="time-start"
            lineDirection="center"
            label={'Start time'}
            block
            required
            // type="number"
            rightIcon={<FontIcon>date_range</FontIcon>}
            value={startDate && `${moment(startDate).format('HH:mm')}`}
            onClick={() => setVisibleStartTimePicker(true)}
            className="auction-details-form_textField filled"
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
          <TextField
            id="time-end"
            lineDirection="center"
            label={'End Time'}
            block
            required
            // type="number"
            rightIcon={<FontIcon>date_range</FontIcon>}
            value={endDate && `${moment(endDate).format('HH:mm')}`}
            onClick={() => setVisibleEndTimePicker(true)}
            className="auction-details-form_textField filled"
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
        <TextField
          id="startingPrice"
          label={'Starting Price'}
          value={startingPrice < 0 ? 0 : startingPrice}
          onChange={(startingPrice) =>
            onSetFormDetails('startingPrice', startingPrice)
          }
          className="auction-details-form_textField md-cell md-cell--6"
          required
          type="number"
          min={0}
        />
        <TextField
          id="incrementalPrice"
          label={'Incremental Price'}
          value={incrementalPrice < 0 ? 0 : incrementalPrice}
          onChange={(incrementalPrice) =>
            onSetFormDetails('incrementalPrice', incrementalPrice)
          }
          className="auction-details-form_textField md-cell md-cell--6"
          required
          type="number"
          min={0}
        />
      </div>
    </div>
  )
}

export default AuctionDetailsForm
