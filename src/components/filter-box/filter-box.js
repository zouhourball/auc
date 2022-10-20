import { useState } from 'react'
import { cls } from 'reactutils'
import { Checkbox, FontIcon, TextField } from 'react-md'
import { useTranslation } from 'libs/langs'

import './style.scss'
import { DatePicker } from '@target-energysolutions/date-picker'
import moment from 'moment'
const FilterBox = ({ className, items, setFilterData, filterData }) => {
  const { t } = useTranslation()
  const [visibleDatePicker, setVisibleDatePicker] = useState({
    startDate: false,
    endDate: false,
  })
  const onChangeItem = (status, value) => {
    let newSelectedItem

    if (status) {
      newSelectedItem = value
    }
    setFilterData({ selectedItem: newSelectedItem })
  }

  const renderItems = () => {
    return items.map((item) => (
      <div key={`item-${item?.value}`} className={`filter-box-content-item`}>
        <Checkbox
          id={`${item?.name}-all`}
          name="simple-checkboxes[]"
          type="radio"
          label={item.name}
          value={item.value}
          onChange={(status) => {
            onChangeItem(status, item?.value)
          }}
          checked={filterData?.selectedItem === item?.value}
        />
      </div>
    ))
  }
  const onHandleDate = (date, key) => {
    setFilterData({
      // ...filterData,
      dateRange: {
        ...filterData?.dateRange,
        [key]: date?.timestamp,
      },
    })
    setVisibleDatePicker({ ...visibleDatePicker, [key]: false })
  }
  return (
    <div className={cls('filter-box', className)}>
      <div className="filter-box-header">
        <div>Filter Date</div>
      </div>
      <div className="filter-box-content">{renderItems()}</div>
      <div className="filter-box-label">{t('custom_range')}</div>
      <div className="filter-box-date">
        <TextField
          id="date-start"
          placeholder="dd/mm/yy"
          block
          required
          rightIcon={<FontIcon className="dateRangeIcon">date_range</FontIcon>}
          value={
            filterData?.dateRange?.startDate &&
            moment(filterData?.dateRange?.startDate).format('DD/MM/YYYY')
          }
          onClick={() =>
            setVisibleDatePicker({ ...visibleDatePicker, startDate: true })
          }
          className="textField"
        />
        {visibleDatePicker?.startDate && (
          <DatePicker
            singlePick
            translation={{ update: 'select' }}
            onUpdate={(date) => onHandleDate(date, 'startDate')}
            onCancel={() =>
              setVisibleDatePicker({ ...visibleDatePicker, startDate: false })
            }
            // minValidDate={{ timestamp: new Date().getTime() }}
            startView="year"
            endView="day"
          />
        )}
        <TextField
          id="date-end"
          placeholder="dd/mm/yy"
          block
          required
          rightIcon={<FontIcon className="dateRangeIcon">date_range</FontIcon>}
          value={
            filterData?.dateRange?.endDate &&
            moment(filterData?.dateRange?.endDate).format('DD/MM/YYYY')
          }
          onClick={() =>
            setVisibleDatePicker({ ...visibleDatePicker, endDate: true })
          }
          className="textField"
        />
        {visibleDatePicker?.endDate && (
          <DatePicker
            singlePick
            translation={{ update: 'select' }}
            onUpdate={(date) => onHandleDate(date, 'endDate')}
            onCancel={() =>
              setVisibleDatePicker({ ...visibleDatePicker, endDate: false })
            }
            minValidDate={{ timestamp: filterData?.dateRange?.startDate }}
            startView="year"
            endView="day"
          />
        )}
      </div>
    </div>
  )
}

export default FilterBox
