import moment from 'moment'
import { useState } from 'react'
import { FontIcon, SelectField, TextField } from 'react-md'

import { DatePicker } from '@target-energysolutions/date-picker'

const AppointmentsForm = ({ appointmentsData, setAppointmentsData }) => {
  const [visibleStartTimePicker, setVisibleStartTimePicker] = useState(false)
  const [visibleEndTimePicker, setVisibleEndTimePicker] = useState(false)
  const [visibleDaysPicker, setVisibleDaysPicker] = useState(false)

  const onSetFormDetails = (property, value) => {
    setAppointmentsData({ ...appointmentsData, [property]: value })
  }

  const appointmentsTypeList = [
    { label: 'Type 1', value: 'type 1' },
    { label: 'Type 2', value: 'type 2' },
    { label: 'Type 3', value: 'type 3' },
  ]
  return (
    <div className="appointments-form md-grid">
      <div className="appointments-form-title md-cell md-cell--12">
        {'Appointments (Optional)'}
      </div>
      <div className="md-cell md-cell--6">
        <label className="appointments-form-label">Appointment Type</label>
        <SelectField
          // onClick={() => setTest(1)}
          id="select-field-with-elements-country-spinner"
          placeholder="Select appointment type"
          listClassName="country-list"
          menuItems={appointmentsTypeList}
          value={appointmentsData?.appointmentsType}
          onChange={(item) => onSetFormDetails('appointmentsType', item)} // setAppointmentsType(item)}
          fullWidth
          position={SelectField.Positions.BELOW}
          dropdownIcon={<FontIcon>keyboard_arrow_down</FontIcon>}
          className="selectField-withShadow"
        />
      </div>
      <div className="md-cell md-cell--6" />

      <div className="dateWrapper md-cell md-cell--3">
        <label className="auction-details-form-label">Start time</label>
        <TextField
          id="time-start"
          placeholder={'Select from'}
          block
          inlineIndicator={<FontIcon primary>schedule</FontIcon>}
          value={
            appointmentsData?.appointmentStartTime &&
            `${moment(appointmentsData.appointmentStartTime).format('HH:mm')}`
          }
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
              onSetFormDetails('appointmentStartTime', timestamp)
              setVisibleStartTimePicker(false)
            }}
            onCancel={() => setVisibleStartTimePicker(false)}
            translation={{ date: 'Time' }}
            onReset={() => {
              onSetFormDetails('appointmentStartTime', moment().valueOf())
              setVisibleStartTimePicker(false)
            }}
          />
        )}
      </div>

      <div className="dateWrapper md-cell md-cell--3">
        <label className="auction-details-form-label">End time</label>
        <TextField
          id="time-start"
          placeholder={'Select from'}
          block
          inlineIndicator={<FontIcon primary>schedule</FontIcon>}
          value={
            appointmentsData?.appointmentEndTime &&
            `${moment(appointmentsData?.appointmentEndTime).format('HH:mm')}`
          }
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
              onSetFormDetails('appointmentEndTime', timestamp)
              setVisibleEndTimePicker(false)
            }}
            onCancel={() => setVisibleEndTimePicker(false)}
            translation={{ date: 'Time' }}
            onReset={() => {
              onSetFormDetails('appointmentEndTime', moment().valueOf())
              setVisibleEndTimePicker(false)
            }}
          />
        )}
      </div>

      <div className="dateWrapper md-cell md-cell--6">
        <label className="appointments-form-form-label">Days</label>
        <TextField
          id="days"
          placeholder={'Select days'}
          block
          inlineIndicator={<FontIcon primary>schedule</FontIcon>}
          value={
            appointmentsData?.appointmentDays &&
            `${moment(appointmentsData?.appointmentDays?.start).format(
              'DD MMM YYYY',
            )} - ${moment(appointmentsData?.appointmentDays?.end).format(
              'DD MMM YYYY',
            )} `
          }
          onClick={() => setVisibleDaysPicker(true)}
          className="textField-withShadow"
        />
        {visibleDaysPicker && (
          <DatePicker
            translation={{ update: 'select' }}
            onUpdate={(start, end) => {
              onSetFormDetails('appointmentDays', { start, end })
              setVisibleDaysPicker(false)
            }}
            onCancel={() => setVisibleDaysPicker(false)}
            startView="day"
            endView="day"
          />
        )}
      </div>
    </div>
  )
}

export default AppointmentsForm
