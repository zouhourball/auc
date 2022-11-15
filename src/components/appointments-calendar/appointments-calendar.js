import { useState, useEffect } from 'react'
import { useTranslation } from 'libs/langs'
import { useQuery, useMutation } from 'react-query'
import moment from 'moment'
import { useSelector, useDispatch } from 'react-redux'
import { addToast } from 'modules/app/actions'

import {
  getRequestsForBrokerCalendar,
  cancelRequest,
  rescheduleRequest,
} from 'libs/api/appointment-api'
import { meQuery } from 'libs/queries/me-query.gql'
import meOrganizations from 'libs/queries/me-organizations.gql'
import ToastMsg from 'components/toast-msg'

import store from 'libs/store'

import CalendarCustom from 'components/calendar'
import ContactInfoDialogappointment from 'components/contact-info-dialog-appointement'
import ContactInfoDialogreschedule from 'components/contact-info-dialog-reschedule'
import ContactInfoDialogaddreschedule from 'components/contact-info-dialog-addreschedule'
import ConfirmDialog from 'components/confirm-dialog'

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
  const { data: currentUser } = useQuery(meQuery, {
    notifyOnNetworkStatusChange: true,
    context: {
      uri: `${PRODUCT_WORKSPACE_URL}/graphql`,
    },
  })
  const { data: myOrgs, refetch } = useQuery(meOrganizations, {
    notifyOnNetworkStatusChange: true,
    context: {
      uri: `${PRODUCT_WORKSPACE_URL}/graphql`,
    },
  })
  const meOrgs = useSelector(({ app }) => app?.myOrgs)
  useEffect(() => {
    refetch()
  }, [currentUser])
  useEffect(() => {
    store.dispatch({
      type: 'APP_SET_MY_ORGS',
      payload: { myOrgs: myOrgs?.meOrganizations },
    })
  }, [myOrgs])
  const { data: calendarAppointments, refetch: refetchAppointments } = useQuery(
    [
      'getAppointments',
      {
        broker_organization_id: meOrgs?.[0]?.ID,
        from_date: moment(moment().month(month)).startOf('month').toISOString(),
        to_date: moment(moment().month(month)).endOf('month').toISOString(),
      },
    ],
    getRequestsForBrokerCalendar,
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
      reqUuid: '2',
    })
  }
  const onReschedule = () => {
    rescheduleMutation.mutate({
      reqUuid: '2',
      body: {},
    })
  }
  return (
    <div className="appointments-calendar-page">
      <div className="appointments-calendar-page-title">Appointments</div>
      <CalendarCustom
        setVisibleAreYouSure={setVisibleAreYouSure}
        setVisibleReschedule={setVisibleReschedule}
        setVisibleAddAppointment={setVisibleAddAppointment}
        setMonth={setMonth}
        calendarAppointments={calendarAppointments}
      />
      {visibleAreYouSure && (
        <ContactInfoDialogappointment
          visible={visibleAreYouSure}
          onHide={() => {
            setVisibleAreYouSure(false)
          }}
          onConfirm={onCancel}
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
