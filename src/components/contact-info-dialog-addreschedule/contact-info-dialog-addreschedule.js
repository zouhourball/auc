import {
  Button,
  DialogContainer,
  FontIcon,
  SelectField,
  TextField,
} from 'react-md'
import './style.scss'
import propTypes from 'prop-types'
import { useState } from 'react'
import moment from 'moment'
import { DatePicker } from '@target-energysolutions/date-picker'

const ContactInfoDialogaddreschedule = ({
  visible,
  onHide,
  setFilterData,
  filterData,
}) => {
  const [visibleDatePicker, setVisibleDatePicker] = useState({
    startDate: false,
    endDate: false,
  })
  const [visibleStartTimePicker, setVisibleStartTimePicker] = useState(false)

  const [startTime, setStartTime] = useState(moment().valueOf())
  const [startDate, setStartDate] = useState(moment().valueOf())

  return (
    <DialogContainer
      visible={visible}
      onHide={onHide}
      focusOnMount={false}
      className="add-appointment-dialog"
      title={
        <div className="add-appointment-dialog-title">Add Appointment</div>
      }
    >
      <div className="dateWrapper">
        <div className="label">Type of Appointment</div>
        <SelectField
          id="select-field-3-1"
          menuItems={[
            { label: 'In-person', value: '0' },
            { label: 'Online', value: '1' },
          ]}
          simplifiedMenu={false}
          onChange={(v) => {
            // location.reload()
          }}
          placeholder="Select type of Appointment"
          position={SelectField.Positions.BELOW}
          value={''}
          className="selectField"
          dropdownIcon={<FontIcon>expand_more</FontIcon>}
        />
      </div>
      <div className="dateWrapper">
        <div className="label">Date*</div>
        <div className="date">
          <TextField
            className="textField"
            id="date"
            placeholder="select date"
            block
            required
            rightIcon={
              <FontIcon className="dateRangeIcon">date_range</FontIcon>
            }
            value={`${moment(startDate).format('DD/MM/YYYY')}`}
            onClick={() =>
              setVisibleDatePicker({ ...visibleDatePicker, endDate: true })
            }
          />

          {visibleDatePicker?.endDate && (
            <DatePicker
              singlePick
              translation={{ update: 'select' }}
              onUpdate={({ timestamp }) => {
                setStartDate(timestamp)
                setVisibleDatePicker(false)
              }}
              onCancel={() => setVisibleDatePicker(false)}
              minValidDate={{ timestamp: filterData?.dateRange?.startDate }}
              startView="year"
              endView="day"
            />
          )}
        </div>
      </div>
      <div className="dateWrapper">
        <div className="label">Time*</div>
        <div className="date">
          <TextField
            id="time-start"
            placeholder={'Select from'}
            block
            rightIcon={
              <FontIcon className="dateRangeIcon">expand_more</FontIcon>
            }
            onClick={() => setVisibleStartTimePicker(true)}
            value={`${moment(startTime).format('HH:mm')}`}
            className="textField"
          />
          {visibleStartTimePicker && (
            <DatePicker
              startView="time"
              endView="time"
              singlePick={true}
              minuteInterval={5}
              timeFormat={null}
              onUpdate={({ timestamp }) => {
                setStartTime(timestamp)
                setVisibleStartTimePicker(false)
              }}
              onCancel={() => setVisibleStartTimePicker(false)}
              translation={{ date: 'Time' }}
              onReset={() => {
                setStartTime(moment().valueOf())
                setVisibleStartTimePicker(false)
              }}
            />
          )}
        </div>
      </div>
      <div className="actions">
        <Button
          flat
          primary
          swapTheming
          className="cancel-btn"
          onClick={onHide}
        >
          Cancel
        </Button>
        <Button
          flat
          primary
          swapTheming
          className="reschedule-btn"
          onClick={onHide}
        >
          Add Appointment
        </Button>
      </div>
    </DialogContainer>
  )
}
ContactInfoDialogaddreschedule.propTypes = {
  visible: propTypes.bool,
}

export default ContactInfoDialogaddreschedule
