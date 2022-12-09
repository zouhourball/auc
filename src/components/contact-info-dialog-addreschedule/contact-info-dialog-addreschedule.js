import { Button, DialogContainer, FontIcon, SelectField } from 'react-md'
import { useQuery, useMutation } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { addToast } from 'modules/app/actions'
import { useTranslation } from 'libs/langs'

import './style.scss'
import propTypes from 'prop-types'
import { useState } from 'react'
import moment from 'moment'
import ToastMsg from 'components/toast-msg'

import {
  // listAuction,
  // featuredAuctions,
  filterAuctions,
} from 'libs/api/auctions-api'
import {
  getAvailabilitiesConfig,
  getAvailability,
  sendAppointmentsRequest,
} from 'libs/api/appointment-api'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import ConfirmDialog from 'components/confirm-dialog'
import successRegister from 'images/successfully-register.png'

const ContactInfoDialogaddreschedule = ({
  visible,
  onHide,
  setFilterData,
  filterData,
}) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const user = useSelector(({ app }) => app?.userInfos)

  const [selectedTime, setTime] = useState('')
  const [successRequestVisible, setSuccessRequestVisible] = useState(false)

  const [month, setMonth] = useState(moment().toISOString())

  const [appointmentData, setAppointmentData] = useState({})
  const { data: auctionsData } = useQuery(
    [
      'getAuctions',
      {
        search_key: '',
        // city_id: filterData?.location,
        price_gte: '',
        price_lte: '',
        auction_status: '',
      },

      {
        filter: {},
      },
      {
        cities: '',
        property_type_ids: '',
        organization_ids: '',
      },
    ],
    filterAuctions,
  )
  const validrescheule = () => {
    return (
      appointmentData?.title &&
      appointmentData?.type &&
      appointmentData?.date &&
      appointmentData?.time
    )
  }
  const listAuctions = () => {
    return auctionsData?.results?.filter(
      (elem) => elem.allow_viewing_request === true,
    )
  }
  const { data: availabilitiesConfig } = useQuery(
    ['getAvailabilitiesConfig', appointmentData?.title],
    getAvailabilitiesConfig,
  )
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
  const { data: getAvailabilityData } = useQuery(
    [
      'getAvailability',
      appointmentData?.title,
      {
        from_date: moment(month).startOf('month').toISOString(),
        to_date: moment(month).endOf('month').toISOString(),
      },
    ],
    appointmentData?.title && getAvailability,
  )
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
        className={`time-chip ${selectedTime === el?.value ? 'selected' : ''}`}
        onClick={() => {
          setTime(el?.value)
          setAppointmentData((prev) => ({
            ...prev,
            time: moment(appointmentData?.date)
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
      id: appointmentData?.title,
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

  const sendRequest = () => {
    onSendAppointment()
  }
  return (
    <DialogContainer
      visible={visible}
      onHide={onHide}
      focusOnMount={false}
      className="add-appointment-dialog"
      title={
        <div className="add-appointment-dialog-title">Add Appointment</div>
      }
      actions={[
        <Button key={1} className="cancel-btn" flat onClick={onHide}>
          {t('cancel')}
        </Button>,
        <Button
          key={2}
          flat
          primary
          swapTheming
          onClick={() => sendRequest()}
          disabled={!validrescheule()}

          // disabled={!appointmentData?.title || !appointmentData?.type || !appointmentData?.date || !appointmentData?.time}
        >
          Add Appointment
        </Button>,
      ]}
    >
      <div className="auction-details-form-label md-cell md-cell--12">
        Auction Title*
      </div>
      <SelectField
        id="select-field-3-1"
        menuItems={listAuctions()?.map((el) => ({
          value: el?.uuid,
          label: <div> {el?.listing?.title}</div>,
        }))}
        onChange={(v) => {
          setAppointmentData((prev) => ({ ...prev, title: v }))
        }}
        placeholder="Select auction title"
        position={SelectField.Positions.BELOW}
        value={appointmentData?.title}
        className="selectField-withShadow  md-cell md-cell--12"
        dropdownIcon={<FontIcon>expand_more</FontIcon>}
      />
      <div className="auction-details-form-label md-cell md-cell--12">
        Type of Appointment
      </div>
      <SelectField
        id="select-field-3-1"
        menuItems={renderType}
        onChange={(v) => {
          setAppointmentData((prev) => ({ ...prev, type: v }))
        }}
        placeholder="Select type of Appointment"
        position={SelectField.Positions.BELOW}
        value={appointmentData?.type}
        className="selectField-withShadow  md-cell md-cell--12"
        dropdownIcon={<FontIcon>expand_more</FontIcon>}
      />
      <div className="auction-details-form-label md-cell md-cell--12">
        Date *
      </div>
      <div className="date md-cell md-cell--12">
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
          value={appointmentData?.date}
        />
      </div>
      <div className="auction-details-form-label md-cell md-cell--12">
        Time*
      </div>
      {appointmentData?.date && (
        <div className="time-chip-wrapper">{renderChips()} </div>
      )}
      <ConfirmDialog
        title={t('request_for_viewing_success')}
        description={t('wait_for_approval')}
        visible={successRequestVisible}
        imgCard={successRegister}
        onHide={() => setSuccessRequestVisible(false)}
      />
    </DialogContainer>
  )
}
ContactInfoDialogaddreschedule.propTypes = {
  visible: propTypes.bool,
}

export default ContactInfoDialogaddreschedule
