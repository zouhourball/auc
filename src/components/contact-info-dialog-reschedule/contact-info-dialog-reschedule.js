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
import Calendar from 'react-calendar'

const ContactInfoDialogreschedule = ({
  visible,
  onHide,
  rescheduleData,
  onConfirm,
  disabledDates,
  setRescheduleData,
  calendarDate,
  setCalendarDate,
  renderTimeSlots,
}) => {
  const [visibleDatePicker, setVisibleDatePicker] = useState(false)

  const [startTime, setStartTime] = useState(moment().valueOf())
  const { date, type } = rescheduleData

  // console.log(startTime, 'startTime')

  // const onHandleDate = (date, key) => {
  //   setrescheduleData({
  //     // ...rescheduleData,
  //     dateRange: {
  //       ...rescheduleData?.dateRange,
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
        <div className="contact-info-dialog-title">reschedule Appointment</div>
      }
    >
      <div className="dateWrapper md-cell md-cell--12">
        <label className="auction-details-form-label">
          Type of Appointment
        </label>

        <SelectField
          id="select-field-3-1"
          menuItems={[
            { label: 'In-person', value: 'In-person' },
            { label: 'Online', value: 'Online' },
          ]}
          required
          simplifiedMenu={false}
          onChange={(v) => {
            // location.reload()
            setRescheduleData((prev) => ({
              ...prev,
              type: v,
            }))
          }}
          placeholder="Select type of Appointment"
          position={SelectField.Positions.BELOW}
          value={type}
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
            rightIcon={<FontIcon className="dateRangeIcon">date</FontIcon>}
            value={`${moment(date).format('DD-MM-YYYY')}`}
            onClick={() => setVisibleDatePicker(true)}
          />

          {visibleDatePicker && (
            <Calendar
              activeStartDate={new Date(moment(calendarDate).startOf('month'))}
              onActiveStartDateChange={(e) => {
                e?.action === 'next' &&
                  setCalendarDate((prev) =>
                    moment(prev).add(1, 'month').toISOString(),
                  )
                e?.action === 'prev' &&
                  setCalendarDate((prev) =>
                    moment(prev).subtract(1, 'month').toISOString(),
                  )
              }}
              onChange={(timestamp) => {
                setRescheduleData((prev) => ({ ...prev, date: timestamp }))
                setVisibleDatePicker(false)
              }}
              tileDisabled={({ activeStartDate, date, view }) => {
                return disabledDates?.some(
                  (el) =>
                    date.getFullYear() === el.getFullYear() &&
                    date.getMonth() === el.getMonth() &&
                    date.getDate() === el.getDate(),
                )
              }}
              value={date}
            />
            // <DatePicker
            //   singlePick
            //   translation={{ update: 'select' }}
            //   onUpdate={({ timestamp }) => {
            //     setStartDate(timestamp)
            //     setVisibleDatePicker(false)
            //   }}
            //   onCancel={() => setVisibleDatePicker(false)}
            //   minValidDate={{ timestamp: rescheduleData?.dateRange?.startDate }}
            //   startView="year"
            //   endView="day"
            // />
          )}
        </div>
      </div>

      <div className="dateWrapper md-cell md-cell--12">
        <label className="auction-details-form-label">Time*</label>

        <SelectField
          id="select-field-3-1"
          menuItems={renderTimeSlots}
          simplifiedMenu={false}
          onChange={(v) => {
            // must be timestamp
            setStartTime(v)
            setRescheduleData((prev) => ({
              ...prev,
              appointment_date: moment(date)
                .hour(moment(v).hour())
                .minute(moment(v).minute())
                .valueOf(),
            }))
          }}
          placeholder="Select Time of Appointment"
          position={SelectField.Positions.BELOW}
          value={startTime}
          className="selectField-withShadow"
          dropdownIcon={<FontIcon>expand_more</FontIcon>}
        />
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
        onClick={() => {
          onConfirm(rescheduleData)
          onHide && onHide()
        }}
      >
        Reschedule
      </Button>
    </DialogContainer>
  )
}
ContactInfoDialogreschedule.propTypes = {
  visible: propTypes.bool,
}

export default ContactInfoDialogreschedule
