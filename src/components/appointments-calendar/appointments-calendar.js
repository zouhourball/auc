import CalendarCustom from 'components/calendar'
import './style.scss'
import ContactInfoDialogappointment from 'components/contact-info-dialog-appointement'
import ContactInfoDialogreschedule from 'components/contact-info-dialog-reschedule'
import ContactInfoDialogrequest from 'components/contact-info-dialog-request'
import ContactInfoDialogaddreschedule from 'components/contact-info-dialog-addreschedule'
import { useState } from 'react'

const AppointmentsCalendar = () => {
  const [visibleAreYouSure, setVisibleAreYouSure] = useState(false)
  const [visibleReschedule, setVisibleReschedule] = useState(false)
  const [visibleSuccessReschedule, setVisibleSuccessReschedule] =
    useState(false)
  const [visibleAddAppointment, setVisibleAddAppointment] = useState(false)

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
        <ContactInfoDialogrequest
          visible={visibleSuccessReschedule}
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
