import moment from 'moment'
import { useState, useEffect } from 'react'
import { FontIcon, SelectField, TextField, Checkbox, Button } from 'react-md'
import { useTranslation } from 'libs/langs'
import locationIcon from './location_icon.svg'

import { DatePicker } from '@target-energysolutions/date-picker'

import DrawOnMap from 'components/draw-on-map'

import './style.scss'

const AppointmentsForm = ({
  appointmentDetails,
  setAppointmentDetails,
  auctionEndDate,
}) => {
  // const auctionEndDate = 'Sat Dec 31 2022 15:00:59 GMT+0100 (Central European Standard Time)'
  const { t } = useTranslation()
  const [visibleStartTimePicker, setVisibleStartTimePicker] = useState(false)
  const [visibleEndTimePicker, setVisibleEndTimePicker] = useState(false)
  const [appointmentType, setAppointmentType] = useState([])
  const [addressView, setAddressView] = useState(false)

  const errorText = t('please_fill_in_missing_details')
  useEffect(() => {
    onSetFormDetails('selected_days', [])
  }, [])
  useEffect(() => {
    appointmentType?.length > 0
      ? setAppointmentDetails((prev) => {
        return appointmentType?.length === 2
          ? { ...prev, type: 'Both' }
          : (appointmentType?.includes('In-person') && {
            ...prev,
            type: 'In-person',
          }) ||
                (appointmentType?.includes('Online') && {
                  ...prev,
                  type: 'Online',
                })
      })
      : setAppointmentDetails((prev) => ({ ...prev, type: '' }))
  }, [appointmentType])

  const onSetFormDetails = (property, value) => {
    setAppointmentDetails((prev) => ({
      ...prev,
      [property]: Array.isArray(value)
        ? value
        : Array.isArray(prev?.[property])
          ? prev?.[property]?.includes(value)
            ? prev?.[property]?.filter((el) => value !== el)
            : [...prev?.[property], value]
          : value,
    }))
  }

  const appointmentsTypeList = [
    <Checkbox
      key={'in-person'}
      id={`in-person`}
      label={t('In-person')}
      onChange={() => {
        setAppointmentType((prev) =>
          prev?.includes('In-person')
            ? prev?.filter((el) => el !== 'In-person')
            : [...prev, 'In-person'],
        )
      }}
      checked={appointmentType?.includes('In-person')}
    />,
    <Checkbox
      key={'online'}
      id={`online`}
      label={t('Online')}
      onChange={() => {
        setAppointmentType((prev) =>
          prev?.includes('Online')
            ? prev?.filter((el) => el !== 'Online')
            : [...prev, 'Online'],
        )
      }}
      checked={appointmentType?.includes('Online')}
    />,
  ]
  const weekDays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]
  return (
    <div className="appointments-form md-grid">
      <h3 className="appointments-form-title md-cell md-cell--12">
        {t('appointments')} ({t('optional')})
      </h3>
      <div className="appointments-form-label md-cell md-cell--12">
        {t('type_of_appointment')}
      </div>
      <div className="md-cell md-cell--6">
        <SelectField
          id="select-field-with-elements-country-spinner"
          placeholder={`${
            appointmentType?.length
              ? appointmentType?.join('-')
              : t('select_type_of_appointment')
          }`}
          listClassName="country-list"
          menuItems={appointmentsTypeList}
          value={appointmentType?.join('-')}
          onChange={(item) => {}} // setAppointmentsType(item)}
          fullWidth
          position={SelectField.Positions.BELOW}
          dropdownIcon={<FontIcon>keyboard_arrow_down</FontIcon>}
          className="selectField-withShadow"
        />
      </div>
      <div className="md-cell md-cell--6">
        {appointmentType?.includes('In-person') && (
          <div className=" map">
            <TextField
              id="auctionAddress"
              placeholder={t('auction_position')}
              value={appointmentDetails?.['appointment_address']}
              disabled={!appointmentDetails?.['appointment_address']}
              onChange={(value) =>
                onSetFormDetails('appointment_address', value)
              }
              className="textField-map"
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
        )}
      </div>

      <div className="dateWrapper md-cell md-cell--3">
        <label className="auction-details-form-label">{t('start_time')}</label>
        <TextField
          id="time-start"
          placeholder={t('Select_Start_time')}
          block
          inlineIndicator={<FontIcon primary>schedule</FontIcon>}
          value={
            appointmentDetails?.['start_at'] &&
            moment(appointmentDetails?.['start_at']).utc().format('HH:mm')
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
              let d = new Date(timestamp)
              d.setUTCHours(+moment(timestamp).hour(), 0, 0, 0)
              onSetFormDetails('start_at', d.toISOString())
              setVisibleStartTimePicker(false)
            }}
            onCancel={() => setVisibleStartTimePicker(false)}
            translation={{ date: 'Time' }}
            onReset={() => {
              onSetFormDetails('start_at', moment().toISOString())
              setVisibleStartTimePicker(false)
            }}
          />
        )}
      </div>

      <div className="dateWrapper md-cell md-cell--3">
        <label className="auction-details-form-label">{t('End_time')}</label>
        <TextField
          id="time-start"
          placeholder={t('Select_End_time')}
          block
          inlineIndicator={<FontIcon primary>schedule</FontIcon>}
          value={
            appointmentDetails?.['end_at'] &&
            moment(appointmentDetails?.['end_at']).utc().format('HH:mm')
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
              let d = new Date(timestamp)
              d.setUTCHours(+moment(timestamp).hour(), 0, 0, 0)
              onSetFormDetails(
                'end_at',
                moment(auctionEndDate)
                  .hour(moment(d).hour())
                  .minute(moment(timestamp).minute())
                  .toISOString(),
              )
              setVisibleEndTimePicker(false)
            }}
            onCancel={() => setVisibleEndTimePicker(false)}
            translation={{ date: 'Time' }}
            onReset={() => {
              onSetFormDetails('end_at', moment().toISOString())
              setVisibleEndTimePicker(false)
            }}
          />
        )}
      </div>

      <div className="dateWrapper md-cell md-cell--6">
        <label className="auction-details-form-label">Days</label>
        <SelectField
          id="select-field-with-elements-country-spinner"
          placeholder={`${
            appointmentDetails?.['selected_days']?.length
              ? appointmentDetails?.['selected_days']?.join('-')
              : t('Select_Days_type')
          }`}
          listClassName="country-list"
          menuItems={weekDays?.map((day) => (
            <Checkbox
              key={day}
              id={day}
              label={day}
              onChange={() => {
                onSetFormDetails(
                  'selected_days',
                  appointmentDetails?.['selected_days']?.includes(day)
                    ? appointmentDetails?.['selected_days']?.filter(
                        (el) => el !== day,
                      )
                    : [...appointmentDetails?.['selected_days'], day],
                )
              }}
              checked={appointmentDetails?.['selected_days']?.includes(day)}
            />
          ))}
          value={appointmentDetails?.['selected_days']?.join('-')}
          fullWidth
          position={SelectField.Positions.BELOW}
          dropdownIcon={<FontIcon>keyboard_arrow_down</FontIcon>}
          className="selectField-withShadow"
        />
        {/* <TextField
          id="days"
          placeholder={'Select days'}
          block
          inlineIndicator={<FontIcon primary>schedule</FontIcon>}
          value={appointmentDetails?.['selected_days']?.join('-')}
          onClick={() => setVisibleDaysPicker(true)}
          className="textField-withShadow"
        /> */}
        {/* {visibleDaysPicker && (
          <ContactInfoDialogdays
            visible={visibleDaysPicker}
            onHide={() => setVisibleDaysPicker(false)}
            onConfirm={(days) => onSetFormDetails('selected_days', days)}
            checkedDays={appointmentDetails?.['selected_days'] || []}
          />
          // <DatePicker
          //   translation={{ update: 'select' }}
          //   onUpdate={(start, end) => {
          //     onSetFormDetails('appointmentDays', { start, end })
          //     setVisibleDaysPicker(false)
          //   }}
          //   onCancel={() => setVisibleDaysPicker(false)}
          //   startView="day"
          //   endView="day"
          // />
        )} */}

        {addressView && (
          <DrawOnMap
            id={'address'}
            onClose={() => {
              setAddressView(false)
            }}
            visible={addressView}
            onSetAddress={(newCoordinates) => {
              onSetFormDetails('general_location_x', +newCoordinates?.['lon'])
              onSetFormDetails('general_location_y', +newCoordinates?.['lat'])
              onSetFormDetails(
                'appointment_address',
                newCoordinates?.['display_name'],
              )
              // onSetFormDetails('address', {
              //   general_location_y: newCoordinates?.['lat'],
              //   general_location_x: newCoordinates?.['lon'],
              //   meta: newCoordinates?.['display_name'],
              // })
            }}
          />
        )}
      </div>
      {appointmentType?.includes('Online') && (
        <div className="request-appointment-note">
          <span className="blueText">{t('note')}:</span>
          {t('online_link_note_broker')}
        </div>
      )}
    </div>
  )
}

export default AppointmentsForm
