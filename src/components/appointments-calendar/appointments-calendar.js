import CalendarCustom from 'components/calendar'
import './style.scss'

const AppointmentsCalendar = () => {
  return (
    <div className="appointments-calendar-page">
      <div className="appointments-calendar-page-title">Appointments</div>
      <CalendarCustom />
    </div>
  )
}
export default AppointmentsCalendar
