import { useState } from 'react'
import { useTranslation } from 'libs/langs'

import CalendarCustom from 'components/calendar'
import ContactInfoDialogappointment from 'components/contact-info-dialog-appointement'
import ContactInfoDialogreschedule from 'components/contact-info-dialog-reschedule'
import ContactInfoDialogaddreschedule from 'components/contact-info-dialog-addreschedule'
import ConfirmDialog from 'components/confirm-dialog'

import successRegister from 'images/successfully-register.png'

import './style.scss'

const AppointmentsCalendar = () => {
  const [visibleAreYouSure, setVisibleAreYouSure] = useState(false)
  const [visibleReschedule, setVisibleReschedule] = useState(false)
  const [visibleSuccessReschedule, setVisibleSuccessReschedule] =
    useState(false)
  const [visibleAddAppointment, setVisibleAddAppointment] = useState(false)
  const { t } = useTranslation()
  return (
    <div className="appointments-calendar-page">
      <div className="appointments-calendar-page-title">Appointments</div>
      <CalendarCustom
        setVisibleAreYouSure={setVisibleAreYouSure}
        setVisibleReschedule={setVisibleReschedule}
        setVisibleAddAppointment={setVisibleAddAppointment}
      />
      {visibleAreYouSure && (
        <ContactInfoDialogappointment
          visible={visibleAreYouSure}
          onHide={() => {
            setVisibleAreYouSure(false)
          }}
        />
      )}
      {visibleReschedule && (
        <ContactInfoDialogreschedule
          visible={visibleReschedule}
          onHide={() => {
            setVisibleReschedule(false)
          }}
          setVisibleSuccessReschedule={setVisibleSuccessReschedule}
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
