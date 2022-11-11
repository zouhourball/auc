import moment from 'moment'
import { useState } from 'react'
import { FontIcon, SelectField, TextField, Checkbox } from 'react-md'
import { useTranslation } from 'libs/langs'

import { DatePicker } from '@target-energysolutions/date-picker'

const AppointmentsForm = ({ appointmentsDetails, setAppointmentDetails }) => {
  const { t } = useTranslation()
  const [visibleStartTimePicker, setVisibleStartTimePicker] = useState(false)
  const [visibleEndTimePicker, setVisibleEndTimePicker] = useState(false)
  const [visibleDaysPicker, setVisibleDaysPicker] = useState(false)

  const onSetFormDetails = (property, value) => {
    setAppointmentDetails((prev) => ({
      ...prev,
      [property]:
        property === 'appointmentsType'
          ? prev?.appointmentsType?.length > 0
            ? [...prev?.appointmentsType, value]
            : [value]
          : value,
    }))
  }

  const appointmentsTypeList = [
    <Checkbox
      key={'in-person'}
      id={`in-person`}
      label={'In-person'}
      onChange={() => {
        onSetFormDetails('appointmentsType', '0')
      }}
      checked={
        !!appointmentsDetails?.appointmentsType?.find((ch) => ch === '0')
      }
    />,
    <Checkbox
      key={'online'}
      id={`online`}
      label={'Online'}
      onChange={() => {
        onSetFormDetails('appointmentsType', '1')
      }}
      checked={
        !!appointmentsDetails?.appointmentsType?.find((ch) => ch === '1')
      }
    />,
  ]
  return (
    <div className="appointments-form md-grid">
      <div className="appointments-form-title md-cell md-cell--12">
        {t('Appointments')} ({t('optional')})
      </div>
      <div className="md-cell md-cell--6">
        <label className="appointments-form-label">Appointment Type</label>
        <SelectField
          // onClick={() => setTest(1)}
          id="select-field-with-elements-country-spinner"
          placeholder="Select appointment type"
          listClassName="country-list"
          menuItems={appointmentsTypeList}
          value={appointmentsDetails?.appointmentsType}
          onChange={(item) => {}} // setAppointmentsType(item)}
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
            appointmentsDetails?.appointmentStartTime &&
            moment(appointmentsDetails?.appointmentStartTime).format('HH:mm')
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
            appointmentsDetails?.appointmentEndTime &&
            moment(appointmentsDetails?.appointmentEndTime).format('HH:mm')
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
            appointmentsDetails?.appointmentDays &&
            `${moment(appointmentsDetails?.appointmentDays?.start).format(
              'DD MMM YYYY',
            )} - ${moment(appointmentsDetails?.appointmentDays?.end).format(
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
