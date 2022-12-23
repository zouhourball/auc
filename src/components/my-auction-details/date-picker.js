import moment from 'moment'
import { DueDate } from 'components/due-date'
import onClickOutside from 'react-onclickoutside'

const CustomDatePicker = ({ showDatePicker, onSetDate, setShowDatePicker }) => {
  return (
    <div className="date-picker">
      <DueDate
        duedate={showDatePicker?.endDate}
        startDate={showDatePicker?.startDate}
        applicationStartDate={showDatePicker?.startDate}
        onDateChange={(start, end) => {
          let startD = new Date(
            moment(start)
              .hour(moment(showDatePicker?.startTime).hour())
              .minute(moment(showDatePicker?.startTime).minute())
              .valueOf(),
          )
          let endD = new Date(
            moment(end)
              .hour(moment(showDatePicker?.endTime).hour())
              .minute(moment(showDatePicker?.endTime).minute())
              .valueOf(),
          )
          onSetDate(startD, endD)
          setShowDatePicker(!showDatePicker)
        }}
      />
    </div>
  )
}

export default onClickOutside(CustomDatePicker)
