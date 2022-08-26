import FilterBox from 'components/filter-box'
import { Button, FontIcon, TextField } from 'react-md'

import NotificationCard from 'components/notification-card'
import './style.scss'
import { useState } from 'react'

const Notifications = () => {
  const [search, setSearch] = useState('')

  const filterDateList = [
    { name: 'Today', value: 'today' },
    { name: 'Yesterday', value: 'yesterday' },
    { name: 'Last 7 Days', value: 'last_7_days' },
    { name: 'Last 30 Days', value: 'last_30_days' },
  ]
  const notifications = [
    {
      icon: 'https://picsum.photos/200',
      label: 'You have outbid! Auction LOt #124',
      date: '23 minutes',
    },
    {
      icon: 'https://picsum.photos/200',
      label: 'You have outbid! Auction LOt #124',
      date: '23 minutes',
    },
    {
      icon: 'https://picsum.photos/200',
      label: 'You have outbid! Auction LOt #124',
      date: '23 minutes',
    },
  ]

  return (
    <div className="notifications">
      <div className="notifications-title">
        Notifications ({notifications.length})
      </div>
      <div className="notifications-container md-grid">
        <div className="notifications-container-content md-cell md-cell--9">
          {notifications.map((item, index) => {
            return (
              <NotificationCard
                key={index}
                icon="https://picsum.photos/200"
                label="You have outbid! Auction LOt #124"
                date="23 minutes"
                withPoint
              />
            )
          })}
          <Button flat swapTheming onClick={() => {}} className="load-more">
            Load mere notifications
          </Button>
        </div>
        <div className="notifications-container-filter md-cell md-cell--3">
          <TextField
            id="search_textField"
            className="searchTextField"
            block
            rightIcon={<FontIcon>search</FontIcon>}
            value={search}
            onChange={(v) => {
              setSearch(v)
            }}
            placeholder="Search"
            fullWidth={false}
          />
          <FilterBox items={filterDateList} />
          <Button
            flat
            swapTheming
            onClick={() => {}}
            className="markAllRead-btn"
          >
            Mark All Read
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Notifications
