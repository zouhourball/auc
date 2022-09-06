import auctionWon from 'images/auction_won.svg'
import myActivity from 'images/my_activity_enable.svg'
import bidPlace from 'images/bid_place_successfully.svg'

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
      icon: bidPlace,
      label: 'You have outbid! Auction LOt #124',
      date: '23 minutes',
      withPoint: true,
    },
    {
      icon: myActivity,
      label:
        'You have been successfully registered to participate in auction Lot #123',
      date: '23 minutes',
    },
    {
      icon: auctionWon,
      label: 'You have outbid! Auction LOt #124',
      date: '23 minutes',
    },
  ]

  return (
    <div className="notifications">
      <div className="notifications-title">
        Notifications{' '}
        <span className="blue-text">({notifications.length})</span>
      </div>
      <div className="notifications-container md-grid">
        <div className="notifications-container-content md-cell md-cell--6">
          {notifications.map((item, index) => {
            return (
              <NotificationCard
                key={item.index}
                icon={item.icon}
                label={item.label}
                date={item.date}
                withPoint
              />
            )
          })}
          <div className="actions">
            <Button flat swapTheming onClick={() => {}} className="load-more">
              Load more notifications
            </Button>
          </div>
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
