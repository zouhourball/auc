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
  const renderChips = () => {
    return renderTimeSlots?.map((el) => (
      <div
        key={el?.value}
        className={`time-chip ${startTime === el?.value ? 'selected' : ''}`}
        onClick={() => {
          setStartTime(el?.value)
          setRescheduleData((prev) => ({
            ...prev,
            appointment_date: moment(date)
              .hour(moment(el?.value).hour())
              .minute(moment(el?.value).minute())
              .valueOf(),
          }))
        }}
      >
        {el?.label}
      </div>
    ))
  }

  return (
    <DialogContainer
      visible={visible}
      onHide={onHide}
      focusOnMount={false}
      className="contact-info-dialog"
      title={
        <div className="contact-info-dialog-title">reschedule Appointment</div>
      }
      actions={[
        <Button key={1} flat onClick={onHide}>
          Cancel
        </Button>,
        <Button
          key={2}
          flat
          primary
          swapTheming
          onClick={() => {
            onConfirm(rescheduleData)
            onHide && onHide()
          }}
        >
          Reschedule
        </Button>,
      ]}
    >
      <label className="auction-details-form-label md-cell md-cell--12">
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
        className="selectField-withShadow md-cell md-cell--12"
        dropdownIcon={<FontIcon>expand_more</FontIcon>}
      />
      <label className="auction-details-form-label md-cell md-cell--12">
        Date*{' '}
      </label>

      <div className="dateWrapper md-cell md-cell--12">
        <TextField
          className="textField-withShadow"
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
            showNeighboringMonth={false}
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
        )}
      </div>

      <label className="auction-details-form-label  md-cell md-cell--12">
        Time*
      </label>

      {date && <div className="time-chip-wrapper">{renderChips()}</div>}
    </DialogContainer>
  )
}
ContactInfoDialogreschedule.propTypes = {
  visible: propTypes.bool,
}

export default ContactInfoDialogreschedule
