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
  getAvailability,
} from 'libs/api/appointment-api'
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
  const [selectedTime, setTime] = useState('')
  const [successRequestVisible, setSuccessRequestVisible] = useState(false)

  // const [startDate, setStartDate] = useState(moment().valueOf())
  const [appointmentData, setAppointmentData] = useState({
    value: moment().valueOf(),
    time: moment().valueOf(),
  })
  const [month, setMonth] = useState(moment().toISOString())
  // const [month, setMonth] = useState(moment().toISOString())

  // const [availabilitiesData, setAvailabilitiesData] = useState({})
  const { type, date, notes } = appointmentData
  // const [value, onChange] = useState(new Date())

  const sendRequest = () => {
    onSendAppointment()
  }
  const { data: getAvailabilityData } = useQuery(
    [
      'getAvailability',
      auctionId,
      {
        from_date: moment(month).startOf('month').toISOString(),
        to_date: moment(month).endOf('month').toISOString(),
      },
    ],
    getAvailability,
  )
  const { data: availabilitiesConfig } = useQuery(
    ['getAvailabilitiesConfig', auctionId],
    getAvailabilitiesConfig,
  )
  const renderType =
    availabilitiesConfig?.type === 'Both'
      ? [
        { label: 'In-person', value: 'In-person' },
        { label: 'Online', value: 'Online' },
      ]
      : [
        {
          label: availabilitiesConfig?.type,
          value: availabilitiesConfig?.type,
        },
      ]

  const lastDayOfMonth = new Date(
    new Date(month).getFullYear(),
    new Date(month).getMonth() + 1,
    0,
  ).getDate()
  let daysOfCurrentMonth = []
  for (let i = 0; i < lastDayOfMonth; i++) {
    daysOfCurrentMonth = [
      ...daysOfCurrentMonth,
      new Date(
        new Date(month).getFullYear(),
        new Date(month).getMonth(),
        i + 1,
      ),
    ]
  }
  const getAvailabilityDataFormatted = getAvailabilityData?.map((el) =>
    new Date(el?.['appointment_date']).getDate(),
  )
  const disabledDates = daysOfCurrentMonth?.filter(
    (el) => !getAvailabilityDataFormatted?.includes(new Date(el).getDate()),
  )

  const addRequestAppointmentMutation = useMutation(sendAppointmentsRequest, {
    onSuccess: (res) => {
      if (res?.id) {
        // dispatch(
        //   addToast(
        //     <ToastMsg
        //       text={'Appointment Canceled Successfully'}
        //       type="success"
        //     />,
        //   ),
        // )
        setSuccessRequestVisible(true)
        setAppointmentData({})
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
        appointment_link: availabilitiesConfig?.['appointment_link'],
        appointment_address: availabilitiesConfig?.['appointment_address'],
        general_location_x: availabilitiesConfig?.['general_location_x'],
        general_location_y: availabilitiesConfig?.['general_location_y'],
        start_at: moment(moment(appointmentData?.time).toISOString()),
        end_at: moment(moment(appointmentData?.time).toISOString()).add(
          moment.duration(1, 'hours'),
        ), // '2022-11-28T14:00:00.000Z',
        notes: appointmentData?.notes,
        appointment_date: `${moment(appointmentData?.date).format(
          'YYYY-MM-DD',
        )}T00:00:00.000Z`, // '2022-11-02T00:00:00Z',
        bidder_name: user?.profile?.fullName,
      },
    })
  }
  const renderTimeSlots = () => {
    let renderTimeSlots = []
    const targetedDay = getAvailabilityData?.filter(
      (el) =>
        new Date(el?.['appointment_date']).getDate() ===
        new Date(appointmentData?.date).getDate(),
    )

    for (let j = 0; j < targetedDay?.length; j++) {
      const timeInterval =
        moment(targetedDay?.[j]?.['end_at']).format('HH') -
        moment(targetedDay?.[j]?.['start_at']).format('HH')
      for (let i = 0; i < timeInterval; i++) {
        renderTimeSlots = [
          ...renderTimeSlots,
          {
            label: `${moment(targetedDay?.[j]?.['start_at'])
              .add(i, 'hours')
              .format('HH:mm')} - ${moment(targetedDay?.[j]?.['start_at'])
              .add(i + 1, 'hours')
              .format('HH:mm')}`,
            value: moment(targetedDay?.[j]?.['start_at'])
              .add(i, 'hours')
              .valueOf(),
          },
        ]
      }
    }
    return renderTimeSlots
  }
  const renderChips = () => {
    return renderTimeSlots()?.map((el) => (
      <div
        key={el?.value}
        className={`${selectedTime === el?.value ? 'selected-time' : ''}`}
        onClick={() => {
          setTime(el?.value)
          setAppointmentData((prev) => ({
            ...prev,
            time: moment(date)
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
        {type === 'In-person' && (
          <div className="dateWrapper">
            <label className="auction-details-form-label">
              {t('location')}
            </label>

            <TextField
              id="select-field-3-1"
              onChange={(v) => {
                setAppointmentData((prev) => ({ ...prev, location: v }))
              }}
              value={availabilitiesConfig?.['appointment_address']}
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
            value={`${moment(date).format('DD-MM-YYYY')}`}
            onClick={() => setVisibleDatePicker(!visibleDatePicker)}
          />

          {visibleDatePicker && (
            <Calendar
              activeStartDate={new Date(moment(month).startOf('month'))}
              onActiveStartDateChange={(e) => {
                e?.action === 'next' &&
                  setMonth((prev) => moment(prev).add(1, 'month').toISOString())
                e?.action === 'prev' &&
                  setMonth((prev) =>
                    moment(prev).subtract(1, 'month').toISOString(),
                  )
              }}
              onChange={(timestamp) => {
                setAppointmentData((prev) => ({ ...prev, date: timestamp }))
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
              showNeighboringMonth={false}
              value={date}
            />
          )}
        </div>
        {date && (
          <div className="dateWrapper">
            <label className="auction-details-form-label">{t('time')}*</label>
            {renderChips()}
            {/* <SelectField
            id="select-field-3-1"
            menuItems={renderTimeSlots()}
            simplifiedMenu={false}
            onChange={(v) => {
              // must be timestamp
              setTime(v)
              setAppointmentData((prev) => ({
                ...prev,
                time: moment(date)
                  .hour(moment(v).hour())
                  .minute(moment(v).minute())
                  .valueOf(),
              }))
            }}
            placeholder="Select Time of Appointment"
            position={SelectField.Positions.BELOW}
            value={selectedTime}
            className="selectField-withShadow"
            dropdownIcon={<FontIcon>expand_more</FontIcon>}
          /> */}
          </div>
        )}
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
        {type === 'Online' && (
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
