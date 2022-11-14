import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './style.scss'
import { useClickOutside } from 'libs/utils/useclickoutside'

import { eventsList } from './helper'
import { Avatar, Button, FontIcon, TextField } from 'react-md'
import { useRef, useState } from 'react'

export let navigate = {
  PREVIOUS: 'PREV',
  NEXT: 'NEXT',
  TODAY: 'TODAY',
  DATE: 'DATE',
}

const CalendarCustom = ({
  setVisibleAreYouSure,
  setVisibleReschedule,
  setVisibleAddAppointment,
}) => {
  const localizer = momentLocalizer(moment)
  const ref = useRef()
  const myRef = useRef()
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [search, setSearch] = useState(null)
  const CustomToolbar = (props) => {
    let { label } = props
    const onNavigatee = (action) => {
      props.onNavigate(action)
    }
    return (
      <div className="toolbar">
        <div className="toolbar-top">
          <TextField
            placeholder={'Search for an appointment'}
            className="md-cell md-cell--3 toolbar-textField"
            value={search}
            onChange={(v) => {
              setSearch(v)
            }}
            rightIcon={<FontIcon>search</FontIcon>}
            block
          />
          <Button onClick={() => setVisibleAddAppointment(true)}>
            Add Appointment
          </Button>
          <div className="btn-group">
            <Button icon onClick={() => onNavigatee(navigate.PREVIOUS)}>
              <FontIcon>chevron_left</FontIcon>
            </Button>
            <span className="toolbar-label">{label}</span>
            <Button icon onClick={() => onNavigatee(navigate.NEXT)}>
              <FontIcon>chevron_right</FontIcon>
            </Button>
          </div>
        </div>
        <div className="toolbar-bottom">
          <span className="toolbar-bottom-label">{label}</span>
          <div className="toolbar-bottom-legend">
            <div className={`event-item-status pending`} />
            <div>Pending</div>
            <div className={`event-item-status confirmed`} />
            <div>Confirmed</div>
            <div className={`event-item-status cancelled`} />
            <div>Cancelled</div>
          </div>
        </div>
      </div>
    )
  }

  const EventWrapperComponent = ({ event, children }) => {
    const onSelectEvent = (event, e) => {
      const { top, left } = ref.current.getBoundingClientRect()
      const { scrollTop, scrollLeft } = ref.current

      const eventY = e.clientY
      const eventX = e.clientX

      const positionY = eventY - top + scrollTop + 100
      const positionX = eventX - left + scrollLeft + 200

      const elementHeight = myRef.current ? myRef.current.offsetHeight : 240
      const elementWidth = myRef.current ? myRef.current.offsetWidth : 300
      const posY =
        positionY < 0
          ? 0
          : positionY + elementHeight > window.innerHeight - top
            ? window.innerHeight - top - elementHeight
            : positionY
      const posX =
        positionX < 0
          ? 0
          : positionX + elementWidth > window.innerWidth - left
            ? window.innerWidth - left - elementWidth
            : positionX

      setSelectedEvent({ ...event, x: posX, y: posY })
    }

    const newChildren = { ...children }
    const newChildrenProps = { ...newChildren.props }
    newChildrenProps.className = `${newChildrenProps.className} outline-none border-none  bg-red-500`
    newChildren.props = { ...newChildrenProps }
    return (
      <div className="event-item" ref={myRef}>
        <div
          className={`event-item-status ${event.status}`}
          onClick={(e) => onSelectEvent(event, e)}
        />
        {event.title}
      </div>
    )
  }

  const popupRef = useClickOutside(() => {
    setSelectedEvent(false)
  })

  return (
    <div style={{ height: 700 }} ref={ref}>
      <Calendar
        localizer={localizer}
        events={eventsList}
        step={60}
        views={['month']}
        defaultDate={new Date()}
        components={{
          eventWrapper: EventWrapperComponent,
          toolbar: CustomToolbar,
        }}
        popup
        selectable
      />

      {selectedEvent && (
        <div
          className="popup"
          ref={popupRef}
          style={{
            position: 'absolute',
            top: `${selectedEvent.y}px`,
            left: `${selectedEvent.x}px`,
            zIndex: 1111,
            background: '#fff',
            width: '270px',
          }}
        >
          <div className="popup-top">
            <Avatar className="avatar" src={selectedEvent?.avatar}>
              {selectedEvent?.title[0]}
            </Avatar>
            <div className="title">{selectedEvent?.title}</div>
          </div>
          <div className="label">Type of Appointment</div>
          <div className="value">{selectedEvent?.type}</div>
          <div className="label">Location</div>
          <div className="value">{selectedEvent?.location}</div>
          <div className="label">Time</div>
          <div className="value">{`${moment(selectedEvent?.start).format(
            'hh:mm',
          )} - ${moment(selectedEvent?.end).format('hh:mm')}`}</div>
          <div className="popup-actions">
            {selectedEvent?.status === 'cancelled' ? (
              <>
                <Button
                  flat
                  className="popup-actions-reschedule"
                  onClick={() => setVisibleReschedule(true)}
                >
                  Reschedule Appointment
                </Button>
              </>
            ) : (
              <>
                <Button
                  flat
                  className="popup-actions-cancel"
                  onClick={() => setVisibleAreYouSure(true)}
                >
                  Cancel Appointment
                </Button>
                <Button
                  flat
                  className="popup-actions-reschedule"
                  onClick={() => setVisibleReschedule(true)}
                >
                  Reschedule Appointment
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CalendarCustom
