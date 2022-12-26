import moment from 'moment'
import { DueDate } from 'components/due-date'
import onClickOutside from 'react-onclickoutside'

const CustomDatePicker = ({
  auctionEditData,
  onSetDate,
  setShowDatePicker,
  isActive,
  startTime,
  endTime,
}) => {
  CustomDatePicker.handleClickOutside = () => setShowDatePicker(false)
  return (
    <div className="date-picker">
      <DueDate
        duedate={new Date(auctionEditData?.endDate)}
        startDate={new Date(auctionEditData?.startDate)}
        //  applicationStartDate={new Date(auctionEditData?.startDate)}
        onDateChange={(start, end) => {
          let startD = isActive
            ? new Date(auctionEditData?.startDate)
            : new Date(
              moment(start)
                .hour(moment(startTime).hour())
                .minute(moment(startTime).minute())
                .valueOf(),
            )
          let endD = new Date(
            moment(end)
              .hour(moment(endTime).hour())
              .minute(moment(endTime).minute())
              .valueOf(),
          )
          onSetDate(startD, endD)
          setShowDatePicker(false)
        }}
      />
    </div>
  )
}

const clickOutsideConfig = {
  handleClickOutside: () => CustomDatePicker.handleClickOutside,
}

export default onClickOutside(CustomDatePicker, clickOutsideConfig)
