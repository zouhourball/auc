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
import { useTranslation } from 'libs/langs'

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
  availabilitiesConfig,
}) => {
  const { t } = useTranslation()

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
            appointment_date: `${moment(date).format(
              'YYYY-MM-DD',
            )}T00:00:00.000Z`,
            time: moment(date)
              .hour(moment(el?.value).hour())
              .minute(moment(el?.value).minute())
              .valueOf(),

            // moment(date)
            //   .hour(moment(el?.value).hour())
            //   .minute(moment(el?.value).minute())
            //   .valueOf(),
          }))
        }}
      >
        {el?.label}
      </div>
    ))
  }
  const renderType =
    availabilitiesConfig?.type === 'Both'
      ? [
        { label: t('In-person'), value: 'In-person' },
        { label: t('Online'), value: 'Online' },
      ]
      : [
        {
          label: availabilitiesConfig?.type,
          value: availabilitiesConfig?.type,
        },
      ]
  return (
    <DialogContainer
      visible={visible}
      onHide={onHide}
      focusOnMount={false}
      stackedActions={false}
      className="contact-info-dialog"
      title={t('reschedule_appointment')}
      actions={[
        <Button key={1} flat onClick={onHide} className="cancel-btn">
          {t('cancel')}
        </Button>,
        <Button
          key={2}
          flat
          primary
          swapTheming
          onClick={() => {
            onConfirm(rescheduleData)
            // onHide && onHide()
          }}
        >
          {t('add_appointment')}
        </Button>,
      ]}
    >
      <label className="label md-cell md-cell--12">
        {t('type_of_appointment')}*
      </label>
      <SelectField
        id="select-field-3-1"
        menuItems={renderType}
        required
        simplifiedMenu={false}
        onChange={(v) => {
          // location.reload()
          setRescheduleData((prev) => ({
            ...prev,
            type: v,
          }))
        }}
        placeholder={t('type_of_appointment')}
        position={SelectField.Positions.BELOW}
        value={type}
        className="selectField-withShadow md-cell md-cell--12"
        dropdownIcon={<FontIcon>expand_more</FontIcon>}
      />
      <label className="label md-cell md-cell--12">{t('date')}* </label>

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

      <label className="label  md-cell md-cell--12">{t('time')}*</label>

      {date && <div className="time-chip-wrapper">{renderChips()}</div>}
    </DialogContainer>
  )
}
ContactInfoDialogreschedule.propTypes = {
  visible: propTypes.bool,
}

export default ContactInfoDialogreschedule
