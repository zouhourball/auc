import { useTranslation } from 'libs/langs'
import { Button, FontIcon, SelectField, TextField } from 'react-md'
import { useState } from 'react'
import { useQuery, useMutation } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { addToast } from 'modules/app/actions'

import { navigate } from '@reach/router'
import moment from 'moment'
import {
  getAvailabilitiesConfig,
  sendAppointmentsRequest,
} from 'libs/api/appointment-api'
import { DatePicker } from '@target-energysolutions/date-picker'
import Calendar from 'react-calendar'
import ToastMsg from 'components/toast-msg'

// import { propertyTypeList } from 'components/helpers'
import successRegister from 'images/successfully-register.png'
import ConfirmDialog from 'components/confirm-dialog'
import 'react-calendar/dist/Calendar.css'

import './style.scss'

const AuctionRequestAppointment = ({ auctionId }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const user = useSelector(({ app }) => app?.userInfos)

  const [visibleDatePicker, setVisibleDatePicker] = useState(false)
  const [visibleStartTimePicker, setVisibleStartTimePicker] = useState(false)
  const [successRequestVisible, setSuccessRequestVisible] = useState(false)

  // const [startDate, setStartDate] = useState(moment().valueOf())
  const [appointmentData, setAppointmentData] = useState({
    location: 'Main Office',
    value: moment().valueOf(),
    time: moment().valueOf(),
  })
  // const [month, setMonth] = useState(moment().toISOString())

  // const [availabilitiesData, setAvailabilitiesData] = useState({})
  const { type, location, date, time, notes } = appointmentData
  // const [value, onChange] = useState(new Date())

  const sendRequest = () => {
    setSuccessRequestVisible(true)
  }

  const { data: availabilitiesConfig } = useQuery(
    ['getAvailabilitiesConfig', auctionId],
    getAvailabilitiesConfig,
  )
  const renderType =
    availabilitiesConfig?.type === 'In-person'
      ? [{ label: 'In-person', value: 'In-person' }]
      : availabilitiesConfig?.type === 'On-line'
        ? [{ label: 'online', value: 'online' }]
        : [{ label: 'both', value: 'both' }]
  const days = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ]
  const activeDays = availabilitiesConfig?.['selected_days']?.split(',')
  const renderActiveDays = () => {
    return activeDays?.map((elem) => days?.indexOf(elem))
  }

  const addRequestAppointmentMutation = useMutation(sendAppointmentsRequest, {
    onSuccess: (res) => {
      if (res?.success) {
        dispatch(
          addToast(
            <ToastMsg
              text={'Appointment Canceled Successfully'}
              type="success"
            />,
          ),
        )
      } else {
        dispatch(
          addToast(<ToastMsg text={'Something is wrong'} type="error" />),
        )
      }
    },
  })

  const onSendAppointment = () => {
    addRequestAppointmentMutation.mutate({
      id: auctionId,
      body: {
        type: appointmentData?.type,
        appointment_link: '',
        appointment_address: appointmentData?.location,
        general_location_x: 0,
        general_location_y: 0,
        start_at: '2022-11-02T13:42:28.550897Z',
        end_at: '2022-11-02T14:12:28.550897Z',
        notes: appointmentData?.note,
        'appointment_date': '2022-11-02T00:00:00Z',
        'bidders_subject': user?.subject,
      },
    })
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
            menuItems={renderType}
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
            <Calendar
              minDate={new Date()}
              maxDate={
                new Date(new Date().getFullYear(), new Date().getMonth() + 2, 0)
              }
              onChange={(timestamp) => {
                setAppointmentData((prev) => ({ ...prev, date: timestamp }))
                setVisibleDatePicker(false)
              }}
              tileDisabled={({ activeStartDate, date, view }) =>
                (view === 'month' &&
                  date.getDay() === renderActiveDays()[0] &&
                  renderActiveDays()[1]) ||
                date.getDay() === 6
              }
              value={date}
            />
            // <DatePicker

          //   singlePick
          //   translation={{ update: 'select' }}
          //   onUpdate={({ timestamp }) => {
          //     setAppointmentData((prev) => ({ ...prev, date: timestamp }))
          //     setVisibleDatePicker(false)
          //   }}
          //   onCancel={() => setVisibleDatePicker(false)}
          //   // minValidDate={{ timestamp: filterData?.dateRange?.startDate }}
          //   startView="year"
          //   endView="day"
          //   onReset={() => {
          //     setAppointmentData((prev) => ({
          //       ...prev,
          //       date: moment().valueOf(),
          //     }))
          //     setVisibleDatePicker(false)
          //   }}
          // />
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
        onConfirm={() => onSendAppointment()}
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
