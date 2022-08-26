import { useState } from 'react'
import { cls } from 'reactutils'
import { Checkbox } from 'react-md'

import './style.scss'

const FilterBox = ({ className, items }) => {
  const [selectedItem, setSelectedItem] = useState(null)
  const onChangeItem = (status, value) => {
    let newSelectedItem

    if (status) {
      newSelectedItem = value
    }

    setSelectedItem(newSelectedItem)
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
          checked={selectedItem === item?.value}
        />
      </div>
    ))
  }
  return (
    <div className={cls('filter-box', className)}>
      <div className="filter-box-header">
        <div>Filter Date</div>
      </div>
      <div className="filter-box-content">{renderItems()}</div>
    </div>
  )
}

export default FilterBox
