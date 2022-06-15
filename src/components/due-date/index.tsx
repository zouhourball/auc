import * as React from 'react'
import { endOfDay, startOfDay } from 'date-fns'

import DayPicker, { DateUtils } from 'react-day-picker'
import 'react-day-picker/lib/style.css'
import './styles.scss'
import { Button, Card } from 'react-md'

export type DueDateProps = {
  duedate?: Date
  onDateChange: (start?: Date, end?: Date) => void
  readOnly?: boolean
  startDate?: Date
}
export const DueDate = React.memo(function DueDate ({
  duedate,
  startDate,
  onDateChange,
  readOnly,
}: // onStartDateChange,
DueDateProps) {
  const [open, setOpen] = React.useState(true)
  const [range, setRange] = React.useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })

  React.useEffect(() => {
    // compatible with tasks which only set duedate
    if (startDate === undefined && duedate !== undefined) return
    setRange({ from: startDate, to: duedate })
  }, [])

  const handleDayClick = (day: Date) => {
    if (range.from !== undefined && range.to !== undefined) {
      setRange({ from: day, to: undefined })
    } else {
      const newRange = DateUtils.addDayToRange(day, range)
      setRange(newRange)
      if (newRange.to !== undefined && newRange.from !== undefined) {
        onDateChange(
          newRange.from ? startOfDay(newRange.from) : undefined,
          newRange.to ? endOfDay(newRange.to) : undefined,
        )
        setOpen(false)
      }
    }
  }

  const handleReset = React.useCallback(() => {
    setOpen(false)
    setRange({ from: undefined, to: undefined })
    onDateChange()
  }, [onDateChange])

  const handleClickToday = React.useCallback(() => {
    setRange({ from: startOfDay(new Date()), to: endOfDay(new Date()) })
    onDateChange(startOfDay(new Date()), endOfDay(new Date()))
  }, [onDateChange])
  return (
    <>
      {open && (
        <Card className="due-date-container">
          <div className="due-date-actions">
            <Button
              dense
              className="date-picker-today"
              onClick={handleClickToday}
            >
              today
            </Button>
            <Button
              outlined
              className="date-picker-reset"
              onClick={handleReset}
            >
              reset
            </Button>
          </div>

          <DayPicker
            numberOfMonths={2}
            selectedDays={[range.from, range]}
            modifiers={{ start: range.from, end: range.to }}
            onDayClick={handleDayClick}
            initialMonth={startDate}
            disabledDays={{ before: new Date() }}
          />
        </Card>
      )}
    </>
  )
})
