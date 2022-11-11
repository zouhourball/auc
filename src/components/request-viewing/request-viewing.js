import {
  Button,
  DialogContainer,
  FontIcon,
  SelectField,
  TextField,
} from 'react-md'
import './style.scss'
import propTypes from 'prop-types'
import { useState } from 'react'
import moment from 'moment'
import { DatePicker } from '@target-energysolutions/date-picker'
// import { propertyTypeList } from 'components/helpers'
import locationIcon from './location_icon.svg'

const RequestViewing = ({
  visible,
  onHide,
  setFilterData,
  filterData,
  auctionDetails,
}) => {
  const [visibleDatePicker, setVisibleDatePicker] = useState({
    startDate: false,
    endDate: false,
  })
  const [visibleStartTimePicker, setVisibleStartTimePicker] = useState(false)

  const [startTime, setStartTime] = useState(moment().valueOf())
  const [startDate, setStartDate] = useState(moment().valueOf())

  // const {
  //   address,

  //   // guaranteeFee,
  // } = auctionDetails
  // console.log(startTime, 'startTime')

  // const onHandleDate = (date, key) => {
  //   setFilterData({
  //     // ...filterData,
  //     dateRange: {
  //       ...filterData?.dateRange,
  //       [key]: date?.timestamp,
  //     },
  //   })
  //   setVisibleDatePicker({ ...visibleDatePicker, [key]: false })
  // }
  return (
    <DialogContainer
      visible={visible}
      onHide={onHide}
      focusOnMount={false}
      className="contact-info-dialog"
      title={
        <>
          <div className="contact-info-dialog-title">Request for Viewing</div>
          <span>
            {' '}
            Please fill in the information to be able set an appointment to view
            asset{' '}
          </span>
        </>
      }
    >
      <div className="dateWrapper md-cell md-cell--12">
        <label className="auction-details-form-label">In-person </label>

        <SelectField
          id="select-field-3-1"
          menuItems={[
            { label: 'text', value: 'text' },
            { label: 'text', value: 'text' },
            { label: 'text', value: 'text' },
          ]}
          simplifiedMenu={false}
          onChange={(v) => {
            // location.reload()
          }}
          placeholder="Select type of Appointment"
          position={SelectField.Positions.BELOW}
          value={''}
          className="langSelector"
          dropdownIcon={<FontIcon>expand_more</FontIcon>}
        />
      </div>

      <div className="dateWrapper md-cell md-cell--12">
        <label className="auction-details-form-label">Date* </label>
        <div className="filter-box-date">
          <TextField
            className="textField"
            id="date"
            placeholder="dd/mm/yy"
            block
            required
            rightIcon={
              <FontIcon className="dateRangeIcon">date_range</FontIcon>
            }
            value={`${moment(startDate).format('DD/MM/YYYY')}`}
            onClick={() =>
              setVisibleDatePicker({ ...visibleDatePicker, endDate: true })
            }
          />

          {visibleDatePicker?.endDate && (
            <DatePicker
              singlePick
              translation={{ update: 'select' }}
              onUpdate={({ timestamp }) => {
                setStartDate(timestamp)
                setVisibleDatePicker(false)
              }}
              onCancel={() => setVisibleDatePicker(false)}
              minValidDate={{ timestamp: filterData?.dateRange?.startDate }}
              startView="year"
              endView="day"
            />
          )}
        </div>
      </div>
      <div className="dateWrapper md-cell md-cell--12">
        <label className="auction-details-form-label">Time*</label>
        <TextField
          id="time-start"
          placeholder={'Select from'}
          block
          inlineIndicator={<FontIcon primary>schedule</FontIcon>}
          onClick={() => setVisibleStartTimePicker(true)}
          value={`${moment(startTime).format('HH:mm')}`}
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
              setStartTime(timestamp)
              setVisibleStartTimePicker(false)
            }}
            onCancel={() => setVisibleStartTimePicker(false)}
            translation={{ date: 'Time' }}
            onReset={() => {
              setStartTime(moment().valueOf())
              setVisibleStartTimePicker(false)
            }}
          />
        )}
      </div>
      <div className="dateWrapper md-cell md-cell--12">
        <label className="auction-details-form-label">Notes*</label>

        <TextField
          className="textField-withShadow"
          // label={t('enter_reason_here')}
          placeholder={
            'Reason for the rejection of invoice will be written here'
          }
          // value={description}
          // onChange={setDescription}
          rows={5}
        />
      </div>
      <div className="md-cell md-cell--12">
        <label className="auction-details-form-label">{'Localisation'}</label>

        <div className=" textField-withShadow map">
          <TextField
            disabled
            id="auctionAddress"
            placeholder={'main-office'}
            value={'address'?.meta}
            // onChange={(value) =>
            //   onSetFormDetails('address', {
            //     general_location_y: address?.['general_location_y'],
            //     general_location_x: address?.['general_location_x'],
            //     meta: value,
            //   })
            // }
            className="textField-map"
            block
            // errorText={('please_fill_in_missing_details')}
          />
          <Button
            icon
            primary
            className="save-btn"
            iconEl={<img height={20} src={locationIcon} />}
          />
        </div>
      </div>

      <Button
        flat
        primary
        swapTheming
        className="owner-card-btn"
        onClick={onHide}
      >
        Cancel
      </Button>
      <Button
        flat
        primary
        swapTheming
        className="owner-card-btn"
        onClick={onHide}
      >
        Send Request
      </Button>
    </DialogContainer>
  )
}
RequestViewing.propTypes = {
  visible: propTypes.bool,
}

export default RequestViewing
