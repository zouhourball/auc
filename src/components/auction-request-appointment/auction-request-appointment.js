import { useTranslation } from 'libs/langs'
import { Button, FontIcon, SelectField, TextField } from 'react-md'
import { useState } from 'react'
import { navigate } from '@reach/router'
import moment from 'moment'
import { DatePicker } from '@target-energysolutions/date-picker'
// import { propertyTypeList } from 'components/helpers'
import successRegister from 'images/successfully-register.png'
import ConfirmDialog from 'components/confirm-dialog'

import './style.scss'

const AuctionRequestAppointment = ({ auctionId }) => {
  const { t } = useTranslation()
  const [visibleDatePicker, setVisibleDatePicker] = useState(false)
  const [visibleStartTimePicker, setVisibleStartTimePicker] = useState(false)
  const [successRequestVisible, setSuccessRequestVisible] = useState(false)

  // const [startDate, setStartDate] = useState(moment().valueOf())
  const [appointmentData, setAppointmentData] = useState({
    location: 'Main Office',
    date: moment().valueOf(),
    time: moment().valueOf(),
  })
  const { type, location, date, time, notes } = appointmentData

  const sendRequest = () => {
    setSuccessRequestVisible(true)
  }
  return (
    <>
      <div className="request-appointment">
        <Button
          className="back-btn"
          primary
          iconBefore
          iconEl={<FontIcon>arrow_back</FontIcon>}
          onClick={() => window.history.go(-1)}
        >
          {t('back_to_auctions')}
        </Button>
        <div className="request-appointment-title">{t('request_viewing')}</div>
        <div>{t('please_fill_the_information')}</div>
        <div className="dateWrapper">
          <label className="auction-details-form-label">
            {t('type_of_appointment')}
          </label>
          <SelectField
            id="select-field-3-1"
            menuItems={[
              { label: 'In-person', value: '0' },
              { label: 'Online', value: '1' },
            ]}
            simplifiedMenu={false}
            onChange={(v) => {
              setAppointmentData((prev) => ({ ...prev, type: v }))
            }}
            placeholder="Select type of Appointment"
            position={SelectField.Positions.BELOW}
            value={type}
            className="selectField-withShadow"
            dropdownIcon={<FontIcon>expand_more</FontIcon>}
          />
        </div>
        {type === '0' && (
          <div className="dateWrapper">
            <label className="auction-details-form-label">
              {t('location')}
            </label>

            <TextField
              id="select-field-3-1"
              onChange={(v) => {
                setAppointmentData((prev) => ({ ...prev, location: v }))
              }}
              value={location}
              disabled
              block
              className="textField-withShadow"
            />
          </div>
        )}

        <div className="dateWrapper">
          <label className="auction-details-form-label">{t('date')}* </label>
          <TextField
            className="textField-withShadow"
            id="date"
            placeholder="dd/mm/yy"
            block
            required
            rightIcon={
              <FontIcon className="dateRangeIcon">date_range</FontIcon>
            }
            value={`${moment(date).format('DD/MM/YYYY')}`}
            onClick={() => setVisibleDatePicker(!visibleDatePicker)}
          />

          {visibleDatePicker && (
            <DatePicker
              singlePick
              translation={{ update: 'select' }}
              onUpdate={({ timestamp }) => {
                setAppointmentData((prev) => ({ ...prev, date: timestamp }))
                setVisibleDatePicker(false)
              }}
              onCancel={() => setVisibleDatePicker(false)}
              // minValidDate={{ timestamp: filterData?.dateRange?.startDate }}
              startView="year"
              endView="day"
              onReset={() => {
                setAppointmentData((prev) => ({
                  ...prev,
                  date: moment().valueOf(),
                }))
                setVisibleDatePicker(false)
              }}
            />
          )}
        </div>
        <div className="dateWrapper">
          <label className="auction-details-form-label">{t('time')}*</label>
          <TextField
            id="time-start"
            placeholder={'Select from'}
            block
            inlineIndicator={<FontIcon primary>schedule</FontIcon>}
            onClick={() => setVisibleStartTimePicker(true)}
            value={`${moment(time).format('HH:mm')} - ${moment(time)
              .add(moment.duration(2, 'hours'))
              .format('HH:mm')}`}
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
                setAppointmentData((prev) => ({ ...prev, time: timestamp }))
                setVisibleStartTimePicker(false)
              }}
              onCancel={() => setVisibleStartTimePicker(false)}
              translation={{ date: 'Time' }}
              onReset={() => {
                setAppointmentData((prev) => ({
                  ...prev,
                  time: moment().valueOf(),
                }))
                setVisibleStartTimePicker(false)
              }}
            />
          )}
        </div>
        <div className="dateWrapper">
          <label className="auction-details-form-label">{t('notes')}*</label>

          <TextField
            className="textField-withShadow"
            placeholder={
              'Reason for the rejection of invoice will be written here'
            }
            value={notes}
            onChange={(v) =>
              setAppointmentData((prev) => ({ ...prev, notes: v }))
            }
            block
            rows={5}
          />
        </div>
        {type === '1' && (
          <div className="request-appointment-note">
            <span className="blueText">{t('note')}</span>
            {t('online_link_note')}
          </div>
        )}
        <div className="request-appointment-actions">
          <Button
            flat
            primary
            className="request-appointment-btn"
            onClick={() => navigate(`/auctions/detail/${auctionId}`)}
          >
            {t('cancel')}
          </Button>
          <Button
            flat
            primary
            swapTheming
            className="request-appointment-btn"
            onClick={() => {
              sendRequest()
            }}
          >
            {t('send_request')}
          </Button>
        </div>
      </div>
      <ConfirmDialog
        title={t('request_for_viewing_success')}
        description={t('wait_for_approval')}
        visible={successRequestVisible}
        imgCard={successRegister}
        onHide={() => {
          setSuccessRequestVisible(false)
          navigate(`/auctions/detail/${auctionId}`)
        }}
      />
    </>
  )
}
export default AuctionRequestAppointment
