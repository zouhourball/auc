import { useState } from 'react'
import { useTranslation } from 'libs/langs'
import { useQuery, useMutation } from 'react-query'
import moment from 'moment'
import { useSelector, useDispatch } from 'react-redux'
import { addToast } from 'modules/app/actions'
// import { getPublicUrl } from 'libs/utils/custom-function'

import {
  getRequestsForBrokerCalendar,
  getAvailability,
  cancelRequest,
  rescheduleRequest,
  getAppointmentsRequest,
} from 'libs/api/appointment-api'
import ToastMsg from 'components/toast-msg'

import CalendarCustom from 'components/calendar'
import ContactInfoDialogappointment from 'components/contact-info-dialog-appointement'
import ContactInfoDialogreschedule from 'components/contact-info-dialog-reschedule'
import ContactInfoDialogaddreschedule from 'components/contact-info-dialog-addreschedule'
import ConfirmDialog from 'components/confirm-dialog'
// import UserInfoBySubject from 'components/user-info-by-subject'

import successRegister from 'images/successfully-register.png'

import './style.scss'

const AppointmentsCalendar = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [visibleAreYouSure, setVisibleAreYouSure] = useState(false)
  const [visibleReschedule, setVisibleReschedule] = useState(false)
  const [visibleSuccessReschedule, setVisibleSuccessReschedule] =
    useState(false)
  const [visibleAddAppointment, setVisibleAddAppointment] = useState(false)
  // const [month, setMonth] = useState(moment().toISOString())
  const [selectedEvent, setSelectedEvent] = useState({ hide: true })
  const [search, setSearch] = useState('')
  const [rescheduleData, setRescheduleData] = useState({})
  const [calendarDate, setCalendarDate] = useState(moment().toISOString())

  const meOrgs = useSelector(({ app }) => app?.myOrgs)

  const { data: calendarAppointments, refetch: refetchAppointments } = useQuery(
    [
      meOrgs?.length > 0 ? 'getAppointments' : 'getBidderAppointments',
      {
        ...(meOrgs?.length > 0 && { broker_organization_id: meOrgs?.[0]?.ID }),
        from_date: moment(calendarDate).startOf('month').toISOString(),
        to_date: moment(calendarDate).endOf('month').toISOString(),
        search_key: search,
      },
    ],
    meOrgs?.length > 0 ? getRequestsForBrokerCalendar : getAppointmentsRequest,
  )
  const { data: getAvailabilityData } = useQuery(
    [
      'getAvailability',
      selectedEvent?.auctionId,
      {
        from_date: moment(calendarDate).startOf('month').toISOString(),
        to_date: moment(calendarDate).endOf('month').toISOString(),
      },
    ],
    selectedEvent?.auctionId && getAvailability,
  )

  const cancelMutation = useMutation(cancelRequest, {
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
        refetchAppointments()
      } else {
        dispatch(
          addToast(<ToastMsg text={'Something is wrong'} type="error" />),
        )
      }
    },
  })
  const rescheduleMutation = useMutation(rescheduleRequest, {
    onSuccess: (res) => {
      if (res?.id) {
        dispatch(
          addToast(
            <ToastMsg
              text={'Appointment Rescheduled Successfully'}
              type="success"
            />,
          ),
        )
        setVisibleSuccessReschedule(true)
        refetchAppointments()
      } else {
        dispatch(
          addToast(
            <ToastMsg text={res?.error || 'Something is wrong'} type="error" />,
          ),
        )
      }
    },
    onError: (res) => {
      dispatch(
        addToast(
          <ToastMsg text={res?.error || 'Something is wrong'} type="error" />,
        ),
      )
    },
  })
  const onCancel = () => {
    cancelMutation.mutate({
      reqUuid: selectedEvent?.id,
    })
  }
  const onReschedule = () => {
    rescheduleMutation.mutate({
      reqUuid: selectedEvent?.id,
      body: {
        type: rescheduleData?.type,
        appointment_date: rescheduleData?.date,
        start_at: rescheduleData?.date,
        end_at: moment(rescheduleData?.date).add(1, 'hours'),
      },
    })
  }

  const renderAppointments = () =>
    calendarAppointments?.map((el) => {
      // const tt = <UserInfoBySubject
      //   key={el?.uuid}
      //   subject={
      //     meOrgs?.length > 0
      //       ? el?.['bidders_subject']
      //       : el?.['to_broker_subject']
      //   }
      // >
      //   {(res) => (
      //     publicUrl = getPublicUrl(res?.photo?.aPIURL)
      //   )}
      // </UserInfoBySubject>

      return {
        id: el?.uuid,
        title: el?.['bidder_name'],
        auctionId: el?.auction?.uuid,
        auctionTitle: el?.['auction_title'],
        // allDay: true,
        start: new Date(el?.['start_at']), // new Date(2015, 3, 0),
        end: new Date(el?.['end_at']), // new Date(2015, 3, 1),
        status:
          el?.status === 'Approved'
            ? 'confirmed'
            : el?.status === 'Rejected'
              ? 'cancelled'
              : 'pending',
        avatar: el?.['broker_organization_id'],
        // ? el?.['bidders_subject']
        // : el?.['to_broker_subject'],
        type: el?.type,
        location: el?.['appointment_address'],
        link: el?.['appointment_link'],
      }
    })
  const lastDayOfMonth = new Date(
    new Date(calendarDate).getFullYear(),
    new Date(calendarDate).getMonth() + 1,
    0,
  ).getDate()
  let daysOfCurrentMonth = []
  for (let i = 0; i < lastDayOfMonth; i++) {
    daysOfCurrentMonth = [
      ...daysOfCurrentMonth,
      new Date(
        new Date(calendarDate).getFullYear(),
        new Date(calendarDate).getMonth(),
        i + 1,
      ),
    ]
  }
  let getAvailabilityDataFormatted = getAvailabilityData?.map((el) =>
    new Date(el?.['appointment_date']).getDate(),
  )
  getAvailabilityDataFormatted = getAvailabilityDataFormatted?.filter(
    (item, index) => getAvailabilityDataFormatted?.indexOf(item) === index,
  )
  const disabledDates = daysOfCurrentMonth?.filter(
    (el) => !getAvailabilityDataFormatted?.includes(new Date(el).getDate()),
  )
  // console.log(disabledDates, 'disabledDates', calendarDate)

  const renderTimeSlots = () => {
    let renderTimeSlots = []
    const targetedDay = getAvailabilityData?.filter(
      (el) =>
        new Date(el?.['appointment_date']).getDate() ===
        new Date(rescheduleData?.date).getDate(),
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
  return (
    <div className="appointments-calendar-page">
      <div className="appointments-calendar-page-title">{t('calendar')}</div>
      <CalendarCustom
        setVisibleAreYouSure={setVisibleAreYouSure}
        setVisibleReschedule={setVisibleReschedule}
        setVisibleAddAppointment={setVisibleAddAppointment}
        // setMonth={setMonth}
        calendarAppointments={renderAppointments() || []}
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        broker={meOrgs?.length > 0}
        setSearch={setSearch}
        search={search}
        setCalendarDate={setCalendarDate}
      />
      {visibleAreYouSure && selectedEvent?.status !== 'cancelled' && (
        <ContactInfoDialogappointment
          visible={visibleAreYouSure}
          onHide={() => {
            setVisibleAreYouSure(false)
          }}
          onConfirm={() => onCancel()}
        />
      )}
      {visibleReschedule && (
        <ContactInfoDialogreschedule
          visible={visibleReschedule}
          onHide={() => {
            setVisibleReschedule(false)
          }}
          onConfirm={onReschedule}
          rescheduleData={rescheduleData}
          disabledDates={disabledDates}
          setRescheduleData={setRescheduleData}
          calendarDate={calendarDate}
          setCalendarDate={setCalendarDate}
          renderTimeSlots={renderTimeSlots()}
        />
      )}
      {visibleSuccessReschedule && (
        <ConfirmDialog
          title={t('request_for_viewing_success')}
          description={t('wait_for_approval')}
          visible={visibleSuccessReschedule}
          imgCard={successRegister}
          onHide={() => {
            setVisibleSuccessReschedule(false)
          }}
        />
      )}

      {visibleAddAppointment && (
        <ContactInfoDialogaddreschedule
          visible={visibleAddAppointment}
          onHide={() => {
            setVisibleAddAppointment(false)
          }}
        />
      )}
    </div>
  )
}
export default AppointmentsCalendar
