import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './style.scss'

import { eventsList } from './helper'
import { Button } from 'react-md'

export let navigate = {
  PREVIOUS: 'PREV',
  NEXT: 'NEXT',
  TODAY: 'TODAY',
  DATE: 'DATE',
}

const calendar = () => {
  const localizer = momentLocalizer(moment)

  return (
    <div style={{ height: 700 }}>
      <Calendar
        localizer={localizer}
        events={eventsList}
        step={60}
        views={['month']}
        defaultDate={new Date()}
        components={{
          eventWrapper: EventWrapperComponent,
          toolbar: CustomToolbarr,
        }}
        // onSelectSlot={(e) => console.log(e, 'ggggg')}
        // onSelectEvent={(e) => console.log(e, 'eeeeee')}
        popup
        selectable
      />
    </div>
  )
}

export default calendar

const CustomToolbarr = (props) => {
  let { label } = props
  const onNavigatee = (action) => {
    props.onNavigate(action)
  }
  return (
    <div className="rbc-toolbar">
      <span className="rbc-btn-group">
        <Button type="button" onClick={() => onNavigatee(navigate.PREVIOUS)}>
          Prev
        </Button>
      </span>
      <span className="rbc-toolbar-label">{label}</span>
      <span className="rbc-btn-group">
        <Button type="button" onClick={() => onNavigatee(navigate.NEXT)}>
          Next
        </Button>
      </span>
    </div>
  )
}

const EventWrapperComponent = ({ event, children }) => {
  const newChildren = { ...children }
  const newChildrenProps = { ...newChildren.props }
  newChildrenProps.className = `${newChildrenProps.className} outline-none border-none  bg-red-500`
  newChildren.props = { ...newChildrenProps }
  return (
    <div className="event-item">
      <div className={`event-item-status ${event.status}`} />
      {event.title}
    </div>
  )
}
