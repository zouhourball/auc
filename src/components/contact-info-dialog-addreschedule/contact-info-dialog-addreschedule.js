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

const ContactInfoDialogaddreschedule = ({
  visible,
  onHide,
  setFilterData,
  filterData,
}) => {
  const [visibleDatePicker, setVisibleDatePicker] = useState({
    startDate: false,
    endDate: false,
  })
  const [visibleStartTimePicker, setVisibleStartTimePicker] = useState(false)

  const [startTime, setStartTime] = useState(moment().valueOf())
  const [startDate, setStartDate] = useState(moment().valueOf())

  return (
    <DialogContainer
      visible={visible}
      onHide={onHide}
      focusOnMount={false}
      className="contact-info-dialog"
      title={<div className="contact-info-dialog-title">Add Appointment</div>}
    >
      <div className="dateWrapper md-cell md-cell--12">
        <label className="auction-details-form-label">
          Type of Appointment{' '}
        </label>

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
        Reschedule
      </Button>
    </DialogContainer>
  )
}
ContactInfoDialogaddreschedule.propTypes = {
  visible: propTypes.bool,
}

export default ContactInfoDialogaddreschedule
