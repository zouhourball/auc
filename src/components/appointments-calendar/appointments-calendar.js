import { useState } from 'react'
import { useTranslation } from 'libs/langs'
import { useQuery, useMutation } from 'react-query'
import moment from 'moment'
import { useSelector, useDispatch } from 'react-redux'
import { addToast } from 'modules/app/actions'
import { getPublicUrl } from 'libs/utils/custom-function'

import {
  getRequestsForBrokerCalendar,
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
import UserInfoBySubject from 'components/user-info-by-subject'

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
  const [month, setMonth] = useState(moment().toISOString())
  const [selectedEvent, setSelectedEvent] = useState({ hide: true })
  const [search, setSearch] = useState('')

  const meOrgs = useSelector(({ app }) => app?.myOrgs)

  const { data: calendarAppointments, refetch: refetchAppointments } = useQuery(
    [
      meOrgs?.length > 0 ? 'getAppointments' : 'getBidderAppointments',
      {
        ...(meOrgs?.length > 0 && { broker_organization_id: meOrgs?.[0]?.ID }),
        from_date: moment(moment().month(month)).startOf('month').toISOString(),
        to_date: moment(moment().month(month)).endOf('month').toISOString(),
        search_key: search,
      },
    ],
    meOrgs?.length > 0 ? getRequestsForBrokerCalendar : getAppointmentsRequest,
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
      if (res?.success) {
        dispatch(
          addToast(
            <ToastMsg
              text={'Appointment Rescheduled Successfully'}
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
  const onCancel = () => {
    cancelMutation.mutate({
      reqUuid: selectedEvent?.id,
    })
  }
  const onReschedule = () => {
    rescheduleMutation.mutate({
      reqUuid: selectedEvent?.id,
      body: {},
    })
  }
  const renderAppointments = () =>
    calendarAppointments?.results?.map((el) => {
      return (
        <UserInfoBySubject
          key={el?.uuid}
          subject={
            meOrgs?.length > 0
              ? el?.['bidders_subject']
              : el?.['to_broker_subject']
          }
        >
          {(res) => ({
            id: el?.uuid,
            title: res?.fullName,
            // allDay: true,
            start: new Date(el?.['start_at']), // new Date(2015, 3, 0),
            end: new Date(el?.['end_at']), // new Date(2015, 3, 1),
            status: el?.status,
            avatar: getPublicUrl(res?.photo?.aPIURL),
            type: el?.type,
            location:
              el?.type === 'In-person'
                ? el?.['appointment_address']
                : el?.['appointment_link'],
          })}
        </UserInfoBySubject>
      )
    })
  return (
    <div className="appointments-calendar-page">
      <div className="appointments-calendar-page-title">Appointments</div>
      <CalendarCustom
        setVisibleAreYouSure={setVisibleAreYouSure}
        setVisibleReschedule={setVisibleReschedule}
        setVisibleAddAppointment={setVisibleAddAppointment}
        setMonth={setMonth}
        calendarAppointments={renderAppointments()}
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        broker={meOrgs?.length > 0}
        setSearch={setSearch}
        search={search}
      />
      {visibleAreYouSure && selectedEvent?.status !== 'Cancelled' && (
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
          setVisibleSuccessReschedule={setVisibleSuccessReschedule}
          onConfirm={onReschedule}
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
