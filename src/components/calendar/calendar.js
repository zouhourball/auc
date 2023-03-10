import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { useClickOutside } from 'libs/utils/useclickoutside'
import { Avatar, Button, FontIcon, TextField } from 'react-md'
import { useRef, useState } from 'react'
import CompanyInfoById from 'components/company-info-by-id'
import { getPublicUrl } from 'libs/utils/custom-function'
import { useTranslation, useCurrentLang, useSupportedLangs } from 'libs/langs'
// import { formatRelative, subDays } from 'date-fns'

import { eventsList } from './helper'

import 'react-big-calendar/lib/css/react-big-calendar.css'
import './style.scss'
import { useSelector } from 'react-redux'
// import 'moment/locale/ar'

export let navigate = {
  PREVIOUS: 'PREV',
  NEXT: 'NEXT',
  TODAY: 'TODAY',
  DATE: 'DATE',
}
let day = ''

const CalendarCustom = ({
  setVisibleAreYouSure,
  setVisibleReschedule,
  setVisibleAddAppointment,
  // setMonth,
  calendarAppointments,
  setSelectedEvent,
  selectedEvent,
  broker,
  setSearch,
  search,
  setCalendarDate,
}) => {
  const { t } = useTranslation()
  const langs = useSupportedLangs()
  const currentLang = langs.find(({ key }) => key === useCurrentLang()) || {}

  const [position, setPosition] = useState('left')

  // console.log(localizer.format(date, 'dddd', 'ar'), 'weekdayFormat')

  // const lang = () => {
  // if (currentLang.key === 'ar') {
  // return (localizer.format(date, 'dddd', 'ar')
  // )
  // } else {
  // return (localizer.format(date, 'dddd', 'en-US'))
  // }
  // }

  const localizer = momentLocalizer(moment)
  const ref = useRef()
  const myRef = useRef()
  const meOrgs = useSelector(({ app }) => app?.myOrgs)
  const CustomToolbar = (props) => {
    let { date } = props
    // const messages = {
    //   Thu: 'tuersday',
    //   Mon: 'Précédent',

    // }

    let momentInstance = moment(date)
    let momentmonth =
      momentInstance
        .locale(currentLang.key === 'ar' ? 'ar' : 'en')
        .format('MMMM') +
      '    ' +
      moment(date).format('YYYY')

    // console.log(momentmonth, 'calendarDate')

    const onNavigatee = (action) => {
      props.onNavigate(action)
      if (action === 'NEXT') {
        // setMonth(moment(date).add(1, 'month').format('MM'))
        setCalendarDate(moment(date).add(1, 'month').toISOString())
      }
      if (action === 'PREV') {
        // setMonth(moment(date).subtract(1, 'month').format('MM'))
        setCalendarDate(moment(date).subtract(1, 'month').toISOString())
      }
    }

    return (
      <div className="toolbar">
        <div className="toolbar-top">
          <TextField
            placeholder={t('search_for_an_appointment')}
            className="toolbar-textField"
            value={search}
            onChange={(v) => {
              setSearch(v)
            }}
            rightIcon={<FontIcon>search</FontIcon>}
            block
          />

          <div className="btn-group">
            {meOrgs?.length > 0 && (
              <Button
                className="nav-btn add-btn"
                onClick={() => setVisibleAddAppointment(true)}
              >
                {t('add_appointment')}
              </Button>
            )}
            <Button
              className="nav-btn"
              icon
              onClick={() => onNavigatee(navigate.PREVIOUS)}
            >
              <FontIcon>
                {currentLang.key === 'ar-SA' || currentLang.key === 'ar'
                  ? 'chevron_right'
                  : 'chevron_left'}
              </FontIcon>
            </Button>
            <span
              onClick={() => onNavigatee(navigate.TODAY)}
              className="toolbar-label nav-btn"
            >
              {t('today')}
            </span>
            <Button
              className="nav-btn"
              icon
              onClick={() => onNavigatee(navigate.NEXT)}
            >
              <FontIcon>
                {currentLang.key === 'ar-SA' || currentLang.key === 'ar'
                  ? 'chevron_left'
                  : 'chevron_right'}
              </FontIcon>
            </Button>
          </div>
        </div>
        <div className="toolbar-bottom">
          <span className="toolbar-bottom-label">{momentmonth}</span>
          <div className="toolbar-bottom-legend">
            <div className="event-item">
              <div className={`event-item-status pending`} />
              <div className="label">{t('pending')}</div>
            </div>
            <div className="event-item">
              <div className={`event-item-status confirmed`} />
              <div className="label">{t('confirm')}</div>
            </div>
            <div className="event-item">
              <div className={`event-item-status cancelled`} />
              <div className="label">{t('cancel')}</div>
            </div>
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
      const positionX = eventX - left + scrollLeft + 100

      const elementHeight = myRef.current ? myRef.current.offsetHeight : 240
      const elementWidth = myRef.current ? myRef.current.offsetWidth : 300

      if (positionX + elementWidth > window.innerWidth - left) {
        setPosition('right')
      } else {
        setPosition('left')
      }

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
            ? window.innerWidth - left - elementWidth - 100 // - myRef.current.offsetWidth
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
          onClick={(e) => {
            onSelectEvent(event, e)
          }}
        />
        {event?.auctionTitle}
      </div>
    )
  }

  const popupRef = useClickOutside(() => {
    setSelectedEvent((prev) => ({ ...prev, hide: true }))
  })
  const formats = {
    weekdayFormat: (date, culture, localizer) => {
      if (currentLang.key === 'ar') {
        day = localizer.format(date, 'dddd', 'ar')
      } else {
        day = localizer.format(date, 'ddd', 'en')
      }
      return day

      // return localizer.format(date, 'dddd', 'ar')
    },
  }

  return (
    <div className="appointments-calendar" ref={ref}>
      <Calendar
        formats={formats}
        localizer={localizer}
        events={calendarAppointments || eventsList}
        step={60}
        views={['month']}
        defaultDate={new Date()}
        components={{
          eventWrapper: EventWrapperComponent,
          toolbar: CustomToolbar,
        }}
        popup
        selectable
        style={{ height: 700 }}
      />

      {!selectedEvent?.hide && (
        <div
          className={`popup ${position}`}
          ref={popupRef}
          style={{
            position: 'absolute',
            top: `${selectedEvent.y}px`,
            left: `${selectedEvent.x}px`,
            zIndex: 1111,
            background: '#fff',
            width: '250px',
          }}
        >
          {broker ? (
            <>
              <div className="info">
                <div className="label">{t('auction_title')}</div>
                <div className="title">{selectedEvent?.auctionTitle}</div>
              </div>
              <div className="info">
                <div className="label">{t('name')}</div>
                <div className="title">{selectedEvent?.title}</div>
              </div>
              <div className="info">
                <div className="label">{t('type_of_appointment')}</div>
                <div className="value">{selectedEvent?.type}</div>
              </div>

              {selectedEvent?.type === 'In-person' && (
                <div className="info">
                  {' '}
                  <div className="label">{t('location')}</div>
                  <div className="value">{selectedEvent?.location}</div>
                </div>
              )}
              {selectedEvent?.type === 'Online' && (
                <div className="info">
                  {' '}
                  <div className="label">{t('link')}</div>
                  <div className="value">
                    {selectedEvent?.link || 'No link yet'}
                  </div>
                </div>
              )}

              <div className="info">
                <div className="label">{t('time')}</div>
                <div className="value">{`${moment(selectedEvent?.start)
                  .utc()
                  .format('hh:mm')} - ${moment(selectedEvent?.end)
                  .utc()
                  .format('hh:mm')}`}</div>
              </div>
              <div className="popup-actions">
                {!(selectedEvent?.status === 'cancelled') && (
                  <>
                    <Button
                      flat
                      className="popup-actions-cancel"
                      onClick={() => {
                        setVisibleAreYouSure(true)
                        setSelectedEvent((prev) => ({ ...prev, hide: true }))
                      }}
                    >
                      {t('cancel_appointment')}
                    </Button>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="popup-top">
                <CompanyInfoById orgId={selectedEvent?.avatar}>
                  {(res) => (
                    <>
                      <Avatar
                        className="avatar"
                        src={getPublicUrl(res?.companyLogo?.aPIID)}
                      >
                        {selectedEvent?.title[0]}
                      </Avatar>
                      <div className="title">{res?.name}</div>
                    </>
                  )}
                </CompanyInfoById>
              </div>
              <div className="info">
                <div className="label">{t('type_of_appointment')}</div>
                <div className="value">{t(selectedEvent?.type)}</div>
              </div>
              {selectedEvent?.type === 'In-person' && (
                <div className="info">
                  {' '}
                  <div className="label">{t('location')}</div>
                  <div className="value">{selectedEvent?.location}</div>
                </div>
              )}
              {selectedEvent?.type === 'Online' && (
                <div className="info">
                  {' '}
                  <div className="label">{t('link')}</div>
                  <div className="value">
                    {selectedEvent?.link || 'No link yet'}
                  </div>
                </div>
              )}
              <div className="info">
                <div className="label">{t('time')}</div>
                <div className="value">{`${moment(selectedEvent?.start).format(
                  'hh:mm',
                )} - ${moment(selectedEvent?.end).format('hh:mm')}`}</div>
              </div>
              <div className="popup-actions">
                {selectedEvent?.status === 'cancelled' ? (
                  <>
                    {!broker && (
                      <Button
                        flat
                        className="popup-actions-reschedule"
                        onClick={() => {
                          setVisibleReschedule(true)
                          setSelectedEvent((prev) => ({ ...prev, hide: true }))
                        }}
                      >
                        {t('reschedule_appointment')}
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <Button
                      flat
                      className="popup-actions-cancel"
                      onClick={() => {
                        setVisibleAreYouSure(true)
                        setSelectedEvent((prev) => ({ ...prev, hide: true }))
                      }}
                    >
                      {t('cancel_appointment')}
                    </Button>
                    {!broker && (
                      <Button
                        flat
                        className="popup-actions-reschedule"
                        onClick={() => {
                          setVisibleReschedule(true)
                          setSelectedEvent((prev) => ({ ...prev, hide: true }))
                        }}
                      >
                        {t('reschedule_appointment')}
                      </Button>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default CalendarCustom
